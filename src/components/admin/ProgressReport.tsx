'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Download, BarChart2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Sheet {
  _id: string;
  title: string;
  description: string;
  totalProblems: number;
}

interface SheetProgress {
  userId: string;
  userName: string;
  userEmail: string;
  completionPercentage: number;
  completedProblems: number;
  totalProblems: number;
  byDifficulty: {
    Easy: { completed: number; total: number };
    Medium: { completed: number; total: number };
    Hard: { completed: number; total: number };
  };
}

interface BlogStats {
  userId: string;
  userName: string;
  userEmail: string;
  totalBlogsRead: number;
  totalBlogs: number;
  readPercentage: number;
}

interface CodingStats {
  userId: string;
  userName: string;
  userEmail: string;
  totalSubmissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;
  byDifficulty: {
    Easy: { submitted: number; accepted: number };
    Medium: { submitted: number; accepted: number };
    Hard: { submitted: number; accepted: number };
  };
}

export default function ProgressReport() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [selectedSheetId, setSelectedSheetId] = useState<string>('');
  const [progressData, setProgressData] = useState<SheetProgress[]>([]);
  const [blogData, setBlogData] = useState<BlogStats[]>([]);
  const [codingData, setCodingData] = useState<CodingStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('sheets');
  const [error, setError] = useState<string | null>(null);

  // Fetch sheets on component mount
  useEffect(() => {
    const fetchSheets = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.getAllSheets();
        setSheets(data);

        if (data.length > 0) {
          setSelectedSheetId(data[0]._id);
        }
      } catch (err: Error | unknown) {
        setError(err.response?.data?.error || 'Failed to fetch sheets');
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  // Fetch progress report when sheet changes
  useEffect(() => {
    if (!selectedSheetId) return;

    const fetchProgressReport = async () => {
      try {
        setReportLoading(true);

        // Get all users
        const usersResponse = await apiClient.getAllUsers();
        const users = usersResponse.data;

        // Get sheet details
        const sheetResponse = await apiClient.getSheet(selectedSheetId);
        const sheet = sheetResponse.data;

        const progressArray: SheetProgress[] = [];

        // For each user, get their progress on this sheet
        for (const user of users) {
          try {
            // Get user's progress for this sheet
            const progressResponse = await apiClient.getProgress(selectedSheetId);
            const progress = progressResponse.data;

            // Count problems by difficulty
            const byDifficulty = {
              Easy: { completed: 0, total: 0 },
              Medium: { completed: 0, total: 0 },
              Hard: { completed: 0, total: 0 }
            };

            // Calculate difficulty stats
            sheet.sections.forEach((section: any) => {
              section.topics.forEach((topic: any) => {
                topic.problems.forEach((problem: any) => {
                  const difficulty = problem.difficulty;
                  byDifficulty[difficulty].total += 1;

                  if (progress.completedProblemIds.includes(problem.id)) {
                    byDifficulty[difficulty].completed += 1;
                  }
                });
              });
            });

            const completedProblems = progress.completedProblemIds.length;
            const completionPercentage = Math.round((completedProblems / sheet.totalProblems) * 100);

            progressArray.push({
              userId: user._id,
              userName: user.name,
              userEmail: user.email,
              completionPercentage,
              completedProblems,
              totalProblems: sheet.totalProblems,
              byDifficulty
            });
          } catch (error) {
            // If error fetching progress for a user, add with zero completion
            progressArray.push({
              userId: user._id,
              userName: user.name,
              userEmail: user.email,
              completionPercentage: 0,
              completedProblems: 0,
              totalProblems: sheet.totalProblems,
              byDifficulty: {
                Easy: { completed: 0, total: 0 },
                Medium: { completed: 0, total: 0 },
                Hard: { completed: 0, total: 0 }
              }
            });
          }
        }

        setProgressData(progressArray);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch progress report');
      } finally {
        setReportLoading(false);
      }
    };

    fetchProgressReport();
  }, [selectedSheetId]);

  // Fetch blog stats
  useEffect(() => {
    if (activeTab !== 'blogs') return;

    const fetchBlogStats = async () => {
      try {
        setReportLoading(true);

        // Get all users
        const usersResponse = await apiClient.getAllUsers();
        const users = usersResponse.data;

        // Get all blogs
        const blogsResponse = await apiClient.getAllBlogs();
        const blogs = blogsResponse.data.data;
        const totalBlogs = blogs.length;

        const blogStatsArray: BlogStats[] = [];

        // For each user, get their blog reading stats
        for (const user of users) {
          try {
            // Get user's blog reads
            const blogReadsResponse = await apiClient.getAdminStats();
            const blogReads = blogReadsResponse.data.blogReads.filter(
              (read: any) => read.userId === user._id
            );

            const totalBlogsRead = blogReads.length;
            const readPercentage = Math.round((totalBlogsRead / totalBlogs) * 100);

            blogStatsArray.push({
              userId: user._id,
              userName: user.name,
              userEmail: user.email,
              totalBlogsRead,
              totalBlogs,
              readPercentage
            });
          } catch (error) {
            // If error fetching blog reads for a user, add with zero completion
            blogStatsArray.push({
              userId: user._id,
              userName: user.name,
              userEmail: user.email,
              totalBlogsRead: 0,
              totalBlogs,
              readPercentage: 0
            });
          }
        }

        setBlogData(blogStatsArray);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch blog stats');
      } finally {
        setReportLoading(false);
      }
    };

    fetchBlogStats();
  }, [activeTab]);

  // Fetch coding problem stats
  useEffect(() => {
    if (activeTab !== 'coding') return;

    const fetchCodingStats = async () => {
      try {
        setReportLoading(true);

        // Get all users
        const usersResponse = await apiClient.getAllUsers();
        const users = usersResponse.data;

        const codingStatsArray: CodingStats[] = [];

        // For each user, get their submission stats
        for (const user of users) {
          try {
            // Get admin stats which includes user submissions
            const statsResponse = await apiClient.getAdminStats();
            const userSubmissions = statsResponse.data.submissions.filter(
              (sub: any) => sub.userId === user._id
            );

            const totalSubmissions = userSubmissions.length;
            const acceptedSubmissions = userSubmissions.filter(
              (sub: any) => sub.status === 'Accepted'
            ).length;

            const acceptanceRate = totalSubmissions > 0
              ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
              : 0;

            // Count by difficulty
            const byDifficulty = {
              Easy: { submitted: 0, accepted: 0 },
              Medium: { submitted: 0, accepted: 0 },
              Hard: { submitted: 0, accepted: 0 }
            };

            // Calculate difficulty stats from problem submissions
            for (const submission of userSubmissions) {
              const problem = statsResponse.data.problems.find(
                (p: any) => p._id === submission.problemId
              );

              if (problem) {
                const difficulty = problem.difficulty;
                byDifficulty[difficulty].submitted += 1;

                if (submission.status === 'Accepted') {
                  byDifficulty[difficulty].accepted += 1;
                }
              }
            }

            codingStatsArray.push({
              userId: user._id,
              userName: user.name,
              userEmail: user.email,
              totalSubmissions,
              acceptedSubmissions,
              acceptanceRate,
              byDifficulty
            });
          } catch (error) {
            // If error fetching submission stats for a user, add with zero completion
            codingStatsArray.push({
              userId: user._id,
              userName: user.name,
              userEmail: user.email,
              totalSubmissions: 0,
              acceptedSubmissions: 0,
              acceptanceRate: 0,
              byDifficulty: {
                Easy: { submitted: 0, accepted: 0 },
                Medium: { submitted: 0, accepted: 0 },
                Hard: { submitted: 0, accepted: 0 }
              }
            });
          }
        }

        setCodingData(codingStatsArray);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch coding stats');
      } finally {
        setReportLoading(false);
      }
    };

    fetchCodingStats();
  }, [activeTab]);

  // Handle sheet change
  const handleSheetChange = (sheetId: string) => {
    setSelectedSheetId(sheetId);
  };

  // Calculate overall stats
  const calculateOverallStats = () => {
    if (progressData.length === 0) return null;

    const totalUsers = progressData.length;
    const avgCompletion = progressData.reduce((sum, user) => sum + user.completionPercentage, 0) / totalUsers;
    const usersCompleted = progressData.filter(user => user.completionPercentage === 100).length;

    return {
      totalUsers,
      avgCompletion,
      usersCompleted
    };
  };

  // Calculate blog stats
  const calculateBlogStats = () => {
    if (blogData.length === 0) return null;

    const totalUsers = blogData.length;
    const avgReadPercentage = blogData.reduce((sum, user) => sum + user.readPercentage, 0) / totalUsers;
    const usersReadAll = blogData.filter(user => user.readPercentage === 100).length;

    return {
      totalUsers,
      avgReadPercentage,
      usersReadAll
    };
  };

  // Calculate coding stats
  const calculateCodingStats = () => {
    if (codingData.length === 0) return null;

    const totalUsers = codingData.length;
    const avgAcceptanceRate = codingData.reduce((sum, user) => sum + user.acceptanceRate, 0) / totalUsers;
    const activeUsers = codingData.filter(user => user.totalSubmissions > 0).length;

    return {
      totalUsers,
      avgAcceptanceRate,
      activeUsers
    };
  };

  const overallStats = calculateOverallStats();
  const blogStats = calculateBlogStats();
  const codingStats = calculateCodingStats();

  // Export to CSV function
  const exportToCSV = () => {
    if (activeTab === 'sheets' && progressData.length > 0) {
      const headers = ['Name', 'Email', 'Completion %', 'Problems', 'Easy', 'Medium', 'Hard'];
      const dataRows = progressData.map(user => [
        user.userName,
        user.userEmail,
        `${user.completionPercentage}%`,
        `${user.completedProblems}/${user.totalProblems}`,
        `${user.byDifficulty.Easy.completed}/${user.byDifficulty.Easy.total}`,
        `${user.byDifficulty.Medium.completed}/${user.byDifficulty.Medium.total}`,
        `${user.byDifficulty.Hard.completed}/${user.byDifficulty.Hard.total}`
      ]);

      const csvContent = [
        headers.join(','),
        ...dataRows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `sheet-progress-${selectedSheetId}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (activeTab === 'blogs' && blogData.length > 0) {
      const headers = ['Name', 'Email', 'Blogs Read', 'Total Blogs', 'Read %'];
      const dataRows = blogData.map(user => [
        user.userName,
        user.userEmail,
        user.totalBlogsRead,
        user.totalBlogs,
        `${user.readPercentage}%`
      ]);

      const csvContent = [
        headers.join(','),
        ...dataRows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'blog-stats.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (activeTab === 'coding' && codingData.length > 0) {
      const headers = ['Name', 'Email', 'Submissions', 'Accepted', 'Rate %', 'Easy', 'Medium', 'Hard'];
      const dataRows = codingData.map(user => [
        user.userName,
        user.userEmail,
        user.totalSubmissions,
        user.acceptedSubmissions,
        `${user.acceptanceRate}%`,
        `${user.byDifficulty.Easy.accepted}/${user.byDifficulty.Easy.submitted}`,
        `${user.byDifficulty.Medium.accepted}/${user.byDifficulty.Medium.submitted}`,
        `${user.byDifficulty.Hard.accepted}/${user.byDifficulty.Hard.submitted}`
      ]);

      const csvContent = [
        headers.join(','),
        ...dataRows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'coding-stats.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8 text-destructive">
            <AlertCircle className="mr-2" />
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Reports</CardTitle>
        <CardDescription>View user completion rates across sheets, blogs, and coding problems</CardDescription>

        <Tabs defaultValue="sheets" className="mt-6" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="sheets">DSA Sheets</TabsTrigger>
            <TabsTrigger value="blogs">Tech Blogs</TabsTrigger>
            <TabsTrigger value="coding">Coding Problems</TabsTrigger>
          </TabsList>

          <TabsContent value="sheets">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <Select value={selectedSheetId} onValueChange={handleSheetChange}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select a sheet" />
                </SelectTrigger>
                <SelectContent>
                  {sheets.map(sheet => (
                    <SelectItem key={sheet._id} value={sheet._id}>
                      {sheet.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button className="w-full md:w-auto" onClick={exportToCSV} disabled={!selectedSheetId || progressData.length === 0}>
                <Download size={16} className="mr-2" />
                Export CSV
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="blogs">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <h3 className="text-lg font-medium">Tech Blog Reading Statistics</h3>
              <div className="ml-auto">
                <Button className="w-full md:w-auto" onClick={exportToCSV} disabled={blogData.length === 0}>
                  <Download size={16} className="mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="coding">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <h3 className="text-lg font-medium">Coding Problem Submission Statistics</h3>
              <div className="ml-auto">
                <Button className="w-full md:w-auto" onClick={exportToCSV} disabled={codingData.length === 0}>
                  <Download size={16} className="mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>

      <CardContent>
        {reportLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sheet Progress Content */}
            {activeTab === 'sheets' && (
              <>
                {/* Overall stats card */}
                {overallStats && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col items-center p-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
                          <p className="text-3xl font-bold">{overallStats.totalUsers}</p>
                        </div>

                        <div className="flex flex-col items-center p-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Average Completion</h3>
                          <p className="text-3xl font-bold">{Math.round(overallStats.avgCompletion)}%</p>
                        </div>

                        <div className="flex flex-col items-center p-4">
                          <h3 className="text-sm font-medium text-muted-foreground">100% Completion</h3>
                          <p className="text-3xl font-bold">{overallStats.usersCompleted} users</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* User progress table */}
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-4 p-4 font-medium border-b">
                    <div>User</div>
                    <div className="hidden md:block">Completion</div>
                    <div className="hidden md:block">Problems</div>
                    <div>Difficulty Breakdown</div>
                  </div>

                  <div className="divide-y">
                    {progressData.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No data available for this sheet
                      </div>
                    ) : (
                      progressData.map(user => (
                        <div key={user.userId} className="grid grid-cols-1 md:grid-cols-4 p-4 items-center">
                          <div>
                            <p className="font-medium">{user.userName}</p>
                            <p className="text-sm text-muted-foreground">{user.userEmail}</p>
                          </div>

                          <div className="hidden md:block">
                            <div className="flex items-center space-x-2">
                              {/* Progress bar */}
                              <div className="w-full max-w-[120px] bg-muted rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: `${user.completionPercentage}%` }}
                                />
                              </div>
                              <span>{user.completionPercentage}%</span>
                            </div>
                          </div>

                          <div className="hidden md:block">
                            <p>
                              {user.completedProblems} / {user.totalProblems}
                            </p>
                          </div>

                          <div className="space-y-1 md:space-y-0 md:flex md:space-x-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              Easy: {user.byDifficulty.Easy.completed}/{user.byDifficulty.Easy.total}
                            </Badge>
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                              Medium: {user.byDifficulty.Medium.completed}/{user.byDifficulty.Medium.total}
                            </Badge>
                            <Badge variant="outline" className="bg-red-500/10 text-red-500">
                              Hard: {user.byDifficulty.Hard.completed}/{user.byDifficulty.Hard.total}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Blog Stats Content */}
            {activeTab === 'blogs' && (
              <>
                {/* Overall blog stats card */}
                {blogStats && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col items-center p-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
                          <p className="text-3xl font-bold">{blogStats.totalUsers}</p>
                        </div>

                        <div className="flex flex-col items-center p-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Average Read Rate</h3>
                          <p className="text-3xl font-bold">{Math.round(blogStats.avgReadPercentage)}%</p>
                        </div>

                        <div className="flex flex-col items-center p-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Read All Blogs</h3>
                          <p className="text-3xl font-bold">{blogStats.usersReadAll} users</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* User blog stats table */}
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-3 p-4 font-medium border-b">
                    <div>User</div>
                    <div>Blogs Read</div>
                    <div>Completion</div>
                  </div>

                  <div className="divide-y">
                    {blogData.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No blog reading data available
                      </div>
                    ) : (
                      blogData.map(user => (
                        <div key={user.userId} className="grid grid-cols-1 md:grid-cols-3 p-4 items-center">
                          <div>
                            <p className="font-medium">{user.userName}</p>
                            <p className="text-sm text-muted-foreground">{user.userEmail}</p>
                          </div>

                          <div>
                            <p>{user.totalBlogsRead} / {user.totalBlogs}</p>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              {/* Progress bar */}
                              <div className="w-full max-w-[120px] bg-muted rounded-full h-2.5">
                                <div
                                  className="bg-blue-500 h-2.5 rounded-full"
                                  style={{ width: `${user.readPercentage}%` }}
                                />
                              </div>
                              <span>{user.readPercentage}%</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Coding Problem Stats Content */}
            {activeTab === 'coding' && (
              <>
                {/* Overall coding stats card */}
                {codingStats && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col items-center p-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
                          <p className="text-3xl font-bold">{codingStats.activeUsers} / {codingStats.totalUsers}</p>
                        </div>

                        <div className="flex flex-col items-center p-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Avg. Acceptance Rate</h3>
                          <p className="text-3xl font-bold">{Math.round(codingStats.avgAcceptanceRate)}%</p>
                        </div>

                        <div className="flex flex-col items-center p-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Total Submissions</h3>
                          <p className="text-3xl font-bold">
                            {codingData.reduce((sum, user) => sum + user.totalSubmissions, 0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* User coding stats table */}
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-4 p-4 font-medium border-b">
                    <div>User</div>
                    <div>Submissions</div>
                    <div>Acceptance Rate</div>
                    <div>Difficulty Breakdown</div>
                  </div>

                  <div className="divide-y">
                    {codingData.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No coding submission data available
                      </div>
                    ) : (
                      codingData.map(user => (
                        <div key={user.userId} className="grid grid-cols-1 md:grid-cols-4 p-4 items-center">
                          <div>
                            <p className="font-medium">{user.userName}</p>
                            <p className="text-sm text-muted-foreground">{user.userEmail}</p>
                          </div>

                          <div>
                            <p>{user.acceptedSubmissions} / {user.totalSubmissions}</p>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              {/* Progress bar */}
                              <div className="w-full max-w-[120px] bg-muted rounded-full h-2.5">
                                <div
                                  className="bg-green-500 h-2.5 rounded-full"
                                  style={{ width: `${user.acceptanceRate}%` }}
                                />
                              </div>
                              <span>{user.acceptanceRate}%</span>
                            </div>
                          </div>

                          <div className="space-y-1 md:space-y-0 md:flex md:space-x-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              Easy: {user.byDifficulty.Easy.accepted}/{user.byDifficulty.Easy.submitted}
                            </Badge>
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                              Medium: {user.byDifficulty.Medium.accepted}/{user.byDifficulty.Medium.submitted}
                            </Badge>
                            <Badge variant="outline" className="bg-red-500/10 text-red-500">
                              Hard: {user.byDifficulty.Hard.accepted}/{user.byDifficulty.Hard.submitted}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
