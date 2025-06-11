
"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlayCircle, FileText, ExternalLink, Check, Sparkles } from "lucide-react"
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

export default function ProblemItem({ problem, sheetId, onToggle }: ProblemItemProps) {
  const { isCompleted, toggleProblem } = useProgress()
  const completed = isCompleted(problem.id)
  const { user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleToggle = async () => {
    await toggleProblem(sheetId, problem.id)
    onToggle()
  }

  const handleCheckboxChange = () => {
    if (!user) {
      setIsDialogOpen(true)
    } else {
      handleToggle()
    }
  }

  // Difficulty badge styles with enhanced effects
  const difficultyStyles = {
    Easy: {
      bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
      text: "text-green-400",
      border: "border-green-500/50",
      glow: "shadow-green-500/25",
    },
    Medium: {
      bg: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
      text: "text-yellow-400",
      border: "border-yellow-500/50",
      glow: "shadow-yellow-500/25",
    },
    Hard: {
      bg: "bg-gradient-to-r from-red-500/20 to-rose-500/20",
      text: "text-red-400",
      border: "border-red-500/50",
      glow: "shadow-red-500/25",
    },
  }[problem.difficulty]

  return (
    <>
      <div
        className={`
          group relative flex items-center justify-between p-4 rounded-xl transition-all duration-300
          ${completed
            ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
            : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
          }
          ${isHovered ? "transform translate-y-[-2px] shadow-lg shadow-black/20" : ""}
          backdrop-blur-sm
        `}
        id={`problem-${problem.id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Completion sparkle effect */}
        {completed && (
          <div className="absolute -top-1 -right-1">
            <Sparkles className="h-4 w-4 text-green-400 animate-pulse" />
          </div>
        )}

        <div className="flex items-center space-x-4 flex-grow min-w-0">
          {/* Enhanced checkbox */}
          <div className="relative">
            <Checkbox
              checked={completed}
              onCheckedChange={handleCheckboxChange}
              id={`checkbox-${problem.id}`}
              className={`
                h-5 w-5 rounded-md border-2 transition-all duration-300
                ${completed
                  ? "border-green-500 bg-green-500/20 shadow-lg shadow-green-500/50"
                  : "border-gray-500 hover:border-gray-400 hover:shadow-md"
                }
              `}
            />
            {completed && (
              <Check className="h-3 w-3 text-green-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-scale-in" />
            )}
          </div>

          <div className="flex flex-col min-w-0 flex-grow">
            <label
              htmlFor={`checkbox-${problem.id}`}
              className={`cursor-pointer font-medium truncate transition-all duration-300 ${completed ? "line-through text-gray-400" : "text-gray-200 hover:text-white group-hover:text-blue-400"
                }`}
            >
              {problem.title}
            </label>

            <div className="flex flex-wrap items-center mt-2">
              <Badge
                variant="outline"
                className={`
                  ${difficultyStyles.bg} ${difficultyStyles.text} ${difficultyStyles.border}
                  text-xs px-3 py-1 h-6 mr-2 mb-1 font-medium
                  transition-all duration-300 hover:shadow-lg hover:${difficultyStyles.glow}
                  ${isHovered ? `shadow-md ${difficultyStyles.glow}` : ""}
                `}
              >
                {problem.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        {/* Enhanced action buttons */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          {problem.problemLink && (
            <Button
              size="icon"
              variant="ghost"
              asChild
              className="h-9 w-9 hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
              title="Problem Link"
            >
              <a href={problem.problemLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} />
              </a>
            </Button>
          )}

          {problem.videoLink && (
            <Button
              size="icon"
              variant="ghost"
              asChild
              className="h-9 w-9 hover:bg-white/10 text-gray-400 hover:text-red-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-red-500/25"
              title="Video Solution"
            >
              <a href={problem.videoLink} target="_blank" rel="noopener noreferrer">
                <PlayCircle size={16} />
              </a>
            </Button>
          )}

          {problem.editorialLink && (
            <Button
              size="icon"
              variant="ghost"
              asChild
              className="h-9 w-9 hover:bg-white/10 text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25"
              title="Editorial"
            >
              <a href={problem.editorialLink} target="_blank" rel="noopener noreferrer">
                <FileText size={16} />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced login dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border border-white/20 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Login Required</DialogTitle>
            <DialogDescription className="text-gray-300">
              Please login to save your progress and track your learning journey.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-3">
            <DialogClose asChild>
              <Button variant="outline" className="glass-button">
                Cancel
              </Button>
            </DialogClose>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                Go to Login
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
