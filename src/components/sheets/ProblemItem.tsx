
'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, FileText, ExternalLink, Check } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import Link from 'next/link';

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
  onToggle,
}: ProblemItemProps) {
  const { isCompleted, toggleProblem } = useProgress();
  const completed = isCompleted(problem.id);
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleToggle = async () => {
    await toggleProblem(sheetId, problem.id);
    onToggle();
  };

  const handleCheckboxChange = () => {
    if (!user) {
      setIsDialogOpen(true);
    } else {
      handleToggle();
    }
  };

  // Difficulty badge color classes
  const difficultyStyles = {
    Easy: {
      bg: 'bg-green-900/30',
      text: 'text-green-400',
      border: 'border-green-700/50',
    },
    Medium: {
      bg: 'bg-yellow-900/30',
      text: 'text-yellow-400',
      border: 'border-yellow-700/50',
    },
    Hard: {
      bg: 'bg-red-900/30',
      text: 'text-red-400',
      border: 'border-red-700/50',
    },
  }[problem.difficulty];

  return (
    <>
      <div
        className={`
          flex items-center justify-between p-3 rounded-lg
          ${completed
            ? 'bg-gradient-to-r from-zinc-800/50 to-zinc-900/30'
            : 'hover:bg-zinc-800/50'}
          transition-all duration-200 backdrop-blur-sm
          border border-zinc-800 hover:border-zinc-700
          ${completed ? 'opacity-80' : ''}
        `}
        id={`problem-${problem.id}`}
      >
        <div className="flex items-center space-x-4 flex-grow min-w-0">
          <div className="relative">
            <Checkbox
              checked={completed}
              onCheckedChange={handleCheckboxChange}
              id={`checkbox-${problem.id}`}
              className={`
                h-5 w-5 rounded-md border-2
                ${completed
                  ? 'border-green-500 bg-green-500/20'
                  : 'border-zinc-600 hover:border-zinc-500'}
                transition-colors
              `}
            />
            {completed && (
              <Check className="h-3 w-3 text-green-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <label
              htmlFor={`checkbox-${problem.id}`}
              className={`cursor-pointer font-medium truncate ${completed
                ? 'line-through text-zinc-400'
                : 'text-zinc-200 hover:text-white'
                } transition-colors`}
            >
              {problem.title}
            </label>

            <div className="flex flex-wrap items-center mt-1">
              <Badge
                variant="outline"
                className={`
                  ${difficultyStyles.bg} ${difficultyStyles.text} ${difficultyStyles.border}
                  text-xs px-2 py-0.5 h-6 mr-2 mb-1
                  transition-colors duration-200
                `}
              >
                {problem.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 flex-shrink-0">
          {problem.problemLink && (
            <Button
              size="icon"
              variant="ghost"
              asChild
              className="h-8 w-8 hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-300 transition-colors"
              title="Problem Link"
            >
              <a
                href={problem.problemLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={16} />
              </a>
            </Button>
          )}

          {problem.videoLink && (
            <Button
              size="icon"
              variant="ghost"
              asChild
              className="h-8 w-8 hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-300 transition-colors"
              title="Video Solution"
            >
              <a
                href={problem.videoLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PlayCircle size={16} />
              </a>
            </Button>
          )}

          {problem.editorialLink && (
            <Button
              size="icon"
              variant="ghost"
              asChild
              className="h-8 w-8 hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-300 transition-colors"
              title="Editorial"
            >
              <a
                href={problem.editorialLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText size={16} />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Login Required Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Please login to save your progress.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
