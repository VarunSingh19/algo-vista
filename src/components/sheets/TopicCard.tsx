'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ProblemItem from './ProblemItem';
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

interface TopicCardProps {
  topic: Topic;
  searchQuery: string;
  difficultyFilter: string | null;
  sheetId: string;
  onProblemToggle: (problemId: string) => void;
  isFiltered: boolean;
}

export default function TopicCard({
  topic,
  searchQuery,
  difficultyFilter,
  sheetId,
  onProblemToggle,
  isFiltered
}: TopicCardProps) {
  const { completedProblems } = useProgress();

  // Calculate completion stats for this topic
  const totalProblems = topic.problems.length;
  const completedInTopic = topic.problems.filter(
    problem => completedProblems.includes(problem.id)
  ).length;

  // Function to check if a problem should be shown based on filters
  const shouldShowProblem = (problem: Problem) => {
    const matchesSearch = !searchQuery ||
      problem.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty = !difficultyFilter ||
      problem.difficulty === difficultyFilter;

    return matchesSearch && matchesDifficulty;
  };

  // Filter problems based on search and difficulty
  const filteredProblems = topic.problems.filter(shouldShowProblem);

  // If no problems match the filters, don't render the topic
  if (filteredProblems.length === 0 && isFiltered) return null;

  return (
    <AccordionItem value={topic.id} className="border rounded-lg overflow-hidden">
      <AccordionTrigger className="px-4 py-2 hover:no-underline">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center">
            <span className="font-medium">{topic.title}</span>
            <span className="ml-2 text-sm text-muted-foreground">
              ({completedInTopic}/{totalProblems})
            </span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pb-2">
        <div className="space-y-1 p-1">
          {filteredProblems.map(problem => (
            <ProblemItem
              key={problem.id}
              problem={problem}
              sheetId={sheetId}
              onToggle={() => onProblemToggle(problem.id)}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
