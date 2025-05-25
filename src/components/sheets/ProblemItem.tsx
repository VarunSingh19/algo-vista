// 'use client';

// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { PlayCircle, FileText, ExternalLink } from 'lucide-react';
// import { useProgress } from '@/contexts/ProgressContext';

// interface Problem {
//   id: string;
//   title: string;
//   problemLink?: string;
//   videoLink?: string;
//   editorialLink?: string;
//   difficulty: 'Easy' | 'Medium' | 'Hard';
// }

// interface ProblemItemProps {
//   problem: Problem;
//   sheetId: string;
//   onToggle: () => void;
// }

// export default function ProblemItem({
//   problem,
//   sheetId,
//   onToggle
// }: ProblemItemProps) {
//   const { isCompleted, toggleProblem } = useProgress();

//   const completed = isCompleted(problem.id);

//   const handleToggle = async () => {
//     await toggleProblem(sheetId, problem.id);
//     onToggle();
//   };

//   // Difficulty badge color
//   const difficultyColor = {
//     Easy: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
//     Medium: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
//     Hard: 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
//   }[problem.difficulty];

//   return (
//     <div
//       className={`flex items-center justify-between p-2 rounded-md ${
//         completed ? 'bg-primary/5' : 'hover:bg-accent'
//       }`}
//       id={`problem-${problem.id}`}
//     >
//       <div className="flex items-center space-x-3 flex-grow">
//         <Checkbox
//           checked={completed}
//           onCheckedChange={handleToggle}
//           id={`checkbox-${problem.id}`}
//         />

//         <div className="flex flex-col md:flex-row md:items-center">
//           <label
//             htmlFor={`checkbox-${problem.id}`}
//             className={`cursor-pointer font-medium ${completed ? 'line-through text-muted-foreground' : ''}`}
//           >
//             {problem.title}
//           </label>

//           <Badge
//             variant="outline"
//             className={`ml-0 md:ml-2 mt-1 md:mt-0 w-fit ${difficultyColor}`}
//           >
//             {problem.difficulty}
//           </Badge>
//         </div>
//       </div>

//       <div className="flex items-center space-x-1">
//         {problem.problemLink && (
//           <Button
//             size="icon"
//             variant="ghost"
//             asChild
//             className="h-8 w-8"
//             title="Problem Link"
//           >
//             <a href={problem.problemLink} target="_blank" rel="noopener noreferrer">
//               <ExternalLink size={16} />
//             </a>
//           </Button>
//         )}

//         {problem.videoLink && (
//           <Button
//             size="icon"
//             variant="ghost"
//             asChild
//             className="h-8 w-8"
//             title="Video Solution"
//           >
//             <a href={problem.videoLink} target="_blank" rel="noopener noreferrer">
//               <PlayCircle size={16} />
//             </a>
//           </Button>
//         )}

//         {problem.editorialLink && (
//           <Button
//             size="icon"
//             variant="ghost"
//             asChild
//             className="h-8 w-8"
//             title="Editorial"
//           >
//             <a href={problem.editorialLink} target="_blank" rel="noopener noreferrer">
//               <FileText size={16} />
//             </a>
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, FileText, ExternalLink, Check } from 'lucide-react';
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

  // Difficulty badge color classes
  const difficultyStyles = {
    Easy: {
      bg: 'bg-green-900/30',
      text: 'text-green-400',
      border: 'border-green-700/50'
    },
    Medium: {
      bg: 'bg-yellow-900/30',
      text: 'text-yellow-400',
      border: 'border-yellow-700/50'
    },
    Hard: {
      bg: 'bg-red-900/30',
      text: 'text-red-400',
      border: 'border-red-700/50'
    }
  }[problem.difficulty];

  return (
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
            onCheckedChange={handleToggle}
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
  );
}