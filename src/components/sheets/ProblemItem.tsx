
// "use client"

// import { useState } from "react"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { PlayCircle, FileText, ExternalLink, Check, Sparkles } from "lucide-react"
// import { useProgress } from "@/contexts/ProgressContext"
// import { useAuth } from "@/contexts/AuthContext"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog"
// import Link from "next/link"

// interface Problem {
//   id: string
//   title: string
//   problemLink?: string
//   videoLink?: string
//   editorialLink?: string
//   difficulty: "Easy" | "Medium" | "Hard"
// }

// interface ProblemItemProps {
//   problem: Problem
//   sheetId: string
//   onToggle: () => void
// }

// export default function ProblemItem({ problem, sheetId, onToggle }: ProblemItemProps) {
//   const { isCompleted, toggleProblem } = useProgress()
//   const completed = isCompleted(problem.id)
//   const { user } = useAuth()
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [isHovered, setIsHovered] = useState(false)

//   const handleToggle = async () => {
//     await toggleProblem(sheetId, problem.id)
//     onToggle()
//   }

//   const handleCheckboxChange = () => {
//     if (!user) {
//       setIsDialogOpen(true)
//     } else {
//       handleToggle()
//     }
//   }

//   // Difficulty badge styles with enhanced effects
//   const difficultyStyles = {
//     Easy: {
//       bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
//       text: "text-green-400",
//       border: "border-green-500/50",
//       glow: "shadow-green-500/25",
//     },
//     Medium: {
//       bg: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
//       text: "text-yellow-400",
//       border: "border-yellow-500/50",
//       glow: "shadow-yellow-500/25",
//     },
//     Hard: {
//       bg: "bg-gradient-to-r from-red-500/20 to-rose-500/20",
//       text: "text-red-400",
//       border: "border-red-500/50",
//       glow: "shadow-red-500/25",
//     },
//   }[problem.difficulty]

//   return (
//     <>
//       <div
//         className={`
//           group relative flex items-center justify-between p-4 rounded-xl transition-all duration-300
//           ${completed
//             ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
//             : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
//           }
//           ${isHovered ? "transform translate-y-[-2px] shadow-lg shadow-black/20" : ""}
//           backdrop-blur-sm
//         `}
//         id={`problem-${problem.id}`}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Completion sparkle effect */}
//         {completed && (
//           <div className="absolute -top-1 -right-1">
//             <Sparkles className="h-4 w-4 text-green-400 animate-pulse" />
//           </div>
//         )}

//         <div className="flex items-center space-x-4 flex-grow min-w-0">
//           {/* Enhanced checkbox */}
//           <div className="relative">
//             <Checkbox
//               checked={completed}
//               onCheckedChange={handleCheckboxChange}
//               id={`checkbox-${problem.id}`}
//               className={`
//                 h-5 w-5 rounded-md border-2 transition-all duration-300
//                 ${completed
//                   ? "border-green-500 bg-green-500/20 shadow-lg shadow-green-500/50"
//                   : "border-gray-500 hover:border-gray-400 hover:shadow-md"
//                 }
//               `}
//             />
//             {completed && (
//               <Check className="h-3 w-3 text-green-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-scale-in" />
//             )}
//           </div>

//           <div className="flex flex-col min-w-0 flex-grow">
//             <label
//               htmlFor={`checkbox-${problem.id}`}
//               className={`cursor-pointer font-medium truncate transition-all duration-300 ${completed ? "line-through text-gray-400" : "text-gray-200 hover:text-white group-hover:text-blue-400"
//                 }`}
//             >
//               {problem.title}
//             </label>

//             <div className="flex flex-wrap items-center mt-2">
//               <Badge
//                 variant="outline"
//                 className={`
//                   ${difficultyStyles.bg} ${difficultyStyles.text} ${difficultyStyles.border}
//                   text-xs px-3 py-1 h-6 mr-2 mb-1 font-medium
//                   transition-all duration-300 hover:shadow-lg hover:${difficultyStyles.glow}
//                   ${isHovered ? `shadow-md ${difficultyStyles.glow}` : ""}
//                 `}
//               >
//                 {problem.difficulty}
//               </Badge>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced action buttons */}
//         <div className="flex items-center space-x-1 flex-shrink-0">
//           {problem.problemLink && (
//             <Button
//               size="icon"
//               variant="ghost"
//               asChild
//               className="h-9 w-9 hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
//               title="Problem Link"
//             >
//               <a href={problem.problemLink} target="_blank" rel="noopener noreferrer">
//                 <ExternalLink size={16} />
//               </a>
//             </Button>
//           )}

//           {problem.videoLink && (
//             <Button
//               size="icon"
//               variant="ghost"
//               asChild
//               className="h-9 w-9 hover:bg-white/10 text-gray-400 hover:text-red-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-red-500/25"
//               title="Video Solution"
//             >
//               <a href={problem.videoLink} target="_blank" rel="noopener noreferrer">
//                 <PlayCircle size={16} />
//               </a>
//             </Button>
//           )}

//           {problem.editorialLink && (
//             <Button
//               size="icon"
//               variant="ghost"
//               asChild
//               className="h-9 w-9 hover:bg-white/10 text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25"
//               title="Editorial"
//             >
//               <a href={problem.editorialLink} target="_blank" rel="noopener noreferrer">
//                 <FileText size={16} />
//               </a>
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Enhanced login dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="glass-card border border-white/20 backdrop-blur-xl">
//           <DialogHeader>
//             <DialogTitle className="text-white text-xl">Login Required</DialogTitle>
//             <DialogDescription className="text-gray-300">
//               Please login to save your progress and track your learning journey.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter className="space-x-3">
//             <DialogClose asChild>
//               <Button variant="outline" className="glass-button">
//                 Cancel
//               </Button>
//             </DialogClose>
//             <Link href="/login">
//               <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
//                 Go to Login
//               </Button>
//             </Link>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }
"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PlayCircle,
  ExternalLink,
  Check,
  Sparkles,
  Clock,
  Trophy,
  Target,
  Zap,
  BookOpen,
  Code2,
  Star,
} from "lucide-react"
import { useProgress } from "@/contexts/ProgressContext"
import { useAuth } from "@/contexts/AuthContext"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import Link from "next/link"
import './enhanced-animations.css' // Import custom CSS for animations

interface Problem {
  id: string
  title: string
  problemLink?: string
  videoLink?: string
  editorialLink?: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface ProblemItemProps {
  problem: Problem
  sheetId: string
  onToggle: () => void
}

export default function EnhancedProblemItem({ problem, sheetId, onToggle }: ProblemItemProps) {
  const { isCompleted, toggleProblem } = useProgress()
  const completed = isCompleted(problem.id)
  const { user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const handleToggle = async () => {
    const wasCompleted = completed
    await toggleProblem(sheetId, problem.id)

    // Trigger celebration animation if just completed
    if (!wasCompleted && !completed) {
      setJustCompleted(true)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
      setTimeout(() => setJustCompleted(false), 3000)
    }

    onToggle()
  }

  const handleCheckboxChange = () => {
    if (!user) {
      setIsDialogOpen(true)
    } else {
      handleToggle()
    }
  }

  // Enhanced difficulty configurations
  const difficultyConfig = {
    Easy: {
      bg: "from-emerald-500/20 via-green-500/15 to-teal-500/20",
      text: "text-emerald-400",
      border: "border-emerald-500/40",
      glow: "shadow-emerald-500/30",
      icon: <Target className="h-3 w-3" />,
      estimatedTime: "15-30 min",
      points: 10,
    },
    Medium: {
      bg: "from-amber-500/20 via-yellow-500/15 to-orange-500/20",
      text: "text-amber-400",
      border: "border-amber-500/40",
      glow: "shadow-amber-500/30",
      icon: <Zap className="h-3 w-3" />,
      estimatedTime: "30-60 min",
      points: 25,
    },
    Hard: {
      bg: "from-rose-500/20 via-red-500/15 to-pink-500/20",
      text: "text-rose-400",
      border: "border-rose-500/40",
      glow: "shadow-rose-500/30",
      icon: <Trophy className="h-3 w-3" />,
      estimatedTime: "60+ min",
      points: 50,
    },
  }[problem.difficulty]

  // Get card styling based on state
  const getCardStyling = () => {
    if (completed) {
      return {
        background: "from-emerald-500/15 via-green-500/10 to-teal-500/15",
        border: "border-emerald-500/30",
        glow: "shadow-emerald-500/20",
      }
    }
    if (isHovered) {
      return {
        background: "from-blue-500/10 via-indigo-500/5 to-purple-500/10",
        border: "border-blue-500/30",
        glow: "shadow-blue-500/20",
      }
    }
    return {
      background: "from-gray-500/5 via-slate-500/3 to-gray-500/5",
      border: "border-white/10",
      glow: "shadow-transparent",
    }
  }

  const cardStyle = getCardStyling()

  return (
    <>
      <div
        className={`
          group relative flex items-center justify-between p-5 rounded-2xl transition-all duration-500 ease-out
          bg-gradient-to-br ${cardStyle.background}
          border ${cardStyle.border}
          hover:shadow-xl hover:${cardStyle.glow}
          ${isHovered ? "transform translate-y-[-4px] scale-[1.02]" : ""}
          ${justCompleted ? "animate-pulse-celebration" : ""}
          backdrop-blur-xl overflow-hidden
        `}
        id={`problem-${problem.id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>

        {/* Celebration particles */}
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-celebration-particle"
                style={{
                  left: `${20 + i * 10}%`,
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <Sparkles className="h-3 w-3 text-yellow-400" />
              </div>
            ))}
          </div>
        )}

        {/* Completion status indicator */}
        {completed && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
              <div className="relative bg-emerald-500 rounded-full p-1.5">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-5 flex-grow min-w-0 relative z-10">
          {/* Enhanced checkbox with ripple effect */}
          <div className="relative group/checkbox">
            <div
              className={`absolute inset-0 rounded-lg transition-all duration-300 ${completed ? "bg-emerald-500/20 scale-150" : "bg-transparent scale-100"}`}
            />
            <Checkbox
              checked={completed}
              onCheckedChange={handleCheckboxChange}
              id={`checkbox-${problem.id}`}
              className={`
                h-6 w-6 rounded-lg border-2 transition-all duration-300 relative z-10
                ${completed
                  ? "border-emerald-500 bg-emerald-500/30 shadow-lg shadow-emerald-500/50"
                  : "border-gray-400 hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/25 hover:bg-blue-500/10"
                }
                ${isHovered && !completed ? "border-blue-400 bg-blue-500/10" : ""}
              `}
            />
            {completed && (
              <Check className="h-4 w-4 text-emerald-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-scale-in z-20" />
            )}
          </div>

          <div className="flex flex-col min-w-0 flex-grow space-y-3">
            {/* Problem title with enhanced styling */}
            <div className="flex items-center space-x-3">
              <label
                htmlFor={`checkbox-${problem.id}`}
                className={`cursor-pointer font-semibold text-lg truncate transition-all duration-300 ${completed ? "line-through text-gray-400" : "text-gray-100 hover:text-white group-hover:text-blue-300"
                  }`}
              >
                {problem.title}
              </label>

              {/* Problem number or ID indicator */}
              <div className="flex-shrink-0 text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded-full">
                #{problem.id.slice(-4)}
              </div>
            </div>

            {/* Enhanced metadata row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Difficulty badge with icon */}
              <Badge
                variant="outline"
                className={`
                  bg-gradient-to-r ${difficultyConfig.bg} ${difficultyConfig.text} ${difficultyConfig.border}
                  text-sm px-3 py-1.5 h-7 font-medium flex items-center space-x-1.5
                  transition-all duration-300 hover:shadow-lg hover:${difficultyConfig.glow} hover:scale-105
                  ${isHovered ? `shadow-md ${difficultyConfig.glow}` : ""}
                `}
              >
                {difficultyConfig.icon}
                <span>{problem.difficulty}</span>
              </Badge>

              {/* Estimated time */}
              <div className="flex items-center space-x-1.5 text-gray-400 text-sm bg-gray-700/30 px-3 py-1.5 rounded-full">
                <Clock className="h-3 w-3" />
                <span>{difficultyConfig.estimatedTime}</span>
              </div>

              {/* Points indicator */}
              <div className="flex items-center space-x-1.5 text-yellow-400 text-sm bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                <Star className="h-3 w-3" />
                <span>{difficultyConfig.points} pts</span>
              </div>

              {/* Completion indicator */}
              {completed && (
                <div className="flex items-center space-x-1.5 text-emerald-400 text-sm bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 animate-fade-in">
                  <Trophy className="h-3 w-3" />
                  <span>Solved</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced action buttons with tooltips */}
        <div className="flex items-center space-x-2 flex-shrink-0 relative z-10">
          {problem.problemLink && (
            <div className="relative group/tooltip">
              <Button
                size="icon"
                variant="ghost"
                asChild
                className="h-10 w-10 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 rounded-xl"
              >
                <a href={problem.problemLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={18} />
                </a>
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Open Problem
              </div>
            </div>
          )}

          {problem.videoLink && (
            <div className="relative group/tooltip">
              <Button
                size="icon"
                variant="ghost"
                asChild
                className="h-10 w-10 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-red-500/30 rounded-xl"
              >
                <a href={problem.videoLink} target="_blank" rel="noopener noreferrer">
                  <PlayCircle size={18} />
                </a>
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Watch Solution
              </div>
            </div>
          )}

          {problem.editorialLink && (
            <div className="relative group/tooltip">
              <Button
                size="icon"
                variant="ghost"
                asChild
                className="h-10 w-10 hover:bg-purple-500/20 text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30 rounded-xl"
              >
                <a href={problem.editorialLink} target="_blank" rel="noopener noreferrer">
                  <BookOpen size={18} />
                </a>
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Read Editorial
              </div>
            </div>
          )}

          {/* Quick code button (placeholder for future feature) */}
          <div className="relative group/tooltip">
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 hover:bg-green-500/20 text-gray-400 hover:text-green-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/30 rounded-xl"
              onClick={() => {
                // Placeholder for quick code editor
                console.log("Quick code editor for", problem.title)
              }}
            >
              <Code2 size={18} />
            </Button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Quick Code
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced login dialog with better styling */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <DialogTitle className="text-white text-2xl font-bold">Login Required</DialogTitle>
            </div>
            <DialogDescription className="text-gray-300 text-lg leading-relaxed">
              Join our community to track your progress, earn points, and unlock achievements on your coding journey!
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span>Track Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-blue-400" />
                <span>Earn Points</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-purple-400" />
                <span>Unlock Badges</span>
              </div>
            </div>
          </div>

          <DialogFooter className="space-x-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300"
              >
                Maybe Later
              </Button>
            </DialogClose>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Get Started
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

