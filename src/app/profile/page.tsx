'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import EditProfileForm from '@/components/profile/EditProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, CheckCircle, Award, Calendar, Hash, Github, Twitter, Linkedin, Globe, Code, Trophy, BookOpen } from 'lucide-react';
import Link from 'next/link';

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

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditMode, setIsEditMode] = useState(false);
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
        setSheets(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch sheets');
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  // Fetch user progress for each sheet
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

  // Calculate overall stats
  const calculateOverallStats = () => {
    if (!user || sheets.length === 0) return { totalCompleted: 0, totalProblems: 0, completion: 0, sheetsCompleted: 0 };

    const totalProblems = sheets.reduce((sum, sheet) => sum + sheet.totalProblems, 0);
    const totalCompleted = Object.values(progress).reduce(
      (sum, prog) => sum + prog.completedProblemIds.length,
      0
    );

    const completion = totalProblems > 0
      ? Math.round((totalCompleted / totalProblems) * 100)
      : 0;

    const sheetsCompleted = sheets.filter(sheet =>
      getCompletionPercentage(sheet._id, sheet.totalProblems) === 100
    ).length;

    return { totalCompleted, totalProblems, completion, sheetsCompleted };
  };

  const stats = calculateOverallStats();

  // Get most active sheet
  const getMostActiveSheet = () => {
    if (sheets.length === 0 || Object.keys(progress).length === 0) return null;

    let maxCompletedProblems = 0;
    let mostActiveSheetId = '';

    Object.entries(progress).forEach(([sheetId, prog]) => {
      if (prog.completedProblemIds.length > maxCompletedProblems) {
        maxCompletedProblems = prog.completedProblemIds.length;
        mostActiveSheetId = sheetId;
      }
    });

    return sheets.find(sheet => sheet._id === mostActiveSheetId) || null;
  };

  const mostActiveSheet = getMostActiveSheet();

  // Mock achievements (would be fetched from backend in real app)
  const achievements = [
    { id: 1, title: "First Problem Solved", icon: <CheckCircle className="h-5 w-5 text-green-500" />, unlocked: stats.totalCompleted > 0 },
    { id: 2, title: "Consistency Champion", icon: <Calendar className="h-5 w-5 text-blue-500" />, unlocked: stats.totalCompleted >= 10 },
    { id: 3, title: "Sheet Master", icon: <Trophy className="h-5 w-5 text-yellow-500" />, unlocked: stats.sheetsCompleted > 0 },
    { id: 4, title: "Algorithm Expert", icon: <Award className="h-5 w-5 text-purple-500" />, unlocked: stats.completion > 50 },
    { id: 5, title: "DSA Grandmaster", icon: <BookOpen className="h-5 w-5 text-orange-500" />, unlocked: stats.completion >= 90 },
  ];

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-8">
          <div className="relative h-40 rounded-t-xl bg-gradient-to-r from-violet-600 to-indigo-600">
            {/* Background banner */}
          </div>

          {/* Profile info section */}
          <div className="relative bg-card rounded-b-xl shadow-md p-6 pb-4 -mt-16 border">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <Avatar className="w-24 h-24 border-4 border-background">
                <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
                <AvatarFallback className="text-2xl bg-orange-600">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h1 className="text-2xl font-bold">{user?.name}</h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>

                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    <Pencil size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {user?.role === 'admin' && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      Admin
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
                    DSA Enthusiast
                  </Badge>
                  {stats.completion >= 50 && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                      Active Learner
                    </Badge>
                  )}
                </div>

                {/* Social links */}
                {user && (
                  <div className="flex mt-4 space-x-2">
                    {user.socialLinks?.github && (
                      <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-card hover:bg-accent rounded-full">
                        <Github size={16} />
                      </a>
                    )}
                    {user.socialLinks?.twitter && (
                      <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-card hover:bg-accent rounded-full">
                        <Twitter size={16} />
                      </a>
                    )}
                    {user.socialLinks?.linkedin && (
                      <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-card hover:bg-accent rounded-full">
                        <Linkedin size={16} />
                      </a>
                    )}
                    {user.socialLinks?.personalSite && (
                      <a href={user.socialLinks.personalSite} target="_blank" rel="noopener noreferrer" className="p-2 bg-card hover:bg-accent rounded-full">
                        <Globe size={16} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-accent/50 p-4 rounded-lg text-center">
                <h3 className="text-muted-foreground text-sm">Problems Solved</h3>
                <p className="text-2xl font-bold mt-1">{stats.totalCompleted} / {stats.totalProblems}</p>
              </div>
              <div className="bg-accent/50 p-4 rounded-lg text-center">
                <h3 className="text-muted-foreground text-sm">Completion</h3>
                <p className="text-2xl font-bold mt-1">{stats.completion}%</p>
              </div>
              <div className="bg-accent/50 p-4 rounded-lg text-center">
                <h3 className="text-muted-foreground text-sm">Sheets Completed</h3>
                <p className="text-2xl font-bold mt-1">{stats.sheetsCompleted} / {sheets.length}</p>
              </div>
              <div className="bg-accent/50 p-4 rounded-lg text-center">
                <h3 className="text-muted-foreground text-sm">Achievements</h3>
                <p className="text-2xl font-bold mt-1">{achievements.filter(a => a.unlocked).length} / {achievements.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content tabs */}
        {isEditMode ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Edit Your Profile</span>
                <Button variant="ghost" size="sm" onClick={() => setIsEditMode(false)}>
                  Cancel
                </Button>
              </CardTitle>
              <CardDescription>
                Update your personal information and social links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditProfileForm />
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            {/* Overview tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Activity summary */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Activity Summary</CardTitle>
                    <CardDescription>Your recent progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
                      </div>
                    ) : sheets.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No problem sheets available
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Most Active Sheet</h3>
                        {mostActiveSheet ? (
                          <div className="bg-accent/30 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{mostActiveSheet.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{mostActiveSheet.description.substring(0, 80)}...</p>
                              </div>
                              <Badge variant="outline" className="bg-primary/10 text-primary">
                                {getCompletionPercentage(mostActiveSheet._id, mostActiveSheet.totalProblems)}% Complete
                              </Badge>
                            </div>
                            <div className="mt-3">
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: `${getCompletionPercentage(mostActiveSheet._id, mostActiveSheet.totalProblems)}%` }}
                                />
                              </div>
                            </div>
                            <div className="mt-4 text-right">
                              <Button asChild variant="ghost" size="sm">
                                <Link href={`/sheets/${mostActiveSheet._id}`}>
                                  Continue Learning
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            You haven't started any sheets yet.{" "}
                            <Link href="/" className="text-primary">
                              Browse sheets
                            </Link>
                          </div>
                        )}

                        <h3 className="text-sm font-medium mt-6">Your Progress</h3>
                        <div className="space-y-3">
                          {sheets.slice(0, 3).map(sheet => (
                            <div key={sheet._id} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="p-2 rounded-md bg-primary/10 mr-3">
                                  <Code size={16} className="text-primary" />
                                </div>
                                <span className="text-sm">{sheet.title}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-muted-foreground">
                                  {progress[sheet._id]?.completedProblemIds.length || 0} / {sheet.totalProblems}
                                </span>
                                <Badge variant={getCompletionPercentage(sheet._id, sheet.totalProblems) === 100 ? "default" : "outline"} className="text-xs">
                                  {getCompletionPercentage(sheet._id, sheet.totalProblems)}%
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>

                        {sheets.length > 3 && (
                          <div className="text-center mt-4">
                            <Button asChild variant="outline" size="sm">
                              <Link href="/progress">View All Progress</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Achievements</CardTitle>
                    <CardDescription>Your latest milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {achievements.filter(a => a.unlocked).slice(0, 3).map(achievement => (
                        <div key={achievement.id} className="flex items-center p-3 bg-accent/30 rounded-lg">
                          <div className="p-2 bg-background rounded-full mr-3">
                            {achievement.icon}
                          </div>
                          <span>{achievement.title}</span>
                        </div>
                      ))}

                      {achievements.filter(a => a.unlocked).length === 0 && (
                        <div className="text-center py-6 text-muted-foreground">
                          <Trophy size={24} className="mx-auto mb-2 text-muted-foreground" />
                          <p>Start solving problems to unlock achievements!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab('achievements')}>
                      View All Achievements
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Progress tab */}
            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>Detailed progress across all sheets</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
                    </div>
                  ) : sheets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No problem sheets available
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {sheets.map(sheet => (
                        <div key={sheet._id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{sheet.title}</h3>
                            <Badge variant={getCompletionPercentage(sheet._id, sheet.totalProblems) === 100 ? "default" : "outline"}>
                              {getCompletionPercentage(sheet._id, sheet.totalProblems)}% Complete
                            </Badge>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: `${getCompletionPercentage(sheet._id, sheet.totalProblems)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{progress[sheet._id]?.completedProblemIds.length || 0} / {sheet.totalProblems} problems solved</span>
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/sheets/${sheet._id}`}>
                                Continue
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements tab */}
            <TabsContent value="achievements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Milestones you've reached</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map(achievement => (
                      <div
                        key={achievement.id}
                        className={`flex items-center p-4 rounded-lg ${achievement.unlocked
                            ? 'bg-accent/30'
                            : 'bg-muted/30 opacity-60'
                          }`}
                      >
                        <div className={`p-3 rounded-full ${achievement.unlocked
                            ? 'bg-background'
                            : 'bg-muted'
                          } mr-4`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {achievement.unlocked
                              ? 'Achieved!'
                              : 'Keep going to unlock this achievement'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ProtectedRoute>
  );
}
