

"use client"

import type React from "react"

import { useState } from "react"
import { useProgress } from "@/contexts/ProgressContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Shuffle, Sparkles } from "lucide-react"
import AnimatedProgressCircle from "../ui/animated-progress-circle"

interface SheetHeaderProps {
  title: string
  description: string
  totalProblems: number
  onSearch: (query: string) => void
  onFilter: (difficulty: string | null) => void
  onRandom: () => void
}

export default function SheetHeader({
  title,
  description,
  totalProblems,
  onSearch,
  onFilter,
  onRandom,
}: SheetHeaderProps) {
  const { completedProblems, completionPercentage } = useProgress()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isRandomSpinning, setIsRandomSpinning] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch(value)
  }

  const handleFilterClick = (difficulty: string | null) => {
    const newFilter = activeFilter === difficulty ? null : difficulty
    setActiveFilter(newFilter)
    onFilter(newFilter)
  }

  const handleRandomClick = () => {
    setIsRandomSpinning(true)
    setTimeout(() => {
      setIsRandomSpinning(false)
      onRandom()
    }, 1000)
  }

  const currentPercentage = completionPercentage(totalProblems)

  return (
    <div className="space-y-8">
      {/* Floating header with glassmorphism */}
      <div className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">DSA Mastery Sheet</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
            {title}
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Progress card with enhanced animations */}
      <Card className="glass-card border border-white/10 backdrop-blur-xl overflow-hidden group bg-gray hover:border-white/20 transition-all duration-500">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Enhanced progress circle */}
            <div className="flex items-center space-x-8">
              <AnimatedProgressCircle percentage={currentPercentage} size={100} strokeWidth={8} />

              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-white">{completedProblems.length}</span>
                  <span className="text-lg text-gray-400">/ {totalProblems}</span>
                </div>
                <p className="text-sm font-medium text-gray-300">Problems Completed</p>
                <p className="text-xs text-gray-400">{totalProblems - completedProblems.length} remaining</p>
              </div>
            </div>

            {/* Enhanced difficulty filters */}
            <div className="flex items-center space-x-3">
              <Badge
                variant={activeFilter === "Easy" ? "default" : "outline"}
                className={`
                  cursor-pointer text-white px-4 py-2 text-sm font-medium transition-all duration-300 transform hover:scale-105
                  ${activeFilter === "Easy"
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/50 shadow-lg shadow-green-100/25 animate-pulse-subtle"
                    : "glass-badge hover:border-green-500/30 hover:text-green-400"
                  }
                `}
                onClick={() => handleFilterClick("Easy")}
              >
                Easy
              </Badge>
              <Badge
                variant={activeFilter === "Medium" ? "default" : "outline"}
                className={`
                  cursor-pointer text-white px-4 py-2 text-sm font-medium transition-all duration-300 transform hover:scale-105
                  ${activeFilter === "Medium"
                    ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/50 shadow-lg shadow-yellow-500/25 animate-pulse-subtle"
                    : "glass-badge hover:border-yellow-500/30 hover:text-yellow-400"
                  }
                `}
                onClick={() => handleFilterClick("Medium")}
              >
                Medium
              </Badge>
              <Badge
                variant={activeFilter === "Hard" ? "default" : "outline"}
                className={`
                  cursor-pointer text-white px-4 py-2 text-sm font-medium transition-all duration-300 transform hover:scale-105
                  ${activeFilter === "Hard"
                    ? "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border-red-500/50 shadow-lg shadow-red-500/25 animate-pulse-subtle"
                    : "glass-badge hover:border-red-500/30 hover:text-red-400"
                  }
                `}
                onClick={() => handleFilterClick("Hard")}
              >
                Hard
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced search and controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div
          className={`relative flex-grow transition-all duration-300 ${isSearchFocused ? "transform scale-[1.02]" : ""
            }`}
        >
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${isSearchFocused ? "text-blue-400" : "text-gray-500"
              }`}
          />
          <Input
            placeholder="Search problems..."
            className={`pl-12 h-12 glass-input text-white placeholder:text-gray-400 transition-all duration-300 ${isSearchFocused ? "border-blue-500/50 shadow-lg shadow-blue-500/25" : ""
              }`}
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setActiveFilter(null)
              onFilter(null)
            }}
            className="glass-button h-12 px-6 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>

          <Button
            onClick={handleRandomClick}
            disabled={isRandomSpinning}
            className={`h-12 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 ${isRandomSpinning ? "animate-spin" : ""
              }`}
          >
            <Shuffle className={`h-4 w-4 mr-2 ${isRandomSpinning ? "animate-spin" : ""}`} />
            Random
          </Button>
        </div>
      </div>
    </div>
  )
}
