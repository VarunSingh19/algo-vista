'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Filter, Search, CheckCircle, AlertCircle, Clock, Tag } from 'lucide-react';

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
    status: string;
    language: string;
    createdAt: string;
}

export default function ProblemsPage() {
    const { user } = useAuth();
    const [problems, setProblems] = useState<CodingProblem[]>([]);
    const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch problems on component mount
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setLoading(true);
                const { data } = await apiClient.getAllProblems();
                setProblems(data.data || []);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to fetch coding problems');
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    // Fetch user submissions if logged in
    useEffect(() => {
        if (!user) return;

        const fetchUserSubmissions = async () => {
            try {
                const { data } = await apiClient.getUserSubmissions();

                // Group submissions by problem ID
                const submissionsByProblem: Record<string, Submission[]> = {};
                data.forEach((submission: Submission) => {
                    if (!submissionsByProblem[submission.problemId]) {
                        submissionsByProblem[submission.problemId] = [];
                    }
                    submissionsByProblem[submission.problemId].push(submission);
                });

                setSubmissions(submissionsByProblem);
            } catch (error) {
                console.error('Error fetching user submissions:', error);
            }
        };

        fetchUserSubmissions();
    }, [user]);

    // Extract all unique tags and sort by frequency
    const tagCounts: Record<string, number> = {};
    problems.forEach(problem => {
        problem.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    const allTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([tag]) => tag);

    // Filter problems based on search query, difficulty, and tag
    const filteredProblems = problems.filter(problem => {
        const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            problem.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = !selectedDifficulty || problem.difficulty === selectedDifficulty;
        const matchesTag = !selectedTag || problem.tags.includes(selectedTag);
        return matchesSearch && matchesDifficulty && matchesTag;
    });

    // Get stats about user's problem-solving progress
    const getUserStats = () => {
        if (!user || Object.keys(submissions).length === 0) return null;

        const totalProblems = problems.length;
        const solvedProblems = Object.keys(submissions).filter(problemId => {
            return submissions[problemId].some(sub => sub.status === 'Accepted');
        }).length;

        const solvedByDifficulty = {
            Easy: 0,
            Medium: 0,
            Hard: 0
        };

        problems.forEach(problem => {
            if (submissions[problem._id]?.some(sub => sub.status === 'Accepted')) {
                solvedByDifficulty[problem.difficulty]++;
            }
        });

        const totalByDifficulty = {
            Easy: problems.filter(p => p.difficulty === 'Easy').length,
            Medium: problems.filter(p => p.difficulty === 'Medium').length,
            Hard: problems.filter(p => p.difficulty === 'Hard').length
        };

        return {
            solved: solvedProblems,
            total: totalProblems,
            percentage: Math.round((solvedProblems / totalProblems) * 100),
            byDifficulty: {
                Easy: { solved: solvedByDifficulty.Easy, total: totalByDifficulty.Easy },
                Medium: { solved: solvedByDifficulty.Medium, total: totalByDifficulty.Medium },
                Hard: { solved: solvedByDifficulty.Hard, total: totalByDifficulty.Hard }
            }
        };
    };

    const userStats = getUserStats();

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get problem status for the current user
    const getProblemStatus = (problemId: string) => {
        if (!user || !submissions[problemId]) return 'unsolved';

        const problemSubmissions = submissions[problemId];
        if (problemSubmissions.some(sub => sub.status === 'Accepted')) {
            return 'solved';
        }

        return 'attempted';
    };

    // Get difficulty color
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'text-green-500 bg-green-50 dark:bg-green-950';
            case 'Medium':
                return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950';
            case 'Hard':
                return 'text-red-500 bg-red-50 dark:bg-red-950';
            default:
                return '';
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="container max-w-6xl mx-auto p-4 py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container max-w-6xl mx-auto p-4 py-8">
                <div className="bg-red-50 text-red-500 p-4 rounded-md">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto p-4 py-8">
            {/* Hero section */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4">Coding Problems</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Sharpen your coding skills with our diverse collection of algorithmic challenges.
                </p>
            </div>

            {/* User stats card */}
            {user && userStats && (
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex flex-col items-center">
                                <h3 className="text-sm font-medium text-muted-foreground">Problems Solved</h3>
                                <div className="flex items-center">
                                    <p className="text-2xl font-bold">{userStats.solved}/{userStats.total}</p>
                                    <span className="text-sm ml-2 text-muted-foreground">({userStats.percentage}%)</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <h3 className="text-sm font-medium text-muted-foreground">Easy</h3>
                                <div className="flex items-center">
                                    <p className="text-2xl font-bold text-green-500">
                                        {userStats.byDifficulty.Easy.solved}/{userStats.byDifficulty.Easy.total}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <h3 className="text-sm font-medium text-muted-foreground">Medium</h3>
                                <div className="flex items-center">
                                    <p className="text-2xl font-bold text-yellow-500">
                                        {userStats.byDifficulty.Medium.solved}/{userStats.byDifficulty.Medium.total}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <h3 className="text-sm font-medium text-muted-foreground">Hard</h3>
                                <div className="flex items-center">
                                    <p className="text-2xl font-bold text-red-500">
                                        {userStats.byDifficulty.Hard.solved}/{userStats.byDifficulty.Hard.total}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search and filter section */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        type="text"
                        placeholder="Search problems..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        variant={selectedDifficulty === null ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setSelectedDifficulty(null)}
                    >
                        All
                    </Button>
                    <Button
                        variant={selectedDifficulty === 'Easy' ? "default" : "outline"}
                        className="flex-1 text-green-500"
                        onClick={() => setSelectedDifficulty(selectedDifficulty === 'Easy' ? null : 'Easy')}
                    >
                        Easy
                    </Button>
                    <Button
                        variant={selectedDifficulty === 'Medium' ? "default" : "outline"}
                        className="flex-1 text-yellow-500"
                        onClick={() => setSelectedDifficulty(selectedDifficulty === 'Medium' ? null : 'Medium')}
                    >
                        Medium
                    </Button>
                    <Button
                        variant={selectedDifficulty === 'Hard' ? "default" : "outline"}
                        className="flex-1 text-red-500"
                        onClick={() => setSelectedDifficulty(selectedDifficulty === 'Hard' ? null : 'Hard')}
                    >
                        Hard
                    </Button>
                </div>
            </div>

            {/* Tags selection */}
            <div className="mb-8">
                <h3 className="text-sm font-medium mb-2">Popular Tags:</h3>
                <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, 10).map(tag => (
                        <Badge
                            key={tag}
                            variant={selectedTag === tag ? "default" : "outline"}
                            className="px-3 py-1.5 cursor-pointer"
                            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        >
                            <Tag size={12} className="mr-1.5" />
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Problems list */}
            {filteredProblems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    No problems found matching your search criteria.
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 font-medium text-sm border-b">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-5">Title</div>
                        <div className="col-span-2">Difficulty</div>
                        <div className="col-span-2 hidden md:block">Tags</div>
                        <div className="col-span-2 hidden md:block">Status</div>
                    </div>

                    {filteredProblems.map((problem, index) => {
                        const status = getProblemStatus(problem._id);
                        return (
                            <Link href={`/problems/${problem._id}`} key={problem._id}>
                                <div className="grid grid-cols-12 gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors items-center">
                                    <div className="col-span-1 text-center text-muted-foreground">{index + 1}</div>

                                    <div className="col-span-5">
                                        <h3 className="font-medium">{problem.title}</h3>
                                    </div>

                                    <div className="col-span-2">
                                        <Badge variant="outline" className={`${getDifficultyColor(problem.difficulty)}`}>
                                            {problem.difficulty}
                                        </Badge>
                                    </div>

                                    <div className="col-span-2 hidden md:block">
                                        <div className="flex flex-wrap gap-1">
                                            {problem.tags.slice(0, 2).map(tag => (
                                                <Badge key={tag} variant="outline" className="text-xs px-1">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {problem.tags.length > 2 && (
                                                <Badge variant="outline" className="text-xs px-1">
                                                    +{problem.tags.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-span-2 hidden md:block">
                                        {status === 'solved' && (
                                            <div className="flex items-center text-green-500">
                                                <CheckCircle size={14} className="mr-1" />
                                                Solved
                                            </div>
                                        )}
                                        {status === 'attempted' && (
                                            <div className="flex items-center text-yellow-500">
                                                <Clock size={14} className="mr-1" />
                                                Attempted
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Admin button */}
            {user?.role === 'admin' && (
                <div className="flex justify-center mt-8">
                    <Link href="/admin">
                        <Button>
                            Manage Coding Problems
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
