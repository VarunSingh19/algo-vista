'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Edit, Trash2, Plus, FileCode, ExternalLink } from 'lucide-react';

interface Example {
    input: string;
    output: string;
    explanation: string;
}

interface CodingProblem {
    _id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string[];
    constraints: string;
    examples: Example[];
    solutionApproach: string;
    timeComplexity: string;
    spaceComplexity: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
}

export default function ProblemList() {
    const router = useRouter();
    const [problems, setProblems] = useState<CodingProblem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [problemForm, setProblemForm] = useState({
        title: '',
        description: '',
        difficulty: 'Medium',
        tags: '',
        constraints: '',
        examples: [{ input: '', output: '', explanation: '' }],
        solutionApproach: '',
        timeComplexity: '',
        spaceComplexity: '',
    });

    // Fetch problems
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.getAllProblems();
                console.log('API response:', response);

                // Handle different response structures
                if (response.data?.data) {
                    // If data is nested inside data property
                    setProblems(response.data.data);
                } else if (Array.isArray(response.data)) {
                    // If data is directly an array
                    setProblems(response.data);
                } else {
                    // If data has another structure
                    setProblems([]);
                    console.error('Unexpected API response structure:', response.data);
                }

                setError(null);
            } catch (err: any) {
                console.error('Error fetching problems:', err);
                setError(err.response?.data?.error || 'Failed to fetch coding problems');
                setProblems([]); // Ensure problems is always an array
            } finally {
                setIsLoading(false);
            }
        };

        fetchProblems();
    }, []);

    // Filter problems based on search query
    const filteredProblems = Array.isArray(problems) ? problems.filter(problem =>
        problem?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem?.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : [];

    // Handle form changes
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProblemForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle select change
    const handleSelectChange = (value: string) => {
        setProblemForm(prev => ({ ...prev, difficulty: value }));
    };

    // Handle example change
    const handleExampleChange = (index: number, field: keyof Example, value: string) => {
        setProblemForm(prev => {
            const updatedExamples = [...prev.examples];
            updatedExamples[index] = { ...updatedExamples[index], [field]: value };
            return { ...prev, examples: updatedExamples };
        });
    };

    // Add new example
    const addExample = () => {
        setProblemForm(prev => ({
            ...prev,
            examples: [...prev.examples, { input: '', output: '', explanation: '' }],
        }));
    };

    // Remove example
    const removeExample = (index: number) => {
        if (problemForm.examples.length <= 1) return;

        setProblemForm(prev => {
            const updatedExamples = [...prev.examples];
            updatedExamples.splice(index, 1);
            return { ...prev, examples: updatedExamples };
        });
    };

    // Handle create problem
    const handleCreateProblem = async () => {
        try {
            setIsLoading(true);

            // Ensure description has minimum length for validation
            if (problemForm.description.length < 50) {
                setError('Description must be at least 50 characters');
                setIsLoading(false);
                return;
            }

            // Validate that at least one example is provided with input and output
            if (problemForm.examples.length === 0 ||
                !problemForm.examples[0].input ||
                !problemForm.examples[0].output) {
                setError('At least one example with input and output is required');
                setIsLoading(false);
                return;
            }

            const problemData = {
                ...problemForm,
                tags: problemForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            };

            // Use fetch directly for more control
            console.log('Submitting problem data:', problemData);

            const response = await fetch('/api/problems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(problemData),
                credentials: 'include'
            });

            const responseData = await response.json();
            console.log('Problem creation response:', responseData);

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to create problem');
            }

            // Add the new problem to the list
            setProblems(prev => Array.isArray(prev) ? [...prev, responseData] : [responseData]);
            setIsCreateDialogOpen(false);
            resetForm();
            setError(null);

            // Refresh problems list
            const refreshResponse = await fetch('/api/problems');
            const refreshData = await refreshResponse.json();

            if (refreshData.data) {
                setProblems(refreshData.data);
            } else {
                setProblems(refreshData);
            }

        } catch (err: any) {
            console.error('Error creating problem:', err);
            setError(err.message ||
                'Failed to create problem. Make sure description is at least 50 characters and at least one example is provided.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle edit problem
    const handleEditProblem = async () => {
        if (!selectedProblem) return;

        try {
            setIsLoading(true);
            const problemData = {
                ...problemForm,
                tags: problemForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            };

            const { data } = await apiClient.updateProblem(selectedProblem._id, problemData);
            setProblems(prev => prev.map(problem => problem._id === selectedProblem._id ? data : problem));
            setIsEditDialogOpen(false);
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update problem');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle delete problem
    const handleDeleteProblem = async () => {
        if (!selectedProblem) return;

        try {
            setIsLoading(true);
            await apiClient.deleteProblem(selectedProblem._id);
            setProblems(prev => prev.filter(problem => problem._id !== selectedProblem._id));
            setIsDeleteDialogOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete problem');
        } finally {
            setIsLoading(false);
        }
    };

    // Open edit dialog and populate form
    const openEditDialog = (problem: CodingProblem) => {
        setSelectedProblem(problem);
        setProblemForm({
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            tags: problem.tags.join(', '),
            constraints: problem.constraints,
            examples: problem.examples.length > 0 ? problem.examples : [{ input: '', output: '', explanation: '' }],
            solutionApproach: problem.solutionApproach,
            timeComplexity: problem.timeComplexity,
            spaceComplexity: problem.spaceComplexity,
        });
        setIsEditDialogOpen(true);
    };

    // Open delete dialog
    const openDeleteDialog = (problem: CodingProblem) => {
        setSelectedProblem(problem);
        setIsDeleteDialogOpen(true);
    };

    // Reset form
    const resetForm = () => {
        setProblemForm({
            title: '',
            description: '',
            difficulty: 'Medium',
            tags: '',
            constraints: '',
            examples: [{ input: '', output: '', explanation: '' }],
            solutionApproach: '',
            timeComplexity: '',
            spaceComplexity: '',
        });
        setSelectedProblem(null);
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Get difficulty badge style
    const getDifficultyBadge = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Hard':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    if (isLoading && problems.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Manage Coding Problems</h2>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Create Problem
                </Button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-300 text-red-800 rounded-md p-4 mb-4">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <p>{error}</p>
                    </div>
                </div>
            )}

            <div className="mb-4">
                <Input
                    placeholder="Search problems by title, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredProblems.length === 0 ? (
                    <div className="text-center p-8 border rounded-md bg-muted/20">
                        <p className="text-muted-foreground">No coding problems found</p>
                    </div>
                ) : (
                    filteredProblems.map((problem) => (
                        <Card key={problem._id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-lg">{problem.title}</h3>
                                            <Badge variant="outline" className={getDifficultyBadge(problem.difficulty)}>
                                                {problem.difficulty}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                            {problem.description.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {problem.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-2">
                                            Created: {formatDate(problem.createdAt)}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => router.push(`/problems/${problem._id}`)}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => openEditDialog(problem)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => openDeleteDialog(problem)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Create Problem Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Coding Problem</DialogTitle>
                        <DialogDescription>
                            Create a new coding problem for users to solve.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={problemForm.title}
                                onChange={handleFormChange}
                                placeholder="Enter problem title..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="difficulty">Difficulty</Label>
                                <Select value={problemForm.difficulty} onValueChange={handleSelectChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tags">Tags (comma separated)</Label>
                                <Input
                                    id="tags"
                                    name="tags"
                                    value={problemForm.tags}
                                    onChange={handleFormChange}
                                    placeholder="e.g. Array, String, Dynamic Programming"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Markdown supported)</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={problemForm.description}
                                onChange={handleFormChange}
                                placeholder="Write the problem description..."
                                rows={6}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="constraints">Constraints</Label>
                            <Textarea
                                id="constraints"
                                name="constraints"
                                value={problemForm.constraints}
                                onChange={handleFormChange}
                                placeholder="List the problem constraints..."
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label>Examples</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addExample}
                                >
                                    <Plus size={16} className="mr-1" /> Add Example
                                </Button>
                            </div>

                            {problemForm.examples.map((example, index) => (
                                <div key={index} className="border rounded-md p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Example {index + 1}</h4>
                                        {problemForm.examples.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeExample(index)}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor={`input-${index}`}>Input</Label>
                                        <Textarea
                                            id={`input-${index}`}
                                            value={example.input}
                                            onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                                            placeholder="Enter example input..."
                                            rows={2}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor={`output-${index}`}>Output</Label>
                                        <Textarea
                                            id={`output-${index}`}
                                            value={example.output}
                                            onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                                            placeholder="Enter example output..."
                                            rows={2}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor={`explanation-${index}`}>Explanation</Label>
                                        <Textarea
                                            id={`explanation-${index}`}
                                            value={example.explanation}
                                            onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)}
                                            placeholder="Enter explanation for this example..."
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="solutionApproach">Solution Approach</Label>
                            <Textarea
                                id="solutionApproach"
                                name="solutionApproach"
                                value={problemForm.solutionApproach}
                                onChange={handleFormChange}
                                placeholder="Explain the approach to solve this problem..."
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="timeComplexity">Time Complexity</Label>
                                <Input
                                    id="timeComplexity"
                                    name="timeComplexity"
                                    value={problemForm.timeComplexity}
                                    onChange={handleFormChange}
                                    placeholder="e.g. O(n), O(n log n)"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="spaceComplexity">Space Complexity</Label>
                                <Input
                                    id="spaceComplexity"
                                    name="spaceComplexity"
                                    value={problemForm.spaceComplexity}
                                    onChange={handleFormChange}
                                    placeholder="e.g. O(1), O(n)"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCreateDialogOpen(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" onClick={handleCreateProblem} disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Problem"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Problem Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Coding Problem</DialogTitle>
                        <DialogDescription>
                            Make changes to the coding problem.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                name="title"
                                value={problemForm.title}
                                onChange={handleFormChange}
                                placeholder="Enter problem title..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-difficulty">Difficulty</Label>
                                <Select value={problemForm.difficulty} onValueChange={handleSelectChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                                <Input
                                    id="edit-tags"
                                    name="tags"
                                    value={problemForm.tags}
                                    onChange={handleFormChange}
                                    placeholder="e.g. Array, String, Dynamic Programming"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description (Markdown supported)</Label>
                            <Textarea
                                id="edit-description"
                                name="description"
                                value={problemForm.description}
                                onChange={handleFormChange}
                                placeholder="Write the problem description..."
                                rows={6}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-constraints">Constraints</Label>
                            <Textarea
                                id="edit-constraints"
                                name="constraints"
                                value={problemForm.constraints}
                                onChange={handleFormChange}
                                placeholder="List the problem constraints..."
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label>Examples</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addExample}
                                >
                                    <Plus size={16} className="mr-1" /> Add Example
                                </Button>
                            </div>

                            {problemForm.examples.map((example, index) => (
                                <div key={index} className="border rounded-md p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Example {index + 1}</h4>
                                        {problemForm.examples.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeExample(index)}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor={`edit-input-${index}`}>Input</Label>
                                        <Textarea
                                            id={`edit-input-${index}`}
                                            value={example.input}
                                            onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                                            placeholder="Enter example input..."
                                            rows={2}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor={`edit-output-${index}`}>Output</Label>
                                        <Textarea
                                            id={`edit-output-${index}`}
                                            value={example.output}
                                            onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                                            placeholder="Enter example output..."
                                            rows={2}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor={`edit-explanation-${index}`}>Explanation</Label>
                                        <Textarea
                                            id={`edit-explanation-${index}`}
                                            value={example.explanation}
                                            onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)}
                                            placeholder="Enter explanation for this example..."
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-solutionApproach">Solution Approach</Label>
                            <Textarea
                                id="edit-solutionApproach"
                                name="solutionApproach"
                                value={problemForm.solutionApproach}
                                onChange={handleFormChange}
                                placeholder="Explain the approach to solve this problem..."
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-timeComplexity">Time Complexity</Label>
                                <Input
                                    id="edit-timeComplexity"
                                    name="timeComplexity"
                                    value={problemForm.timeComplexity}
                                    onChange={handleFormChange}
                                    placeholder="e.g. O(n), O(n log n)"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-spaceComplexity">Space Complexity</Label>
                                <Input
                                    id="edit-spaceComplexity"
                                    name="spaceComplexity"
                                    value={problemForm.spaceComplexity}
                                    onChange={handleFormChange}
                                    placeholder="e.g. O(1), O(n)"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditDialogOpen(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" onClick={handleEditProblem} disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Problem Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this coding problem? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteProblem}
                            disabled={isLoading}
                        >
                            {isLoading ? "Deleting..." : "Delete Problem"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
