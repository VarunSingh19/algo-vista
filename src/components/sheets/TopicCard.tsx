
// "use client"

// import { useState } from "react"
// import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import ProblemItem from "./ProblemItem"
// import { useProgress } from "@/contexts/ProgressContext"
// import { ChevronRight } from "lucide-react"

// interface Problem {
//   id: string
//   title: string
//   problemLink?: string
//   videoLink?: string
//   editorialLink?: string
//   difficulty: "Easy" | "Medium" | "Hard"
// }

// interface Topic {
//   id: string
//   title: string
//   problems: Problem[]
// }

// interface TopicCardProps {
//   topic: Topic
//   searchQuery: string
//   difficultyFilter: string | null
//   sheetId: string
//   onProblemToggle: (problemId: string) => void
//   isFiltered: boolean
// }

// export default function TopicCard({
//   topic,
//   searchQuery,
//   difficultyFilter,
//   sheetId,
//   onProblemToggle,
//   isFiltered,
// }: TopicCardProps) {
//   const { completedProblems } = useProgress()
//   const [isExpanded, setIsExpanded] = useState(false)

//   // Calculate completion stats for this topic
//   const totalProblems = topic.problems.length
//   const completedInTopic = topic.problems.filter((problem) => completedProblems.includes(problem.id)).length

//   const completionPercentage = totalProblems > 0 ? Math.round((completedInTopic / totalProblems) * 100) : 0

//   // Function to check if a problem should be shown based on filters
//   const shouldShowProblem = (problem: Problem) => {
//     const matchesSearch = !searchQuery || problem.title.toLowerCase().includes(searchQuery.toLowerCase())

//     const matchesDifficulty = !difficultyFilter || problem.difficulty === difficultyFilter

//     return matchesSearch && matchesDifficulty
//   }

//   // Filter problems based on search and difficulty
//   const filteredProblems = topic.problems.filter(shouldShowProblem)

//   // If no problems match the filters, don't render the topic
//   if (filteredProblems.length === 0 && isFiltered) return null

//   return (
//     <AccordionItem
//       value={topic.id}
//       className="border border-white/5 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
//     >
//       <AccordionTrigger
//         className="px-4 py-3 hover:no-underline group/trigger"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <div className="flex flex-1 items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <ChevronRight
//               className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
//             />
//             <span className="font-medium text-gray-200 group-hover/trigger:text-white transition-colors duration-300">
//               {topic.title}
//             </span>
//             <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
//               {completedInTopic}/{totalProblems}
//             </span>
//           </div>

//           {/* Mini progress bar */}
//           <div className="hidden md:flex items-center space-x-3">
//             <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
//               <div
//                 className={`h-full rounded-full transition-all duration-700 ${completionPercentage === 100
//                     ? "bg-gradient-to-r from-green-400 to-emerald-500"
//                     : "bg-gradient-to-r from-orange-400 to-amber-500"
//                   }`}
//                 style={{ width: `${completionPercentage}%` }}
//               />
//             </div>
//             <span className="text-xs text-gray-400 w-8 text-right">{completionPercentage}%</span>
//           </div>
//         </div>
//       </AccordionTrigger>

//       <AccordionContent className="pb-2">
//         <div className="space-y-1 p-2 animate-fade-in">
//           {filteredProblems.map((problem, index) => (
//             <div key={problem.id} className="animate-slide-in-right" style={{ animationDelay: `${index * 30}ms` }}>
//               <ProblemItem problem={problem} sheetId={sheetId} onToggle={() => onProblemToggle(problem.id)} />
//             </div>
//           ))}
//         </div>
//       </AccordionContent>
//     </AccordionItem>
//   )
// }
"use client"

import { useState } from "react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ProblemItem from "./ProblemItem"
import { useProgress } from "@/contexts/ProgressContext"
import { ChevronRight, Trophy, Target, Clock, Zap, CheckCircle2, Circle, Star } from 'lucide-react'

interface Problem {
  id: string
  title: string
  problemLink?: string
  videoLink?: string
  editorialLink?: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface Topic {
  id: string
  title: string
  problems: Problem[]
}

interface TopicCardProps {
  topic: Topic
  searchQuery: string
  difficultyFilter: string | null
  sheetId: string
  onProblemToggle: (problemId: string) => void
  isFiltered: boolean
}

export default function EnhancedTopicCard({
  topic,
  searchQuery,
  difficultyFilter,
  sheetId,
  onProblemToggle,
  isFiltered,
}: TopicCardProps) {
  const { completedProblems } = useProgress()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Calculate completion stats for this topic
  const totalProblems = topic.problems.length
  const completedInTopic = topic.problems.filter((problem) => completedProblems.includes(problem.id)).length
  const completionPercentage = totalProblems > 0 ? Math.round((completedInTopic / totalProblems) * 100) : 0

  // Calculate difficulty distribution
  const difficultyStats = topic.problems.reduce((acc, problem) => {
    acc[problem.difficulty] = (acc[problem.difficulty] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const completedByDifficulty = topic.problems.reduce((acc, problem) => {
    if (completedProblems.includes(problem.id)) {
      acc[problem.difficulty] = (acc[problem.difficulty] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  // Function to check if a problem should be shown based on filters
  const shouldShowProblem = (problem: Problem) => {
    const matchesSearch = !searchQuery || problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = !difficultyFilter || problem.difficulty === difficultyFilter
    return matchesSearch && matchesDifficulty
  }

  // Filter problems based on search and difficulty
  const filteredProblems = topic.problems.filter(shouldShowProblem)

  // If no problems match the filters, don't render the topic
  if (filteredProblems.length === 0 && isFiltered) return null

  // Determine topic status
  const isCompleted = completionPercentage === 100
  const isInProgress = completionPercentage > 0 && completionPercentage < 100
  const isNotStarted = completionPercentage === 0

  // Get status icon and colors
  const getStatusIcon = () => {
    if (isCompleted) return <Trophy className="h-4 w-4 text-yellow-400" />
    if (isInProgress) return <Target className="h-4 w-4 text-blue-400" />
    return <Circle className="h-4 w-4 text-gray-500" />
  }

  const getCardGradient = () => {
    if (isCompleted) return "from-yellow-500/20 via-amber-500/10 to-orange-500/20"
    if (isInProgress) return "from-blue-500/20 via-indigo-500/10 to-purple-500/20"
    return "from-gray-500/10 via-slate-500/5 to-gray-500/10"
  }

  const getBorderGradient = () => {
    if (isCompleted) return "from-yellow-400/50 via-amber-400/30 to-orange-400/50"
    if (isInProgress) return "from-blue-400/50 via-indigo-400/30 to-purple-400/50"
    return "from-gray-400/30 via-slate-400/20 to-gray-400/30"
  }

  const getProgressGradient = () => {
    if (isCompleted) return "from-yellow-400 via-amber-500 to-orange-500"
    if (isInProgress) return "from-blue-400 via-indigo-500 to-purple-500"
    return "from-gray-400 to-slate-500"
  }

  return (
    <AccordionItem
      value={topic.id}
      className="border-0 rounded-2xl overflow-hidden group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient()} transition-all duration-500 ${isHovered ? 'opacity-100 scale-105' : 'opacity-70'}`} />

      {/* Animated border */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getBorderGradient()} p-[1px] transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-50'}`}>
        <div className="w-full h-full bg-gray-900/90 backdrop-blur-xl rounded-2xl" />
      </div>

      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getBorderGradient()} blur-xl transition-all duration-500 ${isHovered ? 'opacity-30' : 'opacity-0'}`} />

      <div className="relative z-10">
        <AccordionTrigger
          className="px-6 py-5 hover:no-underline group/trigger border-0 rounded-2xl"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex flex-1 items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              {/* Status icon with animation */}
              <div className={`transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`}>
                {getStatusIcon()}
              </div>

              {/* Chevron with smooth rotation */}
              <ChevronRight
                className={`h-5 w-5 text-gray-400 transition-all duration-500 ease-out ${isExpanded ? "rotate-90 text-white" : ""
                  } ${isHovered ? 'text-gray-300' : ''}`}
              />

              <div className="flex flex-col items-start space-y-1">
                <span className={`font-semibold text-lg transition-all duration-300 ${isCompleted ? 'text-yellow-200' :
                    isInProgress ? 'text-blue-200' : 'text-gray-200'
                  } ${isHovered ? 'text-white' : ''}`}>
                  {topic.title}
                </span>

                {/* Difficulty distribution pills */}
                <div className="flex items-center space-x-2">
                  {difficultyStats.Easy && (
                    <div className="flex items-center space-x-1 bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full text-xs">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span>{completedByDifficulty.Easy || 0}/{difficultyStats.Easy}</span>
                    </div>
                  )}
                  {difficultyStats.Medium && (
                    <div className="flex items-center space-x-1 bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full text-xs">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                      <span>{completedByDifficulty.Medium || 0}/{difficultyStats.Medium}</span>
                    </div>
                  )}
                  {difficultyStats.Hard && (
                    <div className="flex items-center space-x-1 bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full text-xs">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      <span>{completedByDifficulty.Hard || 0}/{difficultyStats.Hard}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced progress section */}
            <div className="flex items-center space-x-4">
              {/* Circular progress indicator */}
              <div className="relative w-16 h-16 hidden lg:block">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="url(#progressGradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - completionPercentage / 100)}`}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={isCompleted ? "#fbbf24" : isInProgress ? "#60a5fa" : "#6b7280"} />
                      <stop offset="100%" stopColor={isCompleted ? "#f59e0b" : isInProgress ? "#3b82f6" : "#4b5563"} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-sm font-bold ${isCompleted ? 'text-yellow-300' :
                      isInProgress ? 'text-blue-300' : 'text-gray-400'
                    }`}>
                    {completionPercentage}%
                  </span>
                </div>
              </div>

              {/* Linear progress bar for smaller screens */}
              <div className="flex flex-col items-end space-y-2 lg:hidden">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-300">
                    {completedInTopic}/{totalProblems}
                  </span>
                  <span className={`text-xs font-bold ${isCompleted ? 'text-yellow-300' :
                      isInProgress ? 'text-blue-300' : 'text-gray-400'
                    }`}>
                    {completionPercentage}%
                  </span>
                </div>
                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getProgressGradient()}`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Completion badge */}
              {isCompleted && (
                <div className={`flex items-center space-x-1 bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Complete</span>
                </div>
              )}

              {/* Estimated time */}
              <div className="hidden xl:flex items-center space-x-1 text-gray-400 text-sm">
                <Clock className="h-4 w-4" />
                <span>{Math.ceil(totalProblems * 0.5)}h</span>
              </div>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="pb-4 px-6">
          <div className="space-y-2 animate-fade-in">
            {/* Topic stats bar */}
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl mb-4 backdrop-blur-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300">
                    {filteredProblems.length} Problems
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">
                    {completedInTopic} Solved
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Est. {Math.ceil(filteredProblems.length * 0.5)} hours
              </div>
            </div>

            {/* Problems list with staggered animation */}
            {filteredProblems.map((problem, index) => (
              <div
                key={problem.id}
                className="animate-slide-in-right opacity-0"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <ProblemItem
                  problem={problem}
                  sheetId={sheetId}
                  onToggle={() => onProblemToggle(problem.id)}
                />
              </div>
            ))}
          </div>
        </AccordionContent>
      </div>
    </AccordionItem>
  )
}
