

"use client"

import { useState } from "react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import TopicCard from "./TopicCard"
import { useProgress } from "@/contexts/ProgressContext"
import { ChevronDown } from "lucide-react"

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

interface Section {
  id: string
  title: string
  topics: Topic[]
}

interface SectionCardProps {
  section: Section
  searchQuery: string
  difficultyFilter: string | null
  sheetId: string
  onProblemToggle: (problemId: string) => void
  isFiltered: boolean
}

export default function SectionCard({
  section,
  searchQuery,
  difficultyFilter,
  sheetId,
  onProblemToggle,
  isFiltered,
}: SectionCardProps) {
  const { completedProblems } = useProgress()
  const [isExpanded, setIsExpanded] = useState(true)

  // Calculate completion stats for this section
  const totalProblems = section.topics.reduce((sum, topic) => sum + topic.problems.length, 0)

  const completedInSection = section.topics.reduce(
    (sum, topic) => sum + topic.problems.filter((problem) => completedProblems.includes(problem.id)).length,
    0,
  )

  const completionPercentage = totalProblems > 0 ? Math.round((completedInSection / totalProblems) * 100) : 0

  // Function to check if a topic should be shown based on filters
  const shouldShowTopic = (topic: Topic) => {
    if (!searchQuery && !difficultyFilter) return true

    return topic.problems.some((problem) => {
      const matchesSearch = !searchQuery || problem.title.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDifficulty = !difficultyFilter || problem.difficulty === difficultyFilter

      return matchesSearch && matchesDifficulty
    })
  }

  // Filter topics based on search and difficulty
  const filteredTopics = section.topics.filter(shouldShowTopic)

  // If no topics match the filters, don't render the section
  if (filteredTopics.length === 0 && isFiltered) return null

  return (
    <AccordionItem
      value={section.id}
      className="glass-card border border-white/10 rounded-2xl mb-6 overflow-hidden backdrop-blur-xl group hover:border-white/20 transition-all duration-500"
    >
      <AccordionTrigger
        className="px-6 py-5 hover:no-underline group/trigger"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              />
              <h3 className="text-xl font-semibold text-white group-hover/trigger:text-blue-400 transition-colors duration-300">
                {section.title}
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                {completedInSection}/{totalProblems}
              </span>
            </div>
          </div>

          {/* Enhanced progress bar */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${completionPercentage === 100
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50"
                  : "bg-gradient-to-r from-orange-400 to-amber-500 shadow-lg shadow-orange-500/50"
                  }`}
                style={{
                  width: `${completionPercentage}%`,
                  boxShadow: completionPercentage > 0 ? "0 0 20px rgba(251, 146, 60, 0.3)" : "none",
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-300 w-12 text-right">{completionPercentage}%</span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-6 pb-6">
        <div className="space-y-4 animate-fade-in">
          {filteredTopics.map((topic, index) => (
            <div key={topic.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 50}ms` }}>
              <TopicCard
                topic={topic}
                searchQuery={searchQuery}
                difficultyFilter={difficultyFilter}
                sheetId={sheetId}
                onProblemToggle={onProblemToggle}
                isFiltered={isFiltered}
              />
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
