'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Code, Filter, Search, CheckCircle, AlertCircle, Clock, Tag, Trophy, Target, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface CodingProblem {
    _id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string[];
    constraints: string;
    examples: {
        input: string;
        output: string;
        explanation?: string;
    }[];
    createdAt: string;
}

interface Submission {
    _id: string;
    problemId: string;
    status: 'Pending' | 'Accepted' | 'Rejected' | 'Solved';
    language: string;
    createdAt: string;
    code: string;
}

const PROBLEMS_PER_PAGE = 10;

export default function ProblemsPage() {
    const { user } = useAuth();
    const [problems, setProblems] = useState<CodingProblem[]>([]);
    const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({});
    const [problemStatus, setProblemStatus] = useState<Record<string, 'solved' | 'attempted'>>({}); // New state for problem statuses
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch problems
    useEffect(() => {
        async function fetchProblems() {
            try {
                const { data } = await apiClient.getAllProblems();
                // Handle both possible response structures
                const problemsArray = data.data || data || [];
                setProblems(problemsArray);
                console.log('Fetched problems count:', problemsArray.length);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to fetch coding problems');
            } finally {
                setLoading(false);
            }
        }
        fetchProblems();
    }, []);

    // Fetch submissions and compute problem statuses
    useEffect(() => {
        if (!user) return;
        async function fetchSubmissions() {
            try {
                const { data } = await apiClient.getUserSubmissions();
                const arr = Array.isArray(data) ? data : data.data || data.submissions || [];

                // Debug logging
                console.log('Raw submissions data:', arr);

                const grouped: Record<string, Submission[]> = {};
                const statusMap: Record<string, 'solved' | 'attempted'> = {};

                arr.forEach((sub: Submission) => {
                    if (!sub.problemId) {
                        console.error('Submission missing problemId:', sub);
                        return;
                    }
                    const pid = sub.problemId;
                    if (!grouped[pid]) grouped[pid] = [];
                    grouped[pid].push(sub);
                });

                // Compute status for each problem with submissions, mirroring getUserStats logic
                Object.keys(grouped).forEach(pid => {
                    const problemSubmissions = grouped[pid];
                    const isSolved = problemSubmissions.some(sub => isSuccessfulStatus(sub.status));
                    statusMap[pid] = isSolved ? 'solved' : 'attempted';
                });

                console.log('Grouped submissions:', grouped);
                setSubmissions(grouped);
                setProblemStatus(statusMap);
            } catch (err) {
                console.error('Error fetching submissions:', err);
            }
        }
        fetchSubmissions();
    }, [user]);

    // Helper function to check if a status indicates success
    const isSuccessfulStatus = (status: string): boolean => {
        const successStatuses = ['accepted', 'ac', 'correct', 'solved'];
        return successStatuses.includes(status.toLowerCase().trim());
    };

    // Tag frequency
    const tagCounts: Record<string, number> = {};
    problems.forEach(p => p.tags.forEach(t => (tagCounts[t] = (tagCounts[t] || 0) + 1)));
    const allTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([t]) => t);

    // Filters
    const filteredProblems = problems.filter(p => {
        const matchesSearch =
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDiff = !selectedDifficulty || p.difficulty === selectedDifficulty;
        const matchesTag = !selectedTag || p.tags.includes(selectedTag);
        return matchesSearch && matchesDiff && matchesTag;
    });

    // Pagination calculations
    const totalProblems = filteredProblems.length;
    const totalPages = Math.ceil(totalProblems / PROBLEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * PROBLEMS_PER_PAGE;
    const endIndex = startIndex + PROBLEMS_PER_PAGE;
    const currentProblems = filteredProblems.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedDifficulty, selectedTag]);

    const getUserStats = () => {
        if (!user || problems.length === 0) return null;

        const total = problems.length; // This should be the total count of ALL problems, not filtered

        console.log('All problems:', problems.map(p => ({ id: p._id, title: p.title })));
        console.log('All submissions keys:', Object.keys(submissions));

        // Get solved problem IDs by checking submissions
        const solvedIds = Object.keys(submissions).filter(problemId => {
            const problemSubmissions = submissions[problemId] || [];
            const isSolved = problemSubmissions.some(sub => {
                console.log(`Checking submission for ${problemId}:`, sub.status, 'Is successful:', isSuccessfulStatus(sub.status));
                return isSuccessfulStatus(sub.status);
            });
            return isSolved;
        });

        console.log('Solved problem IDs:', solvedIds);

        const solved = solvedIds.length;

        const byDiff = { Easy: 0, Medium: 0, Hard: 0 };
        problems.forEach(p => {
            if (solvedIds.includes(p._id)) {
                byDiff[p.difficulty]++;
            }
        });

        return {
            solvedIds,
            solved,
            total,
            percentage: total ? Math.round((solved / total) * 100) : 0,
            byDifficulty: {
                Easy: { solved: byDiff.Easy, total: problems.filter(p => p.difficulty === 'Easy').length },
                Medium: { solved: byDiff.Medium, total: problems.filter(p => p.difficulty === 'Medium').length },
                Hard: { solved: byDiff.Hard, total: problems.filter(p => p.difficulty === 'Hard').length },
            },
        };
    };

    const userStats = getUserStats();

    // Updated getProblemStatus to use precomputed problemStatus
    const getProblemStatus = (problemId: string): 'solved' | 'attempted' | 'unsolved' => {
        if (!user) return 'unsolved';
        return problemStatus[problemId] || 'unsolved';
    };

    const diffStyles = {
        Easy: {
            color: 'text-emerald-400',
            bg: 'bg-emerald-900/30',
            border: 'border-emerald-800/50',
            badge: 'bg-emerald-900/30 border-emerald-800/50 text-emerald-400'
        },
        Medium: {
            color: 'text-yellow-400',
            bg: 'bg-yellow-900/30',
            border: 'border-yellow-800/50',
            badge: 'bg-yellow-900/30 border-yellow-800/50 text-yellow-400'
        },
        Hard: {
            color: 'text-red-400',
            bg: 'bg-red-900/30',
            border: 'border-red-800/50',
            badge: 'bg-red-900/30 border-red-800/50 text-red-400'
        },
    };

    const statusStyles = {
        solved: {
            icon: CheckCircle,
            color: 'text-emerald-400',
            bg: 'bg-emerald-900/30',
            label: 'Solved'
        },
        attempted: {
            icon: Clock,
            color: 'text-yellow-400',
            bg: 'bg-yellow-900/30',
            label: 'Attempted'
        },
        unsolved: {
            icon: BookOpen,
            color: 'text-zinc-400',
            bg: 'bg-zinc-900/50',
            label: 'Unsolved'
        },
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        buttons.push(
            <Button
                key="prev"
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>
        );

        // First page
        if (startPage > 1) {
            buttons.push(
                <Button
                    key={1}
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    className={currentPage === 1
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700"}
                >
                    1
                </Button>
            );
            if (startPage > 2) {
                buttons.push(<span key="dots1" className="text-zinc-400 px-2">...</span>);
            }
        }

        // Page buttons
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i)}
                    className={currentPage === i
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700"}
                >
                    {i}
                </Button>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(<span key="dots2" className="text-zinc-400 px-2">...</span>);
            }
            buttons.push(
                <Button
                    key={totalPages}
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    className={currentPage === totalPages
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700"}
                >
                    {totalPages}
                </Button>
            );
        }

        // Next button
        buttons.push(
            <Button
                key="next"
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="w-4 h-4" />
            </Button>
        );

        return buttons;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
            <div className="animate-spin">
                <div className="w-16 h-16 border-t-4 border-b-4 border-orange-500 rounded-full"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
            <Card className="max-w-md bg-zinc-900/70 border-zinc-800">
                <CardContent className="p-8 text-center">
                    <AlertCircle size={48} className="mx-auto text-red-500" />
                    <h3 className="text-lg font-semibold text-white mt-4">Error</h3>
                    <p className="text-zinc-400 mt-2">{error}</p>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="bg-zinc-950 w-full ">
            <div className="container mx-auto p-4 md:p-6 bg-zinc-950 min-h-screen">
                <header className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Top Interview 155</h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Master algorithms & data structures with curated problems.
                    </p>
                </header>

                {user && userStats && (
                    <Card className="mb-8 bg-zinc-900/70 border-zinc-800">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Trophy className="text-orange-500" />
                                <div>
                                    <CardTitle className="text-white">Your Progress</CardTitle>
                                    <CardDescription className="text-zinc-400">Track your coding journey</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-zinc-800/50 p-4 rounded-lg">
                                    <h3 className="text-zinc-400 text-sm">Total Solved</h3>
                                    <p className="text-2xl font-bold text-white">{userStats.solved}/{userStats.total}</p>
                                    <p className="text-zinc-500 text-sm">{userStats.percentage}% completed</p>
                                </div>
                                {(['Easy', 'Medium', 'Hard'] as const).map(level => (
                                    <div key={level} className="bg-zinc-800/50 p-4 rounded-lg">
                                        <h4 className="text-zinc-400 text-sm">{level}</h4>
                                        <p className="text-white font-medium">
                                            {userStats.byDifficulty[level].solved}/{userStats.byDifficulty[level].total}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="mb-8 bg-zinc-900/70 border-zinc-800">
                    <CardContent className="p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="col-span-2 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <Input
                                    placeholder="Search problems..."
                                    className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={!selectedDifficulty ? 'default' : 'outline'}
                                    className={!selectedDifficulty ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}
                                    onClick={() => setSelectedDifficulty(null)}
                                >
                                    All
                                </Button>
                                {(['Easy', 'Medium', 'Hard'] as const).map(level => (
                                    <Button
                                        key={level}
                                        variant={selectedDifficulty === level ? 'default' : 'outline'}
                                        className={selectedDifficulty === level ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}
                                        onClick={() => setSelectedDifficulty(selectedDifficulty === level ? null : level)}
                                    >
                                        {level}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {allTags.length > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Tag className="text-zinc-400" />
                                    <span className="text-zinc-400 font-medium">Popular Tags:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {allTags.slice(0, 12).map(tag => (
                                        <Badge
                                            key={tag}
                                            variant={selectedTag === tag ? 'default' : 'outline'}
                                            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                            className={`cursor-pointer transition-colors ${selectedTag === tag
                                                ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30'
                                                : 'bg-zinc-800/50 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                                                }`}
                                        >
                                            {tag} <span className="ml-1 text-zinc-500">({tagCounts[tag]})</span>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Results summary */}
                {totalProblems > 0 && (
                    <div className="mb-4 flex justify-between items-center text-zinc-400 text-sm">
                        <span>
                            Showing {startIndex + 1}-{Math.min(endIndex, totalProblems)} of {totalProblems} problems
                        </span>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                )}

                {filteredProblems.length === 0 ? (
                    <Card className="bg-zinc-900/70 border-zinc-800">
                        <CardContent className="text-center py-12 px-4">
                            <Search size={48} className="mx-auto text-zinc-600" />
                            <h3 className="mt-4 text-xl font-medium text-white">No Problems Found</h3>
                            <p className="mt-2 text-zinc-400">Adjust your filters or search to view problems.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card className="bg-zinc-900/70 border-zinc-800">
                            <CardContent className="p-0">
                                {/* Mobile Header */}
                                <div className="grid grid-cols-2 gap-4 p-4 font-semibold text-zinc-300 border-b border-zinc-800 md:hidden">
                                    <div className="col-span-1">Problem</div>
                                    <div className="col-span-1">Status</div>
                                </div>

                                {/* Desktop Header */}
                                <div className="hidden md:grid grid-cols-12 gap-4 p-4 font-semibold text-zinc-300 border-b border-zinc-800">
                                    <div className="col-span-1">#</div>
                                    <div className="col-span-4">Problem</div>
                                    <div className="col-span-2">Difficulty</div>
                                    <div className="col-span-3">Tags</div>
                                    <div className="col-span-2">Status</div>
                                </div>

                                <div className="divide-y divide-zinc-800">
                                    {currentProblems.map((p, i) => {
                                        const statusKey = getProblemStatus(p._id);
                                        const stat = statusStyles[statusKey];
                                        const diff = diffStyles[p.difficulty];
                                        const Icon = stat.icon;
                                        const globalIndex = startIndex + i + 1;

                                        return (
                                            <Link href={`/problems/${p._id}`} key={p._id} className="block hover:bg-zinc-900/50 transition-colors">
                                                <div className="grid grid-cols-2 md:grid-cols-12 items-center gap-4 p-4">
                                                    {/* Mobile View */}
                                                    <div className="col-span-2 md:hidden">
                                                        <h3 className="font-semibold text-white hover:text-orange-400 truncate">{p.title}</h3>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className={`text-xs rounded px-2 py-1 ${diff.badge}`}>
                                                                {p.difficulty}
                                                            </span>
                                                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded ${stat.bg} ${stat.color}`}>
                                                                <Icon className="w-3 h-3" /> {stat.label}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Desktop View */}
                                                    <div className="hidden md:flex md:col-span-1 justify-center text-zinc-400">
                                                        {globalIndex}
                                                    </div>
                                                    <div className="hidden md:block md:col-span-4">
                                                        <h3 className="font-semibold text-white sm:block hover:text-orange-400 truncate">{p.title}</h3>
                                                        <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                                                            {p.description.length > 100 ? `${p.description.slice(0, 100)}...` : p.description}
                                                        </p>
                                                    </div>
                                                    <div className="hidden md:flex md:col-span-2 justify-center">
                                                        <span className={`px-2 py-1 text-xs rounded ${diff.badge}`}>
                                                            {p.difficulty}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-3 hidden md:flex flex-wrap gap-1">
                                                        {p.tags.map(t => (
                                                            <Badge
                                                                key={t}
                                                                variant="outline"
                                                                className="px-2 py-0.5 text-xs bg-zinc-800/50 text-zinc-300 border-zinc-700 hover:bg-zinc-800"
                                                            >
                                                                {t}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <div className="hidden md:flex md:col-span-2 justify-center">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded ${stat.bg} ${stat.color}`}>
                                                            <Icon className="w-3 h-3" /> {stat.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center items-center gap-2">
                                {renderPaginationButtons()}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}