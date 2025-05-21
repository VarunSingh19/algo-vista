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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  // Handle filter selection
  const handleFilterClick = (difficulty: string | null) => {
    const newFilter = activeFilter === difficulty ? null : difficulty;
    setActiveFilter(newFilter);
    onFilter(newFilter);
  };

  return (
    <div className="space-y-4">
      {/* Sheet title and description */}
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Progress card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Progress stats */}
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16">
                {/* Circular progress indicator */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    className="text-muted-foreground/20 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  />
                  {/* Progress circle */}
                  <circle
                    className="text-primary stroke-current"
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
                  <span className="text-sm font-medium">
                    {completionPercentage(totalProblems)}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">
                  {completedProblems.length} / {totalProblems} completed
                </p>
                <p className="text-xs text-muted-foreground">
                  {totalProblems - completedProblems.length} remaining
                </p>
              </div>
            </div>

            {/* Difficulty filters */}
            <div className="flex items-center space-x-2">
              <Badge
                variant={activeFilter === 'Easy' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleFilterClick('Easy')}
              >
                Easy
              </Badge>
              <Badge
                variant={activeFilter === 'Medium' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleFilterClick('Medium')}
              >
                Medium
              </Badge>
              <Badge
                variant={activeFilter === 'Hard' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleFilterClick('Hard')}
              >
                Hard
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and controls */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onFilter(null)}>
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button onClick={onRandom}>
            <Shuffle className="h-4 w-4 mr-2" />
            Random
          </Button>
        </div>
      </div>
    </div>
  );
}
