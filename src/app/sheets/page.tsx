// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Search } from 'lucide-react';
// import SheetList from '@/components/sheets/SheetList';

// export default function SheetsPage() {
//     const { user } = useAuth();
//     const [searchQuery, setSearchQuery] = useState('');

//     return (
//         <div className="w-full min-h-screen bg-black text-white">
//             <div className="max-w-6xl mx-auto p-4 py-12">
//                 {/* Hero section */}
//                 <div className="text-center mb-12">
//                     <h1 className="text-4xl font-bold mb-4">DSA Sheets</h1>
//                     <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
//                         Accelerate your coding journey with our carefully curated problem sheets
//                     </p>
//                 </div>

//                 {/* Search */}
//                 <div className="mb-8 relative max-w-xl mx-auto">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
//                     <Input
//                         type="text"
//                         placeholder="Search sheets..."
//                         className="pl-10 bg-zinc-900/60 border-zinc-800 text-white"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                 </div>

//                 {/* Sheets list component */}
//                 <SheetList />

//                 {/* Admin button */}
//                 {user?.role === 'admin' && (
//                     <div className="flex justify-center mt-12">
//                         <Button asChild className="bg-orange-500 hover:bg-orange-600">
//                             <Link href="/admin">Manage Sheets</Link>
//                         </Button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }



"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, Users, Award, Sparkles, Zap, Target } from "lucide-react"
import SheetList from "@/components/sheets/SheetList"

export default function SheetsPage() {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const filters = [
        { id: "all", label: "All Sheets", icon: Target },
        { id: "beginner", label: "Beginner", icon: Users },
        { id: "intermediate", label: "Intermediate", icon: TrendingUp },
        { id: "advanced", label: "Advanced", icon: Award },
    ]

    const stats = [
        {
            label: "Total Problems",
            value: "350+",
            icon: Target,
            gradient: "from-blue-500 to-cyan-500",
            description: "Curated challenges",
        },
        {
            label: "Active Learners",
            value: "1,250+",
            icon: Users,
            gradient: "from-purple-500 to-pink-500",
            description: "Growing community",
        },
        {
            label: "Success Rate",
            value: "94%",
            icon: TrendingUp,
            gradient: "from-green-500 to-emerald-500",
            description: "Job placements",
        },
        {
            label: "Expert Curated",
            value: "100%",
            icon: Award,
            gradient: "from-orange-500 to-red-500",
            description: "Quality assured",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Enhanced background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
                <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>

                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-orange-400/20 rounded-full animate-float-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${8 + Math.random() * 4}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Enhanced Hero Section */}
                    <div
                        className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        {/* Premium badge */}
                        <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 mb-8 animate-fade-in-up">
                            <Sparkles className="h-5 w-5 text-orange-400 animate-pulse-glow" />
                            <span className="text-sm font-medium text-orange-300">Premium DSA Collection</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent leading-tight animate-fade-in-up">
                            Master Data Structures
                            <br />
                            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                                & Algorithms
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8 animate-fade-in-up">
                            Accelerate your coding journey with our carefully curated problem sheets designed by industry experts.
                            <br />
                            <span className="text-orange-400 font-medium">Join thousands of successful developers.</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 hover:scale-105 group"
                            >
                                <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                                Start Learning Now
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 px-8 py-4 text-lg transition-all duration-500 hover:scale-105"
                            >
                                View Progress
                            </Button>
                        </div>
                    </div>

                    {/* Enhanced Stats Section */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className="glass-card p-6 rounded-2xl border border-white/10 backdrop-blur-xl group hover:border-white/20 transition-all duration-500 hover:scale-105 animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} text-white group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <stat.icon size={24} />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-slate-300 mb-1">{stat.label}</div>
                                <div className="text-xs text-slate-400">{stat.description}</div>
                            </div>
                        ))}
                    </div>

                    {/* Enhanced Search and Filter Section */}
                    <div className="mb-12 space-y-6">
                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-50"></div>
                            <div className="relative glass-card rounded-2xl border border-white/10 backdrop-blur-xl p-2">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <Input
                                        type="text"
                                        placeholder="Search for specific topics, algorithms, or difficulty levels..."
                                        className="pl-12 pr-4 py-4 bg-transparent border-none text-white placeholder:text-slate-400 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {filters.map((filter, index) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedFilter(selectedFilter === filter.id ? null : filter.id)}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 animate-fade-in-up ${selectedFilter === filter.id
                                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                                        : "glass-card border border-white/10 text-slate-300 hover:text-white hover:border-white/20"
                                        }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <filter.icon size={16} />
                                    <span>{filter.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Enhanced Sheets List */}
                    <div className="animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                        <SheetList searchQuery={searchQuery} selectedFilter={selectedFilter} />
                    </div>

                    {/* Enhanced Admin Section */}
                    {user?.role === "admin" && (
                        <div className="flex justify-center mt-16 animate-fade-in-up" style={{ animationDelay: "800ms" }}>
                            <div className="glass-card p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 mb-4">
                                        <Award className="h-4 w-4 text-red-400" />
                                        <span className="text-sm font-medium text-red-300">Admin Access</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Content Management</h3>
                                    <p className="text-slate-400">Manage and create new DSA sheets for the community</p>
                                </div>
                                <Button
                                    asChild
                                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-500 hover:scale-105"
                                >
                                    <Link href="/admin">
                                        <Award className="mr-2 h-4 w-4" />
                                        Manage Sheets
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
