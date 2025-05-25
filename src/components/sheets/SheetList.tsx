'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle2, Code, ArrowRight } from 'lucide-react';

interface Sheet {
    _id: string;
    title: string;
    description: string;
    totalProblems: number;
    sections: any[];
}

interface SheetProgress {
    sheetId: string;
    completedProblemIds: string[];
}

export default function SheetList() {
    const { user } = useAuth();
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [progress, setProgress] = useState<Record<string, SheetProgress>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch sheets on component mount
    useEffect(() => {
        const fetchSheets = async () => {
            try {
                setLoading(true);
                const { data } = await apiClient.getAllSheets();
                console.log("Fetched sheets data:", data);
                setSheets(data);

                // Initialize guest progress from localStorage if not logged in
                if (!user) {
                    const guestProgress: Record<string, SheetProgress> = {};

                    data.forEach((sheet: Sheet) => {
                        const localProgress = localStorage.getItem(`progress:${sheet._id}`);
                        guestProgress[sheet._id] = {
                            sheetId: sheet._id,
                            completedProblemIds: localProgress ? JSON.parse(localProgress) : []
                        };
                    });

                    setProgress(guestProgress);
                }
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to fetch sheets');
                console.error("Error fetching sheets:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSheets();
    }, [user]);

    // Fetch user progress for each sheet if logged in
    useEffect(() => {
        if (!user || sheets.length === 0) return;

        const fetchUserProgress = async () => {
            try {
                const userProgress: Record<string, SheetProgress> = {};

                for (const sheet of sheets) {
                    try {
                        const { data } = await apiClient.getProgress(sheet._id);
                        userProgress[sheet._id] = data;
                    } catch (error) {
                        // If error fetching progress for a sheet, initialize with empty array
                        userProgress[sheet._id] = {
                            sheetId: sheet._id,
                            completedProblemIds: []
                        };
                    }
                }

                setProgress(userProgress);
            } catch (err) {
                console.error('Error fetching user progress:', err);
            }
        };

        fetchUserProgress();
    }, [user, sheets]);

    // Calculate completion percentage for a sheet
    const getCompletionPercentage = (sheetId: string, totalProblems: number) => {
        const sheetProgress = progress[sheetId];

        if (!sheetProgress || totalProblems === 0) return 0;

        return Math.round((sheetProgress.completedProblemIds.length / totalProblems) * 100);
    };

    // Count sections, topics, and problems for a sheet
    const getCounts = (sheet: Sheet) => {
        // If sections is missing or not an array, return 0 for both counts
        if (!sheet.sections || !Array.isArray(sheet.sections)) {
            return { sectionsCount: 0, topicsCount: 0 };
        }

        let topicsCount = 0;
        sheet.sections.forEach(section => {
            // Only add to topicsCount if topics is an array
            if (Array.isArray(section.topics)) {
                topicsCount += section.topics.length;
            }
        });

        return {
            sectionsCount: sheet.sections.length,
            topicsCount
        };
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-t-4 border-b-4 border-orange-500/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-t-4 border-b-4 border-orange-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-900/30 border border-red-800/50 text-red-300 rounded-lg p-6 backdrop-blur-sm">
                <p className="text-lg">{error}</p>
            </div>
        );
    }

    // Empty state
    if (sheets.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="flex justify-center mb-4">
                    <BookOpen className="h-16 w-16 text-zinc-700" />
                </div>
                <h3 className="text-xl font-medium text-zinc-300 mb-2">No sheets found</h3>
                <p className="text-zinc-500">
                    Sheets will appear here once they are published
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sheets.map((sheet) => {
                const { sectionsCount, topicsCount } = getCounts(sheet);
                const completionPercentage = getCompletionPercentage(sheet._id, sheet.totalProblems);
                const isCompleted = completionPercentage === 100;

                return (
                    <Link key={sheet._id} href={`/sheets/${sheet._id}`}>
                        <Card className="h-full flex flex-col hover:border-orange-500/50 transition-all duration-300 group bg-zinc-900 border-zinc-800 hover:shadow-lg hover:shadow-orange-500/10 overflow-hidden">
                            <CardContent className="p-6 flex-grow">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Badge
                                        variant="outline"
                                        className={`
                      transition-colors duration-300
                      ${isCompleted
                                                ? 'bg-green-900/30 text-green-400 border-green-700/50'
                                                : completionPercentage > 0
                                                    ? 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50'
                                                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                            }
                    `}
                                    >
                                        {isCompleted
                                            ? 'Completed'
                                            : completionPercentage > 0
                                                ? 'In Progress'
                                                : 'Not Started'
                                        }
                                    </Badge>
                                </div>

                                <h2 className="text-xl text-white font-semibold mb-2 group-hover:text-orange-400 transition-colors duration-300">
                                    {sheet.title}
                                </h2>

                                <p className="text-zinc-400 text-sm mb-6 line-clamp-2">
                                    {sheet.description}
                                </p>

                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="flex flex-col items-center p-3 bg-zinc-800/70 rounded-lg border border-zinc-700 backdrop-blur-sm">
                                        <p className="text-xl font-semibold text-orange-400">
                                            {sheet.totalProblems}
                                        </p>
                                        <p className="text-xs text-zinc-400">Problems</p>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-zinc-800/70 rounded-lg border border-zinc-700 backdrop-blur-sm">
                                        <p className="text-xl font-semibold text-blue-400">
                                            {sectionsCount}
                                        </p>
                                        <p className="text-xs text-zinc-400">Sections</p>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-zinc-800/70 rounded-lg border border-zinc-700 backdrop-blur-sm">
                                        <p className="text-xl font-semibold text-green-400">
                                            {topicsCount}
                                        </p>
                                        <p className="text-xs text-zinc-400">Topics</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                                        <span>Progress</span>
                                        <span>{completionPercentage}%</span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${isCompleted
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                                                : 'bg-gradient-to-r from-orange-500 to-amber-400'
                                                }`}
                                            style={{ width: `${completionPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 border-t border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
                                <div className="flex items-center justify-between w-full">
                                    {/* <div className="flex items-center space-x-2">
                                        <div className="h-2 w-24 bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${isCompleted
                                                        ? 'bg-green-500'
                                                        : 'bg-orange-500'
                                                    }`}
                                                style={{ width: `${completionPercentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-zinc-400">{completionPercentage}%</span>
                                    </div> */}
                                    <ArrowRight
                                        size={16}
                                        className="text-zinc-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300"
                                    />
                                </div>
                            </CardFooter>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}