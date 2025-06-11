// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useAuth } from '@/contexts/AuthContext';
// import apiClient from '@/lib/api';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { ChevronRight, Code, BookOpen, GraduationCap, LayoutDashboard, BarChart2, FilePen, User, CheckCircle } from 'lucide-react';

// interface Sheet {
//   _id: string;
//   title: string;
//   description: string;
//   totalProblems: number;
// }

// interface SheetProgress {
//   sheetId: string;
//   completedProblemIds: string[];
// }

// interface Blog {
//   _id: string;
//   title: string;
//   summary: string;
//   coverImage: string;
//   createdAt: string;
//   views: number;
//   readTime: number;
// }

// interface CodingProblem {
//   _id: string;
//   title: string;
//   difficulty: 'Easy' | 'Medium' | 'Hard';
// }

// export default function HomePage() {
//   const { user } = useAuth();
//   const [sheets, setSheets] = useState<Sheet[]>([]);
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [problems, setProblems] = useState<CodingProblem[]>([]);
//   const [progress, setProgress] = useState<Record<string, SheetProgress>>({});
//   const [userCount, setUserCount] = useState<number>(1250);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch sheets, blogs, and problems on component mount
//   useEffect(() => {
//     const fetchResources = async () => {
//       try {
//         setLoading(true);

//         // Fetch sheets
//         const sheetsResponse = await apiClient.getAllSheets();
//         setSheets(sheetsResponse.data || []);

//         // Fetch blogs if API exists, otherwise initialize empty
//         try {
//           const blogsResponse = await apiClient.getAllBlogs();
//           setBlogs(blogsResponse.data.data || []);
//         } catch (error) {
//           console.log('Blogs API might not be available yet');
//           setBlogs([]);
//         }

//         // Fetch problems if API exists, otherwise initialize empty
//         try {
//           const problemsResponse = await apiClient.getAllProblems();
//           setProblems(problemsResponse.data.data || []);
//         } catch (error) {
//           console.log('Problems API might not be available yet');
//           setProblems([]);
//         }

//         // Initialize guest progress from localStorage if not logged in
//         if (!user) {
//           const guestProgress: Record<string, SheetProgress> = {};

//           sheetsResponse.data.forEach((sheet: Sheet) => {
//             const localProgress = localStorage.getItem(`progress:${sheet._id}`);
//             guestProgress[sheet._id] = {
//               sheetId: sheet._id,
//               completedProblemIds: localProgress ? JSON.parse(localProgress) : []
//             };
//           });

//           setProgress(guestProgress);
//         }
//       } catch (err: any) {
//         setError(err.response?.data?.error || 'Failed to fetch resources');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResources();
//   }, [user]);

//   // Fetch user progress for each sheet if logged in
//   useEffect(() => {
//     if (!user || sheets.length === 0) return;

//     const fetchUserProgress = async () => {
//       try {
//         const userProgress: Record<string, SheetProgress> = {};

//         for (const sheet of sheets) {
//           try {
//             const { data } = await apiClient.getProgress(sheet._id);
//             userProgress[sheet._id] = data;
//           } catch (error) {
//             // If error fetching progress for a sheet, initialize with empty array
//             userProgress[sheet._id] = {
//               sheetId: sheet._id,
//               completedProblemIds: []
//             };
//           }
//         }

//         setProgress(userProgress);
//       } catch (err) {
//         console.error('Error fetching user progress:', err);
//       }
//     };

//     fetchUserProgress();
//   }, [user, sheets]);

//   // Calculate completion percentage for a sheet
//   const getCompletionPercentage = (sheetId: string, totalProblems: number) => {
//     const sheetProgress = progress[sheetId];

//     if (!sheetProgress || totalProblems === 0) return 0;

//     return Math.round((sheetProgress.completedProblemIds.length / totalProblems) * 100);
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Loading state
//   // if (loading) {
//   //   return (
//   //     <div className="w-full bg-black min-h-screen text-white">
//   //       <div className="max-w-6xl mx-auto px-4 pt-16 pb-12">
//   //         <div className="flex justify-center items-center min-h-[400px]">
//   //           <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   return (

//     <div className="w-full bg-black min-h-screen text-white">
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-b from-zinc-900 to-black pt-16 pb-24 px-4 overflow-hidden">
//         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
//           <div className="absolute top-20 left-10 w-10 h-10 bg-orange-500/20 rounded-full"></div>
//           <div className="absolute bottom-40 right-20 w-20 h-20 bg-blue-500/10 rounded-full"></div>
//           <div className="absolute top-60 right-40 w-5 h-5 bg-green-500/20 rounded-full"></div>
//           <div className="absolute bottom-10 left-1/3 w-8 h-8 bg-yellow-500/10 rounded-full"></div>
//         </div>

//         <div className="max-w-5xl mx-auto relative z-10">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">
//               Advance Your Career with <span className="text-orange-500">VibeArmor</span>
//             </h1>
//             <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
//               Master DSA with curated resources and expert guidance. Learn the skills that set you apart and join the top coders!
//             </p>

//             <div className="flex justify-center gap-4 flex-wrap">
//               <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600">
//                 <Link href="/sheets">Explore Sheets</Link>
//               </Button>
//               <Button size="lg" variant="secondary" asChild>
//                 <Link href="/blogs">Read Blogs</Link>
//               </Button>
//             </div>
//           </div>

//           <div className="mt-12 p-6 bg-zinc-900/80 rounded-xl border border-zinc-800">
//             <div className="flex items-center mb-4">
//               <h2 className="text-2xl font-bold text-orange-500">{userCount}+</h2>
//               <span className="ml-2 text-xl font-semibold">Learners</span>
//             </div>
//             <p className="text-zinc-400 text-sm">have improved their coding skills through our platform</p>

//             <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="flex flex-col items-center bg-zinc-800/50 rounded-lg p-4">
//                 <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
//                   <BookOpen className="h-6 w-6 text-blue-400" />
//                 </div>
//                 <span className="text-sm text-center">DSA Sheets</span>
//               </div>

//               <div className="flex flex-col items-center bg-zinc-800/50 rounded-lg p-4">
//                 <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mb-3">
//                   <FilePen className="h-6 w-6 text-green-400" />
//                 </div>
//                 <span className="text-sm text-center">Tech Blogs</span>
//               </div>

//               <div className="flex flex-col items-center bg-zinc-800/50 rounded-lg p-4">
//                 <div className="w-12 h-12 bg-orange-900/30 rounded-full flex items-center justify-center mb-3">
//                   <Code className="h-6 w-6 text-orange-400" />
//                 </div>
//                 <span className="text-sm text-center">Coding Problems</span>
//               </div>

//               <div className="flex flex-col items-center bg-zinc-800/50 rounded-lg p-4">
//                 <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
//                   <GraduationCap className="h-6 w-6 text-purple-400" />
//                 </div>
//                 <span className="text-sm text-center">Learning Paths</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Resources Section */}
//       <section className="py-16 px-4 bg-zinc-950">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-3xl font-bold mb-12 text-center">Resources to Learn</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <Link href="/sheets" className="block group">
//               <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-full group-hover:border-orange-500/50 transition-colors">
//                 <div className="h-2 bg-orange-500"></div>
//                 <div className="p-6">
//                   <div className="w-12 h-12 bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
//                     <BookOpen className="h-6 w-6 text-orange-400" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors">DSA Sheets</h3>
//                   <p className="text-zinc-400 text-sm">Master data structures & algorithms with our comprehensive sheets</p>

//                   <div className="mt-6 flex items-center text-orange-500 text-sm font-medium">
//                     <span>Explore Sheets</span>
//                     <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
//                   </div>
//                 </div>
//               </div>
//             </Link>

//             <Link href="/blogs" className="block group">
//               <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-full group-hover:border-blue-500/50 transition-colors">
//                 <div className="h-2 bg-blue-500"></div>
//                 <div className="p-6">
//                   <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
//                     <FilePen className="h-6 w-6 text-blue-400" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">Tech Blogs</h3>
//                   <p className="text-zinc-400 text-sm">Stay updated with the latest technologies and coding concepts</p>

//                   <div className="mt-6 flex items-center text-blue-500 text-sm font-medium">
//                     <span>Read Blogs</span>
//                     <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
//                   </div>
//                 </div>
//               </div>
//             </Link>

//             <Link href="/problems" className="block group">
//               <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-full group-hover:border-green-500/50 transition-colors">
//                 <div className="h-2 bg-green-500"></div>
//                 <div className="p-6">
//                   <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
//                     <Code className="h-6 w-6 text-green-400" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2 group-hover:text-green-500 transition-colors">Coding Problems</h3>
//                   <p className="text-zinc-400 text-sm">Sharpen your problem-solving skills with our coding challenges</p>

//                   <div className="mt-6 flex items-center text-green-500 text-sm font-medium">
//                     <span>Solve Problems</span>
//                     <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Recent Content Section */}
//       <section className="py-16 px-4 bg-gradient-to-b from-zinc-950 to-black">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-3xl font-bold mb-12 text-center">Latest Resources</h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Top DSA Sheets */}
//             <div>
//               <div className="flex items-center mb-6">
//                 <BookOpen className="h-5 w-5 text-orange-500 mr-2" />
//                 <h3 className="text-xl font-bold">Popular Sheets</h3>
//               </div>

//               <div className="space-y-4">
//                 {sheets.slice(0, 3).map(sheet => (
//                   <Link key={sheet._id} href={`/sheets/${sheet._id}`}>
//                     <Card className="bg-zinc-900/60 my-2 mx-2 border-zinc-800 hover:border-orange-500/50 transition-all">
//                       <CardContent className="p-4">
//                         <h4 className="font-medium mb-2 text-zinc-400">{sheet.title}</h4>
//                         <div className="flex items-center justify-between">
//                           <span className="text-xs text-zinc-400">{sheet.totalProblems} problems</span>
//                           <div className="flex items-center">
//                             <div className="w-16 h-1.5 bg-zinc-800 rounded-full mr-2">
//                               <div
//                                 className="h-1.5 bg-orange-500 rounded-full"
//                                 style={{ width: `${getCompletionPercentage(sheet._id, sheet.totalProblems)}%` }}
//                               ></div>
//                             </div>
//                             <span className="text-xs text-zinc-400">{getCompletionPercentage(sheet._id, sheet.totalProblems)}%</span>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </Link>
//                 ))}

//                 <Button variant="outline" size="sm" className="w-full" asChild>
//                   <Link href="/sheets" className='text-zinc-800'>View All Sheets</Link>
//                 </Button>
//               </div>
//             </div>

//             {/* Latest Blogs */}
//             <div>
//               <div className="flex items-center mb-6">
//                 <FilePen className="h-5 w-5 text-blue-500 mr-2" />
//                 <h3 className="text-xl font-bold">Latest Blogs</h3>
//               </div>

//               <div className="space-y-4">
//                 {blogs.length > 0 ? (
//                   blogs.slice(0, 3).map(blog => (
//                     <Link key={blog._id} href={`/blogs/${blog._id}`}>
//                       <Card className="bg-zinc-900/60 my-2 mx-2 border-zinc-800 hover:border-blue-500/50 transition-all">
//                         <CardContent className="p-4">
//                           <h4 className="font-medium mb-2 line-clamp-1 text-zinc-400">{blog.title}</h4>
//                           <p className="text-xs text-zinc-400 line-clamp-2 mb-2">{blog.summary}</p>
//                           <div className="flex items-center justify-between text-xs text-zinc-500">
//                             <span>{formatDate(blog.createdAt)}</span>
//                             <span>{blog.readTime} min read</span>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </Link>
//                   ))
//                 ) : (
//                   <Card className="bg-zinc-900/60 border-zinc-800">
//                     <CardContent className="p-4 text-center text-zinc-400">
//                       <p>Blogs coming soon!</p>
//                     </CardContent>
//                   </Card>
//                 )}

//                 <Button variant="outline" size="sm" className="w-full" asChild>
//                   <Link href="/blogs" className='text-zinc-800'>View All Blogs</Link>
//                 </Button>
//               </div>
//             </div>

//             {/* Coding Problems */}
//             <div>
//               <div className="flex items-center mb-6">
//                 <Code className="h-5 w-5 text-green-500 mr-2" />
//                 <h3 className="text-xl font-bold">Coding Problems</h3>
//               </div>

//               <div className="space-y-4">
//                 {problems.length > 0 ? (
//                   problems.slice(0, 3).map(problem => (
//                     <Link key={problem._id} href={`/problems/${problem._id}`}>
//                       <Card className="bg-zinc-900/60 my-2 mx-2 border-zinc-800 hover:border-green-500/50 transition-all">
//                         <CardContent className="p-4">
//                           <h4 className="font-medium mb-2 text-zinc-400">{problem.title}</h4>
//                           <div className="flex justify-between items-center">
//                             <Badge
//                               variant="outline"
//                               className={`
//                                 ${problem.difficulty === 'Easy' ? 'text-green-500 border-green-500/30' :
//                                   problem.difficulty === 'Medium' ? 'text-yellow-500 border-yellow-500/30' :
//                                     'text-red-500 border-red-500/30'}
//                               `}
//                             >
//                               {problem.difficulty}
//                             </Badge>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </Link>
//                   ))
//                 ) : (
//                   <Card className="bg-zinc-900/60 border-zinc-800">
//                     <CardContent className="p-4 text-center text-zinc-400">
//                       <p>Coding problems coming soon!</p>
//                     </CardContent>
//                   </Card>
//                 )}

//                 <Button variant="outline" size="sm" className="w-full" asChild>
//                   <Link href="/problems" className='text-zinc-800'>Explore All Problems</Link>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Join Community Section */}
//       <section className="py-16 px-4 bg-zinc-950 border-t border-zinc-900">
//         <div className="max-w-5xl mx-auto text-center">
//           <h2 className="text-3xl font-bold mb-6">Join Our Ever-Growing Global Community</h2>
//           <p className="text-zinc-400 max-w-2xl mx-auto mb-8">
//             Connect with fellow coders, share your knowledge, and accelerate your learning journey with our supportive community.
//           </p>

//           {user ? (
//             <div className="flex flex-col items-center">
//               <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
//                 {user.avatarUrl ? (
//                   <Image
//                     src={user.avatarUrl}
//                     alt={user.name}
//                     width={80}
//                     height={80}
//                     className="rounded-full"
//                   />
//                 ) : (
//                   <User className="h-10 w-10 text-white" />
//                 )}
//               </div>
//               <h3 className="text-xl font-medium mb-1">Welcome, {user.name}!</h3>
//               <p className="text-zinc-400 mb-6">You're part of our coding community</p>

//               <div className="flex gap-4">
//                 <Button size="lg" className="bg-orange-500 hover:bg-orange-600" asChild>
//                   <Link href="/sheets">Continue Learning</Link>
//                 </Button>
//                 <Button size="lg" variant="outline" asChild>
//                   <Link href="/profile" className='text-zinc-900'>View Profile</Link>
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex gap-4 justify-center">
//               <Button size="lg" className="bg-orange-500 hover:bg-orange-600" asChild>
//                 <Link href="/register">Join Now</Link>
//               </Button>
//               <Button size="lg" variant="outline" asChild>
//                 <Link href="/login">Sign In</Link>
//               </Button>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Features Section */}
//       {!user && (
//         <section className="py-16 px-4 bg-black">
//           <div className="max-w-6xl mx-auto">
//             <h2 className="text-3xl font-bold mb-12 text-center">Revolutionize the Way You Learn</h2>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <Card className="bg-zinc-900/50 border-zinc-800">
//                 <CardContent className="p-6">
//                   <div className="flex mb-4 text-orange-500">
//                     <BookOpen className="h-6 w-6" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2">Structured Learning</h3>
//                   <p className="text-zinc-400">
//                     Follow our proven learning paths to build strong foundations in algorithms and data structures.
//                   </p>
//                 </CardContent>
//               </Card>

//               <Card className="bg-zinc-900/50 border-zinc-800">
//                 <CardContent className="p-6">
//                   <div className="flex mb-4 text-blue-500">
//                     <CheckCircle className="h-6 w-6" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2">Track Progress</h3>
//                   <p className="text-zinc-400">
//                     Monitor your learning journey with detailed progress tracking and performance analytics.
//                   </p>
//                 </CardContent>
//               </Card>

//               <Card className="bg-zinc-900/50 border-zinc-800">
//                 <CardContent className="p-6">
//                   <div className="flex mb-4 text-green-500">
//                     <LayoutDashboard className="h-6 w-6" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2">Learn by Doing</h3>
//                   <p className="text-zinc-400">
//                     Solve real-world problems and strengthen your skills through hands-on practice.
//                   </p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }


"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Code, BookOpen, GraduationCap, LayoutDashboard, BarChart2, FilePen, User, CheckCircle, ArrowRight, Star, Clock, Users, TrendingUp, Award, Sparkles, Zap, Target, Rocket, Shield, Heart, Laptop, Briefcase, Globe, ChevronDown } from 'lucide-react'

interface Sheet {
  _id: string
  title: string
  description: string
  totalProblems: number
}

interface SheetProgress {
  sheetId: string
  completedProblemIds: string[]
}

interface Blog {
  _id: string
  title: string
  summary: string
  coverImage: string
  createdAt: string
  views: number
  readTime: number
}

interface CodingProblem {
  _id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
}

export default function HomePage() {
  const { user } = useAuth()
  const [sheets, setSheets] = useState<Sheet[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [problems, setProblems] = useState<CodingProblem[]>([])
  const [progress, setProgress] = useState<Record<string, SheetProgress>>({})
  const [userCount, setUserCount] = useState<number>(1250)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Animation on load
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fetch sheets, blogs, and problems on component mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true)

        // Fetch sheets
        const sheetsResponse = await apiClient.getAllSheets()
        setSheets(sheetsResponse.data || [])

        // Fetch blogs if API exists, otherwise initialize empty
        try {
          const blogsResponse = await apiClient.getAllBlogs()
          setBlogs(blogsResponse.data.data || [])
        } catch (error) {
          console.log("Blogs API might not be available yet")
          setBlogs([])
        }

        // Fetch problems if API exists, otherwise initialize empty
        try {
          const problemsResponse = await apiClient.getAllProblems()
          setProblems(problemsResponse.data.data || [])
        } catch (error) {
          console.log("Problems API might not be available yet")
          setProblems([])
        }

        // Initialize guest progress from localStorage if not logged in
        if (!user) {
          const guestProgress: Record<string, SheetProgress> = {}

          sheetsResponse.data.forEach((sheet: Sheet) => {
            const localProgress = localStorage.getItem(`progress:${sheet._id}`)
            guestProgress[sheet._id] = {
              sheetId: sheet._id,
              completedProblemIds: localProgress ? JSON.parse(localProgress) : [],
            }
          })

          setProgress(guestProgress)
        }
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch resources")
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
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
            // If error fetching progress for a sheet, initialize with empty array
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

  // Calculate completion percentage for a sheet
  const getCompletionPercentage = (sheetId: string, totalProblems: number) => {
    const sheetProgress = progress[sheetId]

    if (!sheetProgress || totalProblems === 0) return 0

    return Math.round((sheetProgress.completedProblemIds.length / totalProblems) * 100)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Mock testimonials data
  const testimonials = [
    {
      name: "Anubhuti Pandey",
      role: "Software Engineer at Google",
      image: "https://static.takeuforward.org/content/Anubhuti-Pandey-couG3Rtw",
      quote:
        "VibeArmor's structured approach to DSA helped me crack my dream job interview. The curated problem sets were exactly what I needed!",
    },
    {
      name: "Jyoti kiran Patil",
      role: "Full Stack Developer at Seimens",
      image: "https://static.takeuforward.org/content/IMG20240322132442%20-%20JYOTI%20PATIL-BhG5Ptn0",
      quote:
        "I went from struggling with basic algorithms to confidently solving complex problems. The progress tracking kept me motivated throughout my journey.",
    },
    {
      name: "Gaurav Poosarla",
      role: "SDE at Samsung",
      image: "https://static.takeuforward.org/content/id_photo_white_compressed-Gaurav%20Poosarla-BZGWU5pZ",
      quote:
        "VibeArmor transformed my coding skills. The expert-curated resources and supportive community made learning DSA enjoyable and effective.",
    },
  ]

  // Stats data
  const stats = [
    {
      value: "350+",
      label: "Coding Problems",
      icon: Code,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      value: "1,250+",
      label: "Active Learners",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      value: "94%",
      label: "Success Rate",
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      value: "100%",
      label: "Expert Curated",
      icon: Award,
      gradient: "from-orange-500 to-red-500",
    },
  ]

  // Features data
  const features = [
    {
      icon: BookOpen,
      color: "text-orange-500",
      title: "Structured Learning",
      description: "Follow our proven learning paths to build strong foundations in algorithms and data structures.",
    },
    {
      icon: CheckCircle,
      color: "text-blue-500",
      title: "Track Progress",
      description: "Monitor your learning journey with detailed progress tracking and performance analytics.",
    },
    {
      icon: LayoutDashboard,
      color: "text-green-500",
      title: "Learn by Doing",
      description: "Solve real-world problems and strengthen your skills through hands-on practice.",
    },
    {
      icon: Rocket,
      color: "text-purple-500",
      title: "Career Growth",
      description: "Prepare for technical interviews and advance your career with industry-relevant skills.",
    },
    {
      icon: Shield,
      color: "text-red-500",
      title: "Expert Guidance",
      description: "Learn from industry professionals with years of experience in top tech companies.",
    },
    {
      icon: Heart,
      color: "text-pink-500",
      title: "Supportive Community",
      description: "Connect with fellow learners, share knowledge, and grow together in our vibrant community.",
    },
  ]

  // Resource cards data
  const resourceCards = [
    {
      title: "DSA Sheets",
      description: "Master data structures & algorithms with our comprehensive sheets",
      icon: BookOpen,
      color: "orange",
      href: "/sheets",
      cta: "Explore Sheets",
    },
    {
      title: "Tech Blogs",
      description: "Stay updated with the latest technologies and coding concepts",
      icon: FilePen,
      color: "blue",
      href: "/blogs",
      cta: "Read Blogs",
    },
    {
      title: "Coding Problems",
      description: "Sharpen your problem-solving skills with our coding challenges",
      icon: Code,
      color: "green",
      href: "/problems",
      cta: "Solve Problems",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
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

        {/* Code pattern background */}
        <div className="absolute inset-0 opacity-5">
          <pre className="absolute top-20 left-10 text-xs font-mono">
            {`function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.filter((x, i) => i > 0 && x < pivot);
  const right = arr.filter(x => x >= pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}`}
          </pre>
          <pre className="absolute bottom-40 right-20 text-xs font-mono">
            {`class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}`}
          </pre>
        </div>
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-24 pb-32 px-6 overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.1), transparent 70%)",
        }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div
            className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {/* Premium badge */}
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 mb-8 animate-fade-in-up">
              <Sparkles className="h-5 w-5 text-orange-400 animate-pulse-glow" />
              <span className="text-sm font-medium text-orange-300">Premium Coding Education</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent leading-tight animate-fade-in-up">
              Advance Your Career with{" "}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                VibeArmor
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8 animate-fade-in-up">
              Master DSA with curated resources and expert guidance. Learn the skills that set you apart and join the top
              coders!
              <br />
              <span className="text-orange-400 font-medium">Join {userCount.toLocaleString()}+ successful developers.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 hover:scale-105 group"
              >
                <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Start Learning Now
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 px-8 py-6 text-lg transition-all duration-500 hover:scale-105"
              >
                View Progress
              </Button>
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
                  <div className="text-sm font-medium text-slate-300">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Learning Path Visual */}
            <div className="relative max-w-4xl mx-auto py-8 px-4 animate-fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-3xl"></div>
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-6">
                <div className="flex flex-col items-center text-center md:text-left">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/30">
                    <BookOpen className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Learn</h3>
                  <p className="text-sm text-slate-400 mt-2">Master DSA concepts</p>
                </div>

                <div className="hidden md:block w-24 h-0.5 bg-gradient-to-r from-blue-500/50 to-green-500/50"></div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center mb-4 border border-green-500/30">
                    <Code className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Practice</h3>
                  <p className="text-sm text-slate-400 mt-2">Solve real problems</p>
                </div>

                <div className="hidden md:block w-24 h-0.5 bg-gradient-to-r from-green-500/50 to-orange-500/50"></div>

                <div className="flex flex-col items-center text-center md:text-right">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center mb-4 border border-orange-500/30">
                    <Briefcase className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Succeed</h3>
                  <p className="text-sm text-slate-400 mt-2">Land your dream job</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-slate-400" />
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-400 mb-4">
              Comprehensive Resources
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Our carefully crafted resources cover everything from basic algorithms to advanced system design concepts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resourceCards.map((card, index) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-${card.color}-500/10 to-${card.color}-600/10 rounded-2xl transform group-hover:scale-105 transition-transform duration-500`}
                ></div>
                <div className="glass-card border border-white/10 rounded-2xl overflow-hidden h-full group-hover:border-white/20 transition-all duration-500 relative z-10">
                  <div className={`h-2 bg-${card.color}-500`}></div>
                  <div className="p-8">
                    <div
                      className={`w-16 h-16 bg-${card.color}-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                    >
                      <card.icon className={`h-8 w-8 text-${card.color}-400`} />
                    </div>
                    <h3
                      className={`text-2xl font-bold mb-4 group-hover:text-${card.color}-400 transition-colors duration-300`}
                    >
                      {card.title}
                    </h3>
                    <p className="text-slate-400 text-lg mb-8">{card.description}</p>

                    <div
                      className={`flex items-center text-${card.color}-500 text-lg font-medium group-hover:translate-x-2 transition-transform duration-300`}
                    >
                      <span>{card.cta}</span>
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Content Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400 mb-4">
              Always Fresh
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Latest Resources
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Stay updated with our newest content and continue your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Top DSA Sheets */}
            <div className="glass-card rounded-2xl border border-white/10 backdrop-blur-xl p-8 animate-fade-in-up">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white mr-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Popular Sheets</h3>
              </div>

              <div className="space-y-4">
                {sheets.slice(0, 3).map((sheet, index) => (
                  <Link
                    key={sheet._id}
                    href={`/sheets/${sheet._id}`}
                    className="block group animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card className="bg-white/5 border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:bg-white/10">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2 text-white group-hover:text-orange-400 transition-colors">
                          {sheet.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">{sheet.totalProblems} problems</span>
                          <div className="flex items-center">
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full mr-2 overflow-hidden">
                              <div
                                className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                                style={{ width: `${getCompletionPercentage(sheet._id, sheet.totalProblems)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-400">
                              {getCompletionPercentage(sheet._id, sheet.totalProblems)}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}

                <Button
                  variant="outline"
                  className="w-full border-white/10 hover:border-orange-500/50 hover:bg-white/5 text-slate-300 hover:text-white transition-all duration-300"
                  asChild
                >
                  <Link href="/sheets" className="flex items-center justify-center">
                    <span>View All Sheets</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Latest Blogs */}
            <div className="glass-card rounded-2xl border border-white/10 backdrop-blur-xl p-8 animate-fade-in-up animation-delay-200">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white mr-4">
                  <FilePen className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Latest Blogs</h3>
              </div>

              <div className="space-y-4">
                {blogs.length > 0 ? (
                  blogs.slice(0, 3).map((blog, index) => (
                    <Link
                      key={blog._id}
                      href={`/blogs/${blog._id}`}
                      className="block group animate-fade-in-up"
                      style={{ animationDelay: `${(index + 3) * 100}ms` }}
                    >
                      <Card className="bg-white/5 border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:bg-white/10">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2 line-clamp-1 text-white group-hover:text-blue-400 transition-colors">
                            {blog.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mb-2">{blog.summary}</p>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{blog.readTime} min read</span>
                            </div>
                            <span>{formatDate(blog.createdAt)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-6 text-center">
                      <FilePen className="h-12 w-12 text-blue-400/50 mx-auto mb-4" />
                      <p className="text-slate-400 mb-2">Blogs coming soon!</p>
                      <p className="text-xs text-slate-500">
                        We're working on creating insightful content for your learning journey.
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Button
                  variant="outline"
                  className="w-full border-white/10 hover:border-blue-500/50 hover:bg-white/5 text-slate-300 hover:text-white transition-all duration-300"
                  asChild
                >
                  <Link href="/blogs" className="flex items-center justify-center">
                    <span>View All Blogs</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Coding Problems */}
            <div className="glass-card rounded-2xl border border-white/10 backdrop-blur-xl p-8 animate-fade-in-up animation-delay-400">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white mr-4">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Coding Problems</h3>
              </div>

              <div className="space-y-4">
                {problems.length > 0 ? (
                  problems.slice(0, 3).map((problem, index) => (
                    <Link
                      key={problem._id}
                      href={`/problems/${problem._id}`}
                      className="block group animate-fade-in-up"
                      style={{ animationDelay: `${(index + 6) * 100}ms` }}
                    >
                      <Card className="bg-white/5 border-white/10 hover:border-green-500/50 transition-all duration-300 hover:bg-white/10">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2 text-white group-hover:text-green-400 transition-colors">
                            {problem.title}
                          </h4>
                          <div className="flex justify-between items-center">
                            <Badge
                              variant="outline"
                              className={`
                                ${problem.difficulty === "Easy"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : problem.difficulty === "Medium"
                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                                }
                              `}
                            >
                              {problem.difficulty}
                            </Badge>
                            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-6 text-center">
                      <Code className="h-12 w-12 text-green-400/50 mx-auto mb-4" />
                      <p className="text-slate-400 mb-2">Coding problems coming soon!</p>
                      <p className="text-xs text-slate-500">
                        We're preparing challenging problems to test your skills.
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Button
                  variant="outline"
                  className="w-full border-white/10 hover:border-green-500/50 hover:bg-white/5 text-slate-300 hover:text-white transition-all duration-300"
                  asChild
                >
                  <Link href="/problems" className="flex items-center justify-center">
                    <span>Explore All Problems</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400 mb-4">
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              From Our Community
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Hear from developers who transformed their careers with VibeArmor.
            </p>
          </div>

          <div className="relative">
            <div className="glass-card rounded-3xl border border-white/10 backdrop-blur-xl p-8 md:p-12 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${activeTestimonial === index ? "opacity-100" : "opacity-0 absolute inset-0"
                    }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-6 ring-4 ring-purple-500/30">
                      <Image src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} width={80} height={80} />
                    </div>
                    <p className="text-2xl text-slate-300 italic mb-8 leading-relaxed">"{testimonial.quote}"</p>
                    <h4 className="text-xl font-bold text-white mb-2">{testimonial.name}</h4>
                    <p className="text-purple-400">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTestimonial === index ? "bg-purple-500 scale-125" : "bg-slate-600"
                    }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="glass-card rounded-3xl border border-white/10 backdrop-blur-xl p-12 md:p-16">
            {user ? (
              <div className="flex flex-col items-center text-center animate-fade-in-up">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center mb-6 ring-4 ring-orange-500/30">
                  {user.avatarUrl ? (
                    <Image src={user.avatarUrl || "/placeholder.svg"} alt={user.name} width={96} height={96} className="rounded-full" />
                  ) : (
                    <User className="h-12 w-12 text-white" />
                  )}
                </div>
                <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                  Welcome, {user.name}!
                </h3>
                <p className="text-xl text-slate-400 mb-8 max-w-2xl">
                  You're part of our global community of developers. Continue your learning journey and reach new heights!
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 hover:scale-105"
                    asChild
                  >
                    <Link href="/sheets">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Continue Learning
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 px-8 py-6 text-lg transition-all duration-500 hover:scale-105"
                    asChild
                  >
                    <Link href="/profile">
                      <User className="mr-2 h-5 w-5" />
                      View Profile
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center animate-fade-in-up">
                <Badge className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400 mb-6">
                  Join Today
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Join Our Ever-Growing Global Community
                </h2>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
                  Connect with fellow coders, share your knowledge, and accelerate your learning journey with our
                  supportive community.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 hover:scale-105 group"
                    asChild
                  >
                    <Link href="/register">
                      <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                      Join Now
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 px-8 py-6 text-lg transition-all duration-500 hover:scale-105"
                    asChild
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {!user && (
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400 mb-4">
                Platform Benefits
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Revolutionize the Way You Learn
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Our platform is designed to provide you with the best learning experience possible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="glass-card rounded-2xl border border-white/10 backdrop-blur-xl p-8 hover:border-white/20 transition-all duration-500 hover:scale-105 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`flex mb-6 ${feature.color}`}>
                    <feature.icon className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-orange-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-lg">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="glass-card rounded-3xl border border-white/10 backdrop-blur-xl p-12 md:p-16 text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 mb-8 animate-pulse-subtle">
              <Rocket className="h-5 w-5 text-orange-400" />
              <span className="text-sm font-medium text-orange-300">Start Your Journey Today</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent">
              Ready to Master DSA and Advance Your Career?
            </h2>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Join thousands of developers who have transformed their careers with VibeArmor's premium learning resources.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 hover:scale-105 group"
              >
                <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Get Started Now
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 px-8 py-6 text-lg transition-all duration-500 hover:scale-105"
                asChild
              >
                <Link href="/sheets">Browse Sheets</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
