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

export default function ProgressReport() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [selectedSheetId, setSelectedSheetId] = useState<string>('');
  const [progressData, setProgressData] = useState<SheetProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
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
      } catch (err: any) {
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

        // In a real implementation, this would call a specific API endpoint
        // for getting aggregated progress data for a sheet
        // For demo purposes, we'll create mock data

        const mockData: SheetProgress[] = [
          {
            userId: '1',
            userName: 'Alice Johnson',
            userEmail: 'alice@example.com',
            completionPercentage: 75,
            completedProblems: 15,
            totalProblems: 20,
            byDifficulty: {
              Easy: { completed: 8, total: 8 },
              Medium: { completed: 5, total: 8 },
              Hard: { completed: 2, total: 4 }
            }
          },
          {
            userId: '2',
            userName: 'Bob Smith',
            userEmail: 'bob@example.com',
            completionPercentage: 40,
            completedProblems: 8,
            totalProblems: 20,
            byDifficulty: {
              Easy: { completed: 6, total: 8 },
              Medium: { completed: 2, total: 8 },
              Hard: { completed: 0, total: 4 }
            }
          },
          {
            userId: '3',
            userName: 'Charlie Davis',
            userEmail: 'charlie@example.com',
            completionPercentage: 100,
            completedProblems: 20,
            totalProblems: 20,
            byDifficulty: {
              Easy: { completed: 8, total: 8 },
              Medium: { completed: 8, total: 8 },
              Hard: { completed: 4, total: 4 }
            }
          }
        ];

        setProgressData(mockData);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch progress report');
      } finally {
        setReportLoading(false);
      }
    };

    fetchProgressReport();
  }, [selectedSheetId]);

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

  const overallStats = calculateOverallStats();

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
        <CardDescription>View user completion rates for each sheet</CardDescription>

        <div className="mt-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
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

          <Button className="w-full md:w-auto" disabled={!selectedSheetId}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {reportLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
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
                {progressData.map(user => (
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
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
