'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/lib/api';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { Accordion } from '@/components/ui/accordion';
import SheetHeader from '@/components/sheets/SheetHeader';
import SectionCard from '@/components/sheets/SectionCard';
import { AlertCircle } from 'lucide-react';

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

interface Sheet {
  _id: string;
  title: string;
  description: string;
  totalProblems: number;
  sections: Section[];
}

export default function SheetPage() {
  const { id } = useParams<{ id: string }>();
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const problemRefs = useRef<Record<string, HTMLElement | null>>({});

  // Fetch sheet data
  useEffect(() => {
    const fetchSheet = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.getSheet(id as string);
        setSheet(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch sheet');
      } finally {
        setLoading(false);
      }
    };

    fetchSheet();
  }, [id]);

  // Handler for toggling problem completion
  const handleProblemToggle = (problemId: string) => {
    // This is handled by the ProgressContext
    console.log('Problem toggled:', problemId);
  };

  // Handler for search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handler for difficulty filter
  const handleFilter = (difficulty: string | null) => {
    setDifficultyFilter(difficulty);
  };

  // Handler for random problem selection
  const handleRandomProblem = () => {
    if (!sheet) return;

    // Collect all problems that match the current filters
    const allProblems: Problem[] = [];

    sheet.sections.forEach(section => {
      section.topics.forEach(topic => {
        topic.problems.forEach(problem => {
          // Check if problem matches filters
          const matchesSearch = !searchQuery ||
            problem.title.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesDifficulty = !difficultyFilter ||
            problem.difficulty === difficultyFilter;

          if (matchesSearch && matchesDifficulty) {
            allProblems.push(problem);
          }
        });
      });
    });

    if (allProblems.length === 0) return;

    // Select a random problem
    const randomIndex = Math.floor(Math.random() * allProblems.length);
    const randomProblem = allProblems[randomIndex];

    // Scroll to the problem
    const problemElement = document.getElementById(`problem-${randomProblem.id}`);
    if (problemElement) {
      // Make sure accordion sections are open
      problemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Highlight the problem briefly
      problemElement.classList.add('bg-primary/20');
      setTimeout(() => {
        problemElement.classList.remove('bg-primary/20');
      }, 1500);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 space-y-8">
        <div className="h-20 rounded-lg bg-card animate-pulse"></div>
        <div className="h-16 rounded-lg bg-card animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-lg bg-card animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error || !sheet) {
    return (
      <div className="max-w-5xl mx-auto p-4 flex justify-center items-center min-h-[60vh]">
        <div className="flex items-center text-destructive">
          <AlertCircle className="mr-2" />
          {error || 'Sheet not found'}
        </div>
      </div>
    );
  }

  return (
    <ProgressProvider sheetId={sheet._id}>
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Sheet header with search and filters */}
        <SheetHeader
          title={sheet.title}
          description={sheet.description}
          totalProblems={sheet.totalProblems}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onRandom={handleRandomProblem}
        />

        {/* Sections accordion */}
        <Accordion type="multiple" defaultValue={sheet.sections.map(s => s.id)}>
          {sheet.sections.map(section => (
            <SectionCard
              key={section.id}
              section={section}
              searchQuery={searchQuery}
              difficultyFilter={difficultyFilter}
              sheetId={sheet._id}
              onProblemToggle={handleProblemToggle}
              isFiltered={!!searchQuery || !!difficultyFilter}
            />
          ))}
        </Accordion>
      </div>
    </ProgressProvider>
  );
}
