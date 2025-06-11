
// 'use client';

// import { useState } from 'react';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
// import ProblemItem from './ProblemItem';
// import { useProgress } from '@/contexts/ProgressContext';

// interface Problem {
//   id: string;
//   title: string;
//   problemLink?: string;
//   videoLink?: string;
//   editorialLink?: string;
//   difficulty: 'Easy' | 'Medium' | 'Hard';
// }

// interface Topic {
//   id: string;
//   title: string;
//   problems: Problem[];
// }

// interface TopicCardProps {
//   topic: Topic;
//   searchQuery: string;
//   difficultyFilter: string | null;
//   sheetId: string;
//   onProblemToggle: (problemId: string) => void;
//   isFiltered: boolean;
// }

// export default function TopicCard({
//   topic,
//   searchQuery,
//   difficultyFilter,
//   sheetId,
//   onProblemToggle,
//   isFiltered
// }: TopicCardProps) {
//   const { completedProblems } = useProgress();
//   const [expanded, setExpanded] = useState(false);

//   // Calculate completion stats for this topic
//   const totalProblems = topic.problems.length;
//   const completedInTopic = topic.problems.filter(
//     problem => completedProblems.includes(problem.id)
//   ).length;

//   const completionPercentage = totalProblems > 0
//     ? Math.round((completedInTopic / totalProblems) * 100)
//     : 0;

//   // Function to check if a problem should be shown based on filters
//   const shouldShowProblem = (problem: Problem) => {
//     const matchesSearch = !searchQuery ||
//       problem.title.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesDifficulty = !difficultyFilter ||
//       problem.difficulty === difficultyFilter;

//     return matchesSearch && matchesDifficulty;
//   };

//   // Filter problems based on search and difficulty
//   const filteredProblems = topic.problems.filter(shouldShowProblem);

//   // If no problems match the filters, don't render the topic
//   if (filteredProblems.length === 0 && isFiltered) return null;

//   return (
//     <AccordionItem
//       value={topic.id}
//       className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/30 backdrop-blur-sm mb-2"
//     >
//       <AccordionTrigger
//         className="px-4 py-3 hover:no-underline group"
//         onClick={() => setExpanded(!expanded)}
//       >
//         <div className="flex flex-1 items-center justify-between">
//           <div className="flex items-center">
//             <span className="font-medium text-white group-hover:text-orange-400 transition-colors">
//               {topic.title}
//             </span>
//             <span className="ml-2 text-sm text-zinc-400">
//               ({completedInTopic}/{totalProblems})
//             </span>
//           </div>

//           {/* Progress bar */}
//           <div className="hidden md:flex items-center w-32 ml-4">
//             <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
//               <div
//                 className={`h-2 rounded-full transition-all duration-500 ${completionPercentage === 100
//                   ? 'bg-gradient-to-r from-green-500 to-emerald-400'
//                   : 'bg-gradient-to-r from-orange-500 to-amber-400'
//                   }`}
//                 style={{ width: `${completionPercentage}%` }}
//               />
//             </div>
//             <span className="ml-2 text-xs text-zinc-400 w-10">
//               {completionPercentage}%
//             </span>
//           </div>
//         </div>
//       </AccordionTrigger>

//       <AccordionContent className="pb-2 animate-fadeIn">
//         <div className="space-y-1 p-2">
//           {filteredProblems.map(problem => (
//             <ProblemItem
//               key={problem.id}
//               problem={problem}
//               sheetId={sheetId}
//               onToggle={() => onProblemToggle(problem.id)}
//             />
//           ))}
//         </div>
//       </AccordionContent>
//     </AccordionItem>
//   );
// }

"use client"

import { useState } from "react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ProblemItem from "./ProblemItem"
import { useProgress } from "@/contexts/ProgressContext"
import { ChevronRight } from "lucide-react"

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

export default function TopicCard({
  topic,
  searchQuery,
  difficultyFilter,
  sheetId,
  onProblemToggle,
  isFiltered,
}: TopicCardProps) {
  const { completedProblems } = useProgress()
  const [isExpanded, setIsExpanded] = useState(false)

  // Calculate completion stats for this topic
  const totalProblems = topic.problems.length
  const completedInTopic = topic.problems.filter((problem) => completedProblems.includes(problem.id)).length

  const completionPercentage = totalProblems > 0 ? Math.round((completedInTopic / totalProblems) * 100) : 0

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

  return (
    <AccordionItem
      value={topic.id}
      className="border border-white/5 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
    >
      <AccordionTrigger
        className="px-4 py-3 hover:no-underline group/trigger"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-3">
            <ChevronRight
              className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
            />
            <span className="font-medium text-gray-200 group-hover/trigger:text-white transition-colors duration-300">
              {topic.title}
            </span>
            <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
              {completedInTopic}/{totalProblems}
            </span>
          </div>

          {/* Mini progress bar */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${completionPercentage === 100
                    ? "bg-gradient-to-r from-green-400 to-emerald-500"
                    : "bg-gradient-to-r from-orange-400 to-amber-500"
                  }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-8 text-right">{completionPercentage}%</span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pb-2">
        <div className="space-y-1 p-2 animate-fade-in">
          {filteredProblems.map((problem, index) => (
            <div key={problem.id} className="animate-slide-in-right" style={{ animationDelay: `${index * 30}ms` }}>
              <ProblemItem problem={problem} sheetId={sheetId} onToggle={() => onProblemToggle(problem.id)} />
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
