'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProfileCard from '@/components/profile/ProfileCard';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

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

export default function HomePage() {
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

  // Loading state
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="h-[300px] rounded-lg bg-card animate-pulse"></div>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div className="h-16 rounded-lg bg-card animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-lg bg-card animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar */}
      <div className="md:col-span-1">
        <ProfileCard />
      </div>

      {/* Main content */}
      <div className="md:col-span-2 space-y-6">
        {/* Welcome card */}
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold">
              Welcome{user ? `, ${user.name}` : ' to AlgoVista'}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your progress on algorithm problems with personalized sheets.
              {!user && " Sign in to save your progress across devices."}
            </p>
          </CardContent>
        </Card>

        {/* Sheets list */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Problem Sheets</h2>

          {error ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center py-4 text-destructive">
                  <AlertCircle className="mr-2" />
                  {error}
                </div>
              </CardContent>
            </Card>
          ) : sheets.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  No problem sheets available
                </div>
              </CardContent>
            </Card>
          ) : (
            sheets.map(sheet => (
              <Card key={sheet._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <Link href={`/sheets/${sheet._id}`} className="block p-4 hover:bg-accent/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{sheet.title}</h3>
                        <p className="text-sm text-muted-foreground">{sheet.description}</p>
                      </div>

                      <div className="flex items-center mt-2 md:mt-0">
                        {/* Completion percentage */}
                        <div className="mr-4">
                          <div className="flex items-center">
                            <CheckCircle2
                              size={16}
                              className={`mr-1 ${
                                getCompletionPercentage(sheet._id, sheet.totalProblems) > 0
                                  ? 'text-green-500'
                                  : 'text-muted-foreground'
                              }`}
                            />
                            <span>
                              {getCompletionPercentage(sheet._id, sheet.totalProblems)}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {progress[sheet._id]?.completedProblemIds.length || 0} / {sheet.totalProblems}
                          </p>
                        </div>

                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
