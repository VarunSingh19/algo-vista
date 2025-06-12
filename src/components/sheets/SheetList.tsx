// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/contexts/AuthContext';
// import apiClient from '@/lib/api';
// import { Card, CardContent, CardFooter } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { BookOpen, ArrowRight } from 'lucide-react';

// interface Sheet {
//     _id: string;
//     title: string;
//     description: string;
//     totalProblems: number;
//     sections: any[];
// }

// interface SheetProgress {
//     sheetId: string;
//     completedProblemIds: string[];
// }

// export default function SheetList() {
//     const { user } = useAuth();
//     const [sheets, setSheets] = useState<Sheet[]>([]);
//     const [progress, setProgress] = useState<Record<string, SheetProgress>>({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // Fetch sheets on component mount
//     useEffect(() => {
//         const fetchSheets = async () => {
//             try {
//                 setLoading(true);
//                 const { data } = await apiClient.getAllSheets();
//                 console.log("Fetched sheets data:", data);
//                 setSheets(data);

//                 // Initialize guest progress from localStorage if not logged in
//                 if (!user) {
//                     const guestProgress: Record<string, SheetProgress> = {};

//                     data.forEach((sheet: Sheet) => {
//                         const localProgress = localStorage.getItem(`progress:${sheet._id}`);
//                         guestProgress[sheet._id] = {
//                             sheetId: sheet._id,
//                             completedProblemIds: localProgress ? JSON.parse(localProgress) : []
//                         };
//                     });

//                     setProgress(guestProgress);
//                 }
//             } catch (err: any) {
//                 setError(err.response?.data?.error || 'Failed to fetch sheets');
//                 console.error("Error fetching sheets:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSheets();
//     }, [user]);

//     // Fetch user progress for each sheet if logged in
//     useEffect(() => {
//         if (!user || sheets.length === 0) return;

//         const fetchUserProgress = async () => {
//             try {
//                 const userProgress: Record<string, SheetProgress> = {};

//                 for (const sheet of sheets) {
//                     try {
//                         const { data } = await apiClient.getProgress(sheet._id);
//                         userProgress[sheet._id] = data;
//                     } catch (error) {
//                         // If error fetching progress for a sheet, initialize with empty array
//                         userProgress[sheet._id] = {
//                             sheetId: sheet._id,
//                             completedProblemIds: []
//                         };
//                     }
//                 }

//                 setProgress(userProgress);
//             } catch (err) {
//                 console.error('Error fetching user progress:', err);
//             }
//         };

//         fetchUserProgress();
//     }, [user, sheets]);

//     // Calculate completion percentage for a sheet
//     const getCompletionPercentage = (sheetId: string, totalProblems: number) => {
//         const sheetProgress = progress[sheetId];

//         if (!sheetProgress || totalProblems === 0) return 0;

//         return Math.round((sheetProgress.completedProblemIds.length / totalProblems) * 100);
//     };

//     // Count sections, topics, and problems for a sheet
//     const getCounts = (sheet: Sheet) => {
//         // If sections is missing or not an array, return 0 for both counts
//         if (!sheet.sections || !Array.isArray(sheet.sections)) {
//             return { sectionsCount: 0, topicsCount: 0 };
//         }

//         let topicsCount = 0;
//         sheet.sections.forEach(section => {
//             // Only add to topicsCount if topics is an array
//             if (Array.isArray(section.topics)) {
//                 topicsCount += section.topics.length;
//             }
//         });

//         return {
//             sectionsCount: sheet.sections.length,
//             topicsCount
//         };
//     };

//     // Loading state
//     if (loading) {
//         return (
//             <div className="flex justify-center items-center min-h-[300px]">
//                 <div className="relative w-16 h-16">
//                     <div className="absolute top-0 left-0 w-full h-full border-t-4 border-b-4 border-orange-500/20 rounded-full"></div>
//                     <div className="absolute top-0 left-0 w-full h-full border-t-4 border-b-4 border-orange-500 rounded-full animate-spin"></div>
//                 </div>
//             </div>
//         );
//     }

//     // Error state
//     if (error) {
//         return (
//             <div className="bg-red-900/30 border border-red-800/50 text-red-300 rounded-lg p-6 backdrop-blur-sm">
//                 <p className="text-lg">{error}</p>
//             </div>
//         );
//     }

//     // Empty state
//     if (sheets.length === 0) {
//         return (
//             <div className="text-center py-16">
//                 <div className="flex justify-center mb-4">
//                     <BookOpen className="h-16 w-16 text-zinc-700" />
//                 </div>
//                 <h3 className="text-xl font-medium text-zinc-300 mb-2">No sheets found</h3>
//                 <p className="text-zinc-500">
//                     Sheets will appear here once they are published
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {sheets.map((sheet) => {
//                 const { sectionsCount, topicsCount } = getCounts(sheet);
//                 const completionPercentage = getCompletionPercentage(sheet._id, sheet.totalProblems);
//                 const isCompleted = completionPercentage === 100;

//                 return (
//                     <Link key={sheet._id} href={`/sheets/${sheet._id}`}>
//                         <Card className="h-full flex flex-col hover:border-orange-500/50 transition-all duration-300 group bg-zinc-900 border-zinc-800 hover:shadow-lg hover:shadow-orange-500/10 overflow-hidden">
//                             <CardContent className="p-6 flex-grow">
//                                 <div className="flex items-center space-x-2 mb-4">
//                                     <Badge
//                                         variant="outline"
//                                         className={`
//                       transition-colors duration-300
//                       ${isCompleted
//                                                 ? 'bg-green-900/30 text-green-400 border-green-700/50'
//                                                 : completionPercentage > 0
//                                                     ? 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50'
//                                                     : 'bg-zinc-800 text-zinc-400 border-zinc-700'
//                                             }
//                     `}
//                                     >
//                                         {isCompleted
//                                             ? 'Completed'
//                                             : completionPercentage > 0
//                                                 ? 'In Progress'
//                                                 : 'Not Started'
//                                         }
//                                     </Badge>
//                                 </div>

//                                 <h2 className="text-xl text-white font-semibold mb-2 group-hover:text-orange-400 transition-colors duration-300">
//                                     {sheet.title}
//                                 </h2>

//                                 <p className="text-zinc-400 text-sm mb-6 line-clamp-2">
//                                     {sheet.description}
//                                 </p>

//                                 <div className="grid grid-cols-3 gap-2 mb-4">
//                                     <div className="flex flex-col items-center p-3 bg-zinc-800/70 rounded-lg border border-zinc-700 backdrop-blur-sm">
//                                         <p className="text-xl font-semibold text-orange-400">
//                                             {sheet.totalProblems}
//                                         </p>
//                                         <p className="text-xs text-zinc-400">Problems</p>
//                                     </div>
//                                     <div className="flex flex-col items-center p-3 bg-zinc-800/70 rounded-lg border border-zinc-700 backdrop-blur-sm">
//                                         <p className="text-xl font-semibold text-blue-400">
//                                             {sectionsCount}
//                                         </p>
//                                         <p className="text-xs text-zinc-400">Sections</p>
//                                     </div>
//                                     <div className="flex flex-col items-center p-3 bg-zinc-800/70 rounded-lg border border-zinc-700 backdrop-blur-sm">
//                                         <p className="text-xl font-semibold text-green-400">
//                                             {topicsCount}
//                                         </p>
//                                         <p className="text-xs text-zinc-400">Topics</p>
//                                     </div>
//                                 </div>

//                                 <div className="mt-4">
//                                     <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
//                                         <span>Progress</span>
//                                         <span>{completionPercentage}%</span>
//                                     </div>
//                                     <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
//                                         <div
//                                             className={`h-full rounded-full transition-all duration-500 ${isCompleted
//                                                 ? 'bg-gradient-to-r from-green-500 to-emerald-400'
//                                                 : 'bg-gradient-to-r from-orange-500 to-amber-400'
//                                                 }`}
//                                             style={{ width: `${completionPercentage}%` }}
//                                         />
//                                     </div>
//                                 </div>
//                             </CardContent>

//                             <CardFooter className="p-4 border-t border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
//                                 <div className="flex items-center justify-between w-full">
//                                     {/* <div className="flex items-center space-x-2">
//                                         <div className="h-2 w-24 bg-zinc-800 rounded-full overflow-hidden">
//                                             <div
//                                                 className={`h-full rounded-full transition-all duration-500 ${isCompleted
//                                                         ? 'bg-green-500'
//                                                         : 'bg-orange-500'
//                                                     }`}
//                                                 style={{ width: `${completionPercentage}%` }}
//                                             />
//                                         </div>
//                                         <span className="text-sm text-zinc-400">{completionPercentage}%</span>
//                                     </div> */}
//                                     <ArrowRight
//                                         size={16}
//                                         className="text-zinc-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300"
//                                     />
//                                 </div>
//                             </CardFooter>
//                         </Card>
//                     </Link>
//                 );
//             })}
//         </div>
//     );
// }




"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    BookOpen,
    ArrowRight,
    Clock,
    CheckCircle,
    PlayCircle,
    Users,
    TrendingUp,
    Star,
    Target,
    Award,
    Sparkles,
} from "lucide-react"

interface Sheet {
    _id: string
    title: string
    description: string
    totalProblems: number
    sections: any[]
    difficulty?: "Beginner" | "Intermediate" | "Advanced"
    estimatedTime?: string
    tags?: string[]
    featured?: boolean
}

interface SheetProgress {
    sheetId: string
    completedProblemIds: string[]
}

interface SheetListProps {
    searchQuery?: string
    selectedFilter?: string | null
}

export default function SheetList({ searchQuery = "", selectedFilter }: SheetListProps) {
    const { user } = useAuth()
    const [sheets, setSheets] = useState<Sheet[]>([])
    const [progress, setProgress] = useState<Record<string, SheetProgress>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hoveredCard, setHoveredCard] = useState<string | null>(null)

    // Fetch sheets on component mount
    useEffect(() => {
        const fetchSheets = async () => {
            try {
                setLoading(true)
                const { data } = await apiClient.getAllSheets()
                console.log("Fetched sheets data:", data)

                // Enhance sheets with mock data for better presentation
                const enhancedSheets = data.map((sheet: Sheet, index: number) => ({
                    ...sheet,
                    difficulty: ["Beginner", "Intermediate", "Advanced"][index % 3] as Sheet["difficulty"],
                    estimatedTime: ["3-4 months", "4-6 weeks", "6-8 weeks"][index % 3],
                    tags: [
                        ["Arrays", "Strings", "Basic"],
                        ["Trees", "Graphs", "DP"],
                        ["Advanced DP", "System Design", "Hard"],
                    ][index % 3],
                    featured: index < 2,
                }))

                setSheets(enhancedSheets)

                // Initialize guest progress from localStorage if not logged in
                if (!user) {
                    const guestProgress: Record<string, SheetProgress> = {}

                    enhancedSheets.forEach((sheet: Sheet) => {
                        const localProgress = localStorage.getItem(`progress:${sheet._id}`)
                        guestProgress[sheet._id] = {
                            sheetId: sheet._id,
                            completedProblemIds: localProgress ? JSON.parse(localProgress) : [],
                        }
                    })

                    setProgress(guestProgress)
                }
            } catch (err: any) {
                setError(err.response?.data?.error || "Failed to fetch sheets")
                console.error("Error fetching sheets:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchSheets()
    }, [user])

    // Fetch user progress for each sheet if logged in
    useEffect(() => {
        if (!user || sheets.length === 0) return

        const fetchUserProgress = async () => {
            try {
                const userProgress: Record<string, SheetProgress> = {}

                for (const sheet of sheets) {
                    try {
                        const { data } = await apiClient.getProgress(sheet._id)
                        userProgress[sheet._id] = data
                    } catch (error) {
                        userProgress[sheet._id] = {
                            sheetId: sheet._id,
                            completedProblemIds: [],
                        }
                    }
                }

                setProgress(userProgress)
            } catch (err) {
                console.error("Error fetching user progress:", err)
            }
        }

        fetchUserProgress()
    }, [user, sheets])

    // Filter sheets based on search and filter
    const filteredSheets = sheets.filter((sheet) => {
        const matchesSearch = !searchQuery || sheet.title.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesFilter =
            !selectedFilter ||
            selectedFilter === "all" ||
            (selectedFilter === "beginner" && sheet.difficulty === "Beginner") ||
            (selectedFilter === "intermediate" && sheet.difficulty === "Intermediate") ||
            (selectedFilter === "advanced" && sheet.difficulty === "Advanced")

        return matchesSearch && matchesFilter
    })

    // Calculate completion percentage for a sheet
    const getCompletionPercentage = (sheetId: string, totalProblems: number) => {
        const sheetProgress = progress[sheetId]
        if (!sheetProgress || totalProblems === 0) return 0
        return Math.round((sheetProgress.completedProblemIds.length / totalProblems) * 100)
    }

    // Count sections, topics, and problems for a sheet
    const getCounts = (sheet: Sheet) => {
        if (!sheet.sections || !Array.isArray(sheet.sections)) {
            return { sectionsCount: 0, topicsCount: 0 }
        }

        let topicsCount = 0
        sheet.sections.forEach((section) => {
            if (Array.isArray(section.topics)) {
                topicsCount += section.topics.length
            }
        })

        return {
            sectionsCount: sheet.sections.length,
            topicsCount,
        }
    }

    // Get difficulty styling
    const getDifficultyStyle = (difficulty?: string) => {
        switch (difficulty) {
            case "Beginner":
                return {
                    bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
                    text: "text-green-400",
                    border: "border-green-500/50",
                    icon: Users,
                }
            case "Intermediate":
                return {
                    bg: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
                    text: "text-yellow-400",
                    border: "border-yellow-500/50",
                    icon: TrendingUp,
                }
            case "Advanced":
                return {
                    bg: "bg-gradient-to-r from-red-500/20 to-pink-500/20",
                    text: "text-red-400",
                    border: "border-red-500/50",
                    icon: Award,
                }
            default:
                return {
                    bg: "bg-gradient-to-r from-blue-500/20 to-purple-500/20",
                    text: "text-blue-400",
                    border: "border-blue-500/50",
                    icon: Target,
                }
        }
    }

    // Enhanced Loading state
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="glass-card rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden animate-pulse"
                    >
                        <div className="p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-16 h-8 bg-white/10 rounded-full"></div>
                                <div className="w-20 h-6 bg-white/10 rounded"></div>
                            </div>
                            <div className="w-3/4 h-8 bg-white/10 rounded mb-4"></div>
                            <div className="w-full h-4 bg-white/10 rounded mb-2"></div>
                            <div className="w-2/3 h-4 bg-white/10 rounded mb-8"></div>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[...Array(3)].map((_, j) => (
                                    <div key={j} className="h-16 bg-white/5 rounded-xl"></div>
                                ))}
                            </div>
                            <div className="w-full h-3 bg-white/10 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Enhanced Error state
    if (error) {
        return (
            <div className="glass-card p-12 rounded-2xl border border-red-500/20 backdrop-blur-xl text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 mb-6">
                    <BookOpen className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Unable to Load Sheets</h3>
                <p className="text-lg text-red-300 mb-6">{error}</p>
                <Button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                >
                    Try Again
                </Button>
            </div>
        )
    }

    // Enhanced Empty state
    if (filteredSheets.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-slate-700/20 to-slate-600/20 mb-8">
                    <BookOpen className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-3xl font-semibold text-white mb-4">
                    {searchQuery || selectedFilter ? "No matching sheets found" : "No sheets available"}
                </h3>
                <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
                    {searchQuery || selectedFilter
                        ? "Try adjusting your search or filter criteria"
                        : "Sheets will appear here once they are published"}
                </p>
                {(searchQuery || selectedFilter) && (
                    <Button
                        onClick={() => {
                            // Reset filters - you'd need to pass these functions as props
                        }}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:text-white"
                    >
                        Clear Filters
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Featured Sheets Section */}
            {filteredSheets.some((sheet) => sheet.featured) && (
                <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500">
                            <Star className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Featured Sheets</h2>
                        <Badge className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border-orange-500/30">
                            Most Popular
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 ">
                        {filteredSheets
                            .filter((sheet) => sheet.featured)
                            .map((sheet, index) => {
                                const { sectionsCount, topicsCount } = getCounts(sheet)
                                const completionPercentage = getCompletionPercentage(sheet._id, sheet.totalProblems)
                                const isCompleted = completionPercentage === 100
                                const difficultyStyle = getDifficultyStyle(sheet.difficulty)

                                return (
                                    <Link key={sheet._id} href={`/sheets/${sheet._id}`}>
                                        <Card
                                            className="h-full glass-card border border-white/10 backdrop-blur-xl overflow-hidden group hover:border-orange-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10 bg-gradient-to-r from-slate-700/20 to-slate-600/20"
                                            onMouseEnter={() => setHoveredCard(sheet._id)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            {/* Featured badge */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-medium">
                                                    <Sparkles className="h-3 w-3" />
                                                    <span>Featured</span>
                                                </div>
                                            </div>

                                            <CardContent className="p-8">
                                                <div className="flex items-center space-x-3 mb-6">
                                                    <Badge
                                                        className={`${difficultyStyle.bg} ${difficultyStyle.text} border ${difficultyStyle.border} px-3 py-1 font-medium`}
                                                    >
                                                        <difficultyStyle.icon className="h-3 w-3 mr-1" />
                                                        {sheet.difficulty}
                                                    </Badge>

                                                    <Badge
                                                        variant="outline"
                                                        className={`transition-all duration-300 ${isCompleted
                                                            ? "bg-green-500/20 text-green-400 border-green-500/50"
                                                            : completionPercentage > 0
                                                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                                                : "bg-slate-700/20 text-slate-400 border-slate-600/50"
                                                            }`}
                                                    >
                                                        {isCompleted ? (
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                        ) : completionPercentage > 0 ? (
                                                            <PlayCircle className="h-3 w-3 mr-1" />
                                                        ) : (
                                                            <Clock className="h-3 w-3 mr-1" />
                                                        )}
                                                        {isCompleted ? "Completed" : completionPercentage > 0 ? "In Progress" : "Not Started"}
                                                    </Badge>
                                                </div>

                                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors duration-300">
                                                    {sheet.title}
                                                </h3>

                                                <p className="text-slate-300 text-base mb-6 leading-relaxed line-clamp-3">
                                                    {sheet.description}
                                                </p>

                                                {/* Tags */}
                                                {sheet.tags && (
                                                    <div className="flex flex-wrap gap-2 mb-6">
                                                        {sheet.tags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="px-3 py-1 text-xs font-medium bg-white/5 text-slate-300 rounded-full border border-white/10"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Enhanced Stats Grid */}
                                                <div className="grid grid-cols-4 gap-4 mb-6">
                                                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                                                        <div className="text-2xl font-bold text-blue-400 mb-1">{sheet.totalProblems}</div>
                                                        <div className="text-xs text-slate-400">Problems</div>
                                                    </div>
                                                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                                                        <div className="text-2xl font-bold text-purple-400 mb-1">{sectionsCount}</div>
                                                        <div className="text-xs text-slate-400">Sections</div>
                                                    </div>
                                                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
                                                        <div className="text-2xl font-bold text-green-400 mb-1">{topicsCount}</div>
                                                        <div className="text-xs text-slate-400">Topics</div>
                                                    </div>
                                                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20">
                                                        <div className="text-2xl font-bold text-orange-400 mb-1">{sheet.estimatedTime}</div>
                                                        <div className="text-xs text-slate-400">Duration</div>
                                                    </div>
                                                </div>

                                                {/* Enhanced Progress Bar */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-slate-300 font-medium">Progress</span>
                                                        <span className="text-slate-400">{completionPercentage}%</span>
                                                    </div>
                                                    <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted
                                                                ? "bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg shadow-green-500/50"
                                                                : "bg-gradient-to-r from-orange-500 to-amber-400 shadow-lg shadow-orange-500/50"
                                                                }`}
                                                            style={{
                                                                width: `${completionPercentage}%`,
                                                                boxShadow:
                                                                    completionPercentage > 0
                                                                        ? `0 0 20px ${isCompleted ? "rgba(34, 197, 94, 0.3)" : "rgba(251, 146, 60, 0.3)"}`
                                                                        : "none",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>

                                            <CardFooter className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-sm">
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                                                        <Clock className="h-4 w-4" />
                                                        <span>Est. {sheet.estimatedTime}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-orange-400 group-hover:text-orange-300 transition-colors duration-300">
                                                        <span className="text-sm font-medium">Start Learning</span>
                                                        <ArrowRight
                                                            className={`h-4 w-4 transition-all duration-300 ${hoveredCard === sheet._id ? "translate-x-1" : ""
                                                                }`}
                                                        />
                                                    </div>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </Link>
                                )
                            })}
                    </div>
                </div>
            )}

            {/* All Sheets Section */}
            <div>
                <div className="flex items-center space-x-3 mb-8">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                        <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">All Sheets</h2>
                    <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30">
                        {filteredSheets.length} Available
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredSheets.map((sheet, index) => {
                        const { sectionsCount, topicsCount } = getCounts(sheet)
                        const completionPercentage = getCompletionPercentage(sheet._id, sheet.totalProblems)
                        const isCompleted = completionPercentage === 100
                        const difficultyStyle = getDifficultyStyle(sheet.difficulty)

                        return (
                            <Link key={sheet._id} href={`/sheets/${sheet._id}`}>
                                <Card
                                    className="h-full glass-card border border-white/10 backdrop-blur-xl overflow-hidden group hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-black/20 animate-fade-in-up bg-gradient-to-r from-slate-700/20 to-slate-600/20"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    onMouseEnter={() => setHoveredCard(sheet._id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <Badge
                                                className={`${difficultyStyle.bg} ${difficultyStyle.text} border ${difficultyStyle.border} px-3 py-1 font-medium`}
                                            >
                                                <difficultyStyle.icon className="h-3 w-3 mr-1" />
                                                {sheet.difficulty}
                                            </Badge>

                                            <Badge
                                                variant="outline"
                                                className={`transition-all duration-300 ${isCompleted
                                                    ? "bg-green-500/20 text-green-400 border-green-500/50"
                                                    : completionPercentage > 0
                                                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                                        : "bg-slate-700/20 text-slate-400 border-slate-600/50"
                                                    }`}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                ) : completionPercentage > 0 ? (
                                                    <PlayCircle className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <Clock className="h-3 w-3 mr-1" />
                                                )}
                                                {isCompleted ? "Completed" : completionPercentage > 0 ? "In Progress" : "Not Started"}
                                            </Badge>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors duration-300">
                                            {sheet.title}
                                        </h3>

                                        <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">{sheet.description}</p>

                                        {/* Tags */}
                                        {sheet.tags && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {sheet.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 text-xs font-medium bg-white/5 text-slate-400 rounded-md border border-white/10"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                                                <div className="text-lg font-bold text-blue-400 mb-1">{sheet.totalProblems}</div>
                                                <div className="text-xs text-slate-400">Problems</div>
                                            </div>
                                            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                                                <div className="text-lg font-bold text-purple-400 mb-1">{sectionsCount}</div>
                                                <div className="text-xs text-slate-400">Sections</div>
                                            </div>
                                            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
                                                <div className="text-lg font-bold text-green-400 mb-1">{topicsCount}</div>
                                                <div className="text-xs text-slate-400">Topics</div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">Progress</span>
                                                <span className="text-slate-400">{completionPercentage}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${isCompleted
                                                        ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                                        : "bg-gradient-to-r from-orange-500 to-amber-400"
                                                        }`}
                                                    style={{ width: `${completionPercentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center space-x-2 text-xs text-slate-400">
                                                <Clock className="h-3 w-3" />
                                                <span>{sheet.estimatedTime}</span>
                                            </div>
                                            <ArrowRight
                                                className={`h-4 w-4 text-slate-500 group-hover:text-orange-400 transition-all duration-300 ${hoveredCard === sheet._id ? "translate-x-1" : ""
                                                    }`}
                                            />
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
