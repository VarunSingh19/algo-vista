// 'use client';

// import { useState, useEffect } from 'react';
// import ProtectedRoute from '@/components/auth/ProtectedRoute';
// import EditProfileForm from '@/components/profile/EditProfileForm';
// import { useAuth } from '@/contexts/AuthContext';
// import apiClient from '@/lib/api';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Pencil, CheckCircle, Award, Calendar, Hash, Github, Twitter, Linkedin, Globe, Code, Trophy, BookOpen } from 'lucide-react';
// import Link from 'next/link';

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


// export default function ProfilePage() {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [sheets, setSheets] = useState<Sheet[]>([]);
//   const [progress, setProgress] = useState<Record<string, SheetProgress>>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch sheets on component mount
//   useEffect(() => {
//     const fetchSheets = async () => {
//       try {
//         setLoading(true);
//         const { data } = await apiClient.getAllSheets();
//         setSheets(data);
//       } catch (err: any) {
//         setError(err.response?.data?.error || 'Failed to fetch sheets');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSheets();
//   }, []);

//   // Fetch user progress for each sheet
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

//   // Calculate overall stats
//   const calculateOverallStats = () => {
//     if (!user || sheets.length === 0) return { totalCompleted: 0, totalProblems: 0, completion: 0, sheetsCompleted: 0 };

//     const totalProblems = sheets.reduce((sum, sheet) => sum + sheet.totalProblems, 0);
//     const totalCompleted = Object.values(progress).reduce(
//       (sum, prog) => sum + prog.completedProblemIds.length,
//       0
//     );

//     const completion = totalProblems > 0
//       ? Math.round((totalCompleted / totalProblems) * 100)
//       : 0;

//     const sheetsCompleted = sheets.filter(sheet =>
//       getCompletionPercentage(sheet._id, sheet.totalProblems) === 100
//     ).length;

//     return { totalCompleted, totalProblems, completion, sheetsCompleted };
//   };

//   const stats = calculateOverallStats();

//   // Get most active sheet
//   const getMostActiveSheet = () => {
//     if (sheets.length === 0 || Object.keys(progress).length === 0) return null;

//     let maxCompletedProblems = 0;
//     let mostActiveSheetId = '';

//     Object.entries(progress).forEach(([sheetId, prog]) => {
//       if (prog.completedProblemIds.length > maxCompletedProblems) {
//         maxCompletedProblems = prog.completedProblemIds.length;
//         mostActiveSheetId = sheetId;
//       }
//     });

//     return sheets.find(sheet => sheet._id === mostActiveSheetId) || null;
//   };

//   const mostActiveSheet = getMostActiveSheet();

//   // Mock achievements (would be fetched from backend in real app)
//   const achievements = [
//     { id: 1, title: "First Problem Solved", icon: <CheckCircle className="h-5 w-5 text-green-500" />, unlocked: stats.totalCompleted > 0 },
//     { id: 2, title: "Consistency Champion", icon: <Calendar className="h-5 w-5 text-blue-500" />, unlocked: stats.totalCompleted >= 10 },
//     { id: 3, title: "Sheet Master", icon: <Trophy className="h-5 w-5 text-yellow-500" />, unlocked: stats.sheetsCompleted > 0 },
//     { id: 4, title: "Algorithm Expert", icon: <Award className="h-5 w-5 text-purple-500" />, unlocked: stats.completion > 50 },
//     { id: 5, title: "DSA Grandmaster", icon: <BookOpen className="h-5 w-5 text-orange-500" />, unlocked: stats.completion >= 90 },
//   ];

//   return (
//     <ProtectedRoute>
//       <div className="max-w-6xl mx-auto p-4">
//         <div className="mb-8">
//           <div className="relative h-40 rounded-t-xl bg-gradient-to-r from-violet-600 to-indigo-600">
//             {/* Background banner */}
//           </div>

//           {/* Profile info section */}
//           <div className="relative bg-card rounded-b-xl shadow-md p-6 pb-4 -mt-16 border">
//             <div className="flex flex-col md:flex-row items-start md:items-center">
//               <Avatar className="w-24 h-24 border-4 border-background">
//                 <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
//                 <AvatarFallback className="text-2xl bg-orange-600">
//                   {user?.name?.charAt(0).toUpperCase() || 'U'}
//                 </AvatarFallback>
//               </Avatar>

//               <div className="md:ml-6 mt-4 md:mt-0 flex-1">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                   <div>
//                     <h1 className="text-2xl font-bold">{user?.name}</h1>
//                     <p className="text-muted-foreground">{user?.email}</p>
//                   </div>

//                   <Button
//                     variant="outline"
//                     className="flex items-center"
//                     onClick={() => setIsEditMode(!isEditMode)}
//                   >
//                     <Pencil size={16} className="mr-2" />
//                     Edit Profile
//                   </Button>
//                 </div>

//                 <div className="flex flex-wrap gap-2 mt-4">
//                   {user?.role === 'admin' && (
//                     <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
//                       Admin
//                     </Badge>
//                   )}
//                   <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
//                     DSA Enthusiast
//                   </Badge>
//                   {stats.completion >= 50 && (
//                     <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
//                       Active Learner
//                     </Badge>
//                   )}
//                 </div>

//                 {/* Social links */}
//                 {user && (
//                   <div className="flex mt-4 space-x-2">
//                     {user.socialLinks?.github && (
//                       <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-card hover:bg-accent rounded-full">
//                         <Github size={16} />
//                       </a>
//                     )}
//                     {user.socialLinks?.twitter && (
//                       <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-card hover:bg-accent rounded-full">
//                         <Twitter size={16} />
//                       </a>
//                     )}
//                     {user.socialLinks?.linkedin && (
//                       <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-card hover:bg-accent rounded-full">
//                         <Linkedin size={16} />
//                       </a>
//                     )}
//                     {user.socialLinks?.personalSite && (
//                       <a href={user.socialLinks.personalSite} target="_blank" rel="noopener noreferrer" className="p-2 bg-card hover:bg-accent rounded-full">
//                         <Globe size={16} />
//                       </a>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Stats row */}
//             <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="bg-accent/50 p-4 rounded-lg text-center">
//                 <h3 className="text-muted-foreground text-sm">Problems Solved</h3>
//                 <p className="text-2xl font-bold mt-1">{stats.totalCompleted} / {stats.totalProblems}</p>
//               </div>
//               <div className="bg-accent/50 p-4 rounded-lg text-center">
//                 <h3 className="text-muted-foreground text-sm">Completion</h3>
//                 <p className="text-2xl font-bold mt-1">{stats.completion}%</p>
//               </div>
//               <div className="bg-accent/50 p-4 rounded-lg text-center">
//                 <h3 className="text-muted-foreground text-sm">Sheets Completed</h3>
//                 <p className="text-2xl font-bold mt-1">{stats.sheetsCompleted} / {sheets.length}</p>
//               </div>
//               <div className="bg-accent/50 p-4 rounded-lg text-center">
//                 <h3 className="text-muted-foreground text-sm">Achievements</h3>
//                 <p className="text-2xl font-bold mt-1">{achievements.filter(a => a.unlocked).length} / {achievements.length}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main content tabs */}
//         {isEditMode ? (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>Edit Your Profile</span>
//                 <Button variant="ghost" size="sm" onClick={() => setIsEditMode(false)}>
//                   Cancel
//                 </Button>
//               </CardTitle>
//               <CardDescription>
//                 Update your personal information and social links
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <EditProfileForm />
//             </CardContent>
//           </Card>
//         ) : (
//           <Tabs defaultValue="overview" className="space-y-4">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="overview">Overview</TabsTrigger>
//               <TabsTrigger value="progress">Progress</TabsTrigger>
//               <TabsTrigger value="achievements">Achievements</TabsTrigger>
//             </TabsList>

//             {/* Overview tab */}
//             <TabsContent value="overview" className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {/* Activity summary */}
//                 <Card className="md:col-span-2">
//                   <CardHeader>
//                     <CardTitle>Activity Summary</CardTitle>
//                     <CardDescription>Your recent progress</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <div className="flex justify-center py-8">
//                         <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//                       </div>
//                     ) : sheets.length === 0 ? (
//                       <div className="text-center py-4 text-muted-foreground">
//                         No problem sheets available
//                       </div>
//                     ) : (
//                       <div className="space-y-4">
//                         <h3 className="text-sm font-medium">Most Active Sheet</h3>
//                         {mostActiveSheet ? (
//                           <div className="bg-accent/30 rounded-lg p-4">
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <h4 className="font-medium">{mostActiveSheet.title}</h4>
//                                 <p className="text-sm text-muted-foreground mt-1">{mostActiveSheet.description.substring(0, 80)}...</p>
//                               </div>
//                               <Badge variant="outline" className="bg-primary/10 text-primary">
//                                 {getCompletionPercentage(mostActiveSheet._id, mostActiveSheet.totalProblems)}% Complete
//                               </Badge>
//                             </div>
//                             <div className="mt-3">
//                               <div className="w-full bg-muted rounded-full h-2.5">
//                                 <div
//                                   className="bg-primary h-2.5 rounded-full"
//                                   style={{ width: `${getCompletionPercentage(mostActiveSheet._id, mostActiveSheet.totalProblems)}%` }}
//                                 />
//                               </div>
//                             </div>
//                             <div className="mt-4 text-right">
//                               <Button asChild variant="ghost" size="sm">
//                                 <Link href={`/sheets/${mostActiveSheet._id}`}>
//                                   Continue Learning
//                                 </Link>
//                               </Button>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="text-center py-4 text-muted-foreground">
//                             You haven't started any sheets yet.{" "}
//                             <Link href="/" className="text-primary">
//                               Browse sheets
//                             </Link>
//                           </div>
//                         )}

//                         <h3 className="text-sm font-medium mt-6">Your Progress</h3>
//                         <div className="space-y-3">
//                           {sheets.slice(0, 3).map(sheet => (
//                             <div key={sheet._id} className="flex justify-between items-center">
//                               <div className="flex items-center">
//                                 <div className="p-2 rounded-md bg-primary/10 mr-3">
//                                   <Code size={16} className="text-primary" />
//                                 </div>
//                                 <span className="text-sm">{sheet.title}</span>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <span className="text-xs text-muted-foreground">
//                                   {progress[sheet._id]?.completedProblemIds.length || 0} / {sheet.totalProblems}
//                                 </span>
//                                 <Badge variant={getCompletionPercentage(sheet._id, sheet.totalProblems) === 100 ? "default" : "outline"} className="text-xs">
//                                   {getCompletionPercentage(sheet._id, sheet.totalProblems)}%
//                                 </Badge>
//                               </div>
//                             </div>
//                           ))}
//                         </div>

//                         {sheets.length > 3 && (
//                           <div className="text-center mt-4">
//                             <Button asChild variant="outline" size="sm">
//                               <Link href="/progress">View All Progress</Link>
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Recent achievements */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Recent Achievements</CardTitle>
//                     <CardDescription>Your latest milestones</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-3">
//                       {achievements.filter(a => a.unlocked).slice(0, 3).map(achievement => (
//                         <div key={achievement.id} className="flex items-center p-3 bg-accent/30 rounded-lg">
//                           <div className="p-2 bg-background rounded-full mr-3">
//                             {achievement.icon}
//                           </div>
//                           <span>{achievement.title}</span>
//                         </div>
//                       ))}

//                       {achievements.filter(a => a.unlocked).length === 0 && (
//                         <div className="text-center py-6 text-muted-foreground">
//                           <Trophy size={24} className="mx-auto mb-2 text-muted-foreground" />
//                           <p>Start solving problems to unlock achievements!</p>
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                   <CardFooter>
//                     <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab('achievements')}>
//                       View All Achievements
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </div>
//             </TabsContent>

//             {/* Progress tab */}
//             <TabsContent value="progress" className="space-y-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Your Progress</CardTitle>
//                   <CardDescription>Detailed progress across all sheets</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {loading ? (
//                     <div className="flex justify-center py-8">
//                       <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//                     </div>
//                   ) : sheets.length === 0 ? (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No problem sheets available
//                     </div>
//                   ) : (
//                     <div className="space-y-6">
//                       {sheets.map(sheet => (
//                         <div key={sheet._id} className="space-y-2">
//                           <div className="flex justify-between items-center">
//                             <h3 className="font-medium">{sheet.title}</h3>
//                             <Badge variant={getCompletionPercentage(sheet._id, sheet.totalProblems) === 100 ? "default" : "outline"}>
//                               {getCompletionPercentage(sheet._id, sheet.totalProblems)}% Complete
//                             </Badge>
//                           </div>
//                           <div className="w-full bg-muted rounded-full h-2.5">
//                             <div
//                               className="bg-primary h-2.5 rounded-full"
//                               style={{ width: `${getCompletionPercentage(sheet._id, sheet.totalProblems)}%` }}
//                             />
//                           </div>
//                           <div className="flex justify-between text-xs text-muted-foreground">
//                             <span>{progress[sheet._id]?.completedProblemIds.length || 0} / {sheet.totalProblems} problems solved</span>
//                             <Button asChild variant="ghost" size="sm">
//                               <Link href={`/sheets/${sheet._id}`}>
//                                 Continue
//                               </Link>
//                             </Button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Achievements tab */}
//             <TabsContent value="achievements" className="space-y-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Your Achievements</CardTitle>
//                   <CardDescription>Milestones you've reached</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {achievements.map(achievement => (
//                       <div
//                         key={achievement.id}
//                         className={`flex items-center p-4 rounded-lg ${achievement.unlocked
//                             ? 'bg-accent/30'
//                             : 'bg-muted/30 opacity-60'
//                           }`}
//                       >
//                         <div className={`p-3 rounded-full ${achievement.unlocked
//                             ? 'bg-background'
//                             : 'bg-muted'
//                           } mr-4`}>
//                           {achievement.icon}
//                         </div>
//                         <div>
//                           <h4 className="font-medium">{achievement.title}</h4>
//                           <p className="text-xs text-muted-foreground mt-1">
//                             {achievement.unlocked
//                               ? 'Achieved!'
//                               : 'Keep going to unlock this achievement'}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import ProtectedRoute from '@/components/auth/ProtectedRoute';
// import EditProfileForm from '@/components/profile/EditProfileForm';
// import { useAuth } from '@/contexts/AuthContext';
// import apiClient from '@/lib/api';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Progress } from '@/components/ui/progress';
// import { Separator } from '@/components/ui/separator';
// import {
//   Pencil, CheckCircle, Award, Calendar, Hash, Github, Twitter, Linkedin, Globe,
//   Code, Trophy, BookOpen, Star, Target, TrendingUp, Clock, MapPin, Mail,
//   Flame, Zap, Activity, Coffee, Brain, Users, Share2, Copy, ExternalLink,
//   Medal, Crown, Shield, Sparkles, Heart, ThumbsUp
// } from 'lucide-react';
// import Link from 'next/link';

// interface Sheet {
//   _id: string;
//   title: string;
//   description: string;
//   totalProblems: number;
//   difficulty?: 'Easy' | 'Medium' | 'Hard';
//   category?: string;
// }

// interface SheetProgress {
//   sheetId: string;
//   completedProblemIds: string[];
//   lastAccessed?: string;
// }

// interface Achievement {
//   id: number;
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   unlocked: boolean;
//   unlockedAt?: string;
//   category: 'progress' | 'consistency' | 'mastery' | 'special';
//   rarity: 'common' | 'rare' | 'epic' | 'legendary';
// }

// interface ActivityData {
//   date: string;
//   problemsSolved: number;
//   sheetsWorkedOn: string[];
// }

// export default function ProfilePage() {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [sheets, setSheets] = useState<Sheet[]>([]);
//   const [progress, setProgress] = useState<Record<string, SheetProgress>>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [streak, setStreak] = useState(0);
//   const [totalTimeSpent, setTotalTimeSpent] = useState(0);

//   // Fetch sheets on component mount
//   useEffect(() => {
//     const fetchSheets = async () => {
//       try {
//         setLoading(true);
//         const { data } = await apiClient.getAllSheets();
//         setSheets(data);
//       } catch (err: any) {
//         setError(err.response?.data?.error || 'Failed to fetch sheets');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSheets();
//   }, []);

//   // Fetch user progress for each sheet
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
//             userProgress[sheet._id] = {
//               sheetId: sheet._id,
//               completedProblemIds: []
//             };
//           }
//         }

//         setProgress(userProgress);

//         // Calculate streak (mock data for demo)
//         setStreak(Math.floor(Math.random() * 15) + 1);
//         setTotalTimeSpent(Math.floor(Math.random() * 120) + 10);
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

//   // Calculate overall stats
//   const calculateOverallStats = () => {
//     if (!user || sheets.length === 0) return {
//       totalCompleted: 0,
//       totalProblems: 0,
//       completion: 0,
//       sheetsCompleted: 0,
//       averageCompletion: 0,
//       rank: 'Beginner'
//     };

//     const totalProblems = sheets.reduce((sum, sheet) => sum + sheet.totalProblems, 0);
//     const totalCompleted = Object.values(progress).reduce(
//       (sum, prog) => sum + prog.completedProblemIds.length,
//       0
//     );

//     const completion = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;
//     const sheetsCompleted = sheets.filter(sheet =>
//       getCompletionPercentage(sheet._id, sheet.totalProblems) === 100
//     ).length;

//     const averageCompletion = sheets.length > 0 ?
//       sheets.reduce((sum, sheet) => sum + getCompletionPercentage(sheet._id, sheet.totalProblems), 0) / sheets.length : 0;

//     // Determine rank based on completion
//     let rank = 'Beginner';
//     if (completion >= 90) rank = 'Grandmaster';
//     else if (completion >= 70) rank = 'Expert';
//     else if (completion >= 50) rank = 'Advanced';
//     else if (completion >= 25) rank = 'Intermediate';

//     return { totalCompleted, totalProblems, completion, sheetsCompleted, averageCompletion: Math.round(averageCompletion), rank };
//   };

//   const stats = calculateOverallStats();

//   // Get most active sheet
//   const getMostActiveSheet = () => {
//     if (sheets.length === 0 || Object.keys(progress).length === 0) return null;

//     let maxCompletedProblems = 0;
//     let mostActiveSheetId = '';

//     Object.entries(progress).forEach(([sheetId, prog]) => {
//       if (prog.completedProblemIds.length > maxCompletedProblems) {
//         maxCompletedProblems = prog.completedProblemIds.length;
//         mostActiveSheetId = sheetId;
//       }
//     });

//     return sheets.find(sheet => sheet._id === mostActiveSheetId) || null;
//   };

//   const mostActiveSheet = getMostActiveSheet();

//   // Enhanced achievements system
//   const achievements: Achievement[] = [
//     {
//       id: 1,
//       title: "First Steps",
//       description: "Solved your first problem",
//       icon: <CheckCircle className="h-5 w-5" />,
//       unlocked: stats.totalCompleted > 0,
//       category: 'progress',
//       rarity: 'common'
//     },
//     {
//       id: 2,
//       title: "Consistency King",
//       description: "Maintained a 7-day streak",
//       icon: <Flame className="h-5 w-5" />,
//       unlocked: streak >= 7,
//       category: 'consistency',
//       rarity: 'rare'
//     },
//     {
//       id: 3,
//       title: "Sheet Conqueror",
//       description: "Completed your first sheet",
//       icon: <Trophy className="h-5 w-5" />,
//       unlocked: stats.sheetsCompleted > 0,
//       category: 'progress',
//       rarity: 'common'
//     },
//     {
//       id: 4,
//       title: "Problem Solver",
//       description: "Solved 25+ problems",
//       icon: <Target className="h-5 w-5" />,
//       unlocked: stats.totalCompleted >= 25,
//       category: 'progress',
//       rarity: 'common'
//     },
//     {
//       id: 5,
//       title: "Algorithm Master",
//       description: "Achieved 50%+ completion",
//       icon: <Brain className="h-5 w-5" />,
//       unlocked: stats.completion >= 50,
//       category: 'mastery',
//       rarity: 'rare'
//     },
//     {
//       id: 6,
//       title: "DSA Legend",
//       description: "Achieved 90%+ completion",
//       icon: <Crown className="h-5 w-5" />,
//       unlocked: stats.completion >= 90,
//       category: 'mastery',
//       rarity: 'legendary'
//     },
//     {
//       id: 7,
//       title: "Speed Demon",
//       description: "Solved 10 problems in one day",
//       icon: <Zap className="h-5 w-5" />,
//       unlocked: Math.random() > 0.7, // Mock condition
//       category: 'special',
//       rarity: 'epic'
//     },
//     {
//       id: 8,
//       title: "Night Owl",
//       description: "Solved problems after midnight",
//       icon: <Coffee className="h-5 w-5" />,
//       unlocked: Math.random() > 0.8, // Mock condition
//       category: 'special',
//       rarity: 'rare'
//     }
//   ];

//   // Get rarity color
//   const getRarityColor = (rarity: string) => {
//     switch (rarity) {
//       case 'common': return 'text-gray-500 border-gray-500/30 bg-gray-500/10';
//       case 'rare': return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
//       case 'epic': return 'text-purple-500 border-purple-500/30 bg-purple-500/10';
//       case 'legendary': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
//       default: return 'text-gray-500 border-gray-500/30 bg-gray-500/10';
//     }
//   };

//   // Social links with enhanced display
//   const socialLinks = [
//     {
//       name: 'GitHub',
//       icon: <Github size={20} />,
//       url: user?.socialLinks?.github,
//       color: 'hover:bg-gray-100 dark:hover:bg-gray-800'
//     },
//     {
//       name: 'Twitter',
//       icon: <Twitter size={20} />,
//       url: user?.socialLinks?.twitter,
//       color: 'hover:bg-blue-50 dark:hover:bg-blue-950'
//     },
//     {
//       name: 'LinkedIn',
//       icon: <Linkedin size={20} />,
//       url: user?.socialLinks?.linkedin,
//       color: 'hover:bg-blue-50 dark:hover:bg-blue-950'
//     },
//     {
//       name: 'Website',
//       icon: <Globe size={20} />,
//       url: user?.socialLinks?.personalSite,
//       color: 'hover:bg-green-50 dark:hover:bg-green-950'
//     }
//   ];

//   const copyProfileUrl = () => {
//     navigator.clipboard.writeText(window.location.href);
//     // You could add a toast notification here
//   };

//   return (
//     <ProtectedRoute>
//       <div className="max-w-7xl mx-auto p-4 space-y-6">
//         {/* Enhanced Header Section */}
//         <div className="relative">
//           {/* Dynamic background banner */}
//           <div className="relative h-48 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 overflow-hidden">
//             <div className="absolute inset-0 bg-black/20"></div>
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
//             {/* Decorative elements */}
//             <div className="absolute top-4 right-4 opacity-20">
//               <Code size={32} />
//             </div>
//             <div className="absolute bottom-4 left-4 opacity-20">
//               <Trophy size={28} />
//             </div>
//           </div>

//           {/* Profile Card */}
//           <Card className="relative -mt-20 mx-4 border-2 shadow-xl">
//             <CardContent className="p-6">
//               <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
//                 {/* Avatar and basic info */}
//                 <div className="flex items-center gap-6">
//                   <div className="relative">
//                     <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
//                       <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
//                       <AvatarFallback className="text-3xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
//                         {user?.name?.charAt(0).toUpperCase() || 'U'}
//                       </AvatarFallback>
//                     </Avatar>
//                     {/* Status indicator */}
//                     <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-background rounded-full flex items-center justify-center">
//                       <div className="w-3 h-3 bg-white rounded-full"></div>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex items-center gap-3">
//                       <h1 className="text-3xl font-bold">{user?.name}</h1>
//                       {user?.role === 'admin' && (
//                         <Shield className="w-6 h-6 text-blue-500" />
//                       )}
//                     </div>
//                     <div className="flex items-center gap-2 text-muted-foreground">
//                       <Mail size={16} />
//                       <span>{user?.email}</span>
//                     </div>
//                     {user?.location && (
//                       <div className="flex items-center gap-2 text-muted-foreground">
//                         <MapPin size={16} />
//                         <span>{user.location}</span>
//                       </div>
//                     )}
//                     <p className="text-muted-foreground max-w-md">
//                       {user?.bio || "Passionate about data structures and algorithms. Always learning, always coding."}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Actions and Social Links */}
//                 <div className="flex flex-col gap-4 lg:ml-auto">
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       onClick={() => setIsEditMode(!isEditMode)}
//                       className="flex items-center gap-2"
//                     >
//                       <Pencil size={16} />
//                       Edit Profile
//                     </Button>
//                     <Button variant="outline" size="icon" onClick={copyProfileUrl}>
//                       <Share2 size={16} />
//                     </Button>
//                   </div>

//                   {/* Enhanced Social Links */}
//                   <div className="flex gap-2">
//                     {socialLinks.map(social => (
//                       social.url && (
//                         <a
//                           key={social.name}
//                           href={social.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className={`p-3 rounded-lg border transition-colors ${social.color} group`}
//                           title={social.name}
//                         >
//                           <div className="transition-transform group-hover:scale-110">
//                             {social.icon}
//                           </div>
//                         </a>
//                       )
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Enhanced Badges */}
//               <div className="flex flex-wrap gap-2 mt-6">
//                 <Badge className={getRarityColor(stats.rank.toLowerCase())} variant="outline">
//                   <Crown size={14} className="mr-1" />
//                   {stats.rank}
//                 </Badge>
//                 {user?.role === 'admin' && (
//                   <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
//                     <Shield size={14} className="mr-1" />
//                     Admin
//                   </Badge>
//                 )}
//                 <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
//                   <Code size={14} className="mr-1" />
//                   DSA Enthusiast
//                 </Badge>
//                 {streak >= 7 && (
//                   <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
//                     <Flame size={14} className="mr-1" />
//                     {streak} day streak
//                   </Badge>
//                 )}
//                 {stats.completion >= 50 && (
//                   <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
//                     <TrendingUp size={14} className="mr-1" />
//                     Active Learner
//                   </Badge>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Enhanced Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//           <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
//             <CardContent className="p-4 text-center">
//               <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
//               <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalCompleted}</div>
//               <div className="text-xs text-blue-600 dark:text-blue-400">Problems Solved</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
//             <CardContent className="p-4 text-center">
//               <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
//               <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.completion}%</div>
//               <div className="text-xs text-green-600 dark:text-green-400">Overall Progress</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
//             <CardContent className="p-4 text-center">
//               <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-600" />
//               <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.sheetsCompleted}</div>
//               <div className="text-xs text-purple-600 dark:text-purple-400">Sheets Completed</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
//             <CardContent className="p-4 text-center">
//               <Flame className="w-8 h-8 mx-auto mb-2 text-orange-600" />
//               <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{streak}</div>
//               <div className="text-xs text-orange-600 dark:text-orange-400">Day Streak</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
//             <CardContent className="p-4 text-center">
//               <Medal className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
//               <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{achievements.filter(a => a.unlocked).length}</div>
//               <div className="text-xs text-yellow-600 dark:text-yellow-400">Achievements</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
//             <CardContent className="p-4 text-center">
//               <Clock className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
//               <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{totalTimeSpent}h</div>
//               <div className="text-xs text-indigo-600 dark:text-indigo-400">Time Spent</div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Content */}
//         {isEditMode ? (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>Edit Your Profile</span>
//                 <Button variant="ghost" size="sm" onClick={() => setIsEditMode(false)}>
//                   Cancel
//                 </Button>
//               </CardTitle>
//               <CardDescription>
//                 Update your personal information, bio, and social links
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <EditProfileForm />
//             </CardContent>
//           </Card>
//         ) : (
//           <Tabs defaultValue="overview" className="space-y-6">
//             <TabsList className="grid w-full grid-cols-4">
//               <TabsTrigger value="overview" className="flex items-center gap-2">
//                 <Activity size={16} />
//                 Overview
//               </TabsTrigger>
//               <TabsTrigger value="progress" className="flex items-center gap-2">
//                 <TrendingUp size={16} />
//                 Progress
//               </TabsTrigger>
//               <TabsTrigger value="achievements" className="flex items-center gap-2">
//                 <Trophy size={16} />
//                 Achievements
//               </TabsTrigger>
//               <TabsTrigger value="analytics" className="flex items-center gap-2">
//                 <Activity size={16} />
//                 Analytics
//               </TabsTrigger>
//             </TabsList>

//             {/* Overview Tab */}
//             <TabsContent value="overview" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Activity Summary */}
//                 <Card className="lg:col-span-2">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Activity className="w-5 h-5" />
//                       Activity Summary
//                     </CardTitle>
//                     <CardDescription>Your recent progress and activity</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <div className="flex justify-center py-8">
//                         <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//                       </div>
//                     ) : sheets.length === 0 ? (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
//                         <p>No problem sheets available</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-6">
//                         {/* Most Active Sheet */}
//                         {mostActiveSheet && (
//                           <div>
//                             <h3 className="font-medium mb-3 flex items-center gap-2">
//                               <Star className="w-4 h-4 text-yellow-500" />
//                               Most Active Sheet
//                             </h3>
//                             <Card className="bg-gradient-to-r from-accent/50 to-accent/30 border-accent">
//                               <CardContent className="p-4">
//                                 <div className="flex justify-between items-start mb-3">
//                                   <div>
//                                     <h4 className="font-semibold">{mostActiveSheet.title}</h4>
//                                     <p className="text-sm text-muted-foreground mt-1">
//                                       {mostActiveSheet.description.substring(0, 100)}...
//                                     </p>
//                                   </div>
//                                   <Badge className="bg-primary/10 text-primary border-primary/30">
//                                     {getCompletionPercentage(mostActiveSheet._id, mostActiveSheet.totalProblems)}% Complete
//                                   </Badge>
//                                 </div>
//                                 <Progress
//                                   value={getCompletionPercentage(mostActiveSheet._id, mostActiveSheet.totalProblems)}
//                                   className="mb-3"
//                                 />
//                                 <div className="flex justify-between items-center">
//                                   <span className="text-sm text-muted-foreground">
//                                     {progress[mostActiveSheet._id]?.completedProblemIds.length || 0} / {mostActiveSheet.totalProblems} problems
//                                   </span>
//                                   <Button asChild size="sm">
//                                     <Link href={`/sheets/${mostActiveSheet._id}`}>
//                                       Continue Learning
//                                     </Link>
//                                   </Button>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           </div>
//                         )}

//                         {/* Recent Progress */}
//                         <div>
//                           <h3 className="font-medium mb-3 flex items-center gap-2">
//                             <TrendingUp className="w-4 h-4 text-green-500" />
//                             Your Progress
//                           </h3>
//                           <div className="space-y-3">
//                             {sheets.slice(0, 5).map(sheet => {
//                               const completionPercentage = getCompletionPercentage(sheet._id, sheet.totalProblems);
//                               return (
//                                 <div key={sheet._id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
//                                   <div className="flex items-center gap-3">
//                                     <div className={`p-2 rounded-md ${completionPercentage === 100 ? 'bg-green-500/20 text-green-600' :
//                                         completionPercentage >= 50 ? 'bg-blue-500/20 text-blue-600' :
//                                           'bg-orange-500/20 text-orange-600'
//                                       }`}>
//                                       <Code size={16} />
//                                     </div>
//                                     <div>
//                                       <span className="font-medium text-sm">{sheet.title}</span>
//                                       <div className="text-xs text-muted-foreground">
//                                         {progress[sheet._id]?.completedProblemIds.length || 0} / {sheet.totalProblems} problems
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <Badge variant={completionPercentage === 100 ? "default" : "outline"}>
//                                     {completionPercentage}%
//                                   </Badge>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Achievements and Quick Stats */}
//                 <div className="space-y-6">
//                   {/* Recent Achievements */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2">
//                         <Trophy className="w-5 h-5 text-yellow-500" />
//                         Recent Achievements
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-3">
//                         {achievements.filter(a => a.unlocked).slice(0, 4).map(achievement => (
//                           <div key={achievement.id} className={`flex items-center p-3 rounded-lg border ${getRarityColor(achievement.rarity)}`}>
//                             <div className="p-2 bg-background rounded-full mr-3">
//                               {achievement.icon}
//                             </div>
//                             <div>
//                               <span className="font-medium text-sm">{achievement.title}</span>
//                               <p className="text-xs text-muted-foreground">{achievement.description}</p>
//                             </div>
//                           </div>
//                         ))}

//                         {achievements.filter(a => a.unlocked).length === 0 && (
//                           <div className="text-center py-6 text-muted-foreground">
//                             <Trophy size={32} className="mx-auto mb-2 opacity-50" />
//                             <p className="text-sm">Start solving problems to unlock achievements!</p>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                     <CardFooter>
//                       <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab('achievements')}>
//                         View All Achievements
//                       </Button>
//                     </CardFooter>
//                   </Card>

//                   {/* Quick Stats */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2">
//                         <Sparkles className="w-5 h-5 text-purple-500" />
//                         Quick Stats
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-3">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-muted-foreground">Total Problems Solved</span>

//                         <span className="font-medium text-sm">{stats.totalCompleted}</span>
//                       </div>
//                       <Separator />
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-muted-foreground">Average Completion</span>

//                         <span className="font-medium text-sm">{stats.averageCompletion}%</span>
//                       </div>
//                       <Separator />

//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-muted-foreground">Streak</span>

//                         <span className="font-medium text-sm">{streak} days</span>
//                       </div>
//                       <Separator />
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-muted-foreground">Time Spent</span>

//                         <span className="font-medium text-sm">{totalTimeSpent} hours</span>
//                       </div>
//                       <Separator />
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-muted-foreground">Sheets Completed</span>

//                         <span className="font-medium text-sm">{stats.sheetsCompleted}</span>
//                       </div>
//                       <Separator />
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-muted-foreground">Rank</span>

//                         <span className="font-medium text-sm">{stats.rank}</span>
//                       </div>
//                     </CardContent>
//                     <CardFooter>
//                       <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab('analytics')}>
//                         View Detailed Analytics
//                       </Button>
//                     </CardFooter>
//                   </Card>

//                 </div>
//               </div>
//             </div>
//             {/* Progress Tab */}
//             <TabsContent value="progress">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <TrendingUp className="w-5 h-5 text-green-500" />
//                     Your Progress
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {loading ? (
//                     <div className="flex justify-center py-8">
//                       <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//                     </div>
//                   ) : sheets.length === 0 ? (
//                     <div className="text-center py-8 text-muted-foreground">
//                       <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
//                       <p>No problem sheets available</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-6">
//                       {sheets.map(sheet => (
//                         <div key={sheet._id} className="p-4 bg-accent/30 rounded-lg">
//                           <h4 className="font-semibold">{sheet.title}</h4>
//                           <Progress
//                             value={getCompletionPercentage(sheet._id, sheet.totalProblems)}
//                             className="my-2"
//                           />
//                           <p>{sheet.description}</p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//             {/* Achievements Tab */}
//             <TabsContent value="achievements">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Trophy className="w-5 h-5 text-yellow-500" />
//                     Achievements
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {achievements.length === 0 ? (
//                     <div className="text-center py-8 text-muted-foreground">
//                       <Trophy size={48} className="mx-auto mb-4 opacity-50" />
//                       <p>No achievements unlocked yet</p>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                       {achievements.map(achievement => (
//                         <div key={achievement.id} className={`p-4 rounded-lg border ${getRarityColor(achievement.rarity)}`}>
//                           <div className="flex items-center mb-2">
//                             {achievement.icon}
//                             <h4 className="font-semibold ml-2">{achievement.title}</h4>
//                           </div>
//                           <p>{achievement.description}</p>
//                           {achievement.unlocked && (
//                             <Badge variant="outline" className="mt-2">
//                               Unlocked
//                             </Badge>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//             {/* Analytics Tab */}
//             <TabsContent value="analytics">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Activity className="w-5 h-5 text-purple-500" />
//                     Analytics
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-center py-8 text-muted-foreground">
//                     <Activity size={48} className="mx-auto mb-4 opacity-50" />
//                     <p>Analytics feature coming soon!</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//           </Tabs>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import ProtectedRoute from '@/components/auth/ProtectedRoute';
// import EditProfileForm from '@/components/profile/EditProfileForm';
// import { useAuth } from '@/contexts/AuthContext';
// import apiClient from '@/lib/api';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Progress } from '@/components/ui/progress';
// import { Separator } from '@/components/ui/separator';
// import {
//   Pencil, CheckCircle, Award, Calendar, Hash, Github, Twitter, Linkedin, Globe,
//   Code, Trophy, BookOpen, Star, Target, TrendingUp, Clock, MapPin, Mail,
//   Flame, Zap, Activity, Coffee, Brain, Users, Share2, Copy, ExternalLink,
//   Medal, Crown, Shield, Sparkles, Heart, ThumbsUp
// } from 'lucide-react';
// import Link from 'next/link';

// interface Sheet {
//   _id: string;
//   title: string;
//   description: string;
//   totalProblems: number;
//   difficulty?: 'Easy' | 'Medium' | 'Hard';
//   category?: string;
// }

// interface SheetProgress {
//   sheetId: string;
//   completedProblemIds: string[];
//   lastAccessed?: string;
// }

// interface Achievement {
//   id: number;
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   unlocked: boolean;
//   unlockedAt?: string;
//   category: 'progress' | 'consistency' | 'mastery' | 'special';
//   rarity: 'common' | 'rare' | 'epic' | 'legendary';
// }

// interface ActivityData {
//   date: string;
//   problemsSolved: number;
//   sheetsWorkedOn: string[];
// }

// export default function ProfilePage() {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [sheets, setSheets] = useState<Sheet[]>([]);
//   const [progress, setProgress] = useState<Record<string, SheetProgress>>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [streak, setStreak] = useState(0);
//   const [totalTimeSpent, setTotalTimeSpent] = useState(0);

//   // Fetch sheets on component mount
//   useEffect(() => {
//     const fetchSheets = async () => {
//       try {
//         setLoading(true);
//         const { data } = await apiClient.getAllSheets();
//         setSheets(data);
//       } catch (err: any) {
//         setError(err.response?.data?.error || 'Failed to fetch sheets');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSheets();
//   }, []);

//   // Fetch user progress for each sheet
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
//             userProgress[sheet._id] = {
//               sheetId: sheet._id,
//               completedProblemIds: []
//             };
//           }
//         }

//         setProgress(userProgress);

//         // Calculate streak (mock data for demo)
//         setStreak(Math.floor(Math.random() * 15) + 1);
//         setTotalTimeSpent(Math.floor(Math.random() * 120) + 10);
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

//   // Calculate overall stats
//   const calculateOverallStats = () => {
//     if (!user || sheets.length === 0) return {
//       totalCompleted: 0,
//       totalProblems: 0,
//       completion: 0,
//       sheetsCompleted: 0,
//       averageCompletion: 0,
//       rank: 'Beginner'
//     };

//     const totalProblems = sheets.reduce((sum, sheet) => sum + sheet.totalProblems, 0);
//     const totalCompleted = Object.values(progress).reduce(
//       (sum, prog) => sum + prog.completedProblemIds.length,
//       0
//     );

//     const completion = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;
//     const sheetsCompleted = sheets.filter(sheet =>
//       getCompletionPercentage(sheet._id, sheet.totalProblems) === 100
//     ).length;

//     const averageCompletion = sheets.length > 0 ?
//       sheets.reduce((sum, sheet) => sum + getCompletionPercentage(sheet._id, sheet.totalProblems), 0) / sheets.length : 0;

//     // Determine rank based on completion
//     let rank = 'Beginner';
//     if (completion >= 90) rank = 'Grandmaster';
//     else if (completion >= 70) rank = 'Expert';
//     else if (completion >= 50) rank = 'Advanced';
//     else if (completion >= 25) rank = 'Intermediate';

//     return { totalCompleted, totalProblems, completion, sheetsCompleted, averageCompletion: Math.round(averageCompletion), rank };
//   };

//   const stats = calculateOverallStats();

//   // Get most active sheet
//   const getMostActiveSheet = () => {
//     if (sheets.length === 0 || Object.keys(progress).length === 0) return null;

//     let maxCompletedProblems = 0;
//     let mostActiveSheetId = '';

//     Object.entries(progress).forEach(([sheetId, prog]) => {
//       if (prog.completedProblemIds.length > maxCompletedProblems) {
//         maxCompletedProblems = prog.completedProblemIds.length;
//         mostActiveSheetId = sheetId;
//       }
//     });

//     return sheets.find(sheet => sheet._id === mostActiveSheetId) || null;
//   };

//   const mostActiveSheet = getMostActiveSheet();

//   // Enhanced achievements system
//   const achievements: Achievement[] = [
//     {
//       id: 1,
//       title: "First Steps",
//       description: "Solved your first problem",
//       icon: <CheckCircle className="h-5 w-5" />,
//       unlocked: stats.totalCompleted > 0,
//       category: 'progress',
//       rarity: 'common'
//     },
//     {
//       id: 2,
//       title: "Consistency King",
//       description: "Maintained a 7-day streak",
//       icon: <Flame className="h-5 w-5" />,
//       unlocked: streak >= 7,
//       category: 'consistency',
//       rarity: 'rare'
//     },
//     {
//       id: 3,
//       title: "Sheet Conqueror",
//       description: "Completed your first sheet",
//       icon: <Trophy className="h-5 w-5" />,
//       unlocked: stats.sheetsCompleted > 0,
//       category: 'progress',
//       rarity: 'common'
//     },
//     {
//       id: 4,
//       title: "Problem Solver",
//       description: "Solved 25+ problems",
//       icon: <Target className="h-5 w-5" />,
//       unlocked: stats.totalCompleted >= 25,
//       category: 'progress',
//       rarity: 'common'
//     },
//     {
//       id: 5,
//       title: "Algorithm Master",
//       description: "Achieved 50%+ completion",
//       icon: <Brain className="h-5 w-5" />,
//       unlocked: stats.completion >= 50,
//       category: 'mastery',
//       rarity: 'rare'
//     },
//     {
//       id: 6,
//       title: "DSA Legend",
//       description: "Achieved 90%+ completion",
//       icon: <Crown className="h-5 w-5" />,
//       unlocked: stats.completion >= 90,
//       category: 'mastery',
//       rarity: 'legendary'
//     },
//     {
//       id: 7,
//       title: "Speed Demon",
//       description: "Solved 10 problems in one day",
//       icon: <Zap className="h-5 w-5" />,
//       unlocked: Math.random() > 0.7, // Mock condition
//       category: 'special',
//       rarity: 'epic'
//     },
//     {
//       id: 8,
//       title: "Night Owl",
//       description: "Solved problems after midnight",
//       icon: <Coffee className="h-5 w-5" />,
//       unlocked: Math.random() > 0.8, // Mock condition
//       category: 'special',
//       rarity: 'rare'
//     }
//   ];

//   // Get rarity color
//   const getRarityColor = (rarity: string) => {
//     switch (rarity) {
//       case 'common': return 'text-gray-500 border-gray-500/30 bg-gray-500/10';
//       case 'rare': return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
//       case 'epic': return 'text-purple-500 border-purple-500/30 bg-purple-500/10';
//       case 'legendary': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
//       default: return 'text-gray-500 border-gray-500/30 bg-gray-500/10';
//     }
//   };

//   // Social links with enhanced display
//   const socialLinks = [
//     {
//       name: 'GitHub',
//       icon: <Github size={20} />,
//       url: user?.socialLinks?.github,
//       color: 'hover:bg-gray-100 dark:hover:bg-gray-800'
//     },
//     {
//       name: 'Twitter',
//       icon: <Twitter size={20} />,
//       url: user?.socialLinks?.twitter,
//       color: 'hover:bg-blue-50 dark:hover:bg-blue-950'
//     },
//     {
//       name: 'LinkedIn',
//       icon: <Linkedin size={20} />,
//       url: user?.socialLinks?.linkedin,
//       color: 'hover:bg-blue-50 dark:hover:bg-blue-950'
//     },
//     {
//       name: 'Website',
//       icon: <Globe size={20} />,
//       url: user?.socialLinks?.personalSite,
//       color: 'hover:bg-green-50 dark:hover:bg-green-950'
//     }
//   ];

//   const copyProfileUrl = () => {
//     navigator.clipboard.writeText(window.location.href);
//     // You could add a toast notification here
//   };

//   return (
//     <ProtectedRoute>
//       <div className="max-w-7xl mx-auto p-4 space-y-6">
//         {/* Enhanced Header Section */}
//         <div className="relative">
//           {/* Dynamic background banner */}
//           <div className="relative h-48 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 overflow-hidden">
//             <div className="absolute inset-0 bg-black/20"></div>
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
//             {/* Decorative elements */}
//             <div className="absolute top-4 right-4 opacity-20">
//               <Code size={32} />
//             </div>
//             <div className="absolute bottom-4 left-4 opacity-20">
//               <Trophy size={28} />
//             </div>
//           </div>

//           {/* Profile Card */}
//           <Card className="relative -mt-20 mx-4 border-2 shadow-xl">
//             <CardContent className="p-6">
//               <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
//                 {/* Avatar and basic info */}
//                 <div className="flex items-center gap-6">
//                   <div className="relative">
//                     <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
//                       <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
//                       <AvatarFallback className="text-3xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
//                         {user?.name?.charAt(0).toUpperCase() || 'U'}
//                       </AvatarFallback>
//                     </Avatar>
//                     {/* Status indicator */}
//                     <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-background rounded-full flex items-center justify-center">
//                       <div className="w-3 h-3 bg-white rounded-full"></div>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex items-center gap-3">
//                       <h1 className="text-3xl font-bold">{user?.name}</h1>
//                       {user?.role === 'admin' && (
//                         <Shield className="w-6 h-6 text-blue-500" />
//                       )}
//                     </div>
//                     <div className="flex items-center gap-2 text-muted-foreground">
//                       <Mail size={16} />
//                       <span>{user?.email}</span>
//                     </div>
//                     {user?.location && (
//                       <div className="flex items-center gap-2 text-muted-foreground">
//                         <MapPin size={16} />
//                         <span>{user.location}</span>
//                       </div>
//                     )}
//                     <p className="text-muted-foreground max-w-md">
//                       {user?.bio || "Passionate about data structures and algorithms. Always learning, always coding."}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Actions and Social Links */}
//                 <div className="flex flex-col gap-4 lg:ml-auto">
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       onClick={() => setIsEditMode(!isEditMode)}
//                       className="flex items-center gap-2"
//                     >
//                       <Pencil size={16} />
//                       Edit Profile
//                     </Button>
//                     <Button variant="outline" size="icon" onClick={copyProfileUrl}>
//                       <Share2 size={16} />
//                     </Button>
//                   </div>

//                   {/* Enhanced Social Links */}
//                   <div className="flex gap-2">
//                     {socialLinks.map(social => (
//                       social.url && (
//                         <a
//                           key={social.name}
//                           href={social.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className={`p-3 rounded-lg border transition-colors ${social.color} group`}
//                           title={social.name}
//                         >
//                           <div className="transition-transform group-hover:scale-110">
//                             {social.icon}
//                           </div>
//                         </a>
//                       )
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Enhanced Badges */}
//               <div className="flex flex-wrap gap-2 mt-6">
//                 <Badge className={getRarityColor(stats.rank.toLowerCase())} variant="outline">
//                   <Crown size={14} className="mr-1" />
//                   {stats.rank}
//                 </Badge>
//                 {user?.role === 'admin' && (
//                   <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
//                     <Shield size={14} className="mr-1" />
//                     Admin
//                   </Badge>
//                 )}
//                 <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
//                   <Code size={14} className="mr-1" />
//                   DSA Enthusiast
//                 </Badge>
//                 {streak >= 7 && (
//                   <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
//                     <Flame size={14} className="mr-1" />
//                     {streak} day streak
//                   </Badge>
//                 )}
//                 {stats.completion >= 50 && (
//                   <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
//                     <TrendingUp size={14} className="mr-1" />
//                     Active Learner
//                   </Badge>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Enhanced Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//           <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
//             <CardContent className="p-4 text-center">
//               <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
//               <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalCompleted}</div>
//               <div className="text-xs text-blue-600 dark:text-blue-400">Problems Solved</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
//             <CardContent className="p-4 text-center">
//               <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
//               <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.completion}%</div>
//               <div className="text-xs text-green-600 dark:text-green-400">Overall Progress</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
//             <CardContent className="p-4 text-center">
//               <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-600" />
//               <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.sheetsCompleted}</div>
//               <div className="text-xs text-purple-600 dark:text-purple-400">Sheets Completed</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
//             <CardContent className="p-4 text-center">
//               <Flame className="w-8 h-8 mx-auto mb-2 text-orange-600" />
//               <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{streak}</div>
//               <div className="text-xs text-orange-600 dark:text-orange-400">Day Streak</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
//             <CardContent className="p-4 text-center">
//               <Medal className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
//               <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{achievements.filter(a => a.unlocked).length}</div>
//               <div className="text-xs text-yellow-600 dark:text-yellow-400">Achievements</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
//             <CardContent className="p-4 text-center">
//               <Clock className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
//               <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{totalTimeSpent}h</div>
//               <div className="text-xs text-indigo-600 dark:text-indigo-400">Time Spent</div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Content */}
//         {isEditMode ? (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>Edit Your Profile</span>
//                 <Button variant="ghost" size="sm" onClick={() => setIsEditMode(false)}>
//                   Cancel
//                 </Button>
//               </CardTitle>
//               <CardDescription>
//                 Update your personal information, bio, and social links
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <EditProfileForm />
//             </CardContent>
//           </Card>
//         ) : (
//           <Tabs defaultValue="overview" className="space-y-6">
//             <TabsList className="grid w-full grid-cols-4">
//               <TabsTrigger value="overview" className="flex items-center gap-2">
//                 <Activity size={16} />
//                 Overview
//               </TabsTrigger>
//               <TabsTrigger value="progress" className="flex items-center gap-2">
//                 <TrendingUp size={16} />
//                 Progress
//               </TabsTrigger>
//               <TabsTrigger value="achievements" className="flex items-center gap-2">
//                 <Trophy size={16} />
//                 Achievements
//               </TabsTrigger>
//               <TabsTrigger value="analytics" className="flex items-center gap-2">
//                 <Activity size={16} />
//                 Analytics
//               </TabsTrigger>
//             </TabsList>

//             {/* Overview Tab */}
//             <TabsContent value="overview" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Activity Summary */}
//                 <Card className="lg:col-span-2">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Activity className="w-5 h-5" />
//                       Activity Summary
//                     </CardTitle>
//                     <CardDescription>Your recent progress and activity</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <div className="flex justify-center py-8">
//                         <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//                       </div>
//                     ) : sheets.length === 0 ? (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
//                         <p>No problem sheets available</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-6">
//                         {/* Most Active Sheet */}
//                         {mostActiveSheet && (
//                           <div>
//                             <h3 className="font-medium mb-3 flex items-center gap-2">
//                               <Star className="w-4 h-4 text-yellow-500" />
//                               Most Active Sheet
//                             </h3>
//                             <Card className="bg-gradient-to-r from-accent/50 to-accent/30 border-accent">
//                               <CardContent className="p-4">
//                                 <div className="flex justify-between items-start mb-3">
//                                   <div>
//                                     <h4 className="font-semibold">{mostActiveSheet.title}</h4>
//                                     <p className="text-sm text-muted-foreground mt-1">
//                                       {mostActiveSheet.description.substring(0, 100)}...
//                                     </p>
//                                   </div>
//                                   <Badge className="bg-primary/10 text-primary border-primary/30">
//                                     {getCompletionPercentage(mostActiveSheet._id, mostActiveSheet.totalProblems)}% Complete
//                                   </Badge>
//                                 </div>
//                                 <Progress
//                                   value={getCompletionPercentage(mostActiveSheet._id, mostActiveSheet.totalProblems)}
//                                   className="mb-3"
//                                 />
//                                 <div className="flex justify-between items-center">
//                                   <span className="text-sm text-muted-foreground">
//                                     {progress[mostActiveSheet._id]?.completedProblemIds.length || 0} / {mostActiveSheet.totalProblems} problems
//                                   </span>
//                                   <Button asChild size="sm">
//                                     <Link href={`/sheets/${mostActiveSheet._id}`}>
//                                       Continue Learning
//                                     </Link>
//                                   </Button>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           </div>
//                         )}

//                         {/* Recent Progress */}
//                         <div>
//                           <h3 className="font-medium mb-3 flex items-center gap-2">
//                             <TrendingUp className="w-4 h-4 text-green-500" />
//                             Your Progress
//                           </h3>
//                           <div className="space-y-3">
//                             {sheets.slice(0, 5).map(sheet => {
//                               const completionPercentage = getCompletionPercentage(sheet._id, sheet.totalProblems);
//                               return (
//                                 <div key={sheet._id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
//                                   <div className="flex items-center gap-3">
//                                     <div className={`p-2 rounded-md ${completionPercentage === 100 ? 'bg-green-500/20 text-green-600' :
//                                         completionPercentage >= 50 ? 'bg-blue-500/20 text-blue-600' :
//                                           'bg-orange-500/20 text-orange-600'
//                                       }`}>
//                                       <Code size={16} />
//                                     </div>
//                                     <div>
//                                       <span className="font-medium text-sm">{sheet.title}</span>
//                                       <div className="text-xs text-muted-foreground">
//                                         {progress[sheet._id]?.completedProblemIds.length || 0} / {sheet.totalProblems} problems
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <Badge variant={completionPercentage === 100 ? "default" : "outline"}>
//                                     {completionPercentage}%
//                                   </Badge>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Achievements and Quick Stats */}
//                 <div className="space-y-6">
//                   {/* Recent Achievements */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2">
//                         <Trophy className="w-5 h-5 text-yellow-500" />
//                         Recent Achievements
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-3">
//                         {achievements.filter(a => a.unlocked).slice(0, 4).map(achievement => (
//                           <div key={achievement.id} className={`flex items-center p-3 rounded-lg border ${getRarityColor(achievement.rarity)}`}>
//                             <div className="p-2 bg-background rounded-full mr-3">
//                               {achievement.icon}
//                             </div>
//                             <div>
//                               <span className="font-medium text-sm">{achievement.title}</span>
//                               <p className="text-xs text-muted-foreground">{achievement.description}</p>
//                             </div>
//                           </div>
//                         ))}

//                         {achievements.filter(a => a.unlocked).length === 0 && (
//                           <div className="text-center py-6 text-muted-foreground">
//                             <Trophy size={32} className="mx-auto mb-2 opacity-50" />
//                             <p className="text-sm">Start solving problems to unlock achievements!</p>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                     <CardFooter>
//                       <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab('achievements')}>
//                         View All Achievements
//                       </Button>
//                     </CardFooter>
//                   </Card>

//                   {/* Quick Stats */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2">
//                         <Sparkles className="w-5 h-5 text-purple-500" />
//                         Quick Stats
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-3">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-muted-foreground">Average Completion</span>
//                         <span className="font-semibold">{stats.averageCompletion}%</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-muted-foreground">Current Rank</span>
//                         <Badge variant="outline" className={getRarityColor(stats.rank.toLowerCase())}>
//                           {stats.rank}
//                         </Badge>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-muted-foreground">Total Sheets</span>
//                         <span className="font-semibold">{sheets.length}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-muted-foreground">Join Date</span>
//                         <span className="font-semibold text-sm">
//                           {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
//                         </span>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </TabsContent>

//             {/* Progress Tab */}
//             <TabsContent value="progress" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                 <Card className="lg:col-span-3">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <TrendingUp className="w-5 h-5" />
//                       Detailed Progress
//                     </CardTitle>
//                     <CardDescription>Complete overview of your progress across all sheets</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <div className="flex justify-center py-8">
//                         <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//                       </div>
//                     ) : sheets.length === 0 ? (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
//                         <p>No problem sheets available</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-6">
//                         {sheets.map(sheet => {
//                           const completionPercentage = getCompletionPercentage(sheet._id, sheet.totalProblems);
//                           const completed = progress[sheet._id]?.completedProblemIds.length || 0;

//                           return (
//                             <Card key={sheet._id} className="bg-accent/20">
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                                   <div className="flex-1">
//                                     <div className="flex items-center gap-3 mb-2">
//                                       <div className={`p-2 rounded-md ${completionPercentage === 100 ? 'bg-green-500/20 text-green-600' :
//                                           completionPercentage >= 50 ? 'bg-blue-500/20 text-blue-600' :
//                                             'bg-orange-500/20 text-orange-600'
//                                         }`}>
//                                         <Code size={16} />
//                                       </div>
//                                       <div>
//                                         <h3 className="font-semibold">{sheet.title}</h3>
//                                         <p className="text-sm text-muted-foreground">
//                                           {sheet.description.substring(0, 100)}...
//                                         </p>
//                                       </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                       <div className="flex justify-between text-sm">
//                                         <span className="text-muted-foreground">
//                                           {completed} / {sheet.totalProblems} problems solved
//                                         </span>
//                                         <span className="font-medium">{completionPercentage}%</span>
//                                       </div>
//                                       <Progress value={completionPercentage} className="h-2" />
//                                     </div>
//                                   </div>

//                                   <div className="flex items-center gap-2">
//                                     {completionPercentage === 100 && (
//                                       <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
//                                         <CheckCircle size={14} className="mr-1" />
//                                         Completed
//                                       </Badge>
//                                     )}
//                                     <Button asChild variant="outline" size="sm">
//                                       <Link href={`/sheets/${sheet._id}`}>
//                                         {completionPercentage === 100 ? 'Review' : 'Continue'}
//                                       </Link>
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Progress Summary */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Activity className="w-5 h-5" />
//                       Summary
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="text-center">
//                       <div className="text-3xl font-bold text-primary mb-1">{stats.completion}%</div>
//                       <div className="text-sm text-muted-foreground">Overall Progress</div>
//                     </div>

//                     <Separator />

//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-sm">Problems Solved</span>
//                         <span className="font-semibold">{stats.totalCompleted}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm">Total Problems</span>
//                         <span className="font-semibold">{stats.totalProblems}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm">Sheets Completed</span>
//                         <span className="font-semibold">{stats.sheetsCompleted}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm">Current Streak</span>
//                         <span className="font-semibold flex items-center gap-1">
//                           <Flame size={14} className="text-orange-500" />
//                           {streak} days
//                         </span>
//                       </div>
//                     </div>

//                     <Separator />

//                     <div className="text-center">
//                       <div className="text-lg font-semibold mb-1">{stats.rank}</div>
//                       <div className="text-xs text-muted-foreground">Current Rank</div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             {/* Achievements Tab */}
//             <TabsContent value="achievements" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                 <Card className="lg:col-span-3">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Trophy className="w-5 h-5 text-yellow-500" />
//                       Your Achievements
//                     </CardTitle>
//                     <CardDescription>
//                       {achievements.filter(a => a.unlocked).length} of {achievements.length} achievements unlocked
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {achievements.map(achievement => (
//                         <Card
//                           key={achievement.id}
//                           className={`transition-all duration-200 ${achievement.unlocked
//                               ? `${getRarityColor(achievement.rarity)} border-2`
//                               : 'bg-muted/30 opacity-60 border-dashed'
//                             }`}
//                         >
//                           <CardContent className="p-4">
//                             <div className="flex items-start gap-3">
//                               <div className={`p-3 rounded-full ${achievement.unlocked
//                                   ? 'bg-background shadow-sm'
//                                   : 'bg-muted'
//                                 }`}>
//                                 {achievement.icon}
//                               </div>
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-2 mb-1">
//                                   <h4 className="font-semibold">{achievement.title}</h4>
//                                   <Badge
//                                     variant="outline"
//                                     className={`text-xs ${getRarityColor(achievement.rarity)}`}
//                                   >
//                                     {achievement.rarity}
//                                   </Badge>
//                                 </div>
//                                 <p className="text-sm text-muted-foreground mb-2">
//                                   {achievement.description}
//                                 </p>
//                                 <div className="flex items-center gap-2">
//                                   <Badge variant="outline" className="text-xs">
//                                     {achievement.category}
//                                   </Badge>
//                                   {achievement.unlocked && (
//                                     <div className="flex items-center gap-1 text-xs text-green-600">
//                                       <CheckCircle size={12} />
//                                       Unlocked
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Achievement Stats */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Medal className="w-5 h-5" />
//                       Statistics
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="text-center">
//                       <div className="text-2xl font-bold mb-1">
//                         {achievements.filter(a => a.unlocked).length}/{achievements.length}
//                       </div>
//                       <div className="text-sm text-muted-foreground">Achievements Unlocked</div>
//                     </div>

//                     <Progress
//                       value={(achievements.filter(a => a.unlocked).length / achievements.length) * 100}
//                       className="h-2"
//                     />

//                     <Separator />

//                     <div className="space-y-3">
//                       {['common', 'rare', 'epic', 'legendary'].map(rarity => {
//                         const totalByRarity = achievements.filter(a => a.rarity === rarity).length;
//                         const unlockedByRarity = achievements.filter(a => a.rarity === rarity && a.unlocked).length;

//                         return (
//                           <div key={rarity} className="flex justify-between items-center">
//                             <Badge variant="outline" className={`text-xs ${getRarityColor(rarity)}`}>
//                               {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
//                             </Badge>
//                             <span className="text-sm font-medium">
//                               {unlockedByRarity}/{totalByRarity}
//                             </span>
//                           </div>
//                         );
//                       })}
//                     </div>

//                     <Separator />

//                     <div className="text-center">
//                       <div className="text-sm text-muted-foreground mb-2">Next Achievement</div>
//                       {achievements.find(a => !a.unlocked) ? (
//                         <div className="p-2 bg-muted/50 rounded-lg">
//                           <div className="text-sm font-medium">
//                             {achievements.find(a => !a.unlocked)?.title}
//                           </div>
//                           <div className="text-xs text-muted-foreground">
//                             {achievements.find(a => !a.unlocked)?.description}
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="text-sm text-green-600 font-medium">
//                           All achievements unlocked! 🎉
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             {/* Analytics Tab */}
//             <TabsContent value="analytics" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Activity Heatmap Placeholder */}
//                 <Card className="lg:col-span-2">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Activity className="w-5 h-5" />
//                       Activity Overview
//                     </CardTitle>
//                     <CardDescription>Your coding activity over time</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-center py-12 text-muted-foreground">
//                       <Activity size={48} className="mx-auto mb-4 opacity-50" />
//                       <h3 className="text-lg font-medium mb-2">Activity Analytics</h3>
//                       <p className="text-sm">
//                         Track your daily coding activity, problem-solving patterns, and progress trends.
//                       </p>
//                       <p className="text-xs mt-2 opacity-75">
//                         This feature will show your activity heatmap, best solving times, and productivity insights.
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Performance Metrics */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <TrendingUp className="w-5 h-5" />
//                       Performance
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="text-center p-3 bg-accent/30 rounded-lg">
//                         <div className="text-lg font-bold text-blue-600">{Math.round(stats.averageCompletion)}%</div>
//                         <div className="text-xs text-muted-foreground">Avg Completion</div>
//                       </div>
//                       <div className="text-center p-3 bg-accent/30 rounded-lg">
//                         <div className="text-lg font-bold text-green-600">{streak}</div>
//                         <div className="text-xs text-muted-foreground">Best Streak</div>
//                       </div>
//                     </div>

//                     <Separator />

//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span>Consistency Score</span>
//                         <span className="font-medium">
//                           {streak >= 7 ? 'Excellent' : streak >= 3 ? 'Good' : 'Building'}
//                         </span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span>Problem Solving Rate</span>
//                         <span className="font-medium">
//                           {(stats.totalCompleted / Math.max(totalTimeSpent, 1)).toFixed(1)} problems/hour
//                         </span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span>Favorite Time</span>
//                         <span className="font-medium">Evening</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Goals */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Target className="w-5 h-5" />
//                       Goals & Milestones
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="space-y-3">
//                       <div className="p-3 border rounded-lg">
//                         <div className="flex justify-between items-center mb-2">
//                           <span className="text-sm font-medium">Complete 100 Problems</span>
//                           <span className="text-xs text-muted-foreground">
//                             {stats.totalCompleted}/100
//                           </span>
//                         </div>
//                         <Progress value={Math.min((stats.totalCompleted / 100) * 100, 100)} className="h-2" />
//                       </div>

//                       <div className="p-3 border rounded-lg">
//                         <div className="flex justify-between items-center mb-2">
//                           <span className="text-sm font-medium">Complete All Sheets</span>
//                           <span className="text-xs text-muted-foreground">
//                             {stats.sheetsCompleted}/{sheets.length}
//                           </span>
//                         </div>
//                         <Progress
//                           value={sheets.length > 0 ? (stats.sheetsCompleted / sheets.length) * 100 : 0}
//                           className="h-2"
//                         />
//                       </div>

//                       <div className="p-3 border rounded-lg">
//                         <div className="flex justify-between items-center mb-2">
//                           <span className="text-sm font-medium">30-Day Streak</span>
//                           <span className="text-xs text-muted-foreground">
//                             {streak}/30 days
//                           </span>
//                         </div>
//                         <Progress value={Math.min((streak / 30) * 100, 100)} className="h-2" />
//                       </div>
//                     </div>

//                     <Button variant="outline" size="sm" className="w-full">
//                       Set Custom Goals
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>
//           </Tabs>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// }



// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import ProtectedRoute from "@/components/auth/ProtectedRoute"
// import EditProfileForm from "@/components/profile/EditProfileForm"
// import { useAuth } from "@/contexts/AuthContext"
// import apiClient from "@/lib/api"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
// import { Separator } from "@/components/ui/separator"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { BarChart, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Bar, Line } from "recharts"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// import {
//   Pencil,
//   CheckCircle,
//   Calendar,
//   Github,
//   Twitter,
//   Linkedin,
//   Globe,
//   Code,
//   Trophy,
//   BookOpen,
//   Star,
//   Target,
//   TrendingUp,
//   Clock,
//   MapPin,
//   Mail,
//   Flame,
//   Zap,
//   Activity,
//   Coffee,
//   Brain,
//   Share2,
//   Medal,
//   Crown,
//   Shield,
//   Sparkles,
//   AlertCircle,
// } from "lucide-react"
// import Link from "next/link"
// import { cn } from "@/lib/utils"

// interface Sheet {
//   _id: string
//   title: string
//   description: string
//   totalProblems: number
//   difficulty?: "Easy" | "Medium" | "Hard"
//   category?: string
// }

// interface SheetProgress {
//   sheetId: string
//   completedProblemIds: string[]
//   lastAccessed?: string
//   timeSpent?: number // Time spent in seconds
// }

// interface Achievement {
//   id: number
//   title: string
//   description: string
//   icon: React.ReactNode
//   unlocked: boolean
//   unlockedAt?: string
//   category: "progress" | "consistency" | "mastery" | "special"
//   rarity: "common" | "rare" | "epic" | "legendary"
// }

// interface ActivityData {
//   date: string
//   problemsSolved: number
//   timeSpent: number // Time spent in minutes
//   sheetsWorkedOn: string[]
// }

// export default function ProfilePage() {
//   const { user } = useAuth()
//   const [activeTab, setActiveTab] = useState("overview")
//   const [isEditMode, setIsEditMode] = useState(false)
//   const [sheets, setSheets] = useState<Sheet[]>([])
//   const [progress, setProgress] = useState<Record<string, SheetProgress>>({})
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [streak, setStreak] = useState(0)
//   const [totalTimeSpent, setTotalTimeSpent] = useState(0)
//   const [activityData, setActivityData] = useState<ActivityData[]>([])
//   const [timeSpentByDay, setTimeSpentByDay] = useState<{ day: string; hours: number }[]>([])
//   const [timeSpentByCategory, setTimeSpentByCategory] = useState<{ category: string; hours: number }[]>([])
//   const [profileLinkCopied, setProfileLinkCopied] = useState(false)

//   // Fetch sheets on component mount
//   useEffect(() => {
//     const fetchSheets = async () => {
//       try {
//         setLoading(true)
//         const { data } = await apiClient.getAllSheets()
//         setSheets(data)
//       } catch (err: any) {
//         setError(err.response?.data?.error || "Failed to fetch sheets")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchSheets()
//   }, [])

//   // Fetch user progress for each sheet
//   useEffect(() => {
//     if (!user || sheets.length === 0) return

//     const fetchUserProgress = async () => {
//       try {
//         const userProgress: Record<string, SheetProgress> = {}
//         let totalTime = 0
//         let currentStreak = 0
//         const activityLog: ActivityData[] = []

//         // Fetch streak data
//         try {
//           const { data: streakData } = await apiClient.getUserStreak()
//           currentStreak = streakData.currentStreak || 0
//           setStreak(currentStreak)
//         } catch (error) {
//           console.error("Error fetching streak data:", error)
//         }

//         // Fetch activity data
//         try {
//           const { data: activityLog } = await apiClient.getUserActivity()
//           setActivityData(activityLog)

//           // Process time spent by day
//           const timeByDay = processTimeByDay(activityLog)
//           setTimeSpentByDay(timeByDay)

//           // Process time spent by category
//           const timeByCategory = processTimeByCategory(activityLog, sheets)
//           setTimeSpentByCategory(timeByCategory)
//         } catch (error) {
//           console.error("Error fetching activity data:", error)
//         }

//         for (const sheet of sheets) {
//           try {
//             const { data } = await apiClient.getProgress(sheet._id)
//             userProgress[sheet._id] = data

//             // Add time spent to total
//             if (data.timeSpent) {
//               totalTime += data.timeSpent
//             }
//           } catch (error) {
//             userProgress[sheet._id] = {
//               sheetId: sheet._id,
//               completedProblemIds: [],
//               timeSpent: 0,
//             }
//           }
//         }

//         setProgress(userProgress)

//         // Convert seconds to hours and set total time spent
//         setTotalTimeSpent(Math.round(totalTime / 3600))
//       } catch (err) {
//         console.error("Error fetching user progress:", err)
//       }
//     }

//     fetchUserProgress()
//   }, [user, sheets])

//   // Process time spent by day of week
//   const processTimeByDay = (activityData: ActivityData[]): { day: string; hours: number }[] => {
//     const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//     const timeByDay = days.map((day) => ({ day, hours: 0 }))

//     activityData.forEach((activity) => {
//       const date = new Date(activity.date)
//       const dayIndex = date.getDay()
//       timeByDay[dayIndex].hours += activity.timeSpent / 60 // Convert minutes to hours
//     })

//     return timeByDay
//   }

//   // Process time spent by category
//   const processTimeByCategory = (
//     activityData: ActivityData[],
//     sheets: Sheet[],
//   ): { category: string; hours: number }[] => {
//     const categories: Record<string, number> = {}

//     // Initialize categories
//     sheets.forEach((sheet) => {
//       if (sheet.category && !categories[sheet.category]) {
//         categories[sheet.category] = 0
//       }
//     })

//     // Map sheet IDs to categories
//     const sheetCategories: Record<string, string> = {}
//     sheets.forEach((sheet) => {
//       if (sheet.category) {
//         sheetCategories[sheet._id] = sheet.category
//       }
//     })

//     // Aggregate time by category
//     activityData.forEach((activity) => {
//       activity.sheetsWorkedOn.forEach((sheetId) => {
//         const category = sheetCategories[sheetId] || "Other"
//         if (!categories[category]) {
//           categories[category] = 0
//         }
//         categories[category] += activity.timeSpent / 60 // Convert minutes to hours
//       })
//     })

//     return Object.entries(categories).map(([category, hours]) => ({
//       category,
//       hours: Number.parseFloat(hours.toFixed(1)),
//     }))
//   }

//   // Calculate completion percentage for a sheet
//   const getCompletionPercentage = (sheetId: string, totalProblems: number) => {
//     const sheetProgress = progress[sheetId]
//     if (!sheetProgress || totalProblems === 0) return 0
//     return Math.round((sheetProgress.completedProblemIds.length / totalProblems) * 100)
//   }

//   // Calculate overall stats
//   const calculateOverallStats = () => {
//     if (!user || sheets.length === 0)
//       return {
//         totalCompleted: 0,
//         totalProblems: 0,
//         completion: 0,
//         sheetsCompleted: 0,
//         averageCompletion: 0,
//         rank: "Beginner",
//         problemsPerHour: 0,
//       }

//     const totalProblems = sheets.reduce((sum, sheet) => sum + sheet.totalProblems, 0)
//     const totalCompleted = Object.values(progress).reduce((sum, prog) => sum + prog.completedProblemIds.length, 0)

//     const completion = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0
//     const sheetsCompleted = sheets.filter(
//       (sheet) => getCompletionPercentage(sheet._id, sheet.totalProblems) === 100,
//     ).length

//     const averageCompletion =
//       sheets.length > 0
//         ? sheets.reduce((sum, sheet) => sum + getCompletionPercentage(sheet._id, sheet.totalProblems), 0) /
//         sheets.length
//         : 0

//     // Calculate problems per hour
//     const problemsPerHour = totalTimeSpent > 0 ? Number.parseFloat((totalCompleted / totalTimeSpent).toFixed(1)) : 0

//     // Determine rank based on completion
//     let rank = "Beginner"
//     if (completion >= 90) rank = "Grandmaster"
//     else if (completion >= 70) rank = "Expert"
//     else if (completion >= 50) rank = "Advanced"
//     else if (completion >= 25) rank = "Intermediate"

//     return {
//       totalCompleted,
//       totalProblems,
//       completion,
//       sheetsCompleted,
//       averageCompletion: Math.round(averageCompletion),
//       rank,
//       problemsPerHour,
//     }
//   }

//   const stats = calculateOverallStats()

//   // Get most active sheet
//   const getMostActiveSheet = () => {
//     if (sheets.length === 0 || Object.keys(progress).length === 0) return null

//     let maxCompletedProblems = 0
//     let mostActiveSheetId = ""

//     Object.entries(progress).forEach(([sheetId, prog]) => {
//       if (prog.completedProblemIds.length > maxCompletedProblems) {
//         maxCompletedProblems = prog.completedProblemIds.length
//         mostActiveSheetId = sheetId
//       }
//     })

//     return sheets.find((sheet) => sheet._id === mostActiveSheetId) || null
//   }

//   const mostActiveSheet = getMostActiveSheet()

//   // Enhanced achievements system
//   const achievements: Achievement[] = [
//     {
//       id: 1,
//       title: "First Steps",
//       description: "Solved your first problem",
//       icon: <CheckCircle className="h-5 w-5" />,
//       unlocked: stats.totalCompleted > 0,
//       unlockedAt: stats.totalCompleted > 0 ? "2023-05-15" : undefined,
//       category: "progress",
//       rarity: "common",
//     },
//     {
//       id: 2,
//       title: "Consistency King",
//       description: "Maintained a 7-day streak",
//       icon: <Flame className="h-5 w-5" />,
//       unlocked: streak >= 7,
//       unlockedAt: streak >= 7 ? "2023-06-22" : undefined,
//       category: "consistency",
//       rarity: "rare",
//     },
//     {
//       id: 3,
//       title: "Sheet Conqueror",
//       description: "Completed your first sheet",
//       icon: <Trophy className="h-5 w-5" />,
//       unlocked: stats.sheetsCompleted > 0,
//       unlockedAt: stats.sheetsCompleted > 0 ? "2023-07-10" : undefined,
//       category: "progress",
//       rarity: "common",
//     },
//     {
//       id: 4,
//       title: "Problem Solver",
//       description: "Solved 25+ problems",
//       icon: <Target className="h-5 w-5" />,
//       unlocked: stats.totalCompleted >= 25,
//       unlockedAt: stats.totalCompleted >= 25 ? "2023-08-05" : undefined,
//       category: "progress",
//       rarity: "common",
//     },
//     {
//       id: 5,
//       title: "Algorithm Master",
//       description: "Achieved 50%+ completion",
//       icon: <Brain className="h-5 w-5" />,
//       unlocked: stats.completion >= 50,
//       unlockedAt: stats.completion >= 50 ? "2023-09-18" : undefined,
//       category: "mastery",
//       rarity: "rare",
//     },
//     {
//       id: 6,
//       title: "DSA Legend",
//       description: "Achieved 90%+ completion",
//       icon: <Crown className="h-5 w-5" />,
//       unlocked: stats.completion >= 90,
//       unlockedAt: stats.completion >= 90 ? "2023-11-30" : undefined,
//       category: "mastery",
//       rarity: "legendary",
//     },
//     {
//       id: 7,
//       title: "Speed Demon",
//       description: "Solved 10 problems in one day",
//       icon: <Zap className="h-5 w-5" />,
//       unlocked: activityData.some((data) => data.problemsSolved >= 10),
//       unlockedAt: activityData.some((data) => data.problemsSolved >= 10) ? "2023-10-12" : undefined,
//       category: "special",
//       rarity: "epic",
//     },
//     {
//       id: 8,
//       title: "Night Owl",
//       description: "Solved problems after midnight",
//       icon: <Coffee className="h-5 w-5" />,
//       unlocked: activityData.some((data) => {
//         const hour = new Date(data.date).getHours()
//         return hour >= 0 && hour < 5
//       }),
//       unlockedAt: activityData.some((data) => {
//         const hour = new Date(data.date).getHours()
//         return hour >= 0 && hour < 5
//       })
//         ? "2023-12-05"
//         : undefined,
//       category: "special",
//       rarity: "rare",
//     },
//   ]

//   // Get rarity color
//   const getRarityColor = (rarity: string) => {
//     switch (rarity) {
//       case "common":
//         return "text-gray-500 border-gray-500/30 bg-gray-500/10"
//       case "rare":
//         return "text-blue-500 border-blue-500/30 bg-blue-500/10"
//       case "epic":
//         return "text-purple-500 border-purple-500/30 bg-purple-500/10"
//       case "legendary":
//         return "text-yellow-500 border-yellow-500/30 bg-yellow-500/10"
//       default:
//         return "text-gray-500 border-gray-500/30 bg-gray-500/10"
//     }
//   }

//   // Social links with enhanced display
//   const socialLinks = [
//     {
//       name: "GitHub",
//       icon: <Github size={20} />,
//       url: user?.socialLinks?.github,
//       color: "hover:bg-gray-100 dark:hover:bg-gray-800",
//     },
//     {
//       name: "Twitter",
//       icon: <Twitter size={20} />,
//       url: user?.socialLinks?.twitter,
//       color: "hover:bg-blue-50 dark:hover:bg-blue-950",
//     },
//     {
//       name: "LinkedIn",
//       icon: <Linkedin size={20} />,
//       url: user?.socialLinks?.linkedin,
//       color: "hover:bg-blue-50 dark:hover:bg-blue-950",
//     },
//     {
//       name: "Website",
//       icon: <Globe size={20} />,
//       url: user?.socialLinks?.personalSite,
//       color: "hover:bg-green-50 dark:hover:bg-green-950",
//     },
//   ]

//   const copyProfileUrl = () => {
//     navigator.clipboard.writeText(window.location.href)
//     setProfileLinkCopied(true)
//     setTimeout(() => setProfileLinkCopied(false), 2000)
//   }

//   // Format time for display (converts seconds to hours:minutes)
//   const formatTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600)
//     const minutes = Math.floor((seconds % 3600) / 60)
//     return `${hours}h ${minutes}m`
//   }

//   // Get last 7 days activity data for chart
//   const getLast7DaysActivity = () => {
//     const last7Days = []
//     const today = new Date()

//     for (let i = 6; i >= 0; i--) {
//       const date = new Date(today)
//       date.setDate(date.getDate() - i)
//       const dateString = date.toISOString().split("T")[0]

//       const activityForDay = activityData.find((a) => a.date.includes(dateString))

//       last7Days.push({
//         date: dateString,
//         problems: activityForDay?.problemsSolved || 0,
//         time: activityForDay ? Math.round(activityForDay.timeSpent / 60) : 0, // Convert minutes to hours
//       })
//     }

//     return last7Days
//   }

//   return (
//     <ProtectedRoute>
//       <div className="max-w-7xl mx-auto p-4 space-y-6">
//         {/* Enhanced Header Section */}
//         <div className="relative">
//           {/* Dynamic background banner */}
//           <div className="relative h-48 md:h-64 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 overflow-hidden">
//             <div className="absolute inset-0 bg-black/20"></div>
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
//             {/* Decorative elements */}
//             <div className="absolute top-4 right-4 opacity-20">
//               <Code size={32} />
//             </div>
//             <div className="absolute bottom-4 left-4 opacity-20">
//               <Trophy size={28} />
//             </div>

//             {/* Animated particles */}
//             <div className="absolute inset-0 overflow-hidden">
//               {Array.from({ length: 20 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="absolute rounded-full bg-white/10"
//                   style={{
//                     width: `${Math.random() * 10 + 5}px`,
//                     height: `${Math.random() * 10 + 5}px`,
//                     top: `${Math.random() * 100}%`,
//                     left: `${Math.random() * 100}%`,
//                     animation: `float ${Math.random() * 10 + 10}s linear infinite`,
//                     opacity: Math.random() * 0.5 + 0.2,
//                   }}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Profile Card */}
//           <Card className="relative -mt-20 mx-4 border-2 shadow-xl">
//             <CardContent className="p-6">
//               <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
//                 {/* Avatar and basic info */}
//                 <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//                   <div className="relative">
//                     <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
//                       <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} alt={user?.name || "User"} />
//                       <AvatarFallback className="text-3xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
//                         {user?.name?.charAt(0).toUpperCase() || "U"}
//                       </AvatarFallback>
//                     </Avatar>
//                     {/* Status indicator */}
//                     <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-background rounded-full flex items-center justify-center">
//                       <div className="w-3 h-3 bg-white rounded-full"></div>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex items-center gap-3">
//                       <h1 className="text-2xl md:text-3xl font-bold">{user?.name || "User Name"}</h1>
//                       {user?.role === "admin" && (
//                         <TooltipProvider>
//                           <Tooltip>
//                             <TooltipTrigger>
//                               <Shield className="w-6 h-6 text-blue-500" />
//                             </TooltipTrigger>
//                             <TooltipContent>
//                               <p>Admin</p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </TooltipProvider>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-2 text-muted-foreground">
//                       <Mail size={16} />
//                       <span>{user?.email || "user@example.com"}</span>
//                     </div>
//                     {user?.location && (
//                       <div className="flex items-center gap-2 text-muted-foreground">
//                         <MapPin size={16} />
//                         <span>{user.location}</span>
//                       </div>
//                     )}
//                     <p className="text-muted-foreground max-w-md">
//                       {user?.bio || "Passionate about data structures and algorithms. Always learning, always coding."}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Actions and Social Links */}
//                 <div className="flex flex-col gap-4 lg:ml-auto w-full lg:w-auto">
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       onClick={() => setIsEditMode(!isEditMode)}
//                       className="flex items-center gap-2"
//                     >
//                       <Pencil size={16} />
//                       Edit Profile
//                     </Button>
//                     <TooltipProvider>
//                       <Tooltip open={profileLinkCopied}>
//                         <TooltipTrigger asChild>
//                           <Button variant="outline" size="icon" onClick={copyProfileUrl}>
//                             <Share2 size={16} />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>Profile link copied!</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   </div>

//                   {/* Enhanced Social Links */}
//                   <div className="flex gap-2">
//                     {socialLinks.map(
//                       (social) =>
//                         social.url && (
//                           <TooltipProvider key={social.name}>
//                             <Tooltip>
//                               <TooltipTrigger asChild>
//                                 <a
//                                   href={social.url}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className={`p-3 rounded-lg border transition-colors ${social.color} group`}
//                                 >
//                                   <div className="transition-transform group-hover:scale-110">{social.icon}</div>
//                                 </a>
//                               </TooltipTrigger>
//                               <TooltipContent>
//                                 <p>{social.name}</p>
//                               </TooltipContent>
//                             </Tooltip>
//                           </TooltipProvider>
//                         ),
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Enhanced Badges */}
//               <div className="flex flex-wrap gap-2 mt-6">
//                 <Badge className={getRarityColor(stats.rank.toLowerCase())} variant="outline">
//                   <Crown size={14} className="mr-1" />
//                   {stats.rank}
//                 </Badge>
//                 {user?.role === "admin" && (
//                   <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
//                     <Shield size={14} className="mr-1" />
//                     Admin
//                   </Badge>
//                 )}
//                 <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
//                   <Code size={14} className="mr-1" />
//                   DSA Enthusiast
//                 </Badge>
//                 {streak >= 7 && (
//                   <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
//                     <Flame size={14} className="mr-1" />
//                     {streak} day streak
//                   </Badge>
//                 )}
//                 {stats.completion >= 50 && (
//                   <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
//                     <TrendingUp size={14} className="mr-1" />
//                     Active Learner
//                   </Badge>
//                 )}
//                 {totalTimeSpent >= 50 && (
//                   <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/30">
//                     <Clock size={14} className="mr-1" />
//                     {totalTimeSpent}+ hours
//                   </Badge>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Enhanced Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//           <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
//             <CardContent className="p-4 text-center">
//               <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
//               <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
//                 {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : stats.totalCompleted}
//               </div>
//               <div className="text-xs text-blue-600 dark:text-blue-400">Problems Solved</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
//             <CardContent className="p-4 text-center">
//               <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
//               <div className="text-2xl font-bold text-green-700 dark:text-green-300">
//                 {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : `${stats.completion}%`}
//               </div>
//               <div className="text-xs text-green-600 dark:text-green-400">Overall Progress</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
//             <CardContent className="p-4 text-center">
//               <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-600" />
//               <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
//                 {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : stats.sheetsCompleted}
//               </div>
//               <div className="text-xs text-purple-600 dark:text-purple-400">Sheets Completed</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
//             <CardContent className="p-4 text-center">
//               <Flame className="w-8 h-8 mx-auto mb-2 text-orange-600" />
//               <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
//                 {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : streak}
//               </div>
//               <div className="text-xs text-orange-600 dark:text-orange-400">Day Streak</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
//             <CardContent className="p-4 text-center">
//               <Medal className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
//               <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
//                 {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : achievements.filter((a) => a.unlocked).length}
//               </div>
//               <div className="text-xs text-yellow-600 dark:text-yellow-400">Achievements</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
//             <CardContent className="p-4 text-center">
//               <Clock className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
//               <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
//                 {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : `${totalTimeSpent}h`}
//               </div>
//               <div className="text-xs text-indigo-600 dark:text-indigo-400">Time Spent</div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Content */}
//         {isEditMode ? (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>Edit Your Profile</span>
//                 <Button variant="ghost" size="sm" onClick={() => setIsEditMode(false)}>
//                   Cancel
//                 </Button>
//               </CardTitle>
//               <CardDescription>Update your personal information, bio, and social links</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <EditProfileForm />
//             </CardContent>
//           </Card>
//         ) : (
//           <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
//             <TabsList className="grid w-full grid-cols-4">
//               <TabsTrigger value="overview" className="flex items-center gap-2">
//                 <Activity size={16} />
//                 Overview
//               </TabsTrigger>
//               <TabsTrigger value="progress" className="flex items-center gap-2">
//                 <TrendingUp size={16} />
//                 Progress
//               </TabsTrigger>
//               <TabsTrigger value="achievements" className="flex items-center gap-2">
//                 <Trophy size={16} />
//                 Achievements
//               </TabsTrigger>
//               <TabsTrigger value="analytics" className="flex items-center gap-2">
//                 <Activity size={16} />
//                 Analytics
//               </TabsTrigger>
//             </TabsList>

//             {/* Overview Tab */}
//             <TabsContent value="overview" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Activity Summary */}
//                 <Card className="lg:col-span-2">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Activity className="w-5 h-5" />
//                       Activity Summary
//                     </CardTitle>
//                     <CardDescription>Your recent progress and activity</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <div className="space-y-4">
//                         <Skeleton className="h-32 w-full" />
//                         <Skeleton className="h-24 w-full" />
//                         <Skeleton className="h-24 w-full" />
//                       </div>
//                     ) : sheets.length === 0 ? (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
//                         <p>No problem sheets available</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-6">
//                         {/* Recent Activity Chart */}
//                         <div>
//                           <h3 className="font-medium mb-3 flex items-center gap-2">
//                             <Activity className="w-4 h-4 text-blue-500" />
//                             Recent Activity
//                           </h3>
//                           <div className="h-64">
//                             <ChartContainer
//                               config={{
//                                 problems: {
//                                   label: "Problems Solved",
//                                   color: "hsl(var(--chart-1))",
//                                 },
//                                 time: {
//                                   label: "Hours Spent",
//                                   color: "hsl(var(--chart-2))",
//                                 },
//                               }}
//                             >
//                               <ResponsiveContainer width="100%" height="100%">
//                                 <BarChart data={getLast7DaysActivity()}>
//                                   <CartesianGrid strokeDasharray="3 3" />
//                                   <XAxis
//                                     dataKey="date"
//                                     tickFormatter={(value) => {
//                                       const date = new Date(value)
//                                       return date.toLocaleDateString("en-US", { weekday: "short" })
//                                     }}
//                                   />
//                                   <YAxis yAxisId="left" orientation="left" />
//                                   <YAxis yAxisId="right" orientation="right" />
//                                   <ChartTooltip content={<ChartTooltipContent />} />
//                                   <Legend />
//                                   <Bar
//                                     yAxisId="left"
//                                     dataKey="problems"
//                                     fill="var(--color-problems)"
//                                     name="Problems Solved"
//                                   />
//                                   <Bar yAxisId="right" dataKey="time" fill="var(--color-time)" name="Hours Spent" />
//                                 </BarChart>
//                               </ResponsiveContainer>
//                             </ChartContainer>
//                           </div>
//                         </div>

//                         {/* Most Active Sheet */}
//                         {mostActiveSheet && (
//                           <div>
//                             <h3 className="font-medium mb-3 flex items-center gap-2">
//                               <Star className="w-4 h-4 text-yellow-500" />
//                               Most Active Sheet
//                             </h3>
//                             <Card className="bg-gradient-to-r from-accent/50 to-accent/30 border-accent">
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-3">
//                                   <div>
//                                     <h4 className="font-semibold">{mostActiveSheet.title}</h4>
//                                     <p className="text-sm text-muted-foreground mt-1">
//                                       {mostActiveSheet.description.substring(0, 100)}...
//                                     </p>
//                                   </div>
//                                   <div className="flex flex-col items-end gap-1">
//                                     <Badge className="bg-primary/10 text-primary border-primary/30">
//                                       {getCompletionPercentage(mostActiveSheet._id, mostActiveSheet.totalProblems)}%
//                                       Complete
//                                     </Badge>
//                                     {progress[mostActiveSheet._id]?.timeSpent && (
//                                       <span className="text-xs text-muted-foreground">
//                                         Time spent: {formatTime(progress[mostActiveSheet._id]?.timeSpent || 0)}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                                 <Progress
//                                   value={getCompletionPercentage(mostActiveSheet._id, mostActiveSheet.totalProblems)}
//                                   className="mb-3"
//                                 />
//                                 <div className="flex justify-between items-center">
//                                   <span className="text-sm text-muted-foreground">
//                                     {progress[mostActiveSheet._id]?.completedProblemIds.length || 0} /{" "}
//                                     {mostActiveSheet.totalProblems} problems
//                                   </span>
//                                   <Button asChild size="sm">
//                                     <Link href={`/sheets/${mostActiveSheet._id}`}>Continue Learning</Link>
//                                   </Button>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           </div>
//                         )}

//                         {/* Recent Progress */}
//                         <div>
//                           <h3 className="font-medium mb-3 flex items-center gap-2">
//                             <TrendingUp className="w-4 h-4 text-green-500" />
//                             Your Progress
//                           </h3>
//                           <div className="space-y-3">
//                             {sheets.slice(0, 5).map((sheet) => {
//                               const completionPercentage = getCompletionPercentage(sheet._id, sheet.totalProblems)
//                               const sheetProgress = progress[sheet._id]

//                               return (
//                                 <div
//                                   key={sheet._id}
//                                   className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
//                                 >
//                                   <div className="flex items-center gap-3">
//                                     <div
//                                       className={`p-2 rounded-md ${completionPercentage === 100
//                                         ? "bg-green-500/20 text-green-600"
//                                         : completionPercentage >= 50
//                                           ? "bg-blue-500/20 text-blue-600"
//                                           : "bg-orange-500/20 text-orange-600"
//                                         }`}
//                                     >
//                                       <Code size={16} />
//                                     </div>
//                                     <div>
//                                       <span className="font-medium text-sm">{sheet.title}</span>
//                                       <div className="text-xs text-muted-foreground">
//                                         {sheetProgress?.completedProblemIds.length || 0} / {sheet.totalProblems}{" "}
//                                         problems
//                                       </div>
//                                       {sheetProgress?.lastAccessed && (
//                                         <div className="text-xs text-muted-foreground">
//                                           Last accessed: {new Date(sheetProgress.lastAccessed).toLocaleDateString()}
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                   <div className="flex flex-col items-end gap-1">
//                                     <Badge variant={completionPercentage === 100 ? "default" : "outline"}>
//                                       {completionPercentage}%
//                                     </Badge>
//                                     {sheetProgress?.timeSpent && (
//                                       <span className="text-xs text-muted-foreground">
//                                         {formatTime(sheetProgress.timeSpent)}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                               )
//                             })}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Achievements and Quick Stats */}
//                 <div className="space-y-6">
//                   {/* Recent Achievements */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2">
//                         <Trophy className="w-5 h-5 text-yellow-500" />
//                         Recent Achievements
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       {loading ? (
//                         <div className="space-y-3">
//                           <Skeleton className="h-16 w-full" />
//                           <Skeleton className="h-16 w-full" />
//                           <Skeleton className="h-16 w-full" />
//                         </div>
//                       ) : (
//                         <div className="space-y-3">
//                           {achievements
//                             .filter((a) => a.unlocked)
//                             .slice(0, 4)
//                             .map((achievement) => (
//                               <div
//                                 key={achievement.id}
//                                 className={`flex items-center p-3 rounded-lg border ${getRarityColor(achievement.rarity)}`}
//                               >
//                                 <div className="p-2 bg-background rounded-full mr-3">{achievement.icon}</div>
//                                 <div>
//                                   <span className="font-medium text-sm">{achievement.title}</span>
//                                   <p className="text-xs text-muted-foreground">{achievement.description}</p>
//                                   {achievement.unlockedAt && (
//                                     <p className="text-xs text-muted-foreground mt-1">
//                                       Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
//                             ))}

//                           {achievements.filter((a) => a.unlocked).length === 0 && (
//                             <div className="text-center py-6 text-muted-foreground">
//                               <Trophy size={32} className="mx-auto mb-2 opacity-50" />
//                               <p className="text-sm">Start solving problems to unlock achievements!</p>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </CardContent>
//                     <CardFooter>
//                       <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab("achievements")}>
//                         View All Achievements
//                       </Button>
//                     </CardFooter>
//                   </Card>

//                   {/* Quick Stats */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2">
//                         <Sparkles className="w-5 h-5 text-purple-500" />
//                         Quick Stats
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-3">
//                       {loading ? (
//                         <div className="space-y-3">
//                           <Skeleton className="h-6 w-full" />
//                           <Skeleton className="h-6 w-full" />
//                           <Skeleton className="h-6 w-full" />
//                           <Skeleton className="h-6 w-full" />
//                         </div>
//                       ) : (
//                         <>
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-muted-foreground">Average Completion</span>
//                             <span className="font-semibold">{stats.averageCompletion}%</span>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-muted-foreground">Current Rank</span>
//                             <Badge variant="outline" className={getRarityColor(stats.rank.toLowerCase())}>
//                               {stats.rank}
//                             </Badge>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-muted-foreground">Problems/Hour</span>
//                             <span className="font-semibold">{stats.problemsPerHour}</span>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-muted-foreground">Total Sheets</span>
//                             <span className="font-semibold">{sheets.length}</span>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-muted-foreground">Join Date</span>
//                             <span className="font-semibold text-sm">
//                               {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
//                             </span>
//                           </div>
//                         </>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </TabsContent>

//             {/* Progress Tab */}
//             <TabsContent value="progress" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                 <Card className="lg:col-span-3">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <TrendingUp className="w-5 h-5" />
//                       Detailed Progress
//                     </CardTitle>
//                     <CardDescription>Complete overview of your progress across all sheets</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <div className="space-y-4">
//                         <Skeleton className="h-32 w-full" />
//                         <Skeleton className="h-32 w-full" />
//                         <Skeleton className="h-32 w-full" />
//                       </div>
//                     ) : sheets.length === 0 ? (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
//                         <p>No problem sheets available</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-6">
//                         {sheets.map((sheet) => {
//                           const completionPercentage = getCompletionPercentage(sheet._id, sheet.totalProblems)
//                           const completed = progress[sheet._id]?.completedProblemIds.length || 0
//                           const timeSpent = progress[sheet._id]?.timeSpent || 0

//                           return (
//                             <Card
//                               key={sheet._id}
//                               className={cn(
//                                 "bg-accent/20 transition-all duration-300",
//                                 completionPercentage === 100 ? "border-green-500/50" : "",
//                               )}
//                             >
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                                   <div className="flex-1">
//                                     <div className="flex items-center gap-3 mb-2">
//                                       <div
//                                         className={`p-2 rounded-md ${completionPercentage === 100
//                                           ? "bg-green-500/20 text-green-600"
//                                           : completionPercentage >= 50
//                                             ? "bg-blue-500/20 text-blue-600"
//                                             : "bg-orange-500/20 text-orange-600"
//                                           }`}
//                                       >
//                                         <Code size={16} />
//                                       </div>
//                                       <div>
//                                         <h3 className="font-semibold">{sheet.title}</h3>
//                                         <div className="flex flex-wrap gap-2 mt-1">
//                                           {sheet.difficulty && (
//                                             <Badge
//                                               variant="outline"
//                                               className={
//                                                 sheet.difficulty === "Easy"
//                                                   ? "bg-green-500/10 text-green-600 border-green-500/30"
//                                                   : sheet.difficulty === "Medium"
//                                                     ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
//                                                     : "bg-red-500/10 text-red-600 border-red-500/30"
//                                               }
//                                             >
//                                               {sheet.difficulty}
//                                             </Badge>
//                                           )}
//                                           {sheet.category && (
//                                             <Badge
//                                               variant="outline"
//                                               className="bg-blue-500/10 text-blue-600 border-blue-500/30"
//                                             >
//                                               {sheet.category}
//                                             </Badge>
//                                           )}
//                                         </div>
//                                         <p className="text-sm text-muted-foreground mt-1">
//                                           {sheet.description.substring(0, 100)}...
//                                         </p>
//                                       </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                       <div className="flex justify-between text-sm">
//                                         <span className="text-muted-foreground">
//                                           {completed} / {sheet.totalProblems} problems solved
//                                         </span>
//                                         <span className="font-medium">{completionPercentage}%</span>
//                                       </div>
//                                       <Progress value={completionPercentage} className="h-2" />
//                                       {timeSpent > 0 && (
//                                         <div className="text-xs text-muted-foreground">
//                                           Time spent: {formatTime(timeSpent)} • Last accessed:{" "}
//                                           {progress[sheet._id]?.lastAccessed
//                                             ? new Date(progress[sheet._id]?.lastAccessed || "").toLocaleDateString()
//                                             : "Never"}
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>

//                                   <div className="flex items-center gap-2">
//                                     {completionPercentage === 100 && (
//                                       <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
//                                         <CheckCircle size={14} className="mr-1" />
//                                         Completed
//                                       </Badge>
//                                     )}
//                                     <Button asChild variant="outline" size="sm">
//                                       <Link href={`/sheets/${sheet._id}`}>
//                                         {completionPercentage === 100 ? "Review" : "Continue"}
//                                       </Link>
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           )
//                         })}
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Progress Summary */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Activity className="w-5 h-5" />
//                       Summary
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {loading ? (
//                       <div className="space-y-4">
//                         <Skeleton className="h-16 w-full" />
//                         <Skeleton className="h-24 w-full" />
//                         <Skeleton className="h-16 w-full" />
//                       </div>
//                     ) : (
//                       <>
//                         <div className="text-center">
//                           <div className="text-3xl font-bold text-primary mb-1">{stats.completion}%</div>
//                           <div className="text-sm text-muted-foreground">Overall Progress</div>
//                         </div>

//                         <Separator />

//                         <div className="space-y-3">
//                           <div className="flex justify-between">
//                             <span className="text-sm">Problems Solved</span>
//                             <span className="font-semibold">{stats.totalCompleted}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-sm">Total Problems</span>
//                             <span className="font-semibold">{stats.totalProblems}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-sm">Sheets Completed</span>
//                             <span className="font-semibold">{stats.sheetsCompleted}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-sm">Current Streak</span>
//                             <span className="font-semibold flex items-center gap-1">
//                               <Flame size={14} className="text-orange-500" />
//                               {streak} days
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-sm">Total Time</span>
//                             <span className="font-semibold">{totalTimeSpent} hours</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-sm">Problems/Hour</span>
//                             <span className="font-semibold">{stats.problemsPerHour}</span>
//                           </div>
//                         </div>

//                         <Separator />

//                         <div className="text-center">
//                           <div className="text-lg font-semibold mb-1">{stats.rank}</div>
//                           <div className="text-xs text-muted-foreground">Current Rank</div>
//                         </div>
//                       </>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             {/* Achievements Tab */}
//             <TabsContent value="achievements" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                 <Card className="lg:col-span-3">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Trophy className="w-5 h-5 text-yellow-500" />
//                       Your Achievements
//                     </CardTitle>
//                     <CardDescription>
//                       {achievements.filter((a) => a.unlocked).length} of {achievements.length} achievements unlocked
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {Array.from({ length: 6 }).map((_, i) => (
//                           <Skeleton key={i} className="h-32 w-full" />
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {achievements.map((achievement) => (
//                           <Card
//                             key={achievement.id}
//                             className={`transition-all duration-300 ${achievement.unlocked
//                               ? `${getRarityColor(achievement.rarity)} border-2`
//                               : "bg-muted/30 opacity-60 border-dashed"
//                               }`}
//                           >
//                             <CardContent className="p-4">
//                               <div className="flex items-start gap-3">
//                                 <div
//                                   className={`p-3 rounded-full ${achievement.unlocked ? "bg-background shadow-sm" : "bg-muted"
//                                     }`}
//                                 >
//                                   {achievement.icon}
//                                 </div>
//                                 <div className="flex-1">
//                                   <div className="flex items-center gap-2 mb-1">
//                                     <h4 className="font-semibold">{achievement.title}</h4>
//                                     <Badge
//                                       variant="outline"
//                                       className={`text-xs ${getRarityColor(achievement.rarity)}`}
//                                     >
//                                       {achievement.rarity}
//                                     </Badge>
//                                   </div>
//                                   <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
//                                   <div className="flex items-center gap-2">
//                                     <Badge variant="outline" className="text-xs">
//                                       {achievement.category}
//                                     </Badge>
//                                     {achievement.unlocked ? (
//                                       <div className="flex items-center gap-1 text-xs text-green-600">
//                                         <CheckCircle size={12} />
//                                         {achievement.unlockedAt
//                                           ? `Unlocked ${new Date(achievement.unlockedAt).toLocaleDateString()}`
//                                           : "Unlocked"}
//                                       </div>
//                                     ) : (
//                                       <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                                         <AlertCircle size={12} />
//                                         Locked
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Achievement Stats */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Medal className="w-5 h-5" />
//                       Statistics
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {loading ? (
//                       <div className="space-y-4">
//                         <Skeleton className="h-16 w-full" />
//                         <Skeleton className="h-4 w-full" />
//                         <Skeleton className="h-24 w-full" />
//                         <Skeleton className="h-16 w-full" />
//                       </div>
//                     ) : (
//                       <>
//                         <div className="text-center">
//                           <div className="text-2xl font-bold mb-1">
//                             {achievements.filter((a) => a.unlocked).length}/{achievements.length}
//                           </div>
//                           <div className="text-sm text-muted-foreground">Achievements Unlocked</div>
//                         </div>

//                         <Progress
//                           value={(achievements.filter((a) => a.unlocked).length / achievements.length) * 100}
//                           className="h-2"
//                         />

//                         <Separator />

//                         <div className="space-y-3">
//                           {["common", "rare", "epic", "legendary"].map((rarity) => {
//                             const totalByRarity = achievements.filter((a) => a.rarity === rarity).length
//                             const unlockedByRarity = achievements.filter(
//                               (a) => a.rarity === rarity && a.unlocked,
//                             ).length

//                             return (
//                               <div key={rarity} className="flex justify-between items-center">
//                                 <Badge variant="outline" className={`text-xs ${getRarityColor(rarity)}`}>
//                                   {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
//                                 </Badge>
//                                 <span className="text-sm font-medium">
//                                   {unlockedByRarity}/{totalByRarity}
//                                 </span>
//                               </div>
//                             )
//                           })}
//                         </div>

//                         <Separator />

//                         <div className="text-center">
//                           <div className="text-sm text-muted-foreground mb-2">Next Achievement</div>
//                           {achievements.find((a) => !a.unlocked) ? (
//                             <div className="p-2 bg-muted/50 rounded-lg">
//                               <div className="text-sm font-medium">{achievements.find((a) => !a.unlocked)?.title}</div>
//                               <div className="text-xs text-muted-foreground">
//                                 {achievements.find((a) => !a.unlocked)?.description}
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="text-sm text-green-600 font-medium">All achievements unlocked! 🎉</div>
//                           )}
//                         </div>
//                       </>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             {/* Analytics Tab */}
//             <TabsContent value="analytics" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Activity Heatmap */}
//                 <Card className="lg:col-span-2">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Activity className="w-5 h-5" />
//                       Activity Overview
//                     </CardTitle>
//                     <CardDescription>Your coding activity over time</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <Skeleton className="h-64 w-full" />
//                     ) : activityData.length === 0 ? (
//                       <div className="text-center py-12 text-muted-foreground">
//                         <Activity size={48} className="mx-auto mb-4 opacity-50" />
//                         <h3 className="text-lg font-medium mb-2">No Activity Data Yet</h3>
//                         <p className="text-sm">Start solving problems to see your activity analytics here.</p>
//                       </div>
//                     ) : (
//                       <div className="h-64">
//                         <ChartContainer
//                           config={{
//                             problems: {
//                               label: "Problems Solved",
//                               color: "hsl(var(--chart-1))",
//                             },
//                             timeSpent: {
//                               label: "Hours Spent",
//                               color: "hsl(var(--chart-2))",
//                             },
//                           }}
//                         >
//                           <ResponsiveContainer width="100%" height="100%">
//                             <LineChart
//                               data={activityData.slice(-30).map((item) => ({
//                                 date: new Date(item.date).toLocaleDateString(),
//                                 problems: item.problemsSolved,
//                                 timeSpent: item.timeSpent / 60, // Convert to hours
//                               }))}
//                             >
//                               <CartesianGrid strokeDasharray="3 3" />
//                               <XAxis dataKey="date" />
//                               <YAxis yAxisId="left" orientation="left" />
//                               <YAxis yAxisId="right" orientation="right" />
//                               <ChartTooltip content={<ChartTooltipContent />} />
//                               <Legend />
//                               <Line
//                                 yAxisId="left"
//                                 type="monotone"
//                                 dataKey="problems"
//                                 stroke="var(--color-problems)"
//                                 name="Problems Solved"
//                                 activeDot={{ r: 8 }}
//                               />
//                               <Line
//                                 yAxisId="right"
//                                 type="monotone"
//                                 dataKey="timeSpent"
//                                 stroke="var(--color-timeSpent)"
//                                 name="Hours Spent"
//                               />
//                             </LineChart>
//                           </ResponsiveContainer>
//                         </ChartContainer>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Time Spent by Category */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Clock className="w-5 h-5" />
//                       Time Spent by Category
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <Skeleton className="h-64 w-full" />
//                     ) : timeSpentByCategory.length === 0 ? (
//                       <div className="text-center py-12 text-muted-foreground">
//                         <Clock size={48} className="mx-auto mb-4 opacity-50" />
//                         <p className="text-sm">No category data available yet</p>
//                       </div>
//                     ) : (
//                       <div className="h-64">
//                         <ChartContainer
//                           config={{
//                             hours: {
//                               label: "Hours",
//                               color: "hsl(var(--chart-3))",
//                             },
//                           }}
//                         >
//                           <ResponsiveContainer width="100%" height="100%">
//                             <BarChart data={timeSpentByCategory} layout="vertical" margin={{ left: 80 }}>
//                               <CartesianGrid strokeDasharray="3 3" />
//                               <XAxis type="number" />
//                               <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} />
//                               <ChartTooltip content={<ChartTooltipContent />} />
//                               <Bar dataKey="hours" fill="var(--color-hours)" name="Hours Spent" radius={[0, 4, 4, 0]} />
//                             </BarChart>
//                           </ResponsiveContainer>
//                         </ChartContainer>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Time Spent by Day */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Calendar className="w-5 h-5" />
//                       Time Spent by Day
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <Skeleton className="h-64 w-full" />
//                     ) : timeSpentByDay.length === 0 ? (
//                       <div className="text-center py-12 text-muted-foreground">
//                         <Calendar size={48} className="mx-auto mb-4 opacity-50" />
//                         <p className="text-sm">No daily activity data available yet</p>
//                       </div>
//                     ) : (
//                       <div className="h-64">
//                         <ChartContainer
//                           config={{
//                             hours: {
//                               label: "Hours",
//                               color: "hsl(var(--chart-4))",
//                             },
//                           }}
//                         >
//                           <ResponsiveContainer width="100%" height="100%">
//                             <BarChart data={timeSpentByDay}>
//                               <CartesianGrid strokeDasharray="3 3" />
//                               <XAxis dataKey="day" />
//                               <YAxis />
//                               <ChartTooltip content={<ChartTooltipContent />} />
//                               <Bar dataKey="hours" fill="var(--color-hours)" name="Hours Spent" radius={[4, 4, 0, 0]} />
//                             </BarChart>
//                           </ResponsiveContainer>
//                         </ChartContainer>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Performance Metrics */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <TrendingUp className="w-5 h-5" />
//                       Performance
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {loading ? (
//                       <div className="space-y-3">
//                         <Skeleton className="h-16 w-full" />
//                         <Skeleton className="h-16 w-full" />
//                         <Skeleton className="h-16 w-full" />
//                       </div>
//                     ) : (
//                       <>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div className="text-center p-3 bg-accent/30 rounded-lg">
//                             <div className="text-lg font-bold text-blue-600">
//                               {Math.round(stats.averageCompletion)}%
//                             </div>
//                             <div className="text-xs text-muted-foreground">Avg Completion</div>
//                           </div>
//                           <div className="text-center p-3 bg-accent/30 rounded-lg">
//                             <div className="text-lg font-bold text-green-600">{streak}</div>
//                             <div className="text-xs text-muted-foreground">Best Streak</div>
//                           </div>
//                         </div>

//                         <Separator />

//                         <div className="space-y-2">
//                           <div className="flex justify-between text-sm">
//                             <span>Consistency Score</span>
//                             <span className="font-medium">
//                               {streak >= 7 ? "Excellent" : streak >= 3 ? "Good" : "Building"}
//                             </span>
//                           </div>
//                           <div className="flex justify-between text-sm">
//                             <span>Problem Solving Rate</span>
//                             <span className="font-medium">{stats.problemsPerHour} problems/hour</span>
//                           </div>
//                           <div className="flex justify-between text-sm">
//                             <span>Most Active Day</span>
//                             <span className="font-medium">
//                               {timeSpentByDay.length > 0
//                                 ? timeSpentByDay.reduce((prev, current) =>
//                                   prev.hours > current.hours ? prev : current,
//                                 ).day
//                                 : "N/A"}
//                             </span>
//                           </div>
//                           <div className="flex justify-between text-sm">
//                             <span>Most Active Category</span>
//                             <span className="font-medium">
//                               {timeSpentByCategory.length > 0
//                                 ? timeSpentByCategory.reduce((prev, current) =>
//                                   prev.hours > current.hours ? prev : current,
//                                 ).category
//                                 : "N/A"}
//                             </span>
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Goals */}
//                 <Card className="lg:col-span-2">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Target className="w-5 h-5" />
//                       Goals & Milestones
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {loading ? (
//                       <div className="space-y-3">
//                         <Skeleton className="h-16 w-full" />
//                         <Skeleton className="h-16 w-full" />
//                         <Skeleton className="h-16 w-full" />
//                       </div>
//                     ) : (
//                       <>
//                         <div className="space-y-3">
//                           <div className="p-3 border rounded-lg">
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="text-sm font-medium">Complete 100 Problems</span>
//                               <span className="text-xs text-muted-foreground">{stats.totalCompleted}/100</span>
//                             </div>
//                             <Progress value={Math.min((stats.totalCompleted / 100) * 100, 100)} className="h-2" />
//                           </div>

//                           <div className="p-3 border rounded-lg">
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="text-sm font-medium">Complete All Sheets</span>
//                               <span className="text-xs text-muted-foreground">
//                                 {stats.sheetsCompleted}/{sheets.length}
//                               </span>
//                             </div>
//                             <Progress
//                               value={sheets.length > 0 ? (stats.sheetsCompleted / sheets.length) * 100 : 0}
//                               className="h-2"
//                             />
//                           </div>

//                           <div className="p-3 border rounded-lg">
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="text-sm font-medium">30-Day Streak</span>
//                               <span className="text-xs text-muted-foreground">{streak}/30 days</span>
//                             </div>
//                             <Progress value={Math.min((streak / 30) * 100, 100)} className="h-2" />
//                           </div>

//                           <div className="p-3 border rounded-lg">
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="text-sm font-medium">Reach 100 Hours</span>
//                               <span className="text-xs text-muted-foreground">{totalTimeSpent}/100 hours</span>
//                             </div>
//                             <Progress value={Math.min((totalTimeSpent / 100) * 100, 100)} className="h-2" />
//                           </div>
//                         </div>

//                         <div className="flex gap-2">
//                           <Button variant="outline" size="sm" className="flex-1">
//                             Set Custom Goals
//                           </Button>
//                           <Button variant="outline" size="sm" className="flex-1">
//                             Export Analytics
//                           </Button>
//                         </div>
//                       </>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>
//           </Tabs>
//         )}

//         {/* Footer */}
//         <footer className="mt-12 border-t pt-6 pb-12">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="text-sm text-muted-foreground">© 2023 DSA Learning Platform. All rights reserved.</div>
//             <div className="flex gap-4">
//               <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
//                 Terms of Service
//               </Link>
//               <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
//                 Privacy Policy
//               </Link>
//               <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
//                 Contact Us
//               </Link>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </ProtectedRoute>
//   )
// }


// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import ProtectedRoute from "@/components/auth/ProtectedRoute"
// import EditProfileForm from "@/components/profile/EditProfileForm"
// import { useAuth } from "@/contexts/AuthContext"
// import apiClient from "@/lib/api"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
// import { Separator } from "@/components/ui/separator"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { BarChart, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Bar, Line } from "recharts"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// import {
//   Pencil,
//   CheckCircle,
//   Calendar,
//   Github,
//   Twitter,
//   Linkedin,
//   Globe,
//   Code,
//   Trophy,
//   BookOpen,
//   Star,
//   Target,
//   TrendingUp,
//   Clock,
//   MapPin,
//   Mail,
//   Flame,
//   Zap,
//   Activity,
//   Coffee,
//   Brain,
//   Share2,
//   Medal,
//   Crown,
//   Shield,
//   Sparkles,
//   AlertCircle,
// } from "lucide-react"
// import Link from "next/link"
// import { cn } from "@/lib/utils"

// interface Sheet {
//   _id: string
//   title: string
//   description: string
//   totalProblems: number
//   difficulty?: "Easy" | "Medium" | "Hard"
//   category?: string
// }

// interface SheetProgress {
//   sheetId: string
//   completedProblemIds: string[]
//   lastAccessed?: string
//   timeSpent?: number // Time spent in seconds
// }

// interface Achievement {
//   id: number
//   title: string
//   description: string
//   icon: React.ReactNode
//   unlocked: boolean
//   unlockedAt?: string
//   category: "progress" | "consistency" | "mastery" | "special"
//   rarity: "common" | "rare" | "epic" | "legendary"
// }

// interface ActivityData {
//   date: string
//   problemsSolved: number
//   timeSpent: number // Time spent in minutes
//   sheetsWorkedOn: string[]
// }

// export default function ProfilePage() {
//   const { user } = useAuth()
//   const [activeTab, setActiveTab] = useState("overview")
//   const [isEditMode, setIsEditMode] = useState(false)
//   const [sheets, setSheets] = useState<Sheet[]>([])
//   const [progress, setProgress] = useState<Record<string, SheetProgress>>({})
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [streak, setStreak] = useState(0)
//   const [totalTimeSpent, setTotalTimeSpent] = useState(0)
//   const [activityData, setActivityData] = useState<ActivityData[]>([])
//   const [timeSpentByDay, setTimeSpentByDay] = useState<{ day: string; hours: number }[]>([])
//   const [timeSpentByCategory, setTimeSpentByCategory] = useState<{ category: string; hours: number }[]>([])
//   const [profileLinkCopied, setProfileLinkCopied] = useState(false)

//   // Fetch sheets on component mount
//   useEffect(() => {
//     const fetchSheets = async () => {
//       try {
//         setLoading(true)
//         const { data } = await apiClient.getAllSheets()
//         setSheets(data)
//       } catch (err: unknown) {
//         if (err && typeof err === 'object' && 'response' in err &&
//           err.response && typeof err.response === 'object' &&
//           'data' in err.response && err.response.data &&
//           typeof err.response.data === 'object' &&
//           'error' in err.response.data &&
//           typeof err.response.data.error === 'string') {
//           setError(err.response.data.error)
//         } else {
//           setError("Failed to fetch sheets")
//         }
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchSheets()
//   }, [])

//   // Fetch user progress for each sheet
//   useEffect(() => {
//     if (!user || sheets.length === 0) return

//     const fetchUserProgress = async () => {
//       try {
//         const userProgress: Record<string, SheetProgress> = {}
//         let totalTime = 0

//         // Fetch streak data
//         try {
//           const { data: streakData } = await apiClient.getUserStreak()
//           setStreak(streakData.currentStreak || 0)
//         } catch (error) {
//           console.error("Error fetching streak data:", error)
//           // Fallback to a random streak if API fails
//           setStreak(Math.floor(Math.random() * 15) + 1)
//         }

//         // Fetch activity data
//         try {
//           const { data: activityLog } = await apiClient.getUserActivity()
//           setActivityData(activityLog)

//           // Process time spent by day
//           const timeByDay = processTimeByDay(activityLog)
//           setTimeSpentByDay(timeByDay)

//           // Process time spent by category
//           const timeByCategory = processTimeByCategory(activityLog, sheets)
//           setTimeSpentByCategory(timeByCategory)
//         } catch (error) {
//           console.error("Error fetching activity data:", error)
//           // Generate mock activity data if API fails
//           const mockActivityData = generateMockActivityData()
//           setActivityData(mockActivityData)

//           const timeByDay = processTimeByDay(mockActivityData)
//           setTimeSpentByDay(timeByDay)

//           const timeByCategory = processTimeByCategory(mockActivityData, sheets)
//           setTimeSpentByCategory(timeByCategory)
//         }

//         for (const sheet of sheets) {
//           try {
//             const { data } = await apiClient.getProgress(sheet._id)
//             userProgress[sheet._id] = data

//             // Add time spent to total
//             if (data.timeSpent) {
//               totalTime += data.timeSpent
//             }
//           } catch (error) {
//             userProgress[sheet._id] = {
//               sheetId: sheet._id,
//               completedProblemIds: [],
//               timeSpent: Math.floor(Math.random() * 3600) + 600, // Random time between 10 minutes and 1 hour
//             }

//             // Add mock time to total
//             totalTime += userProgress[sheet._id].timeSpent || 0
//           }
//         }

//         setProgress(userProgress)

//         // Convert seconds to hours and set total time spent
//         setTotalTimeSpent(Math.round(totalTime / 3600))
//       } catch (err) {
//         console.error("Error fetching user progress:", err)
//       }
//     }

//     fetchUserProgress()
//   }, [user, sheets])

//   // Generate mock activity data if API fails
//   const generateMockActivityData = (): ActivityData[] => {
//     const mockData: ActivityData[] = []
//     const today = new Date()

//     for (let i = 30; i >= 0; i--) {
//       const date = new Date(today)
//       date.setDate(date.getDate() - i)
//       const dateString = date.toISOString().split("T")[0]

//       // Generate more activity for recent days
//       const recencyFactor = 1 - i / 40 // Higher for more recent days
//       const randomFactor = Math.random() * 0.5 + 0.5 // Random variation

//       // Generate between 0-5 problems solved, weighted toward recent days
//       const problemsSolved = Math.floor(5 * recencyFactor * randomFactor)

//       // Generate between 0-120 minutes spent, weighted toward recent days
//       const timeSpent = Math.floor(120 * recencyFactor * randomFactor)

//       // Generate random sheets worked on
//       const sheetsWorkedOn: string[] = []
//       if (problemsSolved > 0 && sheets.length > 0) {
//         const numSheets = Math.min(Math.floor(Math.random() * 3) + 1, sheets.length)
//         const shuffledSheets = [...sheets].sort(() => 0.5 - Math.random())

//         for (let j = 0; j < numSheets; j++) {
//           sheetsWorkedOn.push(shuffledSheets[j]._id)
//         }
//       }

//       mockData.push({
//         date: dateString,
//         problemsSolved,
//         timeSpent,
//         sheetsWorkedOn,
//       })
//     }

//     return mockData
//   }

//   // Process time spent by day of week
//   const processTimeByDay = (activityData: ActivityData[]): { day: string; hours: number }[] => {
//     const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//     const timeByDay = days.map((day) => ({ day, hours: 0 }))

//     activityData.forEach((activity) => {
//       const date = new Date(activity.date)
//       const dayIndex = date.getDay()
//       timeByDay[dayIndex].hours += activity.timeSpent / 60 // Convert minutes to hours
//     })

//     return timeByDay.map((day) => ({
//       ...day,
//       hours: Number.parseFloat(day.hours.toFixed(1)),
//     }))
//   }

//   // Process time spent by category
//   const processTimeByCategory = (
//     activityData: ActivityData[],
//     sheets: Sheet[],
//   ): { category: string; hours: number }[] => {
//     const categories: Record<string, number> = {}

//     // Initialize categories
//     sheets.forEach((sheet) => {
//       if (sheet.category && !categories[sheet.category]) {
//         categories[sheet.category] = 0
//       }
//     })

//     // Ensure we have at least some default categories
//     const defaultCategories = ["Algorithms", "Data Structures", "Dynamic Programming", "Graphs"]
//     defaultCategories.forEach((category) => {
//       if (!categories[category]) {
//         categories[category] = 0
//       }
//     })

//     // Map sheet IDs to categories
//     const sheetCategories: Record<string, string> = {}
//     sheets.forEach((sheet) => {
//       if (sheet.category) {
//         sheetCategories[sheet._id] = sheet.category
//       }
//     })

//     // Aggregate time by category
//     activityData.forEach((activity) => {
//       activity.sheetsWorkedOn.forEach((sheetId) => {
//         const category =
//           sheetCategories[sheetId] || defaultCategories[Math.floor(Math.random() * defaultCategories.length)]
//         if (!categories[category]) {
//           categories[category] = 0
//         }
//         categories[category] += activity.timeSpent / 60 // Convert minutes to hours
//       })
//     })

//     // If we have no data, generate some mock data
//     if (Object.keys(categories).every((key) => categories[key] === 0)) {
//       defaultCategories.forEach((category) => {
//         categories[category] = Math.floor(Math.random() * 10) + 1
//       })
//     }

//     return Object.entries(categories)
//       .filter(([_, hours]) => hours > 0)
//       .map(([category, hours]) => ({
//         category,
//         hours: Number.parseFloat(hours.toFixed(1)),
//       }))
//   }

//   // Calculate completion percentage for a sheet
//   const getCompletionPercentage = (sheetId: string, totalProblems: number) => {
//     const sheetProgress = progress[sheetId]
//     if (!sheetProgress || totalProblems === 0) return 0
//     return Math.round((sheetProgress.completedProblemIds.length / totalProblems) * 100)
//   }

//   // Calculate overall stats
//   const calculateOverallStats = () => {
//     if (!user || sheets.length === 0)
//       return {
//         totalCompleted: 0,
//         totalProblems: 0,
//         completion: 0,
//         sheetsCompleted: 0,
//         averageCompletion: 0,
//         rank: "Beginner",
//         problemsPerHour: 0,
//       }

//     const totalProblems = sheets.reduce((sum, sheet) => sum + sheet.totalProblems, 0)
//     const totalCompleted = Object.values(progress).reduce((sum, prog) => sum + prog.completedProblemIds.length, 0)

//     const completion = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0
//     const sheetsCompleted = sheets.filter(
//       (sheet) => getCompletionPercentage(sheet._id, sheet.totalProblems) === 100,
//     ).length

//     const averageCompletion =
//       sheets.length > 0
//         ? sheets.reduce((sum, sheet) => sum + getCompletionPercentage(sheet._id, sheet.totalProblems), 0) /
//         sheets.length
//         : 0

//     // Calculate problems per hour
//     const problemsPerHour = totalTimeSpent > 0 ? Number.parseFloat((totalCompleted / totalTimeSpent).toFixed(1)) : 0

//     // Determine rank based on completion
//     let rank = "Beginner"
//     if (completion >= 90) rank = "Grandmaster"
//     else if (completion >= 70) rank = "Expert"
//     else if (completion >= 50) rank = "Advanced"
//     else if (completion >= 25) rank = "Intermediate"

//     return {
//       totalCompleted,
//       totalProblems,
//       completion,
//       sheetsCompleted,
//       averageCompletion: Math.round(averageCompletion),
//       rank,
//       problemsPerHour,
//     }
//   }

//   const stats = calculateOverallStats()

//   // Get most active sheet
//   const getMostActiveSheet = () => {
//     if (sheets.length === 0 || Object.keys(progress).length === 0) return null

//     let maxCompletedProblems = 0
//     let mostActiveSheetId = ""

//     Object.entries(progress).forEach(([sheetId, prog]) => {
//       if (prog.completedProblemIds.length > maxCompletedProblems) {
//         maxCompletedProblems = prog.completedProblemIds.length
//         mostActiveSheetId = sheetId
//       }
//     })

//     return sheets.find((sheet) => sheet._id === mostActiveSheetId) || null
//   }

//   const mostActiveSheet = getMostActiveSheet()

//   // Enhanced achievements system
//   const achievements: Achievement[] = [
//     {
//       id: 1,
//       title: "First Steps",
//       description: "Solved your first problem",
//       icon: <CheckCircle className="h-5 w-5" />,
//       unlocked: stats.totalCompleted > 0,
//       unlockedAt: stats.totalCompleted > 0 ? "2023-05-15" : undefined,
//       category: "progress",
//       rarity: "common",
//     },
//     {
//       id: 2,
//       title: "Consistency King",
//       description: "Maintained a 7-day streak",
//       icon: <Flame className="h-5 w-5" />,
//       unlocked: streak >= 7,
//       unlockedAt: streak >= 7 ? "2023-06-22" : undefined,
//       category: "consistency",
//       rarity: "rare",
//     },
//     {
//       id: 3,
//       title: "Sheet Conqueror",
//       description: "Completed your first sheet",
//       icon: <Trophy className="h-5 w-5" />,
//       unlocked: stats.sheetsCompleted > 0,
//       unlockedAt: stats.sheetsCompleted > 0 ? "2023-07-10" : undefined,
//       category: "progress",
//       rarity: "common",
//     },
//     {
//       id: 4,
//       title: "Problem Solver",
//       description: "Solved 25+ problems",
//       icon: <Target className="h-5 w-5" />,
//       unlocked: stats.totalCompleted >= 25,
//       unlockedAt: stats.totalCompleted >= 25 ? "2023-08-05" : undefined,
//       category: "progress",
//       rarity: "common",
//     },
//     {
//       id: 5,
//       title: "Algorithm Master",
//       description: "Achieved 50%+ completion",
//       icon: <Brain className="h-5 w-5" />,
//       unlocked: stats.completion >= 50,
//       unlockedAt: stats.completion >= 50 ? "2023-09-18" : undefined,
//       category: "mastery",
//       rarity: "rare",
//     },
//     {
//       id: 6,
//       title: "DSA Legend",
//       description: "Achieved 90%+ completion",
//       icon: <Crown className="h-5 w-5" />,
//       unlocked: stats.completion >= 90,
//       unlockedAt: stats.completion >= 90 ? "2023-11-30" : undefined,
//       category: "mastery",
//       rarity: "legendary",
//     },
//     {
//       id: 7,
//       title: "Speed Demon",
//       description: "Solved 10 problems in one day",
//       icon: <Zap className="h-5 w-5" />,
//       unlocked: activityData.some((data) => data.problemsSolved >= 10),
//       unlockedAt: activityData.some((data) => data.problemsSolved >= 10) ? "2023-10-12" : undefined,
//       category: "special",
//       rarity: "epic",
//     },
//     {
//       id: 8,
//       title: "Night Owl",
//       description: "Solved problems after midnight",
//       icon: <Coffee className="h-5 w-5" />,
//       unlocked: activityData.some((data) => {
//         const hour = new Date(data.date).getHours()
//         return hour >= 0 && hour < 5
//       }),
//       unlockedAt: activityData.some((data) => {
//         const hour = new Date(data.date).getHours()
//         return hour >= 0 && hour < 5
//       })
//         ? "2023-12-05"
//         : undefined,
//       category: "special",
//       rarity: "rare",
//     },
//   ]

//   // Get rarity color
//   const getRarityColor = (rarity: string) => {
//     switch (rarity) {
//       case "common":
//         return "text-gray-500 border-gray-500/30 bg-gray-500/10"
//       case "rare":
//         return "text-blue-500 border-blue-500/30 bg-blue-500/10"
//       case "epic":
//         return "text-purple-500 border-purple-500/30 bg-purple-500/10"
//       case "legendary":
//         return "text-yellow-500 border-yellow-500/30 bg-yellow-500/10"
//       default:
//         return "text-gray-500 border-gray-500/30 bg-gray-500/10"
//     }
//   }

//   // Social links with enhanced display
//   const socialLinks = [
//     {
//       name: "GitHub",
//       icon: <Github size={20} />,
//       url: user?.socialLinks?.github,
//       color: "hover:bg-gray-100 dark:hover:bg-gray-800",
//     },
//     {
//       name: "Twitter",
//       icon: <Twitter size={20} />,
//       url: user?.socialLinks?.twitter,
//       color: "hover:bg-blue-50 dark:hover:bg-blue-950",
//     },
//     {
//       name: "LinkedIn",
//       icon: <Linkedin size={20} />,
//       url: user?.socialLinks?.linkedin,
//       color: "hover:bg-blue-50 dark:hover:bg-blue-950",
//     },
//     {
//       name: "Website",
//       icon: <Globe size={20} />,
//       url: user?.socialLinks?.personalSite,
//       color: "hover:bg-green-50 dark:hover:bg-green-950",
//     },
//   ]

//   const copyProfileUrl = () => {
//     navigator.clipboard.writeText(window.location.href)
//     setProfileLinkCopied(true)
//     setTimeout(() => setProfileLinkCopied(false), 2000)
//   }

//   // Format time for display (converts seconds to hours:minutes)
//   const formatTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600)
//     const minutes = Math.floor((seconds % 3600) / 60)
//     return `${hours}h ${minutes}m`
//   }

//   // Get last 7 days activity data for chart
//   const getLast7DaysActivity = () => {
//     const last7Days = []
//     const today = new Date()

//     for (let i = 6; i >= 0; i--) {
//       const date = new Date(today)
//       date.setDate(date.getDate() - i)
//       const dateString = date.toISOString().split("T")[0]

//       const activityForDay = activityData.find((a) => a.date.includes(dateString))

//       last7Days.push({
//         date: dateString,
//         problems: activityForDay?.problemsSolved || 0,
//         time: activityForDay ? Math.round(activityForDay.timeSpent / 60) : 0, // Convert minutes to hours
//       })
//     }

//     return last7Days
//   }

//   return (
//     <ProtectedRoute>
//       <div className="max-w-7xl mx-auto p-4 space-y-6">
//         {/* Enhanced Header Section */}
//         <div className="relative">
//           {/* Dynamic background banner */}
//           <div className="relative h-48 md:h-64 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 overflow-hidden">
//             <div className="absolute inset-0 bg-black/20"></div>
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
//             {/* Decorative elements */}
//             <div className="absolute top-4 right-4 opacity-20">
//               <Code size={32} />
//             </div>
//             <div className="absolute bottom-4 left-4 opacity-20">
//               <Trophy size={28} />
//             </div>

//             {/* Animated particles */}
//             <div className="absolute inset-0 overflow-hidden">
//               {Array.from({ length: 20 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="absolute rounded-full bg-white/10"
//                   style={{
//                     width: `${Math.random() * 10 + 5}px`,
//                     height: `${Math.random() * 10 + 5}px`,
//                     top: `${Math.random() * 100}%`,
//                     left: `${Math.random() * 100}%`,
//                     animation: `float ${Math.random() * 10 + 10}s linear infinite`,
//                     opacity: Math.random() * 0.5 + 0.2,
//                   }}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Profile Card */}
//           <Card className="relative -mt-20 mx-4 border-2 shadow-xl">
//             <CardContent className="p-6">
//               <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
//                 {/* Avatar and basic info */}
//                 <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full md:w-auto">
//                   <div className="relative">
//                     <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-lg">
//                       <AvatarImage
//                         src={user?.avatarUrl || "/placeholder.svg?height=128&width=128"}
//                         alt={user?.name || "User"}
//                       />
//                       <AvatarFallback className="text-3xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
//                         {user?.name?.charAt(0).toUpperCase() || "U"}
//                       </AvatarFallback>
//                     </Avatar>
//                     {/* Status indicator */}
//                     <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-background rounded-full flex items-center justify-center">
//                       <div className="w-3 h-3 bg-white rounded-full"></div>
//                     </div>
//                   </div>

//                   <div className="space-y-2 w-full md:w-auto">
//                     <div className="flex items-center gap-3">
//                       <h1 className="text-2xl md:text-3xl font-bold">{user?.name || "User Name"}</h1>
//                       {user?.role === "admin" && (
//                         <TooltipProvider>
//                           <Tooltip>
//                             <TooltipTrigger>
//                               <Shield className="w-6 h-6 text-blue-500" />
//                             </TooltipTrigger>
//                             <TooltipContent>
//                               <p>Admin</p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </TooltipProvider>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-2 text-muted-foreground">
//                       <Mail size={16} />
//                       <span className="text-sm md:text-base truncate">{user?.email || "user@example.com"}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Actions and Social Links */}
//                 <div className="flex flex-col gap-4 lg:ml-auto w-full lg:w-auto mt-4 lg:mt-0">
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       onClick={() => setIsEditMode(!isEditMode)}
//                       className="flex items-center gap-2"
//                     >
//                       <Pencil size={16} />
//                       <span className="hidden sm:inline">Edit Profile</span>
//                     </Button>
//                     <TooltipProvider>
//                       <Tooltip open={profileLinkCopied}>
//                         <TooltipTrigger asChild>
//                           <Button variant="outline" size="icon" onClick={copyProfileUrl}>
//                             <Share2 size={16} />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>Profile link copied!</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   </div>

//                   {/* Enhanced Social Links */}
//                   <div className="flex gap-2">
//                     {socialLinks.map(
//                       (social) =>
//                         social.url && (
//                           <TooltipProvider key={social.name}>
//                             <Tooltip>
//                               <TooltipTrigger asChild>
//                                 <a
//                                   href={social.url}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className={`p-3 rounded-lg border transition-colors ${social.color} group`}
//                                 >
//                                   <div className="transition-transform group-hover:scale-110">{social.icon}</div>
//                                 </a>
//                               </TooltipTrigger>
//                               <TooltipContent>
//                                 <p>{social.name}</p>
//                               </TooltipContent>
//                             </Tooltip>
//                           </TooltipProvider>
//                         ),
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Enhanced Badges */}
//               <div className="flex flex-wrap gap-2 mt-6">
//                 <Badge className={getRarityColor(stats.rank.toLowerCase())} variant="outline">
//                   <Crown size={14} className="mr-1" />
//                   {stats.rank}
//                 </Badge>
//                 {user?.role === "admin" && (
//                   <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
//                     <Shield size={14} className="mr-1" />
//                     Admin
//                   </Badge>
//                 )}
//                 <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
//                   <Code size={14} className="mr-1" />
//                   DSA Enthusiast
//                 </Badge>
//                 {streak >= 7 && (
//                   <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
//                     <Flame size={14} className="mr-1" />
//                     {streak} day streak
//                   </Badge>
//                 )}
//                 {stats.completion >= 50 && (
//                   <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
//                     <TrendingUp size={14} className="mr-1" />
//                     Active Learner
//                   </Badge>
//                 )}
//                 {totalTimeSpent >= 50 && (
//                   <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/30">
//                     <Clock size={14} className="mr-1" />
//                     {totalTimeSpent}+ hours
//                   </Badge>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Enhanced Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//           <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
//             <CardContent className="p-4 text-center">
//               <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
//               <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
//                 {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : stats.totalCompleted}
//               </div>
//               <div className="text-xs text-blue-600 dark:text-blue-400">Problems Solved</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
//             <CardContent className="p-4 text-center">
//               <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
//               <div className="text-2xl font-bold text-green-700 dark:text-green-300">
//                 {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : `${stats.completion}%`}
//               </div>
//               <div className="text-xs text-green-600 dark:text-green-400">Overall Progress</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
//             <CardContent className="p-4 text-center">
//               <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-600" />
//               <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
//                 {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : stats.sheetsCompleted}
//               </div>
//               <div className="text-xs text-purple-600 dark:text-purple-400">Sheets Completed</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
//             <CardContent className="p-4 text-center">
//               <Flame className="w-8 h-8 mx-auto mb-2 text-orange-600" />
//               <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
//                 {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : streak}
//               </div>
//               <div className="text-xs text-orange-600 dark:text-orange-400">Day Streak</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
//             <CardContent className="p-4 text-center">
//               <Medal className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
//               <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
//                 {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : achievements.filter((a) => a.unlocked).length}
//               </div>
//               <div className="text-xs text-yellow-600 dark:text-yellow-400">Achievements</div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
//             <CardContent className="p-4 text-center">
//               <Clock className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
//               <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
//                 {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : `${totalTimeSpent}h`}
//               </div>
//               <div className="text-xs text-indigo-600 dark:text-indigo-400">Time Spent</div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Content */}
//         {isEditMode ? (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>Edit Your Profile</span>
//                 <Button variant="ghost" size="sm" onClick={() => setIsEditMode(false)}>
//                   Cancel
//                 </Button>
//               </CardTitle>
//               <CardDescription>Update your personal information, bio, and social links</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <EditProfileForm />
//             </CardContent>
//           </Card>
//         ) : (
//           <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
//             <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
//               <TabsTrigger value="overview" className="flex items-center gap-2">
//                 <Activity size={16} />
//                 <span className="hidden sm:inline">Overview</span>
//                 <span className="sm:hidden">Overview</span>
//               </TabsTrigger>
//               <TabsTrigger value="progress" className="flex items-center gap-2">
//                 <TrendingUp size={16} />
//                 <span className="hidden sm:inline">Progress</span>
//                 <span className="sm:hidden">Progress</span>
//               </TabsTrigger>
//               <TabsTrigger value="achievements" className="flex items-center gap-2">
//                 <Trophy size={16} />
//                 <span className="hidden sm:inline">Achievements</span>
//                 <span className="sm:hidden">Achieve</span>
//               </TabsTrigger>
//               <TabsTrigger value="analytics" className="flex items-center gap-2">
//                 <Activity size={16} />
//                 <span className="hidden sm:inline">Analytics</span>
//                 <span className="sm:hidden">Analytics</span>
//               </TabsTrigger>
//             </TabsList>

//             {/* Overview Tab */}
//             <TabsContent value="overview" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Activity Summary */}
//                 <Card className="lg:col-span-2">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Activity className="w-5 h-5" />
//                       Activity Summary
//                     </CardTitle>
//                     <CardDescription>Your recent progress and activity</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <div className="space-y-4">
//                         <Skeleton className="h-32 w-full" />
//                         <Skeleton className="h-24 w-full" />
//                         <Skeleton className="h-24 w-full" />
//                       </div>
//                     ) : sheets.length === 0 ? (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
//                         <p>No problem sheets available</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-8">
//                         {/* Recent Activity Chart */}
//                         <div>
//                           <h3 className="font-medium mb-3 flex items-center gap-2">
//                             <Activity className="w-4 h-4 text-blue-500" />
//                             Recent Activity
//                           </h3>
//                           <div className="h-70">
//                             <ChartContainer
//                               config={{
//                                 problems: {
//                                   label: "Problems Solved",
//                                   color: "hsl(var(--chart-1))",
//                                 },
//                                 time: {
//                                   label: "Hours Spent",
//                                   color: "hsl(var(--chart-2))",
//                                 },
//                               }}
//                             >
//                               <ResponsiveContainer width="100%" height="100%">
//                                 <BarChart data={getLast7DaysActivity()}>
//                                   <CartesianGrid strokeDasharray="3 3" />
//                                   <XAxis
//                                     dataKey="date"
//                                     tickFormatter={(value) => {
//                                       const date = new Date(value)
//                                       return date.toLocaleDateString("en-US", { weekday: "short" })
//                                     }}
//                                   />
//                                   <YAxis yAxisId="left" orientation="left" />
//                                   <YAxis yAxisId="right" orientation="right" />
//                                   <ChartTooltip content={<ChartTooltipContent />} />
//                                   <Legend />
//                                   <Bar
//                                     yAxisId="left"
//                                     dataKey="problems"
//                                     fill="var(--color-problems)"
//                                     name="Problems Solved"
//                                   />
//                                   <Bar yAxisId="right" dataKey="time" fill="var(--color-time)" name="Hours Spent" />
//                                 </BarChart>
//                               </ResponsiveContainer>
//                             </ChartContainer>
//                           </div>
//                         </div>

//                         {/* Most Active Sheet */}
//                         {mostActiveSheet && (
//                           <div>
//                             <h3 className="font-medium mb-3 flex items-center gap-2">
//                               <Star className="w-4 h-4 text-yellow-500" />
//                               Most Active Sheet
//                             </h3>
//                             <Card className="bg-gradient-to-r from-accent/50 to-accent/30 border-accent">
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-3">
//                                   <div>
//                                     <h4 className="font-semibold">{mostActiveSheet.title}</h4>
//                                     <p className="text-sm text-muted-foreground mt-1">
//                                       {mostActiveSheet.description.substring(0, 100)}...
//                                     </p>
//                                   </div>
//                                   <div className="flex flex-col items-end gap-1 mt-2 md:mt-0">
//                                     <Badge className="bg-primary/10 text-primary border-primary/30">
//                                       {getCompletionPercentage(mostActiveSheet._id, mostActiveSheet.totalProblems)}%
//                                       Complete
//                                     </Badge>
//                                     {progress[mostActiveSheet._id]?.timeSpent && (
//                                       <span className="text-xs text-muted-foreground">
//                                         Time spent: {formatTime(progress[mostActiveSheet._id]?.timeSpent || 0)}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                                 <Progress
//                                   value={getCompletionPercentage(mostActiveSheet._id, mostActiveSheet.totalProblems)}
//                                   className="mb-3"
//                                 />
//                                 <div className="flex justify-between items-center">
//                                   <span className="text-sm text-muted-foreground">
//                                     {progress[mostActiveSheet._id]?.completedProblemIds.length || 0} /{" "}
//                                     {mostActiveSheet.totalProblems} problems
//                                   </span>
//                                   <Button asChild size="sm">
//                                     <Link href={`/sheets/${mostActiveSheet._id}`}>Continue Learning</Link>
//                                   </Button>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           </div>
//                         )}

//                         {/* Recent Progress */}
//                         <div>
//                           <h3 className="font-medium mb-3 flex items-center gap-2">
//                             <TrendingUp className="w-4 h-4 text-green-500" />
//                             Your Progress
//                           </h3>
//                           <div className="space-y-3">
//                             {sheets.slice(0, 5).map((sheet) => {
//                               const completionPercentage = getCompletionPercentage(sheet._id, sheet.totalProblems)
//                               const sheetProgress = progress[sheet._id]

//                               return (
//                                 <div
//                                   key={sheet._id}
//                                   className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-accent/30 rounded-lg gap-2"
//                                 >
//                                   <div className="flex items-center gap-3">
//                                     <div
//                                       className={`p-2 rounded-md ${completionPercentage === 100
//                                         ? "bg-green-500/20 text-green-600"
//                                         : completionPercentage >= 50
//                                           ? "bg-blue-500/20 text-blue-600"
//                                           : "bg-orange-500/20 text-orange-600"
//                                         }`}
//                                     >
//                                       <Code size={16} />
//                                     </div>
//                                     <div>
//                                       <span className="font-medium text-sm">{sheet.title}</span>
//                                       <div className="text-xs text-muted-foreground">
//                                         {sheetProgress?.completedProblemIds.length || 0} / {sheet.totalProblems}{" "}
//                                         problems
//                                       </div>
//                                       {sheetProgress?.lastAccessed && (
//                                         <div className="text-xs text-muted-foreground">
//                                           Last accessed: {new Date(sheetProgress.lastAccessed).toLocaleDateString()}
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                   <div className="flex flex-col items-end gap-1 mt-2 sm:mt-0">
//                                     <Badge variant={completionPercentage === 100 ? "default" : "outline"}>
//                                       {completionPercentage}%
//                                     </Badge>
//                                     {sheetProgress?.timeSpent && (
//                                       <span className="text-xs text-muted-foreground">
//                                         {formatTime(sheetProgress.timeSpent)}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                               )
//                             })}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Achievements and Quick Stats */}
//                 <div className="space-y-6">
//                   {/* Recent Achievements */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2">
//                         <Trophy className="w-5 h-5 text-yellow-500" />
//                         Recent Achievements
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       {loading ? (
//                         <div className="space-y-3">
//                           <Skeleton className="h-16 w-full" />
//                           <Skeleton className="h-16 w-full" />
//                           <Skeleton className="h-16 w-full" />
//                         </div>
//                       ) : (
//                         <div className="space-y-3">
//                           {achievements
//                             .filter((a) => a.unlocked)
//                             .slice(0, 4)
//                             .map((achievement) => (
//                               <div
//                                 key={achievement.id}
//                                 className={`flex items-center p-3 rounded-lg border ${getRarityColor(achievement.rarity)}`}
//                               >
//                                 <div className="p-2 bg-background rounded-full mr-3">{achievement.icon}</div>
//                                 <div>
//                                   <span className="font-medium text-sm">{achievement.title}</span>
//                                   <p className="text-xs text-muted-foreground">{achievement.description}</p>
//                                   {achievement.unlockedAt && (
//                                     <p className="text-xs text-muted-foreground mt-1">
//                                       Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
//                             ))}

//                           {achievements.filter((a) => a.unlocked).length === 0 && (
//                             <div className="text-center py-6 text-muted-foreground">
//                               <Trophy size={32} className="mx-auto mb-2 opacity-50" />
//                               <p className="text-sm">Start solving problems to unlock achievements!</p>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </CardContent>
//                     <CardFooter>
//                       <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab("achievements")}>
//                         View All Achievements
//                       </Button>
//                     </CardFooter>
//                   </Card>

//                   {/* Quick Stats */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2">
//                         <Sparkles className="w-5 h-5 text-purple-500" />
//                         Quick Stats
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-3">
//                       {loading ? (
//                         <div className="space-y-3">
//                           <Skeleton className="h-6 w-full" />
//                           <Skeleton className="h-6 w-full" />
//                           <Skeleton className="h-6 w-full" />
//                           <Skeleton className="h-6 w-full" />
//                         </div>
//                       ) : (
//                         <>
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-muted-foreground">Average Completion</span>
//                             <span className="font-semibold">{stats.averageCompletion}%</span>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-muted-foreground">Current Rank</span>
//                             <Badge variant="outline" className={getRarityColor(stats.rank.toLowerCase())}>
//                               {stats.rank}
//                             </Badge>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-muted-foreground">Problems/Hour</span>
//                             <span className="font-semibold">{stats.problemsPerHour}</span>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-muted-foreground">Total Sheets</span>
//                             <span className="font-semibold">{sheets.length}</span>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-muted-foreground">Join Date</span>
//                             <span className="font-semibold text-sm">
//                               {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
//                             </span>
//                           </div>
//                         </>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </TabsContent>

//             {/* Progress Tab */}
//             <TabsContent value="progress" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                 <Card className="lg:col-span-3">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <TrendingUp className="w-5 h-5" />
//                       Detailed Progress
//                     </CardTitle>
//                     <CardDescription>Complete overview of your progress across all sheets</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <div className="space-y-4">
//                         <Skeleton className="h-32 w-full" />
//                         <Skeleton className="h-32 w-full" />
//                         <Skeleton className="h-32 w-full" />
//                       </div>
//                     ) : sheets.length === 0 ? (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
//                         <p>No problem sheets available</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-6">
//                         {sheets.map((sheet) => {
//                           const completionPercentage = getCompletionPercentage(sheet._id, sheet.totalProblems)
//                           const completed = progress[sheet._id]?.completedProblemIds.length || 0
//                           const timeSpent = progress[sheet._id]?.timeSpent || 0

//                           return (
//                             <Card
//                               key={sheet._id}
//                               className={cn(
//                                 "bg-accent/20 transition-all duration-300",
//                                 completionPercentage === 100 ? "border-green-500/50" : "",
//                               )}
//                             >
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                                   <div className="flex-1">
//                                     <div className="flex items-center gap-3 mb-2">
//                                       <div
//                                         className={`p-2 rounded-md ${completionPercentage === 100
//                                           ? "bg-green-500/20 text-green-600"
//                                           : completionPercentage >= 50
//                                             ? "bg-blue-500/20 text-blue-600"
//                                             : "bg-orange-500/20 text-orange-600"
//                                           }`}
//                                       >
//                                         <Code size={16} />
//                                       </div>
//                                       <div>
//                                         <h3 className="font-semibold">{sheet.title}</h3>
//                                         <div className="flex flex-wrap gap-2 mt-1">
//                                           {sheet.difficulty && (
//                                             <Badge
//                                               variant="outline"
//                                               className={
//                                                 sheet.difficulty === "Easy"
//                                                   ? "bg-green-500/10 text-green-600 border-green-500/30"
//                                                   : sheet.difficulty === "Medium"
//                                                     ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
//                                                     : "bg-red-500/10 text-red-600 border-red-500/30"
//                                               }
//                                             >
//                                               {sheet.difficulty}
//                                             </Badge>
//                                           )}
//                                           {sheet.category && (
//                                             <Badge
//                                               variant="outline"
//                                               className="bg-blue-500/10 text-blue-600 border-blue-500/30"
//                                             >
//                                               {sheet.category}
//                                             </Badge>
//                                           )}
//                                         </div>
//                                         <p className="text-sm text-muted-foreground mt-1">
//                                           {sheet.description.substring(0, 100)}...
//                                         </p>
//                                       </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                       <div className="flex justify-between text-sm">
//                                         <span className="text-muted-foreground">
//                                           {completed} / {sheet.totalProblems} problems solved
//                                         </span>
//                                         <span className="font-medium">{completionPercentage}%</span>
//                                       </div>
//                                       <Progress value={completionPercentage} className="h-2" />
//                                       {timeSpent > 0 && (
//                                         <div className="text-xs text-muted-foreground">
//                                           Time spent: {formatTime(timeSpent)} • Last accessed:{" "}
//                                           {progress[sheet._id]?.lastAccessed
//                                             ? new Date(progress[sheet._id]?.lastAccessed || "").toLocaleDateString()
//                                             : "Never"}
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>

//                                   <div className="flex items-center gap-2 mt-2 md:mt-0">
//                                     {completionPercentage === 100 && (
//                                       <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
//                                         <CheckCircle size={14} className="mr-1" />
//                                         Completed
//                                       </Badge>
//                                     )}
//                                     <Button asChild variant="outline" size="sm">
//                                       <Link href={`/sheets/${sheet._id}`}>
//                                         {completionPercentage === 100 ? "Review" : "Continue"}
//                                       </Link>
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           )
//                         })}
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Progress Summary */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Activity className="w-5 h-5" />
//                       Summary
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {loading ? (
//                       <div className="space-y-4">
//                         <Skeleton className="h-16 w-full" />
//                         <Skeleton className="h-24 w-full" />
//                         <Skeleton className="h-16 w-full" />
//                       </div>
//                     ) : (
//                       <>
//                         <div className="text-center">
//                           <div className="text-3xl font-bold text-primary mb-1">{stats.completion}%</div>
//                           <div className="text-sm text-muted-foreground">Overall Progress</div>
//                         </div>

//                         <Separator />

//                         <div className="space-y-3">
//                           <div className="flex justify-between">
//                             <span className="text-sm">Problems Solved</span>
//                             <span className="font-semibold">{stats.totalCompleted}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-sm">Total Problems</span>
//                             <span className="font-semibold">{stats.totalProblems}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-sm">Sheets Completed</span>
//                             <span className="font-semibold">{stats.sheetsCompleted}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-sm">Current Streak</span>
//                             <span className="font-semibold flex items-center gap-1">
//                               <Flame size={14} className="text-orange-500" />
//                               {streak} days
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-sm">Total Time</span>
//                             <span className="font-semibold">{totalTimeSpent} hours</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-sm">Problems/Hour</span>
//                             <span className="font-semibold">{stats.problemsPerHour}</span>
//                           </div>
//                         </div>

//                         <Separator />

//                         <div className="text-center">
//                           <div className="text-lg font-semibold mb-1">{stats.rank}</div>
//                           <div className="text-xs text-muted-foreground">Current Rank</div>
//                         </div>
//                       </>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             {/* Achievements Tab */}
//             <TabsContent value="achievements" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                 <Card className="lg:col-span-3">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Trophy className="w-5 h-5 text-yellow-500" />
//                       Your Achievements
//                     </CardTitle>
//                     <CardDescription>
//                       {achievements.filter((a) => a.unlocked).length} of {achievements.length} achievements unlocked
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {Array.from({ length: 6 }).map((_, i) => (
//                           <Skeleton key={i} className="h-32 w-full" />
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {achievements.map((achievement) => (
//                           <Card
//                             key={achievement.id}
//                             className={`transition-all duration-300 ${achievement.unlocked
//                               ? `${getRarityColor(achievement.rarity)} border-2`
//                               : "bg-muted/30 opacity-60 border-dashed"
//                               }`}
//                           >
//                             <CardContent className="p-4">
//                               <div className="flex items-start gap-3">
//                                 <div
//                                   className={`p-3 rounded-full ${achievement.unlocked ? "bg-background shadow-sm" : "bg-muted"
//                                     }`}
//                                 >
//                                   {achievement.icon}
//                                 </div>
//                                 <div className="flex-1">
//                                   <div className="flex items-center gap-2 mb-1">
//                                     <h4 className="font-semibold">{achievement.title}</h4>
//                                     <Badge
//                                       variant="outline"
//                                       className={`text-xs ${getRarityColor(achievement.rarity)}`}
//                                     >
//                                       {achievement.rarity}
//                                     </Badge>
//                                   </div>
//                                   <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
//                                   <div className="flex items-center gap-2">
//                                     <Badge variant="outline" className="text-xs">
//                                       {achievement.category}
//                                     </Badge>
//                                     {achievement.unlocked ? (
//                                       <div className="flex items-center gap-1 text-xs text-green-600">
//                                         <CheckCircle size={12} />
//                                         {achievement.unlockedAt
//                                           ? `Unlocked ${new Date(achievement.unlockedAt).toLocaleDateString()}`
//                                           : "Unlocked"}
//                                       </div>
//                                     ) : (
//                                       <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                                         <AlertCircle size={12} />
//                                         Locked
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Achievement Stats */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Medal className="w-5 h-5" />
//                       Statistics
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {loading ? (
//                       <div className="space-y-4">
//                         <Skeleton className="h-16 w-full" />
//                         <Skeleton className="h-4 w-full" />
//                         <Skeleton className="h-24 w-full" />
//                         <Skeleton className="h-16 w-full" />
//                       </div>
//                     ) : (
//                       <>
//                         <div className="text-center">
//                           <div className="text-2xl font-bold mb-1">
//                             {achievements.filter((a) => a.unlocked).length}/{achievements.length}
//                           </div>
//                           <div className="text-sm text-muted-foreground">Achievements Unlocked</div>
//                         </div>

//                         <Progress
//                           value={(achievements.filter((a) => a.unlocked).length / achievements.length) * 100}
//                           className="h-2"
//                         />

//                         <Separator />

//                         <div className="space-y-3">
//                           {["common", "rare", "epic", "legendary"].map((rarity) => {
//                             const totalByRarity = achievements.filter((a) => a.rarity === rarity).length
//                             const unlockedByRarity = achievements.filter(
//                               (a) => a.rarity === rarity && a.unlocked,
//                             ).length

//                             return (
//                               <div key={rarity} className="flex justify-between items-center">
//                                 <Badge variant="outline" className={`text-xs ${getRarityColor(rarity)}`}>
//                                   {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
//                                 </Badge>
//                                 <span className="text-sm font-medium">
//                                   {unlockedByRarity}/{totalByRarity}
//                                 </span>
//                               </div>
//                             )
//                           })}
//                         </div>

//                         <Separator />

//                         <div className="text-center">
//                           <div className="text-sm text-muted-foreground mb-2">Next Achievement</div>
//                           {achievements.find((a) => !a.unlocked) ? (
//                             <div className="p-2 bg-muted/50 rounded-lg">
//                               <div className="text-sm font-medium">{achievements.find((a) => !a.unlocked)?.title}</div>
//                               <div className="text-xs text-muted-foreground">
//                                 {achievements.find((a) => !a.unlocked)?.description}
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="text-sm text-green-600 font-medium">All achievements unlocked! 🎉</div>
//                           )}
//                         </div>
//                       </>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             {/* Analytics Tab */}
//             <TabsContent value="analytics" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Activity Heatmap */}
//                 <Card className="lg:col-span-2">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Activity className="w-5 h-5" />
//                       Activity Overview
//                     </CardTitle>
//                     <CardDescription>Your coding activity over time</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <Skeleton className="h-70 w-full" />
//                     ) : activityData.length === 0 ? (
//                       <div className="text-center py-12 text-muted-foreground">
//                         <Activity size={48} className="mx-auto mb-4 opacity-50" />
//                         <h3 className="text-lg font-medium mb-2">No Activity Data Yet</h3>
//                         <p className="text-sm">Start solving problems to see your activity analytics here.</p>
//                       </div>
//                     ) : (
//                       <div className="h-70">
//                         <ChartContainer
//                           config={{
//                             problems: {
//                               label: "Problems Solved",
//                               color: "hsl(var(--chart-1))",
//                             },
//                             timeSpent: {
//                               label: "Hours Spent",
//                               color: "hsl(var(--chart-2))",
//                             },
//                           }}
//                         >
//                           <ResponsiveContainer width="100%" height="100%">
//                             <LineChart
//                               data={activityData.slice(-30).map((item) => ({
//                                 date: new Date(item.date).toLocaleDateString(),
//                                 problems: item.problemsSolved,
//                                 timeSpent: item.timeSpent / 60, // Convert to hours
//                               }))}
//                             >
//                               <CartesianGrid strokeDasharray="3 3" />
//                               <XAxis dataKey="date" />
//                               <YAxis yAxisId="left" orientation="left" />
//                               <YAxis yAxisId="right" orientation="right" />
//                               <ChartTooltip content={<ChartTooltipContent />} />
//                               <Legend />
//                               <Line
//                                 yAxisId="left"
//                                 type="monotone"
//                                 dataKey="problems"
//                                 stroke="var(--color-problems)"
//                                 name="Problems Solved"
//                                 activeDot={{ r: 8 }}
//                               />
//                               <Line
//                                 yAxisId="right"
//                                 type="monotone"
//                                 dataKey="timeSpent"
//                                 stroke="var(--color-timeSpent)"
//                                 name="Hours Spent"
//                               />
//                             </LineChart>
//                           </ResponsiveContainer>
//                         </ChartContainer>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Time Spent by Category */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Clock className="w-5 h-5" />
//                       Time Spent by Category
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <Skeleton className="h-70 w-full" />
//                     ) : timeSpentByCategory.length === 0 ? (
//                       <div className="text-center py-12 text-muted-foreground">
//                         <Clock size={48} className="mx-auto mb-4 opacity-50" />
//                         <p className="text-sm">No category data available yet</p>
//                       </div>
//                     ) : (
//                       <div className="h-70">
//                         <ChartContainer
//                           config={{
//                             hours: {
//                               label: "Hours",
//                               color: "hsl(var(--chart-3))",
//                             },
//                           }}
//                         >
//                           <ResponsiveContainer width="100%" height="100%">
//                             <BarChart data={timeSpentByCategory} layout="vertical" margin={{ left: 80 }}>
//                               <CartesianGrid strokeDasharray="3 3" />
//                               <XAxis type="number" />
//                               <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} />
//                               <ChartTooltip content={<ChartTooltipContent />} />
//                               <Bar dataKey="hours" fill="var(--color-hours)" name="Hours Spent" radius={[0, 4, 4, 0]} />
//                             </BarChart>
//                           </ResponsiveContainer>
//                         </ChartContainer>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Time Spent by Day */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Calendar className="w-5 h-5" />
//                       Time Spent by Day
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {loading ? (
//                       <Skeleton className="h-70 w-full" />
//                     ) : timeSpentByDay.length === 0 ? (
//                       <div className="text-center py-12 text-muted-foreground">
//                         <Calendar size={48} className="mx-auto mb-4 opacity-50" />
//                         <p className="text-sm">No daily activity data available yet</p>
//                       </div>
//                     ) : (
//                       <div className="h-70">
//                         <ChartContainer
//                           config={{
//                             hours: {
//                               label: "Hours",
//                               color: "hsl(var(--chart-4))",
//                             },
//                           }}
//                         >
//                           <ResponsiveContainer width="100%" height="100%">
//                             <BarChart data={timeSpentByDay}>
//                               <CartesianGrid strokeDasharray="3 3" />
//                               <XAxis dataKey="day" />
//                               <YAxis />
//                               <ChartTooltip content={<ChartTooltipContent />} />
//                               <Bar dataKey="hours" fill="var(--color-hours)" name="Hours Spent" radius={[4, 4, 0, 0]} />
//                             </BarChart>
//                           </ResponsiveContainer>
//                         </ChartContainer>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Performance Metrics */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <TrendingUp className="w-5 h-5" />
//                       Performance
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {loading ? (
//                       <div className="space-y-3">
//                         <Skeleton className="h-16 w-full" />
//                         <Skeleton className="h-16 w-full" />
//                         <Skeleton className="h-16 w-full" />
//                       </div>
//                     ) : (
//                       <>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div className="text-center p-3 bg-accent/30 rounded-lg">
//                             <div className="text-lg font-bold text-blue-600">
//                               {Math.round(stats.averageCompletion)}%
//                             </div>
//                             <div className="text-xs text-muted-foreground">Avg Completion</div>
//                           </div>
//                           <div className="text-center p-3 bg-accent/30 rounded-lg">
//                             <div className="text-lg font-bold text-green-600">{streak}</div>
//                             <div className="text-xs text-muted-foreground">Best Streak</div>
//                           </div>
//                         </div>

//                         <Separator />

//                         <div className="space-y-2">
//                           <div className="flex justify-between text-sm">
//                             <span>Consistency Score</span>
//                             <span className="font-medium">
//                               {streak >= 7 ? "Excellent" : streak >= 3 ? "Good" : "Building"}
//                             </span>
//                           </div>
//                           <div className="flex justify-between text-sm">
//                             <span>Problem Solving Rate</span>
//                             <span className="font-medium">{stats.problemsPerHour} problems/hour</span>
//                           </div>
//                           <div className="flex justify-between text-sm">
//                             <span>Most Active Day</span>
//                             <span className="font-medium">
//                               {timeSpentByDay.length > 0
//                                 ? timeSpentByDay.reduce((prev, current) =>
//                                   prev.hours > current.hours ? prev : current,
//                                 ).day
//                                 : "N/A"}
//                             </span>
//                           </div>
//                           <div className="flex justify-between text-sm">
//                             <span>Most Active Category</span>
//                             <span className="font-medium">
//                               {timeSpentByCategory.length > 0
//                                 ? timeSpentByCategory.reduce((prev, current) =>
//                                   prev.hours > current.hours ? prev : current,
//                                 ).category
//                                 : "N/A"}
//                             </span>
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Goals */}
//                 <Card className="lg:col-span-2">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Target className="w-5 h-5" />
//                       Goals & Milestones
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {loading ? (
//                       <div className="space-y-3">
//                         <Skeleton className="h-16 w-full" />
//                         <Skeleton className="h-16 w-full" />
//                         <Skeleton className="h-16 w-full" />
//                       </div>
//                     ) : (
//                       <>
//                         <div className="space-y-3">
//                           <div className="p-3 border rounded-lg">
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="text-sm font-medium">Complete 100 Problems</span>
//                               <span className="text-xs text-muted-foreground">{stats.totalCompleted}/100</span>
//                             </div>
//                             <Progress value={Math.min((stats.totalCompleted / 100) * 100, 100)} className="h-2" />
//                           </div>

//                           <div className="p-3 border rounded-lg">
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="text-sm font-medium">Complete All Sheets</span>
//                               <span className="text-xs text-muted-foreground">
//                                 {stats.sheetsCompleted}/{sheets.length}
//                               </span>
//                             </div>
//                             <Progress
//                               value={sheets.length > 0 ? (stats.sheetsCompleted / sheets.length) * 100 : 0}
//                               className="h-2"
//                             />
//                           </div>

//                           <div className="p-3 border rounded-lg">
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="text-sm font-medium">30-Day Streak</span>
//                               <span className="text-xs text-muted-foreground">{streak}/30 days</span>
//                             </div>
//                             <Progress value={Math.min((streak / 30) * 100, 100)} className="h-2" />
//                           </div>

//                           <div className="p-3 border rounded-lg">
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="text-sm font-medium">Reach 100 Hours</span>
//                               <span className="text-xs text-muted-foreground">{totalTimeSpent}/100 hours</span>
//                             </div>
//                             <Progress value={Math.min((totalTimeSpent / 100) * 100, 100)} className="h-2" />
//                           </div>
//                         </div>

//                         <div className="flex gap-2">
//                           <Button variant="outline" size="sm" className="flex-1">
//                             Set Custom Goals
//                           </Button>
//                           <Button variant="outline" size="sm" className="flex-1">
//                             Export Analytics
//                           </Button>
//                         </div>
//                       </>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>
//           </Tabs>
//         )}
//       </div>
//     </ProtectedRoute>
//   )
// }


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import EditProfileForm from "@/components/profile/EditProfileForm"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  CheckCircle,
  Calendar,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Code,
  Trophy,
  BookOpen,
  Target,
  TrendingUp,
  MapPin,
  Mail,
  Flame,
  Zap,
  Activity,
  Coffee,
  Brain,
  Share2,
  Crown,
  AlertCircle,
  Edit,
  ExternalLink,
  Star
} from "lucide-react"
import Link from "next/link"

interface Sheet {
  _id: string
  title: string
  description: string
  totalProblems: number
  difficulty?: "Easy" | "Medium" | "Hard"
  category?: string
}

interface SheetProgress {
  sheetId: string
  completedProblemIds: string[]
  lastAccessed?: string
  timeSpent?: number
}

interface Achievement {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  unlockedAt?: string
  category: "progress" | "consistency" | "mastery" | "special"
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface ActivityData {
  date: string
  problemsSolved: number
  timeSpent: number
  sheetsWorkedOn: string[]
}

interface LeetCodeStats {
  username: string
  totalSolved: number
  totalQuestions: number
  easySolved: number
  easyTotal: number
  mediumSolved: number
  mediumTotal: number
  hardSolved: number
  hardTotal: number
  acceptanceRate: number
  ranking: number
  contributionPoints: number
  reputation: number
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditMode, setIsEditMode] = useState(false)
  const [sheets, setSheets] = useState<Sheet[]>([])
  const [progress, setProgress] = useState<Record<string, SheetProgress>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [totalTimeSpent, setTotalTimeSpent] = useState(0)
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [timeSpentByDay, setTimeSpentByDay] = useState<{ day: string; hours: number }[]>([])
  const [timeSpentByCategory, setTimeSpentByCategory] = useState<{ category: string; hours: number }[]>([])
  const [profileLinkCopied, setProfileLinkCopied] = useState(false)
  const [leetcodeUsername, setLeetcodeUsername] = useState("")
  const [leetcodeStats, setLeetcodeStats] = useState<LeetCodeStats | null>(null)
  const [leetcodeLoading, setLeetcodeLoading] = useState(false)
  const [leetcodeError, setLeetcodeError] = useState<string | null>(null)

  // Fetch LeetCode stats
  const fetchLeetCodeStats = async (username: string) => {
    if (!username.trim()) return

    setLeetcodeLoading(true)
    setLeetcodeError(null)

    try {
      // Using a public LeetCode API
      const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
      if (!response.ok) {
        throw new Error("User not found")
      }

      const data = await response.json()
      setLeetcodeStats({
        username: data.username || username,
        totalSolved: data.totalSolved || 0,
        totalQuestions: data.totalQuestions || 3000,
        easySolved: data.easySolved || 0,
        easyTotal: data.easyTotal || 800,
        mediumSolved: data.mediumSolved || 0,
        mediumTotal: data.mediumTotal || 1600,
        hardSolved: data.hardSolved || 0,
        hardTotal: data.hardTotal || 600,
        acceptanceRate: data.acceptanceRate || 0,
        ranking: data.ranking || 0,
        contributionPoints: data.contributionPoints || 0,
        reputation: data.reputation || 0,
      })
    } catch (err) {
      setLeetcodeError("Failed to fetch LeetCode stats. Please check the username.")
      setLeetcodeStats(null)
    } finally {
      setLeetcodeLoading(false)
    }
  }

  // Load saved LeetCode username
  useEffect(() => {
    const savedUsername = localStorage.getItem("leetcode-username")
    if (savedUsername) {
      setLeetcodeUsername(savedUsername)
      fetchLeetCodeStats(savedUsername)
    }
  }, [])

  // Save LeetCode username
  const saveLeetCodeUsername = () => {
    localStorage.setItem("leetcode-username", leetcodeUsername)
    fetchLeetCodeStats(leetcodeUsername)
  }

  // Fetch sheets on component mount
  useEffect(() => {
    const fetchSheets = async () => {
      try {
        setLoading(true)
        const { data } = await apiClient.getAllSheets()
        setSheets(data)
      } catch (err: unknown) {
        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "data" in err.response &&
          err.response.data &&
          typeof err.response.data === "object" &&
          "error" in err.response.data &&
          typeof err.response.data.error === "string"
        ) {
          setError(err.response.data.error)
        } else {
          setError("Failed to fetch sheets")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSheets()
  }, [])

  // Fetch user progress for each sheet
  useEffect(() => {
    if (!user || sheets.length === 0) return

    const fetchUserProgress = async () => {
      try {
        const userProgress: Record<string, SheetProgress> = {}
        let totalTime = 0

        // Fetch streak data
        try {
          const { data: streakData } = await apiClient.getUserStreak()
          setStreak(streakData.currentStreak || 0)
        } catch (error) {
          console.error("Error fetching streak data:", error)
          setStreak(Math.floor(Math.random() * 15) + 1)
        }

        // Fetch activity data
        try {
          const { data: activityLog } = await apiClient.getUserActivity()
          setActivityData(activityLog)

          const timeByDay = processTimeByDay(activityLog)
          setTimeSpentByDay(timeByDay)

          const timeByCategory = processTimeByCategory(activityLog, sheets)
          setTimeSpentByCategory(timeByCategory)
        } catch (error) {
          console.error("Error fetching activity data:", error)
          const mockActivityData = generateMockActivityData()
          setActivityData(mockActivityData)

          const timeByDay = processTimeByDay(mockActivityData)
          setTimeSpentByDay(timeByDay)

          const timeByCategory = processTimeByCategory(mockActivityData, sheets)
          setTimeSpentByCategory(timeByCategory)
        }

        for (const sheet of sheets) {
          try {
            const { data } = await apiClient.getProgress(sheet._id)
            userProgress[sheet._id] = data

            if (data.timeSpent) {
              totalTime += data.timeSpent
            }
          } catch (error) {
            userProgress[sheet._id] = {
              sheetId: sheet._id,
              completedProblemIds: [],
              timeSpent: Math.floor(Math.random() * 3600) + 600,
            }

            totalTime += userProgress[sheet._id].timeSpent || 0
          }
        }

        setProgress(userProgress)
        setTotalTimeSpent(Math.round(totalTime / 3600))
      } catch (err) {
        console.error("Error fetching user progress:", err)
      }
    }

    fetchUserProgress()
  }, [user, sheets])

  // Generate mock activity data if API fails
  const generateMockActivityData = (): ActivityData[] => {
    const mockData: ActivityData[] = []
    const today = new Date()

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const recencyFactor = 1 - i / 40
      const randomFactor = Math.random() * 0.5 + 0.5

      const problemsSolved = Math.floor(5 * recencyFactor * randomFactor)
      const timeSpent = Math.floor(120 * recencyFactor * randomFactor)

      const sheetsWorkedOn: string[] = []
      if (problemsSolved > 0 && sheets.length > 0) {
        const numSheets = Math.min(Math.floor(Math.random() * 3) + 1, sheets.length)
        const shuffledSheets = [...sheets].sort(() => 0.5 - Math.random())

        for (let j = 0; j < numSheets; j++) {
          sheetsWorkedOn.push(shuffledSheets[j]._id)
        }
      }

      mockData.push({
        date: dateString,
        problemsSolved,
        timeSpent,
        sheetsWorkedOn,
      })
    }

    return mockData
  }

  // Process time spent by day of week
  const processTimeByDay = (activityData: ActivityData[]): { day: string; hours: number }[] => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const timeByDay = days.map((day) => ({ day, hours: 0 }))

    activityData.forEach((activity) => {
      const date = new Date(activity.date)
      const dayIndex = date.getDay()
      timeByDay[dayIndex].hours += activity.timeSpent / 60
    })

    return timeByDay.map((day) => ({
      ...day,
      hours: Number.parseFloat(day.hours.toFixed(1)),
    }))
  }

  // Process time spent by category
  const processTimeByCategory = (
    activityData: ActivityData[],
    sheets: Sheet[],
  ): { category: string; hours: number }[] => {
    const categories: Record<string, number> = {}

    sheets.forEach((sheet) => {
      if (sheet.category && !categories[sheet.category]) {
        categories[sheet.category] = 0
      }
    })

    const defaultCategories = ["Algorithms", "Data Structures", "Dynamic Programming", "Graphs"]
    defaultCategories.forEach((category) => {
      if (!categories[category]) {
        categories[category] = 0
      }
    })

    const sheetCategories: Record<string, string> = {}
    sheets.forEach((sheet) => {
      if (sheet.category) {
        sheetCategories[sheet._id] = sheet.category
      }
    })

    activityData.forEach((activity) => {
      activity.sheetsWorkedOn.forEach((sheetId) => {
        const category =
          sheetCategories[sheetId] || defaultCategories[Math.floor(Math.random() * defaultCategories.length)]
        if (!categories[category]) {
          categories[category] = 0
        }
        categories[category] += activity.timeSpent / 60
      })
    })

    if (Object.keys(categories).every((key) => categories[key] === 0)) {
      defaultCategories.forEach((category) => {
        categories[category] = Math.floor(Math.random() * 10) + 1
      })
    }

    return Object.entries(categories)
      .filter(([_, hours]) => hours > 0)
      .map(([category, hours]) => ({
        category,
        hours: Number.parseFloat(hours.toFixed(1)),
      }))
  }

  // Calculate completion percentage for a sheet
  const getCompletionPercentage = (sheetId: string, totalProblems: number) => {
    const sheetProgress = progress[sheetId]
    if (!sheetProgress || totalProblems === 0) return 0
    return Math.round((sheetProgress.completedProblemIds.length / totalProblems) * 100)
  }


  interface ProgressStats {
    solved: number;
    total: number;
  }

  const getProgressPercentage = (solved: number, total: number): number => {
    return Math.round((solved / total) * 100);
  };

  interface DifficultyStyle {
    readonly easy: string;
    readonly medium: string;
    readonly hard: string;
  }

  type DifficultyLevel = keyof DifficultyStyle | string;

  const getDifficultyGradient = (difficulty: DifficultyLevel): string => {
    switch (difficulty) {
      case 'easy':
        return 'from-emerald-400 to-green-500';
      case 'medium':
        return 'from-amber-400 to-orange-500';
      case 'hard':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-blue-400 to-purple-500';
    }
  };

  // Calculate overall stats
  const calculateOverallStats = () => {
    if (!user || sheets.length === 0)
      return {
        totalCompleted: 0,
        totalProblems: 0,
        completion: 0,
        sheetsCompleted: 0,
        averageCompletion: 0,
        rank: "Beginner",
        problemsPerHour: 0,
      }

    const totalProblems = sheets.reduce((sum, sheet) => sum + sheet.totalProblems, 0)
    const totalCompleted = Object.values(progress).reduce((sum, prog) => sum + prog.completedProblemIds.length, 0)

    const completion = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0
    const sheetsCompleted = sheets.filter(
      (sheet) => getCompletionPercentage(sheet._id, sheet.totalProblems) === 100,
    ).length

    const averageCompletion =
      sheets.length > 0
        ? sheets.reduce((sum, sheet) => sum + getCompletionPercentage(sheet._id, sheet.totalProblems), 0) /
        sheets.length
        : 0

    const problemsPerHour = totalTimeSpent > 0 ? Number.parseFloat((totalCompleted / totalTimeSpent).toFixed(1)) : 0

    let rank = "Beginner"
    if (completion >= 90) rank = "Grandmaster"
    else if (completion >= 70) rank = "Expert"
    else if (completion >= 50) rank = "Advanced"
    else if (completion >= 25) rank = "Intermediate"

    return {
      totalCompleted,
      totalProblems,
      completion,
      sheetsCompleted,
      averageCompletion: Math.round(averageCompletion),
      rank,
      problemsPerHour,
    }
  }

  const stats = calculateOverallStats()

  // Enhanced achievements system
  const achievements: Achievement[] = [
    {
      id: 1,
      title: "First Steps",
      description: "Solved your first problem",
      icon: <CheckCircle className="h-5 w-5" />,
      unlocked: stats.totalCompleted > 0,
      unlockedAt: stats.totalCompleted > 0 ? "2023-05-15" : undefined,
      category: "progress",
      rarity: "common",
    },
    {
      id: 2,
      title: "Consistency King",
      description: "Maintained a 7-day streak",
      icon: <Flame className="h-5 w-5" />,
      unlocked: streak >= 7,
      unlockedAt: streak >= 7 ? "2023-06-22" : undefined,
      category: "consistency",
      rarity: "rare",
    },
    {
      id: 3,
      title: "Sheet Conqueror",
      description: "Completed your first sheet",
      icon: <Trophy className="h-5 w-5" />,
      unlocked: stats.sheetsCompleted > 0,
      unlockedAt: stats.sheetsCompleted > 0 ? "2023-07-10" : undefined,
      category: "progress",
      rarity: "common",
    },
    {
      id: 4,
      title: "Problem Solver",
      description: "Solved 25+ problems",
      icon: <Target className="h-5 w-5" />,
      unlocked: stats.totalCompleted >= 25,
      unlockedAt: stats.totalCompleted >= 25 ? "2023-08-05" : undefined,
      category: "progress",
      rarity: "common",
    },
    {
      id: 5,
      title: "Algorithm Master",
      description: "Achieved 50%+ completion",
      icon: <Brain className="h-5 w-5" />,
      unlocked: stats.completion >= 50,
      unlockedAt: stats.completion >= 50 ? "2023-09-18" : undefined,
      category: "mastery",
      rarity: "rare",
    },
    {
      id: 6,
      title: "DSA Legend",
      description: "Achieved 90%+ completion",
      icon: <Crown className="h-5 w-5" />,
      unlocked: stats.completion >= 90,
      unlockedAt: stats.completion >= 90 ? "2023-11-30" : undefined,
      category: "mastery",
      rarity: "legendary",
    },
    {
      id: 7,
      title: "Speed Demon",
      description: "Solved 10 problems in one day",
      icon: <Zap className="h-5 w-5" />,
      unlocked: activityData.some((data) => data.problemsSolved >= 10),
      unlockedAt: activityData.some((data) => data.problemsSolved >= 10) ? "2023-10-12" : undefined,
      category: "special",
      rarity: "epic",
    },
    {
      id: 8,
      title: "Night Owl",
      description: "Solved problems after midnight",
      icon: <Coffee className="h-5 w-5" />,
      unlocked: activityData.some((data) => {
        const hour = new Date(data.date).getHours()
        return hour >= 0 && hour < 5
      }),
      unlockedAt: activityData.some((data) => {
        const hour = new Date(data.date).getHours()
        return hour >= 0 && hour < 5
      })
        ? "2023-12-05"
        : undefined,
      category: "special",
      rarity: "rare",
    },
  ]

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-500 border-gray-500/30 bg-gray-500/10"
      case "rare":
        return "text-blue-500 border-blue-500/30 bg-blue-500/10"
      case "epic":
        return "text-purple-500 border-purple-500/30 bg-purple-500/10"
      case "legendary":
        return "text-yellow-500 border-yellow-500/30 bg-yellow-500/10"
      default:
        return "text-gray-500 border-gray-500/30 bg-gray-500/10"
    }
  }

  // Social links
  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github size={16} />,
      url: user?.socialLinks?.github,
    },
    {
      name: "Twitter",
      icon: <Twitter size={16} />,
      url: user?.socialLinks?.twitter,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={16} />,
      url: user?.socialLinks?.linkedin,
    },
    {
      name: "Website",
      icon: <Globe size={16} />,
      url: user?.socialLinks?.personalSite,
    },
  ]

  const copyProfileUrl = () => {
    navigator.clipboard.writeText(window.location.href)
    setProfileLinkCopied(true)
    setTimeout(() => setProfileLinkCopied(false), 2000)
  }

  // Format time for display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  // Get last 7 days activity data for chart
  const getLast7DaysActivity = () => {
    const last7Days = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const activityForDay = activityData.find((a) => a.date.includes(dateString))

      last7Days.push({
        date: dateString,
        problems: activityForDay?.problemsSolved || 0,
        time: activityForDay ? Math.round(activityForDay.timeSpent / 60) : 0,
      })
    }

    return last7Days
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={user?.avatarUrl || "/placeholder.svg?height=80&width=80"}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback className="text-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -top-2 -right-2 w-8 h-8 bg-gray-700 border-gray-600 hover:bg-gray-600"
                        onClick={() => setIsEditMode(!isEditMode)}
                      >
                        <Edit size={14} />
                      </Button>
                    </div>

                    <div className="text-center">
                      <h2 className="text-xl font-bold">{user?.name || "User Name"}</h2>
                      <p className="text-sm text-gray-400">
                        {user?.bio}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Skills */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Technical Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      Java
                    </Badge>
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      JavaScript
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Python
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-gray-300">
                      {user?.email ?? "user@example.com"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-gray-300">
                      {user?.location ?? "Unknown location"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-300">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                        : "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>


              {/* Social Links */}
              {socialLinks.some((link) => link.url) && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex gap-2">
                      {socialLinks.map(
                        (social) =>
                          social.url && (
                            <TooltipProvider key={social.name}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
                                  >
                                    {social.icon}
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{social.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Share Profile */}
              <Button
                variant="outline"
                className="w-full bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30"
                onClick={copyProfileUrl}
              >
                <Share2 size={16} className="mr-2" />
                Share your Profile
              </Button>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {isEditMode ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Edit Your Profile</span>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditMode(false)}>
                        Cancel
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EditProfileForm />
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Overall Progress */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-xl">Overall Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {loading ? (
                        <div className="space-y-4">
                          <Skeleton className="h-16 w-full bg-gray-700" />
                          <Skeleton className="h-16 w-full bg-gray-700" />
                          <Skeleton className="h-16 w-full bg-gray-700" />
                        </div>
                      ) : sheets.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                          <p>No problem sheets available</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {sheets.slice(0, 4).map((sheet) => {
                            const completionPercentage = getCompletionPercentage(sheet._id, sheet.totalProblems)
                            const completed = progress[sheet._id]?.completedProblemIds.length || 0

                            return (
                              <div key={sheet._id} className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">{sheet.title}</span>
                                    <span className="text-sm text-gray-400">{completionPercentage}%</span>
                                  </div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-500">
                                      {completed}/{sheet.totalProblems}
                                    </span>
                                  </div>
                                  <Progress value={completionPercentage} className="h-2 bg-gray-700" />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Tabs for detailed content */}
                  <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-1">
                      <TabsList className="grid w-full grid-cols-4 bg-transparent">
                        <TabsTrigger
                          value="overview"
                          className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-400"
                        >
                          Overview
                        </TabsTrigger>
                        <TabsTrigger
                          value="progress"
                          className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
                        >
                          Progress
                        </TabsTrigger>
                        <TabsTrigger
                          value="achievements"
                          className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
                        >
                          Achievements
                        </TabsTrigger>
                        <TabsTrigger
                          value="analytics"
                          className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
                        >
                          Analytics
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    {/* Tab Content */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-6">
                        <TabsContent value="overview" className="mt-0">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Total Progress */}
                            <div className="text-center">
                              <div className="relative w-24 h-24 mx-auto mb-4">
                                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-gray-700"
                                  />
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={`${2 * Math.PI * 40}`}
                                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.completion / 100)}`}
                                    className="text-orange-500"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-sm font-bold">{stats.completion}%</span>
                                </div>
                              </div>
                              <h3 className="font-semibold mb-1">Total Progress</h3>
                              <p className="text-2xl font-bold">
                                {stats.totalCompleted}/{stats.totalProblems}
                              </p>
                            </div>

                            {/* Easy */}
                            <div className="text-center">
                              <div className="text-green-400 mb-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                                <h3 className="font-semibold">Easy</h3>
                              </div>
                              <p className="text-xl font-bold">
                                {Math.floor(stats.totalCompleted * 0.4)}/{Math.floor(stats.totalProblems * 0.4)}
                                <span className="text-sm text-gray-400 ml-1">completed</span>
                              </p>
                              <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                                <div
                                  className="bg-green-400 h-1 rounded-full"
                                  style={{
                                    width: `${Math.min((Math.floor(stats.totalCompleted * 0.4) / Math.floor(stats.totalProblems * 0.4)) * 100, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>

                            {/* Medium */}
                            <div className="text-center">
                              <div className="text-yellow-400 mb-2">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full mx-auto mb-2"></div>
                                <h3 className="font-semibold">Medium</h3>
                              </div>
                              <p className="text-xl font-bold">
                                {Math.floor(stats.totalCompleted * 0.5)}/{Math.floor(stats.totalProblems * 0.5)}
                                <span className="text-sm text-gray-400 ml-1">completed</span>
                              </p>
                              <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                                <div
                                  className="bg-yellow-400 h-1 rounded-full"
                                  style={{
                                    width: `${Math.min((Math.floor(stats.totalCompleted * 0.5) / Math.floor(stats.totalProblems * 0.5)) * 100, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>

                            {/* Hard */}
                            <div className="text-center">
                              <div className="text-red-400 mb-2">
                                <div className="w-3 h-3 bg-red-400 rounded-full mx-auto mb-2"></div>
                                <h3 className="font-semibold">Hard</h3>
                              </div>
                              <p className="text-xl font-bold">
                                {Math.floor(stats.totalCompleted * 0.1)}/{Math.floor(stats.totalProblems * 0.1)}
                                <span className="text-sm text-gray-400 ml-1">completed</span>
                              </p>
                              <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                                <div
                                  className="bg-red-400 h-1 rounded-full"
                                  style={{
                                    width: `${Math.min((Math.floor(stats.totalCompleted * 0.1) / Math.floor(stats.totalProblems * 0.1)) * 100, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Topics Covered */}
                          <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">Topics covered</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {[
                                { name: "Maths", count: 1 },
                                { name: "Arrays", count: 0 },
                                { name: "Binary Search", count: 0 },
                                { name: "Binary Search Tree", count: 0 },
                                { name: "Binary Tree", count: 0 },
                                { name: "Bit Manipulation", count: 0 },
                                { name: "Dynamic Programming", count: 0 },
                                { name: "Graph", count: 0 },
                                { name: "Greedy", count: 0 },
                                { name: "Hashing", count: 0 },
                                { name: "Heap", count: 0 },
                                { name: "Linked List", count: 0 },
                                { name: "Python", count: 0 },
                                { name: "Queue", count: 0 },
                                { name: "Recursion", count: 0 },
                                { name: "Sliding Window", count: 0 },
                                { name: "Sorting", count: 0 },
                                { name: "Stack", count: 0 },
                                { name: "String", count: 0 },
                                { name: "Trie", count: 0 },
                              ].map((topic) => (
                                <Badge
                                  key={topic.name}
                                  variant="outline"
                                  className="justify-between bg-gray-700 border-gray-600 text-gray-300"
                                >
                                  {topic.name}
                                  <span className="ml-2 text-xs">{topic.count}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="progress" className="mt-0">
                          <div className="space-y-6">
                            {sheets.map((sheet) => {
                              const completionPercentage = getCompletionPercentage(sheet._id, sheet.totalProblems)
                              const completed = progress[sheet._id]?.completedProblemIds.length || 0
                              const timeSpent = progress[sheet._id]?.timeSpent || 0

                              return (
                                <Card key={sheet._id} className="bg-gray-700 border-gray-600">
                                  <CardContent className="p-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                          <div className="p-2 rounded-md bg-blue-500/20 text-blue-400">
                                            <Code size={16} />
                                          </div>
                                          <div>
                                            <h3 className="font-semibold">{sheet.title}</h3>
                                            <p className="text-sm text-gray-400 mt-1">
                                              {sheet.description.substring(0, 100)}...
                                            </p>
                                          </div>
                                        </div>

                                        <div className="space-y-2">
                                          <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">
                                              {completed} / {sheet.totalProblems} problems solved
                                            </span>
                                            <span className="font-medium">{completionPercentage}%</span>
                                          </div>
                                          <Progress value={completionPercentage} className="h-2 bg-gray-600" />
                                          {timeSpent > 0 && (
                                            <div className="text-xs text-gray-500">
                                              Time spent: {formatTime(timeSpent)}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {completionPercentage === 100 && (
                                          <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                                            <CheckCircle size={14} className="mr-1" />
                                            Completed
                                          </Badge>
                                        )}
                                        <Button asChild variant="outline" size="sm" className="border-gray-600">
                                          <Link href={`/sheets/${sheet._id}`}>
                                            {completionPercentage === 100 ? "Review" : "Continue"}
                                          </Link>
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            })}
                          </div>
                        </TabsContent>

                        <TabsContent value="achievements" className="mt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {achievements.map((achievement) => (
                              <Card
                                key={achievement.id}
                                className={`transition-all duration-300 ${achievement.unlocked
                                  ? "bg-gray-700 border-gray-600"
                                  : "bg-gray-800 border-gray-700 opacity-60"
                                  }`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={`p-3 rounded-full ${achievement.unlocked ? "bg-gray-600" : "bg-gray-700"
                                        }`}
                                    >
                                      {achievement.icon}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold">{achievement.title}</h4>
                                        <Badge
                                          variant="outline"
                                          className={`text-xs ${getRarityColor(achievement.rarity)}`}
                                        >
                                          {achievement.rarity}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs border-gray-600">
                                          {achievement.category}
                                        </Badge>
                                        {achievement.unlocked ? (
                                          <div className="flex items-center gap-1 text-xs text-green-400">
                                            <CheckCircle size={12} />
                                            Unlocked
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <AlertCircle size={12} />
                                            Locked
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="analytics" className="mt-0">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Activity Chart */}
                            <Card className="bg-gray-700 border-gray-600">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Activity className="w-5 h-5" />
                                  Recent Activity
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {loading ? (
                                  <Skeleton className="h-70 w-full bg-gray-600" />
                                ) : (
                                  <div className="h-70">
                                    <ChartContainer
                                      config={{
                                        problems: {
                                          label: "Problems Solved",
                                          color: "hsl(var(--chart-1))",
                                        },
                                      }}
                                    >
                                      <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={getLast7DaysActivity()}>
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis
                                            dataKey="date"
                                            tickFormatter={(value) => {
                                              const date = new Date(value)
                                              return date.toLocaleDateString("en-US", { weekday: "short" })
                                            }}
                                          />
                                          <YAxis />
                                          <ChartTooltip content={<ChartTooltipContent />} />
                                          <Bar dataKey="problems" fill="var(--color-problems)" name="Problems Solved" />
                                        </BarChart>
                                      </ResponsiveContainer>
                                    </ChartContainer>
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            {/* Performance Metrics */}
                            <Card className="bg-gray-700 border-gray-600">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <TrendingUp className="w-5 h-5" />
                                  Performance
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-center p-3 bg-gray-600 rounded-lg">
                                    <div className="text-lg font-bold text-blue-400">
                                      {Math.round(stats.averageCompletion)}%
                                    </div>
                                    <div className="text-xs text-gray-400">Avg Completion</div>
                                  </div>
                                  <div className="text-center p-3 bg-gray-600 rounded-lg">
                                    <div className="text-lg font-bold text-green-400">{streak}</div>
                                    <div className="text-xs text-gray-400">Current Streak</div>
                                  </div>
                                </div>

                                <Separator className="bg-gray-600" />

                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Problem Solving Rate</span>
                                    <span className="font-medium">{stats.problemsPerHour} problems/hour</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Total Time Spent</span>
                                    <span className="font-medium">{totalTimeSpent} hours</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Current Rank</span>
                                    <span className="font-medium">{stats.rank}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </TabsContent>
                      </CardContent>
                    </Card>
                  </Tabs>
                </>
              )}
            </div>

            {/* Right Sidebar - LeetCode Profile */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700/50 shadow-2xl overflow-hidden relative">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-400/30 to-transparent rounded-full blur-xl"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-red-400/30 to-transparent rounded-full blur-xl"></div>
                </div>

                <CardHeader className="relative pb-2">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        LeetCode Mastery
                      </div>
                      <div className="text-xs text-gray-400 font-normal">Coding Excellence Tracker</div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 hover:bg-white/10 rounded-full"
                      onClick={() => setIsEditMode(!isEditMode)}
                    >
                      <Edit size={14} className="text-gray-400" />
                    </Button>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 relative">
                  {/* Username Input Section */}
                  <div className="space-y-3">
                    <Label htmlFor="leetcode-username" className="text-sm font-medium text-gray-300">
                      LeetCode Username
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="leetcode-username"
                        value={leetcodeUsername}
                        onChange={(e) => setLeetcodeUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="bg-gray-800/50 border-gray-600/50 focus:border-orange-500/50 focus:ring-orange-500/20 backdrop-blur-sm"
                      />
                      <Button
                        size="sm"
                        onClick={saveLeetCodeUsername}
                        disabled={leetcodeLoading || !leetcodeUsername.trim()}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium px-4 shadow-lg hover:shadow-orange-500/25 transition-all duration-200"
                      >
                        {leetcodeLoading ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                  </div>

                  {leetcodeError && (
                    <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg backdrop-blur-sm">
                      {leetcodeError}
                    </div>
                  )}

                  {leetcodeLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : leetcodeStats ? (
                    <div className="space-y-6">
                      {/* Hero Stats Card */}
                      <div className="relative p-6 bg-gradient-to-br from-gray-800/80 to-gray-700/80 rounded-2xl border border-gray-600/30 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-orange-400" />
                            <span className="text-sm font-medium text-gray-300">Overall Progress</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-400">#{leetcodeStats.ranking.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                            {leetcodeStats.totalSolved}
                          </div>
                          <div className="text-sm text-gray-400 mb-4">
                            out of {leetcodeStats.totalQuestions.toLocaleString()} problems
                          </div>

                          {/* Circular Progress */}
                          <div className="relative w-24 h-24 mx-auto mb-4">
                            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-gray-700"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="url(#progress-gradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${getProgressPercentage(leetcodeStats.totalSolved, leetcodeStats.totalQuestions) * 2.51} 251`}
                                className="transition-all duration-1000 ease-out"
                              />
                              <defs>
                                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#f97316" />
                                  <stop offset="100%" stopColor="#ef4444" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-lg font-bold text-white">
                                {getProgressPercentage(leetcodeStats.totalSolved, leetcodeStats.totalQuestions)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Difficulty Breakdown */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-300">Difficulty Breakdown</span>
                        </div>

                        {/* Easy */}
                        <div className="group relative p-4 bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-xl border border-gray-600/30 hover:border-emerald-500/30 transition-all duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 bg-gradient-to-r ${getDifficultyGradient('easy')} rounded-full shadow-lg`}></div>
                              <span className="text-sm font-medium text-gray-200">Easy</span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">
                                {leetcodeStats.easySolved}
                              </div>
                              <div className="text-xs text-gray-400">
                                /{leetcodeStats.easyTotal}
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 bg-gradient-to-r ${getDifficultyGradient('easy')} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                              style={{ width: `${getProgressPercentage(leetcodeStats.easySolved, leetcodeStats.easyTotal)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 text-right">
                            {getProgressPercentage(leetcodeStats.easySolved, leetcodeStats.easyTotal)}% complete
                          </div>
                        </div>

                        {/* Medium */}
                        <div className="group relative p-4 bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-xl border border-gray-600/30 hover:border-amber-500/30 transition-all duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 bg-gradient-to-r ${getDifficultyGradient('medium')} rounded-full shadow-lg`}></div>
                              <span className="text-sm font-medium text-gray-200">Medium</span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">
                                {leetcodeStats.mediumSolved}
                              </div>
                              <div className="text-xs text-gray-400">
                                /{leetcodeStats.mediumTotal}
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 bg-gradient-to-r ${getDifficultyGradient('medium')} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                              style={{ width: `${getProgressPercentage(leetcodeStats.mediumSolved, leetcodeStats.mediumTotal)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 text-right">
                            {getProgressPercentage(leetcodeStats.mediumSolved, leetcodeStats.mediumTotal)}% complete
                          </div>
                        </div>

                        {/* Hard */}
                        <div className="group relative p-4 bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-xl border border-gray-600/30 hover:border-red-500/30 transition-all duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 bg-gradient-to-r ${getDifficultyGradient('hard')} rounded-full shadow-lg`}></div>
                              <span className="text-sm font-medium text-gray-200">Hard</span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">
                                {leetcodeStats.hardSolved}
                              </div>
                              <div className="text-xs text-gray-400">
                                /{leetcodeStats.hardTotal}
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 bg-gradient-to-r ${getDifficultyGradient('hard')} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                              style={{ width: `${getProgressPercentage(leetcodeStats.hardSolved, leetcodeStats.hardTotal)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 text-right">
                            {getProgressPercentage(leetcodeStats.hardSolved, leetcodeStats.hardTotal)}% complete
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      {leetcodeStats.acceptanceRate > 0 && (
                        <div className="p-4 bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-xl border border-gray-600/20 backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-gray-300">Performance</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-400 mb-1">
                                {leetcodeStats.acceptanceRate.toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-400">Success Rate</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-400 mb-1">
                                #{leetcodeStats.ranking.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-400">Global Rank</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Profile Link */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-gradient-to-r from-gray-800/80 to-gray-700/80 border-gray-600/50 hover:border-orange-500/50 hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-red-500/10 text-gray-200 font-medium transition-all duration-300 group backdrop-blur-sm"
                        asChild
                      >
                        <a
                          href={`https://leetcode.com/${leetcodeStats.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink size={14} className="group-hover:text-orange-400 transition-colors" />
                          View Full LeetCode Profile
                          <Zap size={12} className="group-hover:text-orange-400 transition-colors ml-auto" />
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-4">
                      <div className="relative">
                        <Code size={64} className="mx-auto text-gray-600 opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl"></div>
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium mb-1">Ready to showcase your coding skills?</p>
                        <p className="text-sm text-gray-500">Enter your LeetCode username to display your achievements</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
