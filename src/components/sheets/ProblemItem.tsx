'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, FileText, ExternalLink } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

interface Problem {
  id: string;
  title: string;
  problemLink?: string;
  videoLink?: string;
  editorialLink?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface ProblemItemProps {
  problem: Problem;
  sheetId: string;
  onToggle: () => void;
}

export default function ProblemItem({
  problem,
  sheetId,
  onToggle
}: ProblemItemProps) {
  const { isCompleted, toggleProblem } = useProgress();

  const completed = isCompleted(problem.id);

  const handleToggle = async () => {
    await toggleProblem(sheetId, problem.id);
    onToggle();
  };

  // Difficulty badge color
  const difficultyColor = {
    Easy: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    Hard: 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
  }[problem.difficulty];

  return (
    <div
      className={`flex items-center justify-between p-2 rounded-md ${
        completed ? 'bg-primary/5' : 'hover:bg-accent'
      }`}
      id={`problem-${problem.id}`}
    >
      <div className="flex items-center space-x-3 flex-grow">
        <Checkbox
          checked={completed}
          onCheckedChange={handleToggle}
          id={`checkbox-${problem.id}`}
        />

        <div className="flex flex-col md:flex-row md:items-center">
          <label
            htmlFor={`checkbox-${problem.id}`}
            className={`cursor-pointer font-medium ${completed ? 'line-through text-muted-foreground' : ''}`}
          >
            {problem.title}
          </label>

          <Badge
            variant="outline"
            className={`ml-0 md:ml-2 mt-1 md:mt-0 w-fit ${difficultyColor}`}
          >
            {problem.difficulty}
          </Badge>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {problem.problemLink && (
          <Button
            size="icon"
            variant="ghost"
            asChild
            className="h-8 w-8"
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
            className="h-8 w-8"
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
            className="h-8 w-8"
            title="Editorial"
          >
            <a href={problem.editorialLink} target="_blank" rel="noopener noreferrer">
              <FileText size={16} />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
