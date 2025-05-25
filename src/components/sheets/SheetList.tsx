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
                <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-100 border border-red-300 text-red-800 rounded-md p-4">
                <p>{error}</p>
            </div>
        );
    }

    // Empty state
    if (sheets.length === 0) {
        return (
            <div className="text-center py-16">
                <BookOpen className="h-16 w-16 mx-auto text-zinc-600 mb-4" />
                <h3 className="text-xl font-medium text-zinc-800 mb-2">No sheets found</h3>
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

                return (
                    <Link key={sheet._id} href={`/sheets/${sheet._id}`}>
                        <Card className="h-full flex flex-col hover:border-primary/50 transition-all cursor-pointer group">
                            <CardContent className="p-6 flex-grow">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Badge
                                        variant="outline"
                                        className={`
                      ${completionPercentage === 100
                                                ? 'bg-green-100 text-green-800 border-green-300'
                                                : completionPercentage > 0
                                                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                                    : 'bg-gray-100 text-gray-800 border-gray-300'
                                            }
                    `}
                                    >
                                        {completionPercentage === 100
                                            ? 'Completed'
                                            : completionPercentage > 0
                                                ? 'In Progress'
                                                : 'Not Started'
                                        }
                                    </Badge>
                                </div>

                                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{sheet.title}</h2>
                                <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{sheet.description}</p>

                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xl font-semibold text-primary">{sheet.totalProblems}</p>
                                        <p className="text-xs text-muted-foreground">Problems</p>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xl font-semibold text-blue-600">{sectionsCount}</p>
                                        <p className="text-xs text-muted-foreground">Sections</p>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xl font-semibold text-green-600">{topicsCount}</p>
                                        <p className="text-xs text-muted-foreground">Topics</p>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 border-t bg-muted/10">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center space-x-2">
                                        <div className=" bg-muted rounded-full h-2 w-24">
                                            <div
                                                className="bg-primary h-2 rounded-full"
                                                style={{ width: `${completionPercentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
                                    </div>
                                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            </CardFooter>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}
