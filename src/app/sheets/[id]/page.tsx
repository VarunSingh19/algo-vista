
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import apiClient from "@/lib/api"
import { ProgressProvider } from "@/contexts/ProgressContext"
import { Accordion } from "@/components/ui/accordion"
import SheetHeader from "@/components/sheets/SheetHeader"
import SectionCard from "@/components/sheets/SectionCard"
import { AlertCircle } from "lucide-react"
import ParticleBackground from "@/components/ui/ParticleBackground"
import LoadingSkeleton from "@/components/ui/loading-skeleton"

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

interface Sheet {
  _id: string
  title: string
  description: string
  totalProblems: number
  sections: Section[]
}

export default function SheetPage() {
  const { id } = useParams<{ id: string }>()
  const [sheet, setSheet] = useState<Sheet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Fetch sheet data
  useEffect(() => {
    const fetchSheet = async () => {
      try {
        setLoading(true)
        const { data } = await apiClient.getSheet(id as string)
        setSheet(data)
        // Trigger entrance animation
        setTimeout(() => setIsVisible(true), 100)
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch sheet")
      } finally {
        setLoading(false)
      }
    }

    fetchSheet()
  }, [id])

  // Handler for toggling problem completion
  const handleProblemToggle = (problemId: string) => {
    console.log("Problem toggled:", problemId)
  }

  // Handler for search input
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Handler for difficulty filter
  const handleFilter = (difficulty: string | null) => {
    setDifficultyFilter(difficulty)
  }

  // Handler for random problem selection
  const handleRandomProblem = () => {
    if (!sheet) return

    const allProblems: Problem[] = []

    sheet.sections.forEach((section) => {
      section.topics.forEach((topic) => {
        topic.problems.forEach((problem) => {
          const matchesSearch = !searchQuery || problem.title.toLowerCase().includes(searchQuery.toLowerCase())

          const matchesDifficulty = !difficultyFilter || problem.difficulty === difficultyFilter

          if (matchesSearch && matchesDifficulty) {
            allProblems.push(problem)
          }
        })
      })
    })

    if (allProblems.length === 0) return

    const randomIndex = Math.floor(Math.random() * allProblems.length)
    const randomProblem = allProblems[randomIndex]

    const problemElement = document.getElementById(`problem-${randomProblem.id}`)
    if (problemElement) {
      problemElement.scrollIntoView({ behavior: "smooth", block: "center" })

      // Enhanced highlight effect
      problemElement.classList.add("animate-pulse-glow")
      setTimeout(() => {
        problemElement.classList.remove("animate-pulse-glow")
      }, 2000)
    }
  }

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  // Error state
  if (error || !sheet) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 glass-card p-8 rounded-2xl border border-white/10">
          <div className="flex items-center text-red-400">
            <AlertCircle className="mr-3 h-6 w-6" />
            <span className="text-lg font-medium">{error || "Sheet not found"}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 animate-gradient-shift" />

      {/* Particle background */}
      <ParticleBackground />

      {/* Main content */}
      <div className="relative z-10">
        <ProgressProvider sheetId={sheet._id}>
          <div
            className={`max-w-6xl mx-auto p-6 space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {/* Sheet header with stagger animation */}
            <div className="animate-slide-in-left">
              <SheetHeader
                title={sheet.title}
                description={sheet.description}
                totalProblems={sheet.totalProblems}
                onSearch={handleSearch}
                onFilter={handleFilter}
                onRandom={handleRandomProblem}
              />
            </div>

            {/* Sections accordion with stagger animation */}
            <div className="space-y-6">
              <Accordion type="multiple" defaultValue={sheet.sections.map((s) => s.id)}>
                {sheet.sections.map((section, index) => (
                  <div key={section.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <SectionCard
                      section={section}
                      searchQuery={searchQuery}
                      difficultyFilter={difficultyFilter}
                      sheetId={sheet._id}
                      onProblemToggle={handleProblemToggle}
                      isFiltered={!!searchQuery || !!difficultyFilter}
                    />
                  </div>
                ))}
              </Accordion>
            </div>
          </div>
        </ProgressProvider>
      </div>
    </div>
  )
}
