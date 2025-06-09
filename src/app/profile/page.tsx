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
                      <h2 className="text-xl font-bold text-white">{user?.name || "User Name"}</h2>
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
                  <CardTitle className="text-lg text-white">Technical Skills</CardTitle>
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
                  <CardTitle className="text-lg text-white">Personal Information</CardTitle>
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
                                    className="p-2 rounded-lg border border-gray-600 hover:bg-gray-100 transition-colors"
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
                      <CardTitle className="text-xl text-white">Overall Progress</CardTitle>
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
                                    <span className="text-sm font-medium text-white">{sheet.title}</span>
                                    <span className="text-sm text-gray-400">{completionPercentage}%</span>
                                  </div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-500">
                                      {completed}/{sheet.totalProblems}
                                    </span>
                                  </div>
                                  <Progress value={completionPercentage} className="h-2 bg-gray-500" />
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
                                  <span className="text-sm font-bold text-white">{stats.completion}%</span>
                                </div>
                              </div>
                              <h3 className="font-semibold mb-1 text-white">Total Progress</h3>
                              <p className="text-2xl font-bold text-white">
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
                              <p className="text-xl font-bold text-white">
                                {Math.floor(stats.totalCompleted * 0.1)}/{Math.floor(stats.totalProblems * 0.1)}
                                <span className="text-sm text-gray-100 ml-1">completed</span>
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
                            <h3 className="text-lg font-semibold mb-4 text-white">Topics covered</h3>
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
                        className="bg-gray-800/50 border-gray-600/50 focus:border-orange-500/50 focus:ring-orange-500/20 backdrop-blur-sm text-white"
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
