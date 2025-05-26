
'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import TopicCard from './TopicCard';
import { useProgress } from '@/contexts/ProgressContext';

interface Problem {
  id: string;
  title: string;
  problemLink?: string;
  videoLink?: string;
  editorialLink?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface Topic {
  id: string;
  title: string;
  problems: Problem[];
}

interface Section {
  id: string;
  title: string;
  topics: Topic[];
}

interface SectionCardProps {
  section: Section;
  searchQuery: string;
  difficultyFilter: string | null;
  sheetId: string;
  onProblemToggle: (problemId: string) => void;
  isFiltered: boolean;
}

export default function SectionCard({
  section,
  searchQuery,
  difficultyFilter,
  sheetId,
  onProblemToggle,
  isFiltered
}: SectionCardProps) {
  const { completedProblems } = useProgress();
  const [expanded, setExpanded] = useState<string[]>([]);

  // Calculate completion stats for this section
  const totalProblems = section.topics.reduce(
    (sum, topic) => sum + topic.problems.length,
    0
  );

  const completedInSection = section.topics.reduce(
    (sum, topic) => sum + topic.problems.filter(
      problem => completedProblems.includes(problem.id)
    ).length,
    0
  );

  const completionPercentage = totalProblems > 0
    ? Math.round((completedInSection / totalProblems) * 100)
    : 0;

  // Function to check if a topic should be shown based on filters
  const shouldShowTopic = (topic: Topic) => {
    if (!searchQuery && !difficultyFilter) return true;

    return topic.problems.some(problem => {
      const matchesSearch = !searchQuery ||
        problem.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty = !difficultyFilter ||
        problem.difficulty === difficultyFilter;

      return matchesSearch && matchesDifficulty;
    });
  };

  // Filter topics based on search and difficulty
  const filteredTopics = section.topics.filter(shouldShowTopic);

  // If no topics match the filters, don't render the section
  if (filteredTopics.length === 0 && isFiltered) return null;

  return (
    <AccordionItem
      value={section.id}
      className="border border-zinc-800 rounded-lg mb-4 bg-zinc-900/50 backdrop-blur-sm overflow-hidden"
    >
      <AccordionTrigger
        className="px-4 py-3 hover:no-underline group"
        onClick={() => setExpanded(prev =>
          prev.includes(section.id)
            ? prev.filter(id => id !== section.id)
            : [...prev, section.id]
        )}
      >
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center">
            <span className="font-medium text-white group-hover:text-orange-400 transition-colors">
              {section.title}
            </span>
            <span className="ml-2 text-sm text-zinc-400">
              ({completedInSection}/{totalProblems})
            </span>
          </div>

          {/* Progress bar */}
          <div className="hidden md:flex items-center w-32 ml-4">
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${completionPercentage === 100
                  ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                  : 'bg-gradient-to-r from-orange-500 to-amber-400'
                  }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="ml-2 text-xs text-zinc-400 w-10">
              {completionPercentage}%
            </span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 animate-fadeIn">
        <div className="space-y-4">
          {filteredTopics.map(topic => (
            <TopicCard
              key={topic.id}
              topic={topic}
              searchQuery={searchQuery}
              difficultyFilter={difficultyFilter}
              sheetId={sheetId}
              onProblemToggle={onProblemToggle}
              isFiltered={isFiltered}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}