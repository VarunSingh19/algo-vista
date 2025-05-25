// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/contexts/AuthContext';
// import apiClient from '@/lib/api';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Code, Filter, Search, CheckCircle, AlertCircle, Clock, Tag } from 'lucide-react';

// interface CodingProblem {
//     _id: string;
//     title: string;
//     description: string;
//     difficulty: 'Easy' | 'Medium' | 'Hard';
//     tags: string[];
//     constraints: string;
//     examples: {
//         input: string;
//         output: string;
//         explanation?: string;
//     }[];
//     createdAt: string;
// }

// interface Submission {
//     _id: string;
//     problemId: string;
//     status: string;
//     language: string;
//     createdAt: string;
// }

// export default function ProblemsPage() {
//     const { user } = useAuth();
//     const [problems, setProblems] = useState<CodingProblem[]>([]);
//     const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({});
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
//     const [selectedTag, setSelectedTag] = useState<string | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // Fetch problems on component mount
//     useEffect(() => {
//         const fetchProblems = async () => {
//             try {
//                 setLoading(true);
//                 const { data } = await apiClient.getAllProblems();
//                 setProblems(data.data || []);
//             } catch (err: any) {
//                 setError(err.response?.data?.error || 'Failed to fetch coding problems');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProblems();
//     }, []);

//     // Fetch user submissions if logged in
//     useEffect(() => {
//         if (!user) return;

//         const fetchUserSubmissions = async () => {
//             try {
//                 const { data } = await apiClient.getUserSubmissions();

//                 // Group submissions by problem ID
//                 const submissionsByProblem: Record<string, Submission[]> = {};
//                 data.forEach((submission: Submission) => {
//                     if (!submissionsByProblem[submission.problemId]) {
//                         submissionsByProblem[submission.problemId] = [];
//                     }
//                     submissionsByProblem[submission.problemId].push(submission);
//                 });

//                 setSubmissions(submissionsByProblem);
//             } catch (error) {
//                 console.error('Error fetching user submissions:', error);
//             }
//         };

//         fetchUserSubmissions();
//     }, [user]);

//     // Extract all unique tags and sort by frequency
//     const tagCounts: Record<string, number> = {};
//     problems.forEach(problem => {
//         problem.tags.forEach(tag => {
//             tagCounts[tag] = (tagCounts[tag] || 0) + 1;
//         });
//     });

//     const allTags = Object.entries(tagCounts)
//         .sort((a, b) => b[1] - a[1])
//         .map(([tag]) => tag);

//     // Filter problems based on search query, difficulty, and tag
//     const filteredProblems = problems.filter(problem => {
//         const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             problem.description.toLowerCase().includes(searchQuery.toLowerCase());
//         const matchesDifficulty = !selectedDifficulty || problem.difficulty === selectedDifficulty;
//         const matchesTag = !selectedTag || problem.tags.includes(selectedTag);
//         return matchesSearch && matchesDifficulty && matchesTag;
//     });

//     // Get stats about user's problem-solving progress
//     const getUserStats = () => {
//         if (!user || Object.keys(submissions).length === 0) return null;

//         const totalProblems = problems.length;
//         const solvedProblems = Object.keys(submissions).filter(problemId => {
//             return submissions[problemId].some(sub => sub.status === 'Accepted');
//         }).length;

//         const solvedByDifficulty = {
//             Easy: 0,
//             Medium: 0,
//             Hard: 0
//         };

//         problems.forEach(problem => {
//             if (submissions[problem._id]?.some(sub => sub.status === 'Accepted')) {
//                 solvedByDifficulty[problem.difficulty]++;
//             }
//         });

//         const totalByDifficulty = {
//             Easy: problems.filter(p => p.difficulty === 'Easy').length,
//             Medium: problems.filter(p => p.difficulty === 'Medium').length,
//             Hard: problems.filter(p => p.difficulty === 'Hard').length
//         };

//         return {
//             solved: solvedProblems,
//             total: totalProblems,
//             percentage: Math.round((solvedProblems / totalProblems) * 100),
//             byDifficulty: {
//                 Easy: { solved: solvedByDifficulty.Easy, total: totalByDifficulty.Easy },
//                 Medium: { solved: solvedByDifficulty.Medium, total: totalByDifficulty.Medium },
//                 Hard: { solved: solvedByDifficulty.Hard, total: totalByDifficulty.Hard }
//             }
//         };
//     };

//     const userStats = getUserStats();

//     // Format date
//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         });
//     };

//     // Get problem status for the current user
//     const getProblemStatus = (problemId: string) => {
//         if (!user || !submissions[problemId]) return 'unsolved';

//         const problemSubmissions = submissions[problemId];
//         if (problemSubmissions.some(sub => sub.status === 'Accepted')) {
//             return 'solved';
//         }

//         return 'attempted';
//     };

//     // Get difficulty color
//     const getDifficultyColor = (difficulty: string) => {
//         switch (difficulty) {
//             case 'Easy':
//                 return 'text-green-500 bg-green-50 dark:bg-green-950';
//             case 'Medium':
//                 return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950';
//             case 'Hard':
//                 return 'text-red-500 bg-red-50 dark:bg-red-950';
//             default:
//                 return '';
//         }
//     };

//     // Loading state
//     if (loading) {
//         return (
//             <div className="container max-w-6xl mx-auto p-4 py-8">
//                 <div className="flex justify-center items-center min-h-[400px]">
//                     <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//                 </div>
//             </div>
//         );
//     }

//     // Error state
//     if (error) {
//         return (
//             <div className="container max-w-6xl mx-auto p-4 py-8">
//                 <div className="bg-red-50 text-red-500 p-4 rounded-md">
//                     <p>{error}</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container max-w-6xl mx-auto p-4 py-8">
//             {/* Hero section */}
//             <div className="text-center mb-10">
//                 <h1 className="text-4xl font-bold mb-4">Coding Problems</h1>
//                 <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//                     Sharpen your coding skills with our diverse collection of algorithmic challenges.
//                 </p>
//             </div>

//             {/* User stats card */}
//             {user && userStats && (
//                 <Card className="mb-8">
//                     <CardContent className="p-6">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//                             <div className="flex flex-col items-center">
//                                 <h3 className="text-sm font-medium text-muted-foreground">Problems Solved</h3>
//                                 <div className="flex items-center">
//                                     <p className="text-2xl font-bold">{userStats.solved}/{userStats.total}</p>
//                                     <span className="text-sm ml-2 text-muted-foreground">({userStats.percentage}%)</span>
//                                 </div>
//                             </div>

//                             <div className="flex flex-col items-center">
//                                 <h3 className="text-sm font-medium text-muted-foreground">Easy</h3>
//                                 <div className="flex items-center">
//                                     <p className="text-2xl font-bold text-green-500">
//                                         {userStats.byDifficulty.Easy.solved}/{userStats.byDifficulty.Easy.total}
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="flex flex-col items-center">
//                                 <h3 className="text-sm font-medium text-muted-foreground">Medium</h3>
//                                 <div className="flex items-center">
//                                     <p className="text-2xl font-bold text-yellow-500">
//                                         {userStats.byDifficulty.Medium.solved}/{userStats.byDifficulty.Medium.total}
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="flex flex-col items-center">
//                                 <h3 className="text-sm font-medium text-muted-foreground">Hard</h3>
//                                 <div className="flex items-center">
//                                     <p className="text-2xl font-bold text-red-500">
//                                         {userStats.byDifficulty.Hard.solved}/{userStats.byDifficulty.Hard.total}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Search and filter section */}
//             <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="relative md:col-span-2">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
//                     <Input
//                         type="text"
//                         placeholder="Search problems..."
//                         className="pl-10"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                 </div>

//                 <div className="flex gap-2">
//                     <Button
//                         variant={selectedDifficulty === null ? "default" : "outline"}
//                         className="flex-1"
//                         onClick={() => setSelectedDifficulty(null)}
//                     >
//                         All
//                     </Button>
//                     <Button
//                         variant={selectedDifficulty === 'Easy' ? "default" : "outline"}
//                         className="flex-1 text-green-500"
//                         onClick={() => setSelectedDifficulty(selectedDifficulty === 'Easy' ? null : 'Easy')}
//                     >
//                         Easy
//                     </Button>
//                     <Button
//                         variant={selectedDifficulty === 'Medium' ? "default" : "outline"}
//                         className="flex-1 text-yellow-500"
//                         onClick={() => setSelectedDifficulty(selectedDifficulty === 'Medium' ? null : 'Medium')}
//                     >
//                         Medium
//                     </Button>
//                     <Button
//                         variant={selectedDifficulty === 'Hard' ? "default" : "outline"}
//                         className="flex-1 text-red-500"
//                         onClick={() => setSelectedDifficulty(selectedDifficulty === 'Hard' ? null : 'Hard')}
//                     >
//                         Hard
//                     </Button>
//                 </div>
//             </div>

//             {/* Tags selection */}
//             <div className="mb-8">
//                 <h3 className="text-sm font-medium mb-2">Popular Tags:</h3>
//                 <div className="flex flex-wrap gap-2">
//                     {allTags.slice(0, 10).map(tag => (
//                         <Badge
//                             key={tag}
//                             variant={selectedTag === tag ? "default" : "outline"}
//                             className="px-3 py-1.5 cursor-pointer"
//                             onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
//                         >
//                             <Tag size={12} className="mr-1.5" />
//                             {tag}
//                         </Badge>
//                     ))}
//                 </div>
//             </div>

//             {/* Problems list */}
//             {filteredProblems.length === 0 ? (
//                 <div className="text-center py-8 text-muted-foreground">
//                     No problems found matching your search criteria.
//                 </div>
//             ) : (
//                 <div className="space-y-4">
//                     <div className="grid grid-cols-12 gap-4 px-4 py-2 font-medium text-sm border-b">
//                         <div className="col-span-1 text-center">#</div>
//                         <div className="col-span-5">Title</div>
//                         <div className="col-span-2">Difficulty</div>
//                         <div className="col-span-2 hidden md:block">Tags</div>
//                         <div className="col-span-2 hidden md:block">Status</div>
//                     </div>

//                     {filteredProblems.map((problem, index) => {
//                         const status = getProblemStatus(problem._id);
//                         return (
//                             <Link href={`/problems/${problem._id}`} key={problem._id}>
//                                 <div className="grid grid-cols-12 gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors items-center">
//                                     <div className="col-span-1 text-center text-muted-foreground">{index + 1}</div>

//                                     <div className="col-span-5">
//                                         <h3 className="font-medium">{problem.title}</h3>
//                                     </div>

//                                     <div className="col-span-2">
//                                         <Badge variant="outline" className={`${getDifficultyColor(problem.difficulty)}`}>
//                                             {problem.difficulty}
//                                         </Badge>
//                                     </div>

//                                     <div className="col-span-2 hidden md:block">
//                                         <div className="flex flex-wrap gap-1">
//                                             {problem.tags.slice(0, 2).map(tag => (
//                                                 <Badge key={tag} variant="outline" className="text-xs px-1">
//                                                     {tag}
//                                                 </Badge>
//                                             ))}
//                                             {problem.tags.length > 2 && (
//                                                 <Badge variant="outline" className="text-xs px-1">
//                                                     +{problem.tags.length - 2}
//                                                 </Badge>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="col-span-2 hidden md:block">
//                                         {status === 'solved' && (
//                                             <div className="flex items-center text-green-500">
//                                                 <CheckCircle size={14} className="mr-1" />
//                                                 Solved
//                                             </div>
//                                         )}
//                                         {status === 'attempted' && (
//                                             <div className="flex items-center text-yellow-500">
//                                                 <Clock size={14} className="mr-1" />
//                                                 Attempted
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </Link>
//                         );
//                     })}
//                 </div>
//             )}

//             {/* Admin button */}
//             {user?.role === 'admin' && (
//                 <div className="flex justify-center mt-8">
//                     <Link href="/admin">
//                         <Button>
//                             Manage Coding Problems
//                         </Button>
//                     </Link>
//                 </div>
//             )}
//         </div>
//     );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/contexts/AuthContext';
// import apiClient from '@/lib/api';
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
//     CardDescription,
//     CardFooter,
// } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Code, Filter, Search, CheckCircle, AlertCircle, Clock, Tag, Trophy, Target, BookOpen } from 'lucide-react';

// interface CodingProblem {
//     _id: string;
//     title: string;
//     description: string;
//     difficulty: 'Easy' | 'Medium' | 'Hard';
//     tags: string[];
//     constraints: string;
//     examples: {
//         input: string;
//         output: string;
//         explanation?: string;
//     }[];
//     createdAt: string;
// }

// interface Submission {
//     _id: string;
//     problemId: string;
//     status: string;
//     language: string;
//     createdAt: string;
// }

// export default function ProblemsPage() {
//     const { user } = useAuth();
//     const [problems, setProblems] = useState<CodingProblem[]>([]);
//     const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({});
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
//     const [selectedTag, setSelectedTag] = useState<string | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // Fetch problems
//     useEffect(() => {
//         async function fetchProblems() {
//             try {
//                 const { data } = await apiClient.getAllProblems();
//                 setProblems(data.data || []);
//             } catch (err: any) {
//                 setError(err.response?.data?.error || 'Failed to fetch coding problems');
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchProblems();
//     }, []);

//     // Fetch submissions
//     useEffect(() => {
//         if (!user) return;

//         async function fetchSubmissions() {
//             try {
//                 const { data } = await apiClient.getUserSubmissions();
//                 const arr = Array.isArray(data) ? data : data.data || data.submissions || [];
//                 const grouped: Record<string, Submission[]> = {};
//                 arr.forEach((sub: Submission) => {
//                     const pid = sub.problemId || sub.problem || sub._id;
//                     if (!grouped[pid]) grouped[pid] = [];
//                     grouped[pid].push(sub);
//                 });
//                 setSubmissions(grouped);
//             } catch (err) {
//                 console.error(err);
//             }
//         }
//         fetchSubmissions();
//     }, [user]);

//     // Tag frequency
//     const tagCounts: Record<string, number> = {};
//     problems.forEach(p => p.tags.forEach(t => (tagCounts[t] = (tagCounts[t] || 0) + 1)));
//     const allTags = Object.entries(tagCounts)
//         .sort((a, b) => b[1] - a[1])
//         .map(([t]) => t);

//     // Filters
//     const filteredProblems = problems.filter(p => {
//         const matchesSearch =
//             p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             p.description.toLowerCase().includes(searchQuery.toLowerCase());
//         const matchesDiff = !selectedDifficulty || p.difficulty === selectedDifficulty;
//         const matchesTag = !selectedTag || p.tags.includes(selectedTag);
//         return matchesSearch && matchesDiff && matchesTag;
//     });

//     // User stats
//     const getUserStats = () => {
//         if (!user) return null;
//         const total = problems.length;
//         const solvedIds = Object.keys(submissions).filter(pid =>
//             submissions[pid].some(s => ['accepted', 'ac', 'correct'].includes(s.status.toLowerCase()))
//         );
//         const solved = solvedIds.length;
//         const byDiff = { Easy: 0, Medium: 0, Hard: 0 };
//         problems.forEach(p => {
//             if (solvedIds.includes(p._id)) byDiff[p.difficulty]++;
//         });
//         return {
//             solved,
//             total,
//             percentage: total ? Math.round((solved / total) * 100) : 0,
//             byDifficulty: {
//                 Easy: { solved: byDiff.Easy, total: problems.filter(p => p.difficulty === 'Easy').length },
//                 Medium: { solved: byDiff.Medium, total: problems.filter(p => p.difficulty === 'Medium').length },
//                 Hard: { solved: byDiff.Hard, total: problems.filter(p => p.difficulty === 'Hard').length },
//             },
//         };
//     };

//     const userStats = getUserStats();

//     const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', {
//         year: 'numeric', month: 'short', day: 'numeric'
//     });

//     const getProblemStatus = (pid: string) => {
//         if (!user || !submissions[pid]) return 'unsolved';
//         const subs = submissions[pid];
//         if (subs.some(s => ['accepted', 'ac', 'correct'].includes(s.status.toLowerCase()))) return 'solved';
//         return subs.length ? 'attempted' : 'unsolved';
//     };

//     const diffStyles = {
//         Easy: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
//         Medium: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
//         Hard: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
//     };
//     const statusStyles = {
//         solved: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Solved' },
//         attempted: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Attempted' },
//         unsolved: { icon: BookOpen, color: 'text-gray-500', bg: 'bg-gray-50', label: 'Unsolved' },
//     };

//     if (loading) return (
//         <div className="min-h-screen flex items-center justify-center">
//             <div className="animate-spin">
//                 <Code size={48} />
//             </div>
//         </div>
//     );
//     if (error) return (
//         <div className="min-h-screen flex items-center justify-center">
//             <Card className="max-w-md">
//                 <CardContent>
//                     <AlertCircle size={48} className="mx-auto text-red-500" />
//                     <h3 className="text-center text-lg font-semibold">Error</h3>
//                     <p className="text-center">{error}</p>
//                 </CardContent>
//             </Card>
//         </div>
//     );

//     return (
//         <div className="container mx-auto p-6">
//             <header className="text-center mb-12">
//                 <h1 className="text-4xl font-bold">Coding Challenges</h1>
//                 <p className="mt-2 text-gray-600">Master algorithms & data structures with curated problems.</p>
//             </header>

//             {user && userStats && (
//                 <Card className="mb-8">
//                     <CardHeader>
//                         <div className="flex items-center gap-3">
//                             <Trophy />
//                             <div>
//                                 <CardTitle>Your Progress</CardTitle>
//                                 <CardDescription>Track your coding journey</CardDescription>
//                             </div>
//                         </div>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                             <div>
//                                 <h3>Total Solved</h3>
//                                 <p className="text-2xl font-bold">{userStats.solved}/{userStats.total} ({userStats.percentage}%)</p>
//                             </div>
//                             {(['Easy', 'Medium', 'Hard'] as const).map(level => (
//                                 <div key={level}>
//                                     <h4>{level}</h4>
//                                     <p>{userStats.byDifficulty[level].solved}/{userStats.byDifficulty[level].total}]</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}

//             <Card className="mb-8">
//                 <CardContent>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="col-span-2 relative">
//                             <Search className="absolute left-3 top-3 text-gray-400" />
//                             <Input
//                                 placeholder="Search problems..."
//                                 className="pl-10"
//                                 value={searchQuery}
//                                 onChange={e => setSearchQuery(e.target.value)}
//                             />
//                         </div>
//                         <div className="flex gap-2">
//                             <Button variant={!selectedDifficulty ? 'default' : 'outline'} onClick={() => setSelectedDifficulty(null)}>All</Button>
//                             {(['Easy', 'Medium', 'Hard'] as const).map(level => (
//                                 <Button
//                                     key={level}
//                                     variant={selectedDifficulty === level ? 'default' : 'outline'}
//                                     onClick={() => setSelectedDifficulty(selectedDifficulty === level ? null : level)}
//                                 >{level}</Button>
//                             ))}
//                         </div>
//                     </div>

//                     {allTags.length > 0 && (
//                         <div className="mt-4">
//                             <Tag /> <span>Popular Tags:</span>
//                             <div className="flex flex-wrap gap-2 mt-2">
//                                 {allTags.slice(0, 12).map(tag => (
//                                     <Badge
//                                         key={tag}
//                                         variant={selectedTag === tag ? 'default' : 'outline'}
//                                         onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
//                                         className="cursor-pointer"
//                                     >{tag} <span>({tagCounts[tag]})</span></Badge>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>

//             {filteredProblems.length === 0 ? (
//                 <Card>
//                     <CardContent className="text-center py-12">
//                         <Search size={48} className="mx-auto text-gray-400" />
//                         <h3 className="mt-4 text-xl">No Problems Found</h3>
//                         <p className="mt-2 text-gray-500">Adjust your filters or search to view problems.</p>
//                     </CardContent>
//                 </Card>
//             ) : (
//                 <Card>
//                     <CardContent className="p-0">
//                         <div className="grid grid-cols-12 bg-gray-100 p-4 font-semibold text-gray-700">
//                             <div className="col-span-1 text-center">#</div>
//                             <div className="col-span-4">Problem</div>
//                             <div className="col-span-2">Difficulty</div>
//                             <div className="col-span-3 hidden md:block">Tags</div>
//                             <div className="col-span-2">Status</div>
//                         </div>
//                         <div className="divide-y">
//                             {filteredProblems.map((p, i) => {
//                                 const statusKey = getProblemStatus(p._id) as 'solved' | 'attempted' | 'unsolved';
//                                 const stat = statusStyles[statusKey];
//                                 const diff = diffStyles[p.difficulty];
//                                 const Icon = stat.icon;
//                                 return (
//                                     <Link href={`/problems/${p._id}`} key={p._id}>
//                                         <div className="grid grid-cols-12 items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer">
//                                             <div className="col-span-1 text-center text-gray-500">{i + 1}</div>
//                                             <div className="col-span-4">
//                                                 <h3 className="font-semibold text-gray-900 hover:text-blue-600">{p.title}</h3>
//                                                 <p className="text-sm text-gray-500 mt-1">
//                                                     {p.description.length > 100 ? `${p.description.slice(0, 100)}...` : p.description}
//                                                 </p>
//                                             </div>
//                                             <div className="col-span-2 flex justify-center">
//                                                 <span className={`px-2 py-1 text-xs rounded ${diff.bg} ${diff.color} ${diff.border}`}>{p.difficulty}</span>
//                                             </div>
//                                             <div className="col-span-3 hidden md:flex flex-wrap gap-2">
//                                                 {p.tags.map(t => (
//                                                     <Badge key={t} variant="outline" className="px-2 py-1 text-xs">{t}</Badge>
//                                                 ))}
//                                             </div>
//                                             <div className="col-span-2 flex justify-center">
//                                                 <span className={`inline-flex items-center gap-1 px-2 py-1 text-sm rounded ${stat.bg} ${stat.color}`}>
//                                                     <Icon className="w-4 h-4" /> {stat.label}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </Link>
//                                 );
//                             })}
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}
//         </div>
//     );
// }








// 'use client';
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/contexts/AuthContext';
// import apiClient from '@/lib/api';
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
//     CardDescription,
//     CardFooter,
// } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Code, Filter, Search, CheckCircle, AlertCircle, Clock, Tag, Trophy, Target, BookOpen } from 'lucide-react';

// interface CodingProblem {
//     _id: string;
//     title: string;
//     description: string;
//     difficulty: 'Easy' | 'Medium' | 'Hard';
//     tags: string[];
//     constraints: string;
//     examples: {
//         input: string;
//         output: string;
//         explanation?: string;
//     }[];
//     createdAt: string;
// }

// interface Submission {
//     _id: string;
//     problemId: string;
//     status: 'Pending' | 'Accepted' | 'Rejected' | 'Solved';
//     language: string;
//     createdAt: string;
//     code: string;

// }

// export default function ProblemsPage() {
//     const { user } = useAuth();
//     const [problems, setProblems] = useState<CodingProblem[]>([]);
//     const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({});
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
//     const [selectedTag, setSelectedTag] = useState<string | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // Fetch problems
//     useEffect(() => {
//         async function fetchProblems() {
//             try {
//                 const { data } = await apiClient.getAllProblems();
//                 setProblems(data.data || []);
//             } catch (err: any) {
//                 setError(err.response?.data?.error || 'Failed to fetch coding problems');
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchProblems();
//     }, []);

//     // Fetch submissions
//     useEffect(() => {
//         if (!user) return;
//         async function fetchSubmissions() {
//             try {
//                 const { data } = await apiClient.getUserSubmissions();
//                 const arr = Array.isArray(data) ? data : data.data || data.submissions || [];
//                 const grouped: Record<string, Submission[]> = {};
//                 arr.forEach((sub: Submission) => {
//                     const pid = sub.problemId || sub._id;
//                     if (!grouped[pid]) grouped[pid] = [];
//                     grouped[pid].push(sub);
//                 });
//                 setSubmissions(grouped);
//             } catch (err) {
//                 console.error(err);
//             }
//         }
//         fetchSubmissions();
//     }, [user]);

//     // Tag frequency
//     const tagCounts: Record<string, number> = {};
//     problems.forEach(p => p.tags.forEach(t => (tagCounts[t] = (tagCounts[t] || 0) + 1)));
//     const allTags = Object.entries(tagCounts)
//         .sort((a, b) => b[1] - a[1])
//         .map(([t]) => t);

//     // Filters
//     const filteredProblems = problems.filter(p => {
//         const matchesSearch =
//             p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             p.description.toLowerCase().includes(searchQuery.toLowerCase());
//         const matchesDiff = !selectedDifficulty || p.difficulty === selectedDifficulty;
//         const matchesTag = !selectedTag || p.tags.includes(selectedTag);
//         return matchesSearch && matchesDiff && matchesTag;
//     });

//     const getUserStats = () => {
//         if (!user) return null;

//         const total = problems.length;
//         const solvedIds = Object.keys(submissions).filter(pid =>
//             submissions[pid].some(s =>
//                 ['accepted', 'ac', 'correct'].includes(s.status.toLowerCase())
//             )
//         );

//         const solved = solvedIds.length;

//         const byDiff = { Easy: 0, Medium: 0, Hard: 0 };
//         problems.forEach(p => {
//             if (solvedIds.includes(p._id)) byDiff[p.difficulty]++;
//         });

//         return {
//             solvedIds, // 👈 Make sure this is exposed
//             solved,
//             total,
//             percentage: total ? Math.round((solved / total) * 100) : 0,
//             byDifficulty: {
//                 Easy: { solved: byDiff.Easy, total: problems.filter(p => p.difficulty === 'Easy').length },
//                 Medium: { solved: byDiff.Medium, total: problems.filter(p => p.difficulty === 'Medium').length },
//                 Hard: { solved: byDiff.Hard, total: problems.filter(p => p.difficulty === 'Hard').length },
//             },
//         };
//     };

//     const userStats = getUserStats();

//     const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', {
//         year: 'numeric', month: 'short', day: 'numeric'
//     });

//     const getProblemStatus = (pid: string) => {
//         if (!user || !userStats) return 'unsolved';

//         // Use the precomputed solvedIds from userStats
//         if (userStats.solvedIds.includes(pid)) return 'solved';

//         // Check if there are any submissions at all for this problem
//         const subs = submissions[pid] || [];
//         if (subs.length > 0) {
//             const hasSuccessfulSubmission = subs.some(s =>
//                 ['accepted', 'ac', 'correct'].includes(s.status.toLowerCase())
//             );
//             return hasSuccessfulSubmission ? 'solved' : 'attempted';
//         }
//         return 'unsolved';
//     };

//     const diffStyles = {
//         Easy: {
//             color: 'text-emerald-400',
//             bg: 'bg-emerald-900/30',
//             border: 'border-emerald-800/50',
//             badge: 'bg-emerald-900/30 border-emerald-800/50 text-emerald-400'
//         },
//         Medium: {
//             color: 'text-yellow-400',
//             bg: 'bg-yellow-900/30',
//             border: 'border-yellow-800/50',
//             badge: 'bg-yellow-900/30 border-yellow-800/50 text-yellow-400'
//         },
//         Hard: {
//             color: 'text-red-400',
//             bg: 'bg-red-900/30',
//             border: 'border-red-800/50',
//             badge: 'bg-red-900/30 border-red-800/50 text-red-400'
//         },
//     };

//     const statusStyles = {
//         solved: {
//             icon: CheckCircle,
//             color: 'text-emerald-400',
//             bg: 'bg-emerald-900/30',
//             label: 'Solved'
//         },
//         attempted: {
//             icon: Clock,
//             color: 'text-yellow-400',
//             bg: 'bg-yellow-900/30',
//             label: 'Attempted'
//         },
//         unsolved: {
//             icon: BookOpen,
//             color: 'text-zinc-400',
//             bg: 'bg-zinc-900/50',
//             label: 'Unsolved'
//         },
//     };

//     if (loading) return (
//         <div className="min-h-screen flex items-center justify-center bg-zinc-950">
//             <div className="animate-spin">
//                 <div className="w-16 h-16 border-t-4 border-b-4 border-orange-500 rounded-full"></div>
//             </div>
//         </div>
//     );

//     if (error) return (
//         <div className="min-h-screen flex items-center justify-center bg-zinc-950">
//             <Card className="max-w-md bg-zinc-900/70 border-zinc-800">
//                 <CardContent className="p-8 text-center">
//                     <AlertCircle size={48} className="mx-auto text-red-500" />
//                     <h3 className="text-lg font-semibold text-white mt-4">Error</h3>
//                     <p className="text-zinc-400 mt-2">{error}</p>
//                 </CardContent>
//             </Card>
//         </div>
//     );

//     return (
//         <div className="bg-zinc-950 w-full ">


//             <div className="container mx-auto p-4 md:p-6 bg-zinc-950 min-h-screen">
//                 <header className="text-center mb-8">
//                     <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Coding Challenges</h1>
//                     <p className="text-zinc-400 max-w-2xl mx-auto">
//                         Master algorithms & data structures with curated problems.
//                     </p>
//                 </header>

//                 {user && userStats && (
//                     <Card className="mb-8 bg-zinc-900/70 border-zinc-800">
//                         <CardHeader>
//                             <div className="flex items-center gap-3">
//                                 <Trophy className="text-orange-500" />
//                                 <div>
//                                     <CardTitle className="text-white">Your Progress</CardTitle>
//                                     <CardDescription className="text-zinc-400">Track your coding journey</CardDescription>
//                                 </div>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                                 <div className="bg-zinc-800/50 p-4 rounded-lg">
//                                     <h3 className="text-zinc-400 text-sm">Total Solved</h3>
//                                     <p className="text-2xl font-bold text-white">{userStats.solved}/{userStats.total}</p>
//                                     <p className="text-zinc-500 text-sm">{userStats.percentage}% completed</p>
//                                 </div>
//                                 {(['Easy', 'Medium', 'Hard'] as const).map(level => (
//                                     <div key={level} className="bg-zinc-800/50 p-4 rounded-lg">
//                                         <h4 className="text-zinc-400 text-sm">{level}</h4>
//                                         <p className="text-white font-medium">
//                                             {userStats.byDifficulty[level].solved}/{userStats.byDifficulty[level].total}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </CardContent>
//                     </Card>
//                 )}

//                 <Card className="mb-8 bg-zinc-900/70 border-zinc-800">
//                     <CardContent className="p-4 md:p-6">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             <div className="col-span-2 relative">
//                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
//                                 <Input
//                                     placeholder="Search problems..."
//                                     className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
//                                     value={searchQuery}
//                                     onChange={e => setSearchQuery(e.target.value)}
//                                 />
//                             </div>
//                             <div className="flex flex-wrap gap-2">
//                                 <Button
//                                     variant={!selectedDifficulty ? 'default' : 'outline'}
//                                     className={!selectedDifficulty ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}
//                                     onClick={() => setSelectedDifficulty(null)}
//                                 >
//                                     All
//                                 </Button>
//                                 {(['Easy', 'Medium', 'Hard'] as const).map(level => (
//                                     <Button
//                                         key={level}
//                                         variant={selectedDifficulty === level ? 'default' : 'outline'}
//                                         className={selectedDifficulty === level ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}
//                                         onClick={() => setSelectedDifficulty(selectedDifficulty === level ? null : level)}
//                                     >
//                                         {level}
//                                     </Button>
//                                 ))}
//                             </div>
//                         </div>

//                         {allTags.length > 0 && (
//                             <div className="mt-6">
//                                 <div className="flex items-center gap-2 mb-3">
//                                     <Tag className="text-zinc-400" />
//                                     <span className="text-zinc-400 font-medium">Popular Tags:</span>
//                                 </div>
//                                 <div className="flex flex-wrap gap-2">
//                                     {allTags.slice(0, 12).map(tag => (
//                                         <Badge
//                                             key={tag}
//                                             variant={selectedTag === tag ? 'default' : 'outline'}
//                                             onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
//                                             className={`cursor-pointer transition-colors ${selectedTag === tag
//                                                 ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30'
//                                                 : 'bg-zinc-800/50 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
//                                                 }`}
//                                         >
//                                             {tag} <span className="ml-1 text-zinc-500">({tagCounts[tag]})</span>
//                                         </Badge>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>

//                 {filteredProblems.length === 0 ? (
//                     <Card className="bg-zinc-900/70 border-zinc-800">
//                         <CardContent className="text-center py-12 px-4">
//                             <Search size={48} className="mx-auto text-zinc-600" />
//                             <h3 className="mt-4 text-xl font-medium text-white">No Problems Found</h3>
//                             <p className="mt-2 text-zinc-400">Adjust your filters or search to view problems.</p>
//                         </CardContent>
//                     </Card>
//                 ) : (
//                     <Card className="bg-zinc-900/70 border-zinc-800">
//                         <CardContent className="p-0">
//                             {/* Mobile Header */}
//                             <div className="grid grid-cols-2 gap-4 p-4 font-semibold text-zinc-300 border-b border-zinc-800 md:hidden">
//                                 <div className="col-span-1">Problem</div>
//                                 <div className="col-span-1">Status</div>
//                             </div>

//                             {/* Desktop Header */}
//                             <div className="hidden md:grid grid-cols-12 gap-4 p-4 font-semibold text-zinc-300 border-b border-zinc-800">
//                                 <div className="col-span-1">#</div>
//                                 <div className="col-span-4">Problem</div>
//                                 <div className="col-span-2">Difficulty</div>
//                                 <div className="col-span-3">Tags</div>
//                                 <div className="col-span-2">Status</div>
//                             </div>

//                             <div className="divide-y divide-zinc-800">
//                                 {filteredProblems.map((p, i) => {
//                                     const statusKey = getProblemStatus(p._id) as 'solved' | 'attempted' | 'unsolved';
//                                     const stat = statusStyles[statusKey];
//                                     const diff = diffStyles[p.difficulty];
//                                     const Icon = stat.icon;

//                                     return (
//                                         <Link href={`/problems/${p._id}`} key={p._id} className="block hover:bg-zinc-900/50 transition-colors">
//                                             <div className="grid grid-cols-2 md:grid-cols-12 items-center gap-4 p-4">
//                                                 {/* Mobile View */}
//                                                 <div className="col-span-2 md:hidden">
//                                                     <h3 className="font-semibold text-white hover:text-orange-400 truncate">{p.title}</h3>
//                                                     <div className="flex items-center justify-between mt-2">
//                                                         <span className={`text-xs rounded px-2 py-1 ${diff.badge}`}>
//                                                             {p.difficulty}
//                                                         </span>
//                                                         <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded ${stat.bg} ${stat.color}`}>
//                                                             <Icon className="w-3 h-3" /> {stat.label}
//                                                         </span>
//                                                     </div>
//                                                 </div>

//                                                 {/* Desktop View */}
//                                                 <div className="col-span-1 hidden md:flex justify-center text-zinc-400">{i + 1}</div>
//                                                 <div className="col-span-4">
//                                                     <h3 className="font-semibold text-white hover:text-orange-400 truncate">{p.title}</h3>
//                                                     <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
//                                                         {p.description.length > 100 ? `${p.description.slice(0, 100)}...` : p.description}
//                                                     </p>
//                                                 </div>
//                                                 <div className="col-span-2 hidden md:flex justify-center">
//                                                     <span className={`px-2 py-1 text-xs rounded ${diff.badge}`}>
//                                                         {p.difficulty}
//                                                     </span>
//                                                 </div>
//                                                 <div className="col-span-3 hidden md:flex flex-wrap gap-1">
//                                                     {p.tags.map(t => (
//                                                         <Badge
//                                                             key={t}
//                                                             variant="outline"
//                                                             className="px-2 py-0.5 text-xs bg-zinc-800/50 text-zinc-300 border-zinc-700 hover:bg-zinc-800"
//                                                         >
//                                                             {t}
//                                                         </Badge>
//                                                     ))}
//                                                 </div>
//                                                 <div className="col-span-2 hidden md:flex justify-center">
//                                                     <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded ${stat.bg} ${stat.color}`}>
//                                                         <Icon className="w-3 h-3" /> {stat.label}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         </Link>
//                                     );
//                                 })}
//                             </div>
//                         </CardContent>
//                     </Card>
//                 )}
//             </div>
//         </div >
//     );
// }

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
import { Code, Filter, Search, CheckCircle, AlertCircle, Clock, Tag, Trophy, Target, BookOpen } from 'lucide-react';

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

export default function ProblemsPage() {
    const { user } = useAuth();
    const [problems, setProblems] = useState<CodingProblem[]>([]);
    const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({});
    const [problemStatus, setProblemStatus] = useState<Record<string, 'solved' | 'attempted'>>({}); // New state for problem statuses
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch problems
    useEffect(() => {
        async function fetchProblems() {
            try {
                const { data } = await apiClient.getAllProblems();
                setProblems(data.data || []);
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

    const getUserStats = () => {
        if (!user || problems.length === 0) return null;

        const total = problems.length;

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
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Coding Challenges</h1>
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

                {filteredProblems.length === 0 ? (
                    <Card className="bg-zinc-900/70 border-zinc-800">
                        <CardContent className="text-center py-12 px-4">
                            <Search size={48} className="mx-auto text-zinc-600" />
                            <h3 className="mt-4 text-xl font-medium text-white">No Problems Found</h3>
                            <p className="mt-2 text-zinc-400">Adjust your filters or search to view problems.</p>
                        </CardContent>
                    </Card>
                ) : (
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
                                {filteredProblems.map((p, i) => {
                                    const statusKey = getProblemStatus(p._id);
                                    const stat = statusStyles[statusKey];
                                    const diff = diffStyles[p.difficulty];
                                    const Icon = stat.icon;

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
                                                <div className="col-span-1 hidden md:flex justify-center text-zinc-400">{i + 1}</div>
                                                <div className="col-span-4">
                                                    <h3 className="font-semibold text-white hover:text-orange-400 truncate">{p.title}</h3>
                                                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                                                        {p.description.length > 100 ? `${p.description.slice(0, 100)}...` : p.description}
                                                    </p>
                                                </div>
                                                <div className="col-span-2 hidden md:flex justify-center">
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
                                                <div className="col-span-2 hidden md:flex justify-center">
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
                )}
            </div>
        </div>
    );
}