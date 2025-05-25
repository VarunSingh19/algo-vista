// 'use client';

// import { useState } from 'react';
// import { useProgress } from '@/contexts/ProgressContext';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Search, Filter, Shuffle } from 'lucide-react';

// interface SheetHeaderProps {
//   title: string;
//   description: string;
//   totalProblems: number;
//   onSearch: (query: string) => void;
//   onFilter: (difficulty: string | null) => void;
//   onRandom: () => void;
// }

// export default function SheetHeader({
//   title,
//   description,
//   totalProblems,
//   onSearch,
//   onFilter,
//   onRandom
// }: SheetHeaderProps) {
//   const { completedProblems, completionPercentage } = useProgress();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeFilter, setActiveFilter] = useState<string | null>(null);

//   // Handle search input change
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchQuery(value);
//     onSearch(value);
//   };

//   // Handle filter selection
//   const handleFilterClick = (difficulty: string | null) => {
//     const newFilter = activeFilter === difficulty ? null : difficulty;
//     setActiveFilter(newFilter);
//     onFilter(newFilter);
//   };

//   return (
//     <div className="space-y-4">
//       {/* Sheet title and description */}
//       <div>
//         <h1 className="text-2xl font-bold">{title}</h1>
//         <p className="text-muted-foreground">{description}</p>
//       </div>

//       {/* Progress card */}
//       <Card>
//         <CardContent className="p-4">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             {/* Progress stats */}
//             <div className="flex items-center space-x-4">
//               <div className="relative w-16 h-16">
//                 {/* Circular progress indicator */}
//                 <svg className="w-full h-full" viewBox="0 0 100 100">
//                   {/* Background circle */}
//                   <circle
//                     className="text-muted-foreground/20 stroke-current"
//                     strokeWidth="10"
//                     cx="50"
//                     cy="50"
//                     r="40"
//                     fill="transparent"
//                   />
//                   {/* Progress circle */}
//                   <circle
//                     className="text-primary stroke-current"
//                     strokeWidth="10"
//                     strokeLinecap="round"
//                     cx="50"
//                     cy="50"
//                     r="40"
//                     fill="transparent"
//                     strokeDasharray={251.2}
//                     strokeDashoffset={251.2 - (251.2 * completionPercentage(totalProblems)) / 100}
//                     transform="rotate(-90 50 50)"
//                   />
//                 </svg>
//                 {/* Percentage text */}
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="text-sm font-medium">
//                     {completionPercentage(totalProblems)}%
//                   </span>
//                 </div>
//               </div>

//               <div>
//                 <p className="text-sm font-medium">
//                   {completedProblems.length} / {totalProblems} completed
//                 </p>
//                 <p className="text-xs text-muted-foreground">
//                   {totalProblems - completedProblems.length} remaining
//                 </p>
//               </div>
//             </div>

//             {/* Difficulty filters */}
//             <div className="flex items-center space-x-2">
//               <Badge
//                 variant={activeFilter === 'Easy' ? 'default' : 'outline'}
//                 className="cursor-pointer"
//                 onClick={() => handleFilterClick('Easy')}
//               >
//                 Easy
//               </Badge>
//               <Badge
//                 variant={activeFilter === 'Medium' ? 'default' : 'outline'}
//                 className="cursor-pointer"
//                 onClick={() => handleFilterClick('Medium')}
//               >
//                 Medium
//               </Badge>
//               <Badge
//                 variant={activeFilter === 'Hard' ? 'default' : 'outline'}
//                 className="cursor-pointer"
//                 onClick={() => handleFilterClick('Hard')}
//               >
//                 Hard
//               </Badge>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Search and controls */}
//       <div className="flex flex-col md:flex-row gap-2">
//         <div className="relative flex-grow">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search problems..."
//             className="pl-8"
//             value={searchQuery}
//             onChange={handleSearchChange}
//           />
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={() => onFilter(null)}>
//             <Filter className="h-4 w-4 mr-2" />
//             Clear
//           </Button>
//           <Button onClick={onRandom}>
//             <Shuffle className="h-4 w-4 mr-2" />
//             Random
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Shuffle } from 'lucide-react';

interface SheetHeaderProps {
  title: string;
  description: string;
  totalProblems: number;
  onSearch: (query: string) => void;
  onFilter: (difficulty: string | null) => void;
  onRandom: () => void;
}

export default function SheetHeader({
  title,
  description,
  totalProblems,
  onSearch,
  onFilter,
  onRandom
}: SheetHeaderProps) {
  const { completedProblems, completionPercentage } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterClick = (difficulty: string | null) => {
    const newFilter = activeFilter === difficulty ? null : difficulty;
    setActiveFilter(newFilter);
    onFilter(newFilter);
  };

  return (
    <div className="space-y-6">
      {/* Sheet title and description */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-zinc-400">{description}</p>
      </div>

      {/* Progress card */}
      <Card className="bg-zinc-800/70 border-zinc-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Progress stats */}
            <div className="flex items-center space-x-6">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    className="stroke-zinc-700"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  />
                  {/* Progress circle */}
                  <circle
                    className="stroke-orange-500 transition-all duration-500"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * completionPercentage(totalProblems)) / 100}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-orange-400">
                    {completionPercentage(totalProblems)}%
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-white">
                  {completedProblems.length} / {totalProblems} completed
                </p>
                <p className="text-xs text-zinc-400">
                  {totalProblems - completedProblems.length} remaining
                </p>
              </div>
            </div>

            {/* Difficulty filters */}
            <div className="flex items-center space-x-2">
              <Badge
                variant={activeFilter === 'Easy' ? 'default' : 'outline'}
                className={`
                  cursor-pointer px-3 py-1 text-sm
                  ${activeFilter === 'Easy'
                    ? 'bg-green-900/50 text-green-400 border-green-700/50 hover:bg-green-900/70'
                    : 'bg-zinc-700/50 text-zinc-300 border-zinc-600 hover:bg-zinc-700/70'
                  }
                `}
                onClick={() => handleFilterClick('Easy')}
              >
                Easy
              </Badge>
              <Badge
                variant={activeFilter === 'Medium' ? 'default' : 'outline'}
                className={`
                  cursor-pointer px-3 py-1 text-sm
                  ${activeFilter === 'Medium'
                    ? 'bg-yellow-900/50 text-yellow-400 border-yellow-700/50 hover:bg-yellow-900/70'
                    : 'bg-zinc-700/50 text-zinc-300 border-zinc-600 hover:bg-zinc-700/70'
                  }
                `}
                onClick={() => handleFilterClick('Medium')}
              >
                Medium
              </Badge>
              <Badge
                variant={activeFilter === 'Hard' ? 'default' : 'outline'}
                className={`
                  cursor-pointer px-3 py-1 text-sm
                  ${activeFilter === 'Hard'
                    ? 'bg-red-900/50 text-red-400 border-red-700/50 hover:bg-red-900/70'
                    : 'bg-zinc-700/50 text-zinc-300 border-zinc-600 hover:bg-zinc-700/70'
                  }
                `}
                onClick={() => handleFilterClick('Hard')}
              >
                Hard
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search problems..."
            className="pl-9 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-orange-500/50"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onFilter(null)}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/70 hover:text-white"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button
            onClick={onRandom}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Random
          </Button>
        </div>
      </div>
    </div>
  );
}