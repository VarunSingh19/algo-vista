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
    <AccordionItem value={section.id} className="border rounded-lg mb-4 bg-card">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center">
            <span className="font-medium">{section.title}</span>
            <span className="ml-2 text-sm text-muted-foreground">
              ({completedInSection}/{totalProblems})
            </span>
          </div>

          {/* Progress bar */}
          <div className="hidden md:flex items-center w-32 ml-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="ml-2 text-xs text-muted-foreground w-10">
              {completionPercentage}%
            </span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4">
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
