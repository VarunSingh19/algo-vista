"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    ArrowLeft,
    Play,
    CheckCircle,
    XCircle,
    Clock,
    Code,
    Tag,
    AlertTriangle,
    Info,
    Archive,
    X,
    Users,
    User,
    Zap,
    Target,
    BookOpen,
    Activity,
    Trophy,
    Monitor,
    Sparkles,
    Brain,
    Lightbulb,
    Lock,
} from "lucide-react"
import Link from "next/link"

interface CodingProblem {
    _id: string
    title: string
    description: string
    difficulty: "Easy" | "Medium" | "Hard"
    tags: string[]
    constraints: string
    examples: {
        input: string
        output: string
        explanation?: string
    }[]
    solutionApproach: string
    timeComplexity: string
    spaceComplexity: string
    createdAt: string
}

interface Submission {
    _id: string
    userId: {
        _id?: string
        name: string
        email: string
    }
    problemId: string
    code: string
    language: string
    status: string
    output?: string
    error?: string
    executionTime?: number
    createdAt: string
}

interface AIGeneratedSolution {
    stepByStepExplanation: string
    optimizedCode: string
    algorithmApproach: string
    complexityAnalysis: string
    alternativeSolutions: string[]
    commonMistakes: string[]
}

const PROGRAMMING_LANGUAGES = [
    { value: "javascript", label: "JavaScript", icon: "🟨" },
    { value: "python", label: "Python", icon: "🐍" },
    { value: "java", label: "Java", icon: "☕" },
    { value: "cpp", label: "C++", icon: "⚡" },
    { value: "c", label: "C", icon: "🔧" },
]

// AI Solution Generation Function
async function generateCodingSolution(problem: CodingProblem, selectedLanguage: string): Promise<AIGeneratedSolution> {
    // This would use your existing Gemini AI setup
    const { GoogleGenerativeAI } = await import("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const languageMap = {
        javascript: "JavaScript",
        python: "Python",
        java: "Java",
        cpp: "C++",
        c: "C",
    }

    const prompt = `
        Generate a comprehensive coding solution for the following problem in ${languageMap[selectedLanguage as keyof typeof languageMap]}:
        
        Title: ${problem.title}
        Description: ${problem.description}
        Constraints: ${problem.constraints}
        Solution Approach: ${problem.solutionApproach}
        Difficulty: ${problem.difficulty}
        
        Please provide a detailed response in the following JSON format:
        {
            "stepByStepExplanation": "Detailed step-by-step explanation with comments",
            "optimizedCode": "Clean, well-commented code solution in ${languageMap[selectedLanguage as keyof typeof languageMap]}",
            "algorithmApproach": "High-level algorithm explanation",
            "complexityAnalysis": "Time and space complexity analysis",
            "alternativeSolutions": ["Alternative approach 1", "Alternative approach 2"],
            "commonMistakes": ["Common mistake 1", "Common mistake 2"]
        }
        
        Make sure the stepByStepExplanation includes detailed comments that explain each part of the solution.
        The optimizedCode should be production-ready with proper variable names and comments in ${languageMap[selectedLanguage as keyof typeof languageMap]}.
        Use proper ${languageMap[selectedLanguage as keyof typeof languageMap]} syntax and conventions.
    `

    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Clean and parse the response
        const cleanedText = text.replace(/```json\s*|\s*```/g, "").trim()
        const jsonResponse = JSON.parse(cleanedText)

        return {
            stepByStepExplanation: jsonResponse.stepByStepExplanation || "No explanation generated",
            optimizedCode: jsonResponse.optimizedCode || "No code generated",
            algorithmApproach: jsonResponse.algorithmApproach || "No approach provided",
            complexityAnalysis: jsonResponse.complexityAnalysis || "No analysis provided",
            alternativeSolutions: Array.isArray(jsonResponse.alternativeSolutions) ? jsonResponse.alternativeSolutions : [],
            commonMistakes: Array.isArray(jsonResponse.commonMistakes) ? jsonResponse.commonMistakes : [],
        }
    } catch (error) {
        console.error("Failed to generate AI solution:", error)
        throw new Error("Failed to generate AI solution")
    }
}

// Helper function to format text with bold
const formatTextWithBold = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return (
                <strong key={index} className="font-semibold text-white">
                    {part.slice(2, -2)}
                </strong>
            )
        }
        return part
    })
}

export default function ProblemPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const problemId = params?.id as string
    const [problem, setProblem] = useState<CodingProblem | null>(null)
    const [allSubmissions, setAllSubmissions] = useState<Submission[]>([])
    const [userSubmissions, setUserSubmissions] = useState<Submission[]>([])
    const [code, setCode] = useState("")
    const [language, setLanguage] = useState("javascript")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("problem")
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
    const [submissionFilter, setSubmissionFilter] = useState<"all" | "mine">("all")
    const [showValidationWarning, setShowValidationWarning] = useState(false)

    // AI Solution states
    const [aiSolution, setAiSolution] = useState<AIGeneratedSolution | null>(null)
    const [generatingAI, setGeneratingAI] = useState(false)
    const [solutionTab, setSolutionTab] = useState("your-solution")
    const [aiLanguage, setAiLanguage] = useState("python") // Add this new state

    // Test API connection
    useEffect(() => {
        const testAPI = async () => {
            try {
                const response = await apiClient.getAllProblems()
                console.log("All problems response:", response)
            } catch (err) {
                console.error("API test failed:", err)
            }
        }
        testAPI()
    }, [])

    // Fetch problem data
    useEffect(() => {
        const fetchProblem = async () => {
            if (!problemId) {
                setError("No problem ID provided")
                setLoading(false)
                return
            }
            try {
                setLoading(true)
                setError(null)
                const response = await apiClient.getProblem(problemId)
                const problemData = response.data?.data || response.data || response
                setProblem(problemData)
            } catch (err: unknown) {
                console.error("Error fetching problem:", err)
                if ((err as any).response?.status === 404) {
                    setError("Problem not found")
                } else if ((err as any).response?.status === 401) {
                    setError("Authentication required")
                } else {
                    setError((err as any).response?.data?.error || (err as Error).message || "Failed to fetch problem")
                }
            } finally {
                setLoading(false)
            }
        }
        fetchProblem()
    }, [problemId])

    // Modify the submissions filtering logic in useEffect
    useEffect(() => {
        if (!problemId) return;

        const fetchSubmissions = async () => {
            try {
                console.log("Fetching submissions for problemId:", problemId);

                const response = await apiClient.getSubmissions({
                    problemId,
                    allUsers: true
                });

                console.log("API Response:", response);

                if (response.data?.data) {
                    const submissions = response.data.data;

                    // Filter all submissions to exclude others' pending submissions
                    const filteredAllSubmissions = submissions.filter(
                        (submission: Submission) =>
                            submission.status !== "Pending" ||
                            (user && (submission.userId._id === user._id || submission.userId.email === user.email))
                    );

                    setAllSubmissions(filteredAllSubmissions);

                    // Keep all submissions (including pending) for the current user
                    if (user) {
                        const userSubs = submissions.filter(
                            (sub: Submission) =>
                                sub.userId._id === user._id ||
                                sub.userId.email === user.email
                        );
                        setUserSubmissions(userSubs);
                    }
                }
            } catch (error) {
                console.error("Error fetching submissions:", error);
            }
        };

        fetchSubmissions();
    }, [problemId, user]);

    // Generate AI Solution
    const handleGenerateAISolution = async () => {
        if (!problem) return

        setGeneratingAI(true)
        try {
            const solution = await generateCodingSolution(problem, aiLanguage)
            setAiSolution(solution)
            setSolutionTab("ai-solution")
        } catch (error) {
            console.error("Failed to generate AI solution:", error)
            setError("Failed to generate AI solution. Please try again.")
        } finally {
            setGeneratingAI(false)
        }
    }

    // Submit solution
    const handleSubmit = async () => {
        if (!user) {
            router.push("/login")
            return
        }

        if (!code.trim() || code.trim() === getCodeTemplate(language).trim()) {
            setShowValidationWarning(true)
            setError("Please enter your code before submitting")
            setTimeout(() => setShowValidationWarning(false), 3000)
            return
        }

        try {
            setSubmitting(true)
            setError(null)
            setShowValidationWarning(false)

            // Submit solution
            const response = await apiClient.submitSolution(problemId, {
                code,
                language
            });

            // Refresh submissions
            const submissionsResponse = await apiClient.getSubmissions({
                problemId,
                allUsers: true
            });

            if (submissionsResponse.data?.data) {
                const submissions = submissionsResponse.data.data.filter(
                    (sub: Submission) => sub.problemId === problemId
                );

                setAllSubmissions(submissions);

                if (user) {
                    const userSubs = submissions.filter(
                        (sub: Submission) =>
                            sub.userId._id === user._id ||
                            sub.userId.email === user.email
                    );
                    setUserSubmissions(userSubs);
                }
            }

            setActiveTab("submissions")
        } catch (err: any) {
            console.error("Submission error:", err)
            if (err.response?.status === 401) {
                setError("Authentication failed. Please login again.")
            } else if (err.response?.status === 404) {
                setError("Problem not found")
            } else {
                setError(err.response?.data?.error || err.message || "Failed to submit code")
            }
        } finally {
            setSubmitting(false)
        }
    }

    // Difficulty color mapping
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy":
                return "text-emerald-400 bg-emerald-900/30 border-emerald-700/50"
            case "Medium":
                return "text-yellow-400 bg-yellow-900/30 border-yellow-700/50"
            case "Hard":
                return "text-red-400 bg-red-900/30 border-red-700/50"
            default:
                return "text-zinc-400 bg-zinc-900/30 border-zinc-700/50"
        }
    }

    // Status display mapping
    const getStatusDisplay = (status: string) => ({
        color:
            {
                Accepted: "text-emerald-400",
                "Wrong Answer": "text-red-400",
                "Time Limit Exceeded": "text-yellow-400",
                "Runtime Error": "text-red-400",
            }[status] || "text-zinc-400",
        icon: {
            Accepted: <CheckCircle size={16} />,
            "Wrong Answer": <XCircle size={16} />,
            "Time Limit Exceeded": <Clock size={16} />,
            "Runtime Error": <AlertTriangle size={16} />,
        }[status] || <Info size={16} />,
        bgColor:
            {
                Accepted: "bg-emerald-900/30 border-emerald-800/50",
                "Wrong Answer": "bg-red-900/30 border-red-800/50",
                "Time Limit Exceeded": "bg-yellow-900/30 border-yellow-800/50",
                "Runtime Error": "bg-red-900/30 border-red-800/50",
            }[status] || "bg-zinc-900/30 border-zinc-800/50",
    })

    // Format date
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })

    // Get code template
    const getCodeTemplate = (lang: string) => {
        const templates = {
            javascript: `function solution() {\n    // Write your solution here\n}`,
            python: `def solution():\n    # Write your solution here\n    pass`,
            java: `public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}`,
            cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    // Write your solution here\n    return 0;\n}`,
            c: `#include <stdio.h>\nint main() {\n    // Write your solution here\n    return 0;\n}`,
        }
        return templates[lang as keyof typeof templates] || ""
    }

    // Set code template when language changes
    useEffect(() => {
        if (!code) setCode(getCodeTemplate(language))
    }, [language, code])

    // Filter submissions based on active filter
    const getDisplayedSubmissions = () => {
        if (submissionFilter === "mine") {
            return userSubmissions
        }
        return allSubmissions.filter(submission => submission.status !== "Pending");
    }

    // Check if submission belongs to current user
    const isMySubmission = (submission: Submission) => {
        if (!user) return false
        return submission.userId.email === user.email || submission.userId._id === user._id
    }

    const displayedSubmissions = getDisplayedSubmissions()
    const totalSubmissions = allSubmissions.filter(submission => submission.status !== "Pending").length
    const mySubmissions = userSubmissions.length

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950">
                <div className="container max-w-7xl mx-auto p-4 py-8">
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-orange-500/20 rounded-full animate-spin"></div>
                                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="text-zinc-400 font-medium">Loading problem...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error && !problem) {
        return (
            <div className="min-h-screen bg-zinc-950">
                <div className="container max-w-7xl mx-auto p-4 py-8">
                    <Card className="border-red-800/50 bg-red-950/30 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="text-red-400" size={24} />
                                <h3 className="text-lg font-semibold text-red-300">Error Loading Problem</h3>
                            </div>
                            <p className="text-red-300 mb-2">
                                <strong>Error:</strong> {error}
                            </p>
                            <p className="text-red-400 text-sm mb-4">
                                <strong>Problem ID:</strong> {problemId}
                            </p>
                            <Link href="/problems">
                                <Button variant="outline" className="border-red-700/50 text-red-300 hover:bg-red-900/50">
                                    <ArrowLeft size={16} className="mr-2" />
                                    Back to Problems
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    // Problem not found
    if (!problem) {
        return (
            <div className="min-h-screen bg-zinc-950">
                <div className="container max-w-7xl mx-auto p-4 py-8">
                    <div className="text-center py-12">
                        <div className="mb-6">
                            <Archive className="mx-auto text-zinc-600" size={64} />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-200 mb-2">Problem Not Found</h2>
                        <p className="text-zinc-400 mb-6">The problem you're looking for doesn't exist or has been removed.</p>
                        <Link href="/problems">
                            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                                <ArrowLeft size={16} className="mr-2" />
                                Back to Problems
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Submission Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-900/30 rounded-lg">
                                    <Monitor className="text-blue-400" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Submission Details</h2>
                                    {isMySubmission(selectedSubmission) && (
                                        <Badge variant="outline" className="text-blue-400 bg-blue-950/30 border-blue-800/50 mt-1">
                                            <User size={12} className="mr-1" />
                                            Your Submission
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <Button variant="ghost" onClick={() => setSelectedSubmission(null)} className="hover:bg-zinc-800/50">
                                <X size={20} />
                            </Button>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <User className="text-zinc-500" size={16} />
                                        <span className="font-medium text-zinc-300">Author:</span>
                                        <span className="text-zinc-400">{selectedSubmission.userId.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Code className="text-zinc-500" size={16} />
                                        <span className="font-medium text-zinc-300">Language:</span>
                                        <Badge variant="outline" className="border-zinc-700/50 bg-zinc-900/50 text-zinc-300">
                                            {PROGRAMMING_LANGUAGES.find((l) => l.value === selectedSubmission.language)?.icon}{" "}
                                            {PROGRAMMING_LANGUAGES.find((l) => l.value === selectedSubmission.language)?.label}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Activity className="text-zinc-500" size={16} />
                                        <span className="font-medium text-zinc-300">Status:</span>
                                        <Badge
                                            variant="outline"
                                            className={`border ${getStatusDisplay(selectedSubmission.status).bgColor} ${getStatusDisplay(selectedSubmission.status).color}`}
                                        >
                                            {getStatusDisplay(selectedSubmission.status).icon}
                                            <span className="ml-2">{selectedSubmission.status}</span>
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="text-zinc-500" size={16} />
                                        <span className="font-medium text-zinc-300">Submitted:</span>
                                        <span className="text-zinc-400 text-sm">{formatDate(selectedSubmission.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Code className="text-zinc-400" size={16} />
                                    <span className="font-medium text-zinc-300">Code Solution</span>
                                </div>
                                <div className="bg-zinc-900/70 rounded-xl p-4 border border-zinc-800">
                                    <pre className="text-zinc-300 text-sm overflow-auto font-mono leading-relaxed">
                                        {selectedSubmission.code}
                                    </pre>
                                </div>
                            </div>
                            {selectedSubmission.output && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Target className="text-green-400" size={16} />
                                        <span className="font-medium text-zinc-300">Output</span>
                                    </div>
                                    <div className="bg-green-950/30 rounded-xl p-4 border border-green-800/50">
                                        <pre className="text-green-300 text-sm overflow-auto font-mono">{selectedSubmission.output}</pre>
                                    </div>
                                </div>
                            )}
                            {selectedSubmission.error && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertTriangle className="text-red-400" size={16} />
                                        <span className="font-medium text-zinc-300">Error Details</span>
                                    </div>
                                    <div className="bg-red-950/30 rounded-xl p-4 border border-red-800/50">
                                        <pre className="text-red-300 text-sm overflow-auto font-mono">{selectedSubmission.error}</pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="container max-w-7xl mx-auto p-4 py-8">
                {/* Back button */}
                <div className="mb-8">
                    <Link href="/problems">
                        <Button
                            variant="outline"
                            className="mb-6 bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800/50"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Problems
                        </Button>
                    </Link>

                    {/* Problem header */}
                    <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6 shadow-lg">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                        {problem.title}
                                    </h1>
                                    <Badge
                                        variant="outline"
                                        className={`${getDifficultyColor(problem.difficulty)} border font-medium px-3 py-1`}
                                    >
                                        {problem.difficulty === "Easy" && <Zap size={14} className="mr-1" />}
                                        {problem.difficulty === "Medium" && <Target size={14} className="mr-1" />}
                                        {problem.difficulty === "Hard" && <Trophy size={14} className="mr-1" />}
                                        {problem.difficulty}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {problem.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className="text-xs text-white bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50 transition-colors"
                                        >
                                            <Tag size={12} className="mr-1" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                {!user ? (
                                    // Show login prompt if user is not authenticated
                                    <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                        <div className="mb-4">
                                            <Lock className="mx-auto text-zinc-600" size={48} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2">Login Required</h3>
                                        <p className="text-zinc-400 mb-4">
                                            You need to login to access AI-powered solutions and explanations.
                                        </p>
                                        <Link href="/login">
                                            <Button className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700">
                                                <User size={16} className="mr-2" />
                                                Login to Access AI Solutions
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={handleGenerateAISolution}
                                        disabled={generatingAI}
                                        className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-200"
                                    >
                                        {generatingAI ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Generating...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Sparkles size={16} />
                                                <span>Use AlgoVistaAI</span>
                                            </div>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Left Panel */}
                    <div className="space-y-6">
                        <Card className="bg-zinc-900/50 border-zinc-800 shadow-lg">
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid w-full grid-cols-2 bg-zinc-800/50 p-1 rounded-xl">
                                    <TabsTrigger
                                        value="problem"
                                        className="flex items-center gap-2 data-[state=active]:bg-zinc-200/50 data-[state=active]:shadow-sm rounded-lg font-medium transition-all"
                                    >
                                        <BookOpen size={16} />
                                        Problem
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="submissions"
                                        className="flex items-center gap-2 data-[state=active]:bg-zinc-200/50 data-[state=active]:shadow-sm rounded-lg font-medium transition-all"
                                    >
                                        <Activity size={16} />
                                        Submissions ({submissionFilter === "all" ? totalSubmissions : mySubmissions})
                                    </TabsTrigger>
                                </TabsList>

                                {/* Problem tab content */}
                                <TabsContent value="problem" className="space-y-6 mt-6">
                                    <CardContent className="space-y-6 p-0">
                                        {/* Description */}
                                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                <Info className="text-blue-400" size={20} />
                                                Description
                                            </h3>
                                            <div className="prose dark:prose-invert max-w-none text-zinc-300">
                                                <p className="whitespace-pre-wrap leading-relaxed">{problem.description}</p>
                                            </div>
                                        </div>

                                        {/* Examples */}
                                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                <Target className="text-green-400" size={20} />
                                                Examples
                                            </h3>
                                            <div className="space-y-4">
                                                {problem.examples.map((example, index) => (
                                                    <div key={index} className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
                                                        <h4 className="font-medium text-white mb-3">Example {index + 1}:</h4>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <span className="font-medium text-zinc-300">Input: </span>
                                                                <code className="bg-zinc-900 px-3 py-1 rounded-md text-sm font-mono text-zinc-300">
                                                                    {example.input}
                                                                </code>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-zinc-300">Output: </span>
                                                                <code className="bg-zinc-900 px-3 py-1 rounded-md text-sm font-mono text-zinc-300">
                                                                    {example.output}
                                                                </code>
                                                            </div>
                                                            {example.explanation && (
                                                                <div>
                                                                    <span className="font-medium text-zinc-300">Explanation: </span>
                                                                    <span className="text-sm text-zinc-400">{example.explanation}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Constraints */}
                                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                <AlertTriangle className="text-yellow-400" size={20} />
                                                Constraints
                                            </h3>
                                            <div className="text-sm text-zinc-300 whitespace-pre-wrap font-mono bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                                                {problem.constraints}
                                            </div>
                                        </div>

                                        {/* Solution Approach */}
                                        {problem.solutionApproach && (
                                            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                    <BookOpen className="text-purple-400" size={20} />
                                                    Solution Approach
                                                </h3>
                                                <div className="prose dark:prose-invert max-w-none">
                                                    <p className="whitespace-pre-wrap text-zinc-300 leading-relaxed bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                                                        {problem.solutionApproach}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Complexity Analysis */}
                                        {(problem.timeComplexity || problem.spaceComplexity) && (
                                            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                    <Activity className="text-indigo-400" size={20} />
                                                    Complexity Analysis
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {problem.timeComplexity && (
                                                        <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Clock size={16} className="text-blue-400" />
                                                                <span className="font-medium text-zinc-300">Time Complexity</span>
                                                            </div>
                                                            <code className="bg-zinc-800 text-blue-300 px-3 py-2 rounded-md text-sm font-mono block">
                                                                {problem.timeComplexity}
                                                            </code>
                                                        </div>
                                                    )}
                                                    {problem.spaceComplexity && (
                                                        <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Archive size={16} className="text-purple-400" />
                                                                <span className="font-medium text-zinc-300">Space Complexity</span>
                                                            </div>
                                                            <code className="bg-zinc-800 text-purple-300 px-3 py-2 rounded-md text-sm font-mono block">
                                                                {problem.spaceComplexity}
                                                            </code>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </TabsContent>

                                {/* Submissions tab content */}
                                <TabsContent value="submissions" className="space-y-6 mt-6">
                                    <CardContent className="p-0">
                                        {/* Submission filter */}
                                        <div className="flex justify-between items-center mb-6 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-semibold text-white">Submissions</h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant={submissionFilter === "all" ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setSubmissionFilter("all")}
                                                    className={`transition-all duration-200 ${submissionFilter === "all"
                                                        ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                                                        : "bg-zinc-200/50 border-zinc-200/50 hover:bg-zinc-200/50"
                                                        }`}
                                                >
                                                    <Users size={14} className="mr-2" />
                                                    All ({totalSubmissions})
                                                </Button>
                                                {user && (
                                                    <Button
                                                        variant={submissionFilter === "mine" ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setSubmissionFilter("mine")}
                                                        className={`transition-all duration-200 ${submissionFilter === "mine"
                                                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                                                            : "bg-zinc-200/50 border-zinc-200/50 hover:bg-zinc-200/50"
                                                            }`}
                                                    >
                                                        <User size={14} className="mr-2" />
                                                        Mine ({mySubmissions})
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Submissions list */}
                                        {displayedSubmissions.length === 0 ? (
                                            <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                                <div className="mb-4">
                                                    <Archive className="mx-auto text-zinc-600" size={48} />
                                                </div>
                                                <h3 className="text-lg font-semibold text-white mb-2">No Submissions Yet</h3>
                                                <p className="text-zinc-400">
                                                    {submissionFilter === "mine"
                                                        ? "You haven't submitted any solutions yet. Try solving this problem!"
                                                        : "No one has submitted a solution yet. Be the first to solve it!"}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {displayedSubmissions.map((submission) => {
                                                    const statusDisplay = getStatusDisplay(submission.status)
                                                    const isOwn = isMySubmission(submission)
                                                    return (
                                                        <div
                                                            key={submission._id}
                                                            className={`bg-zinc-900/50 rounded-xl border transition-all duration-200 hover:border-zinc-700/50 ${isOwn ? "ring-1 ring-blue-500/50" : ""}`}
                                                        >
                                                            <div className="p-5">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <div className="flex items-center gap-3 flex-wrap">
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`text-xs ${statusDisplay.bgColor} ${statusDisplay.color} border`}
                                                                        >
                                                                            {statusDisplay.icon}
                                                                            <span className="ml-2">{submission.status}</span>
                                                                        </Badge>
                                                                        <Badge variant="outline" className="text-white bg-zinc-800/50 border-zinc-700/50">
                                                                            {PROGRAMMING_LANGUAGES.find((l) => l.value === submission.language)?.icon}{" "}
                                                                            {PROGRAMMING_LANGUAGES.find((l) => l.value === submission.language)?.label}
                                                                        </Badge>
                                                                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                                            <User size={14} />
                                                                            <span>by {submission.userId.name}</span>
                                                                            {isOwn && (
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="text-xs text-blue-400 bg-blue-900/30 border-blue-800/50"
                                                                                >
                                                                                    You
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-sm text-zinc-400">{formatDate(submission.createdAt)}</span>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => setSelectedSubmission(submission)}
                                                                            className="bg-zinc-800/50 text-white border-zinc-700/50 hover:bg-zinc-700/50"
                                                                        >
                                                                            <Monitor size={14} className="mr-1" />
                                                                            View
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                {submission.executionTime && (
                                                                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                                        <Clock size={14} />
                                                                        <span>Execution time: {submission.executionTime}ms</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </CardContent>
                                </TabsContent>
                            </Tabs>
                        </Card>
                    </div>

                    {/* Right Panel - Code Editor with AI Solutions */}
                    <div className="space-y-6">
                        <Card className="bg-zinc-900/50 border-zinc-800 shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                                        <Code size={20} className="text-white" />
                                    </div>
                                    <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                        Solutions
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Solution Tabs */}
                                <Tabs value={solutionTab} onValueChange={setSolutionTab}>
                                    <TabsList className="grid w-full grid-cols-2 bg-zinc-800/50 p-1 rounded-xl">
                                        <TabsTrigger
                                            value="your-solution"
                                            className="flex items-center gap-2 data-[state=active]:bg-zinc-200/50 data-[state=active]:shadow-sm rounded-lg font-medium transition-all"
                                        >
                                            <User size={16} />
                                            Your Solution
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="ai-solution"
                                            className="flex items-center gap-2 data-[state=active]:bg-zinc-200/50 data-[state=active]:shadow-sm rounded-lg font-medium transition-all"
                                        >
                                            <Brain size={16} />
                                            AlgoVistaAI Solutions
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Your Solution Tab */}
                                    <TabsContent value="your-solution" className="space-y-6 mt-6">
                                        {/* Language selector */}
                                        <div>
                                            <label className="text-sm font-semibold text-zinc-300 mb-3 block  items-center gap-2">
                                                <Tag size={14} />
                                                Programming Language
                                            </label>
                                            <Select value={language} onValueChange={setLanguage}>
                                                <SelectTrigger className="bg-zinc-800/50 border-zinc-700/50 text-white hover:bg-zinc-700/50 transition-colors">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-900/80 border-zinc-800">
                                                    {PROGRAMMING_LANGUAGES.map((lang) => (
                                                        <SelectItem key={lang.value} value={lang.value} className="text-white hover:bg-zinc-800/50">
                                                            <span className="flex items-center gap-2">
                                                                {lang.icon} {lang.label}
                                                            </span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Code editor */}
                                        <div>
                                            <label className="text-sm font-semibold text-zinc-300 mb-3 block  items-center gap-2">
                                                <Code size={14} />
                                                Your Code
                                            </label>
                                            <div className="relative">
                                                <Textarea
                                                    value={code}
                                                    onChange={(e) => setCode(e.target.value)}
                                                    className={`font-mono text-sm min-h-96 resize-none bg-zinc-900/50 text-zinc-300 border-zinc-700/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${showValidationWarning ? "border-red-500/50 focus:ring-red-500/50" : ""
                                                        }`}
                                                    placeholder="Write your solution here..."
                                                />
                                                {showValidationWarning && (
                                                    <div className="absolute -bottom-7 left-0 right-0 bg-red-950/30 border border-red-800/50 rounded-b-lg px-3 py-1">
                                                        <div className="flex items-center gap-2 text-red-400 text-sm">
                                                            <AlertTriangle size={14} />
                                                            <span>Please enter your code before submitting</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Error message */}
                                        {error && !showValidationWarning && (
                                            <Alert className="bg-red-950/30 border-red-800/50">
                                                <AlertTriangle className="h-4 w-4 text-red-400" />
                                                <AlertDescription className="text-red-300">{error}</AlertDescription>
                                            </Alert>
                                        )}

                                        {/* Submit button */}
                                        <div className="pt-2">
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={submitting || !user}
                                                className={`w-full h-12 text-base font-semibold transition-all duration-200 ${user
                                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-blue-500/20"
                                                    : "bg-zinc-700/50 text-zinc-400 cursor-not-allowed"
                                                    }`}
                                            >
                                                {submitting ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span>Submitting Solution...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        {user ? <Play size={18} /> : <User size={18} />}
                                                        <span>{user ? "Submit Solution" : "Login to Submit"}</span>
                                                    </div>
                                                )}
                                            </Button>
                                        </div>

                                        {/* Login prompt */}
                                        {!user && (
                                            <div className="text-center p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                                                <p className="text-sm text-zinc-400">
                                                    You need to{" "}
                                                    <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium underline">
                                                        login
                                                    </Link>{" "}
                                                    to submit solutions and track your progress.
                                                </p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* AI Solution Tab */}
                                    <TabsContent value="ai-solution" className="space-y-6 mt-6">
                                        {!user ? (
                                            // Show login prompt if user is not authenticated
                                            <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                                <div className="mb-4">
                                                    <Lock className="mx-auto text-zinc-600" size={48} />
                                                </div>
                                                <h3 className="text-lg font-semibold text-white mb-2">Login Required</h3>
                                                <p className="text-zinc-400 mb-4">
                                                    You need to login to access AI-powered solutions and explanations.
                                                </p>
                                                <Link href="/login">
                                                    <Button className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700">
                                                        <User size={16} className="mr-2" />
                                                        Login to Access AI Solutions
                                                    </Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            // Show AI solution content for authenticated users
                                            <>
                                                {/* AI Language Selector */}
                                                <div>
                                                    <label className="text-sm font-semibold text-zinc-300 mb-3 block  items-center gap-2">
                                                        <Tag size={14} />
                                                        AI Solution Language
                                                    </label>
                                                    <Select value={aiLanguage} onValueChange={setAiLanguage}>
                                                        <SelectTrigger className="bg-zinc-800/50 border-zinc-700/50 text-white hover:bg-zinc-700/50 transition-colors">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-zinc-900/80 border-zinc-800">
                                                            {PROGRAMMING_LANGUAGES.map((lang) => (
                                                                <SelectItem key={lang.value} value={lang.value} className="text-white hover:bg-zinc-800/50">
                                                                    <span className="flex items-center gap-2">
                                                                        {lang.icon} {lang.label}
                                                                    </span>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {!aiSolution ? (
                                                    <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                                        <div className="mb-4">
                                                            <Brain className="mx-auto text-zinc-600" size={48} />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-white mb-2">No AI Solution Generated</h3>
                                                        <p className="text-zinc-400 mb-4">
                                                            Select your preferred programming language and click "Generate AI Solution" to get a
                                                            step-by-step solution with detailed explanations.
                                                        </p>

                                                        <Button
                                                            onClick={handleGenerateAISolution}
                                                            disabled={generatingAI}
                                                            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700"
                                                        >
                                                            {generatingAI ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                    <span>Generating...</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <Sparkles size={16} />
                                                                    <span>Generate AI Solution</span>
                                                                </div>
                                                            )}
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-6">
                                                        {/* Step by Step Explanation */}
                                                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                                <Lightbulb className="text-yellow-400" size={20} />
                                                                Step-by-Step Explanation
                                                            </h3>
                                                            <div className="bg-zinc-900/70 rounded-lg p-4 border border-zinc-800">
                                                                <div className="text-zinc-300 text-sm overflow-auto font-mono leading-relaxed whitespace-pre-wrap">
                                                                    {formatTextWithBold(aiSolution.stepByStepExplanation)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Optimized Code */}
                                                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                                <Code className="text-green-400" size={20} />
                                                                Optimized Solution ({PROGRAMMING_LANGUAGES.find((l) => l.value === aiLanguage)?.label})
                                                            </h3>
                                                            <div className="bg-zinc-900/70 rounded-lg p-4 border border-zinc-800">
                                                                <pre className="text-zinc-300 text-sm overflow-auto font-mono leading-relaxed">
                                                                    {aiSolution.optimizedCode}
                                                                </pre>
                                                            </div>
                                                        </div>

                                                        {/* Algorithm Approach */}
                                                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                                <Target className="text-blue-400" size={20} />
                                                                Algorithm Approach
                                                            </h3>
                                                            <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                                                {formatTextWithBold(aiSolution.algorithmApproach)}
                                                            </div>
                                                        </div>

                                                        {/* Complexity Analysis */}
                                                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                                <Activity className="text-purple-400" size={20} />
                                                                Complexity Analysis
                                                            </h3>
                                                            <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                                                {formatTextWithBold(aiSolution.complexityAnalysis)}
                                                            </div>
                                                        </div>

                                                        {/* Alternative Solutions */}
                                                        {aiSolution.alternativeSolutions.length > 0 && (
                                                            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                                    <Lightbulb className="text-orange-400" size={20} />
                                                                    Alternative Approaches
                                                                </h3>
                                                                <ul className="space-y-2">
                                                                    {aiSolution.alternativeSolutions.map((solution, index) => (
                                                                        <li key={index} className="text-zinc-300 flex items-start gap-2">
                                                                            <span className="text-orange-400 mt-1">•</span>
                                                                            <div>{formatTextWithBold(solution)}</div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* Common Mistakes */}
                                                        {aiSolution.commonMistakes.length > 0 && (
                                                            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                                    <AlertTriangle className="text-red-400" size={20} />
                                                                    Common Mistakes to Avoid
                                                                </h3>
                                                                <ul className="space-y-2">
                                                                    {aiSolution.commonMistakes.map((mistake, index) => (
                                                                        <li key={index} className="text-zinc-300 flex items-start gap-2">
                                                                            <span className="text-red-400 mt-1">•</span>
                                                                            <div>{formatTextWithBold(mistake)}</div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* Regenerate Button */}
                                                        <div className="pt-2">
                                                            <Button
                                                                onClick={handleGenerateAISolution}
                                                                disabled={generatingAI}
                                                                variant="outline"
                                                                className="w-full bg-zinc-800/50 border-zinc-700/50 text-white hover:bg-zinc-700/50"
                                                            >
                                                                {generatingAI ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                        <span>Regenerating...</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        <Sparkles size={16} />
                                                                        <span>
                                                                            Regenerate Solution in{" "}
                                                                            {PROGRAMMING_LANGUAGES.find((l) => l.value === aiLanguage)?.label}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}