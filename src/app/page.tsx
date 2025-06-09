'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Code, BookOpen, GraduationCap, LayoutDashboard, BarChart2, FilePen, User, CheckCircle } from 'lucide-react';

interface Sheet {
  _id: string;
  title: string;
  description: string;
  totalProblems: number;
}

interface SheetProgress {
  sheetId: string;
  completedProblemIds: string[];
}

interface Blog {
  _id: string;
  title: string;
  summary: string;
  coverImage: string;
  createdAt: string;
  views: number;
  readTime: number;
}

interface CodingProblem {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export default function HomePage() {
  const { user } = useAuth();
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [progress, setProgress] = useState<Record<string, SheetProgress>>({});
  const [userCount, setUserCount] = useState<number>(456);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sheets, blogs, and problems on component mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);

        // Fetch sheets
        const sheetsResponse = await apiClient.getAllSheets();
        setSheets(sheetsResponse.data || []);

        // Fetch blogs if API exists, otherwise initialize empty
        try {
          const blogsResponse = await apiClient.getAllBlogs();
          setBlogs(blogsResponse.data.data || []);
        } catch (error) {
          console.log('Blogs API might not be available yet');
          setBlogs([]);
        }

        // Fetch problems if API exists, otherwise initialize empty
        try {
          const problemsResponse = await apiClient.getAllProblems();
          setProblems(problemsResponse.data.data || []);
        } catch (error) {
          console.log('Problems API might not be available yet');
          setProblems([]);
        }

        // Initialize guest progress from localStorage if not logged in
        if (!user) {
          const guestProgress: Record<string, SheetProgress> = {};

          sheetsResponse.data.forEach((sheet: Sheet) => {
            const localProgress = localStorage.getItem(`progress:${sheet._id}`);
            guestProgress[sheet._id] = {
              sheetId: sheet._id,
              completedProblemIds: localProgress ? JSON.parse(localProgress) : []
            };
          });

          setProgress(guestProgress);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-black min-h-screen text-white">
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="w-full bg-black min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-zinc-900 to-black pt-16 pb-24 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-10 h-10 bg-orange-500/20 rounded-full"></div>
          <div className="absolute bottom-40 right-20 w-20 h-20 bg-blue-500/10 rounded-full"></div>
          <div className="absolute top-60 right-40 w-5 h-5 bg-green-500/20 rounded-full"></div>
          <div className="absolute bottom-10 left-1/3 w-8 h-8 bg-yellow-500/10 rounded-full"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Advance Your Career with <span className="text-orange-500">VibeArmor</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
              Master DSA with curated resources and expert guidance. Learn the skills that set you apart and join the top coders!
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/sheets">Explore Sheets</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/blogs">Read Blogs</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 p-6 bg-zinc-900/80 rounded-xl border border-zinc-800">
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-500">{userCount}+</h2>
              <span className="ml-2 text-xl font-semibold">Learners</span>
            </div>
            <p className="text-zinc-400 text-sm">have improved their coding skills through our platform</p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center bg-zinc-800/50 rounded-lg p-4">
                <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <span className="text-sm text-center">DSA Sheets</span>
              </div>

              <div className="flex flex-col items-center bg-zinc-800/50 rounded-lg p-4">
                <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                  <FilePen className="h-6 w-6 text-green-400" />
                </div>
                <span className="text-sm text-center">Tech Blogs</span>
              </div>

              <div className="flex flex-col items-center bg-zinc-800/50 rounded-lg p-4">
                <div className="w-12 h-12 bg-orange-900/30 rounded-full flex items-center justify-center mb-3">
                  <Code className="h-6 w-6 text-orange-400" />
                </div>
                <span className="text-sm text-center">Coding Problems</span>
              </div>

              <div className="flex flex-col items-center bg-zinc-800/50 rounded-lg p-4">
                <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
                  <GraduationCap className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-sm text-center">Learning Paths</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 px-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Resources to Learn</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/sheets" className="block group">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-full group-hover:border-orange-500/50 transition-colors">
                <div className="h-2 bg-orange-500"></div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors">DSA Sheets</h3>
                  <p className="text-zinc-400 text-sm">Master data structures & algorithms with our comprehensive sheets</p>

                  <div className="mt-6 flex items-center text-orange-500 text-sm font-medium">
                    <span>Explore Sheets</span>
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/blogs" className="block group">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-full group-hover:border-blue-500/50 transition-colors">
                <div className="h-2 bg-blue-500"></div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                    <FilePen className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">Tech Blogs</h3>
                  <p className="text-zinc-400 text-sm">Stay updated with the latest technologies and coding concepts</p>

                  <div className="mt-6 flex items-center text-blue-500 text-sm font-medium">
                    <span>Read Blogs</span>
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/problems" className="block group">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-full group-hover:border-green-500/50 transition-colors">
                <div className="h-2 bg-green-500"></div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-green-500 transition-colors">Coding Problems</h3>
                  <p className="text-zinc-400 text-sm">Sharpen your problem-solving skills with our coding challenges</p>

                  <div className="mt-6 flex items-center text-green-500 text-sm font-medium">
                    <span>Solve Problems</span>
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Content Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Latest Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Top DSA Sheets */}
            <div>
              <div className="flex items-center mb-6">
                <BookOpen className="h-5 w-5 text-orange-500 mr-2" />
                <h3 className="text-xl font-bold">Popular Sheets</h3>
              </div>

              <div className="space-y-4">
                {sheets.slice(0, 3).map(sheet => (
                  <Link key={sheet._id} href={`/sheets/${sheet._id}`}>
                    <Card className="bg-zinc-900/60 my-2 mx-2 border-zinc-800 hover:border-orange-500/50 transition-all">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2 text-zinc-400">{sheet.title}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-400">{sheet.totalProblems} problems</span>
                          <div className="flex items-center">
                            <div className="w-16 h-1.5 bg-zinc-800 rounded-full mr-2">
                              <div
                                className="h-1.5 bg-orange-500 rounded-full"
                                style={{ width: `${getCompletionPercentage(sheet._id, sheet.totalProblems)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-zinc-400">{getCompletionPercentage(sheet._id, sheet.totalProblems)}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/sheets" className='text-zinc-800'>View All Sheets</Link>
                </Button>
              </div>
            </div>

            {/* Latest Blogs */}
            <div>
              <div className="flex items-center mb-6">
                <FilePen className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-xl font-bold">Latest Blogs</h3>
              </div>

              <div className="space-y-4">
                {blogs.length > 0 ? (
                  blogs.slice(0, 3).map(blog => (
                    <Link key={blog._id} href={`/blogs/${blog._id}`}>
                      <Card className="bg-zinc-900/60 my-2 mx-2 border-zinc-800 hover:border-blue-500/50 transition-all">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2 line-clamp-1 text-zinc-400">{blog.title}</h4>
                          <p className="text-xs text-zinc-400 line-clamp-2 mb-2">{blog.summary}</p>
                          <div className="flex items-center justify-between text-xs text-zinc-500">
                            <span>{formatDate(blog.createdAt)}</span>
                            <span>{blog.readTime} min read</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <Card className="bg-zinc-900/60 border-zinc-800">
                    <CardContent className="p-4 text-center text-zinc-400">
                      <p>Blogs coming soon!</p>
                    </CardContent>
                  </Card>
                )}

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/blogs" className='text-zinc-800'>View All Blogs</Link>
                </Button>
              </div>
            </div>

            {/* Coding Problems */}
            <div>
              <div className="flex items-center mb-6">
                <Code className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-xl font-bold">Coding Problems</h3>
              </div>

              <div className="space-y-4">
                {problems.length > 0 ? (
                  problems.slice(0, 3).map(problem => (
                    <Link key={problem._id} href={`/problems/${problem._id}`}>
                      <Card className="bg-zinc-900/60 my-2 mx-2 border-zinc-800 hover:border-green-500/50 transition-all">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2 text-zinc-400">{problem.title}</h4>
                          <div className="flex justify-between items-center">
                            <Badge
                              variant="outline"
                              className={`
                                ${problem.difficulty === 'Easy' ? 'text-green-500 border-green-500/30' :
                                  problem.difficulty === 'Medium' ? 'text-yellow-500 border-yellow-500/30' :
                                    'text-red-500 border-red-500/30'}
                              `}
                            >
                              {problem.difficulty}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <Card className="bg-zinc-900/60 border-zinc-800">
                    <CardContent className="p-4 text-center text-zinc-400">
                      <p>Coding problems coming soon!</p>
                    </CardContent>
                  </Card>
                )}

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/problems" className='text-zinc-800'>Explore All Problems</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="py-16 px-4 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Ever-Growing Global Community</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-8">
            Connect with fellow coders, share your knowledge, and accelerate your learning journey with our supportive community.
          </p>

          {user ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <User className="h-10 w-10 text-white" />
                )}
              </div>
              <h3 className="text-xl font-medium mb-1">Welcome, {user.name}!</h3>
              <p className="text-zinc-400 mb-6">You're part of our coding community</p>

              <div className="flex gap-4">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link href="/sheets">Continue Learning</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/profile" className='text-zinc-900'>View Profile</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600" asChild>
                <Link href="/register">Join Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      {!user && (
        <section className="py-16 px-4 bg-black">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Revolutionize the Way You Learn</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex mb-4 text-orange-500">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Structured Learning</h3>
                  <p className="text-zinc-400">
                    Follow our proven learning paths to build strong foundations in algorithms and data structures.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex mb-4 text-blue-500">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Track Progress</h3>
                  <p className="text-zinc-400">
                    Monitor your learning journey with detailed progress tracking and performance analytics.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex mb-4 text-green-500">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Learn by Doing</h3>
                  <p className="text-zinc-400">
                    Solve real-world problems and strengthen your skills through hands-on practice.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
