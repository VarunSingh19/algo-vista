// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';
// import apiClient from '@/lib/api';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//     ArrowLeft,
//     Play,
//     CheckCircle,
//     XCircle,
//     Clock,
//     Code,
//     Tag,
//     AlertTriangle,
//     Info
// } from 'lucide-react';
// import Link from 'next/link';

// interface CodingProblem {
//     _id: string;
//     title: string;
//     description: string;
//     difficulty: 'Easy' | 'Medium' | 'Hard';
//     tags: string[];
//     constraints: string;
//     examples: {
//         input: string;
//         output: string;
//         explanation?: string;
//     }[];
//     createdAt: string;
// }

// interface Submission {
//     _id: string;
//     problemId: string;
//     code: string;
//     language: string;
//     status: string;
//     output?: string;
//     error?: string;
//     executionTime?: number;
//     createdAt: string;
// }

// const PROGRAMMING_LANGUAGES = [
//     { value: 'javascript', label: 'JavaScript' },
//     { value: 'python', label: 'Python' },
//     { value: 'java', label: 'Java' },
//     { value: 'cpp', label: 'C++' },
//     { value: 'c', label: 'C' },
// ];

// export default function ProblemPage() {
//     const params = useParams();
//     const router = useRouter();
//     const { user } = useAuth();

//     // Add debugging to see what params we're getting
//     console.log('Params:', params);
//     console.log('Problem ID:', params?.id);

//     const problemId = params?.id as string;

//     const [problem, setProblem] = useState<CodingProblem | null>(null);
//     const [submissions, setSubmissions] = useState<Submission[]>([]);
//     const [code, setCode] = useState('');
//     const [language, setLanguage] = useState('javascript');
//     const [loading, setLoading] = useState(true);
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [activeTab, setActiveTab] = useState('problem');

//     // Test API connection
//     useEffect(() => {
//         const testAPI = async () => {
//             try {
//                 console.log('Testing API connection...');
//                 // Try to fetch all problems first to test API
//                 const response = await apiClient.getAllProblems();
//                 console.log('All problems response:', response);
//             } catch (err) {
//                 console.error('API test failed:', err);
//             }
//         };
//         testAPI();
//     }, []);

//     // Fetch problem details
//     useEffect(() => {
//         const fetchProblem = async () => {
//             if (!problemId) {
//                 console.log('No problem ID found');
//                 setError('No problem ID provided');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 setLoading(true);
//                 setError(null);
//                 console.log('Fetching problem with ID:', problemId);
//                 console.log('API Client:', apiClient);

//                 // Try different possible API response structures
//                 const response = await apiClient.getProblem(problemId);
//                 console.log('Full API response:', response);
//                 console.log('Response data:', response.data);

//                 // Handle different possible response structures
//                 let problemData = null;
//                 if (response.data?.data) {
//                     problemData = response.data.data;
//                 } else if (response.data) {
//                     problemData = response.data;
//                 } else if (response) {
//                     problemData = response;
//                 }

//                 console.log('Processed problem data:', problemData);

//                 if (problemData) {
//                     setProblem(problemData);
//                 } else {
//                     setError('Problem data not found in response');
//                 }
//             } catch (err: any) {
//                 console.error('Error fetching problem:', err);
//                 console.error('Error response:', err.response);
//                 console.error('Error message:', err.message);

//                 // More detailed error handling
//                 if (err.response?.status === 404) {
//                     setError('Problem not found');
//                 } else if (err.response?.status === 401) {
//                     setError('Authentication required');
//                 } else {
//                     setError(err.response?.data?.error || err.message || 'Failed to fetch problem');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProblem();
//     }, [problemId]);

//     // Fetch user submissions for this problem
//     useEffect(() => {
//         if (!user || !problemId) return;

//         const fetchSubmissions = async () => {
//             try {
//                 const { data } = await apiClient.getProblemSubmissions(problemId);
//                 setSubmissions(data.data || []);
//             } catch (error) {
//                 console.error('Error fetching submissions:', error);
//             }
//         };

//         fetchSubmissions();
//     }, [user, problemId]);

//     // Handle code submission
//     const handleSubmit = async () => {
//         if (!user) {
//             router.push('/login');
//             return;
//         }

//         if (!code.trim()) {
//             setError('Please enter your code');
//             return;
//         }

//         try {
//             setSubmitting(true);
//             setError(null);

//             const { data } = await apiClient.submitCode({
//                 problemId,
//                 code,
//                 language
//             });

//             // Refresh submissions after successful submission
//             const submissionsResponse = await apiClient.getProblemSubmissions(problemId);
//             setSubmissions(submissionsResponse.data.data || []);

//             // Switch to submissions tab to show result
//             setActiveTab('submissions');
//         } catch (err: any) {
//             setError(err.response?.data?.error || 'Failed to submit code');
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Get difficulty color
//     const getDifficultyColor = (difficulty: string) => {
//         switch (difficulty) {
//             case 'Easy':
//                 return 'text-green-500 bg-green-50 dark:bg-green-950';
//             case 'Medium':
//                 return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950';
//             case 'Hard':
//                 return 'text-red-500 bg-red-50 dark:bg-red-950';
//             default:
//                 return '';
//         }
//     };

//     // Get status color and icon
//     const getStatusDisplay = (status: string) => {
//         switch (status) {
//             case 'Accepted':
//                 return {
//                     color: 'text-green-500',
//                     icon: <CheckCircle size={16} />,
//                     bgColor: 'bg-green-50 dark:bg-green-950'
//                 };
//             case 'Wrong Answer':
//                 return {
//                     color: 'text-red-500',
//                     icon: <XCircle size={16} />,
//                     bgColor: 'bg-red-50 dark:bg-red-950'
//                 };
//             case 'Time Limit Exceeded':
//                 return {
//                     color: 'text-yellow-500',
//                     icon: <Clock size={16} />,
//                     bgColor: 'bg-yellow-50 dark:bg-yellow-950'
//                 };
//             case 'Runtime Error':
//                 return {
//                     color: 'text-red-500',
//                     icon: <AlertTriangle size={16} />,
//                     bgColor: 'bg-red-50 dark:bg-red-950'
//                 };
//             default:
//                 return {
//                     color: 'text-gray-500',
//                     icon: <Info size={16} />,
//                     bgColor: 'bg-gray-50 dark:bg-gray-950'
//                 };
//         }
//     };

//     // Format date
//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     // Get default code template based on language
//     const getCodeTemplate = (lang: string) => {
//         switch (lang) {
//             case 'javascript':
//                 return `function solution() {
//     // Write your solution here

// }`;
//             case 'python':
//                 return `def solution():
//     # Write your solution here
//     pass`;
//             case 'java':
//                 return `public class Solution {
//     public static void main(String[] args) {
//         // Write your solution here

//     }
// }`;
//             case 'cpp':
//                 return `#include <iostream>
// using namespace std;

// int main() {
//     // Write your solution here

//     return 0;
// }`;
//             case 'c':
//                 return `#include <stdio.h>

// int main() {
//     // Write your solution here

//     return 0;
// }`;
//             default:
//                 return '';
//         }
//     };

//     // Update code template when language changes
//     useEffect(() => {
//         if (!code) {
//             setCode(getCodeTemplate(language));
//         }
//     }, [language, code]);

//     // Add debugging information
//     console.log('Current state:', { loading, error, problem, problemId });

//     // Loading state
//     if (loading) {
//         return (
//             <div className="container max-w-6xl mx-auto p-4 py-8">
//                 <div className="flex justify-center items-center min-h-[400px]">
//                     <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//                 </div>
//             </div>
//         );
//     }

//     // Error state
//     if (error) {
//         return (
//             <div className="container max-w-6xl mx-auto p-4 py-8">
//                 <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
//                     <p><strong>Error:</strong> {error}</p>
//                     <p><strong>Problem ID:</strong> {problemId}</p>
//                     <p><strong>User:</strong> {user ? 'Logged in' : 'Not logged in'}</p>
//                 </div>
//                 <div className="mt-4">
//                     <Link href="/problems">
//                         <Button variant="outline">
//                             <ArrowLeft size={16} className="mr-2" />
//                             Back to Problems
//                         </Button>
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     // No problem found
//     if (!problem) {
//         return (
//             <div className="container max-w-6xl mx-auto p-4 py-8">
//                 <div className="text-center py-8">
//                     <p className="text-muted-foreground mb-4">Problem not found</p>
//                     <Link href="/problems">
//                         <Button variant="outline">
//                             <ArrowLeft size={16} className="mr-2" />
//                             Back to Problems
//                         </Button>
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container max-w-7xl mx-auto p-4 py-8">
//             {/* Header */}
//             <div className="mb-6">
//                 <Link href="/problems">
//                     <Button variant="outline" className="mb-4">
//                         <ArrowLeft size={16} className="mr-2" />
//                         Back to Problems
//                     </Button>
//                 </Link>

//                 <div className="flex items-center gap-4 mb-4">
//                     <h1 className="text-3xl font-bold">{problem.title}</h1>
//                     <Badge variant="outline" className={`${getDifficultyColor(problem.difficulty)}`}>
//                         {problem.difficulty}
//                     </Badge>
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                     {problem.tags.map(tag => (
//                         <Badge key={tag} variant="outline" className="text-xs">
//                             <Tag size={12} className="mr-1" />
//                             {tag}
//                         </Badge>
//                     ))}
//                 </div>
//             </div>

//             {/* Main content */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Left column - Problem details */}
//                 <div>
//                     <Tabs value={activeTab} onValueChange={setActiveTab}>
//                         <TabsList className="grid w-full grid-cols-2">
//                             <TabsTrigger value="problem">Problem</TabsTrigger>
//                             <TabsTrigger value="submissions">
//                                 Submissions ({submissions.length})
//                             </TabsTrigger>
//                         </TabsList>

//                         <TabsContent value="problem" className="space-y-6">
//                             {/* Problem Description */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Description</CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="prose dark:prose-invert max-w-none">
//                                         <p className="whitespace-pre-wrap">{problem.description}</p>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             {/* Examples */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Examples</CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="space-y-4">
//                                     {problem.examples.map((example, index) => (
//                                         <div key={index} className="border rounded-lg p-4">
//                                             <h4 className="font-medium mb-2">Example {index + 1}:</h4>
//                                             <div className="space-y-2">
//                                                 <div>
//                                                     <span className="font-medium">Input: </span>
//                                                     <code className="bg-muted px-2 py-1 rounded text-sm">
//                                                         {example.input}
//                                                     </code>
//                                                 </div>
//                                                 <div>
//                                                     <span className="font-medium">Output: </span>
//                                                     <code className="bg-muted px-2 py-1 rounded text-sm">
//                                                         {example.output}
//                                                     </code>
//                                                 </div>
//                                                 {example.explanation && (
//                                                     <div>
//                                                         <span className="font-medium">Explanation: </span>
//                                                         <span className="text-sm">{example.explanation}</span>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </CardContent>
//                             </Card>

//                             {/* Constraints */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Constraints</CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="text-sm whitespace-pre-wrap">{problem.constraints}</div>
//                                 </CardContent>
//                             </Card>
//                         </TabsContent>

//                         <TabsContent value="submissions" className="space-y-4">
//                             {submissions.length === 0 ? (
//                                 <div className="text-center py-8 text-muted-foreground">
//                                     No submissions yet. Submit your solution to see results here.
//                                 </div>
//                             ) : (
//                                 <div className="space-y-3">
//                                     {submissions.map((submission) => {
//                                         const statusDisplay = getStatusDisplay(submission.status);
//                                         return (
//                                             <Card key={submission._id}>
//                                                 <CardContent className="p-4">
//                                                     <div className="flex items-center justify-between mb-2">
//                                                         <div className="flex items-center gap-2">
//                                                             <Badge variant="outline" className={`${statusDisplay.color} ${statusDisplay.bgColor}`}>
//                                                                 {statusDisplay.icon}
//                                                                 <span className="ml-1">{submission.status}</span>
//                                                             </Badge>
//                                                             <Badge variant="outline">
//                                                                 {PROGRAMMING_LANGUAGES.find(l => l.value === submission.language)?.label}
//                                                             </Badge>
//                                                         </div>
//                                                         <span className="text-sm text-muted-foreground">
//                                                             {formatDate(submission.createdAt)}
//                                                         </span>
//                                                     </div>

//                                                     {submission.executionTime && (
//                                                         <div className="text-sm text-muted-foreground mb-2">
//                                                             Execution time: {submission.executionTime}ms
//                                                         </div>
//                                                     )}

//                                                     {submission.output && (
//                                                         <div className="mt-2">
//                                                             <div className="text-sm font-medium mb-1">Output:</div>
//                                                             <pre className="bg-muted p-2 rounded text-sm overflow-auto">
//                                                                 {submission.output}
//                                                             </pre>
//                                                         </div>
//                                                     )}

//                                                     {submission.error && (
//                                                         <div className="mt-2">
//                                                             <div className="text-sm font-medium mb-1 text-red-500">Error:</div>
//                                                             <pre className="bg-red-50 dark:bg-red-950 p-2 rounded text-sm text-red-500 overflow-auto">
//                                                                 {submission.error}
//                                                             </pre>
//                                                         </div>
//                                                     )}
//                                                 </CardContent>
//                                             </Card>
//                                         );
//                                     })}
//                                 </div>
//                             )}
//                         </TabsContent>
//                     </Tabs>
//                 </div>

//                 {/* Right column - Code editor */}
//                 <div>
//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="flex items-center gap-2">
//                                 <Code size={20} />
//                                 Solution
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                             {/* Language selector */}
//                             <div>
//                                 <label className="text-sm font-medium mb-2 block">Language</label>
//                                 <Select value={language} onValueChange={setLanguage}>
//                                     <SelectTrigger>
//                                         <SelectValue />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {PROGRAMMING_LANGUAGES.map(lang => (
//                                             <SelectItem key={lang.value} value={lang.value}>
//                                                 {lang.label}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             {/* Code editor */}
//                             <div>
//                                 <label className="text-sm font-medium mb-2 block">Your Solution</label>
//                                 <Textarea
//                                     value={code}
//                                     onChange={(e) => setCode(e.target.value)}
//                                     className="font-mono text-sm min-h-96 resize-none"
//                                     placeholder="Write your solution here..."
//                                 />
//                             </div>

//                             {/* Error message */}
//                             {error && (
//                                 <div className="bg-red-50 dark:bg-red-950 text-red-500 p-3 rounded-md text-sm">
//                                     {error}
//                                 </div>
//                             )}

//                             {/* Submit button */}
//                             <Button
//                                 onClick={handleSubmit}
//                                 disabled={submitting || !user}
//                                 className="w-full"
//                             >
//                                 {submitting ? (
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
//                                         Submitting...
//                                     </div>
//                                 ) : (
//                                     <div className="flex items-center gap-2">
//                                         <Play size={16} />
//                                         {user ? 'Submit Solution' : 'Login to Submit'}
//                                     </div>
//                                 )}
//                             </Button>

//                             {!user && (
//                                 <p className="text-sm text-muted-foreground text-center">
//                                     You need to{' '}
//                                     <Link href="/login" className="text-primary hover:underline">
//                                         login
//                                     </Link>
//                                     {' '}to submit solutions.
//                                 </p>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     );
// }




// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';
// import apiClient from '@/lib/api';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//     ArrowLeft,
//     Play,
//     CheckCircle,
//     XCircle,
//     Clock,
//     Code,
//     Tag,
//     AlertTriangle,
//     Info,
//     Archive
// } from 'lucide-react';
// import Link from 'next/link';

// interface CodingProblem {
//     _id: string;
//     title: string;
//     description: string;
//     difficulty: 'Easy' | 'Medium' | 'Hard';
//     tags: string[];
//     constraints: string;
//     examples: {
//         input: string;
//         output: string;
//         explanation?: string;
//     }[];
//     solutionApproach: string;
//     timeComplexity: string;
//     spaceComplexity: string;
//     createdAt: string;
// }

// interface Submission {
//     _id: string;
//     problemId: string;
//     code: string;
//     language: string;
//     status: string;
//     output?: string;
//     error?: string;
//     executionTime?: number;
//     createdAt: string;
// }

// const PROGRAMMING_LANGUAGES = [
//     { value: 'javascript', label: 'JavaScript' },
//     { value: 'python', label: 'Python' },
//     { value: 'java', label: 'Java' },
//     { value: 'cpp', label: 'C++' },
//     { value: 'c', label: 'C' },
// ];

// export default function ProblemPage() {
//     const params = useParams();
//     const router = useRouter();
//     const { user } = useAuth();

//     // Add debugging to see what params we're getting
//     console.log('Params:', params);
//     console.log('Problem ID:', params?.id);

//     const problemId = params?.id as string;

//     const [problem, setProblem] = useState<CodingProblem | null>(null);
//     const [submissions, setSubmissions] = useState<Submission[]>([]);
//     const [code, setCode] = useState('');
//     const [language, setLanguage] = useState('javascript');
//     const [loading, setLoading] = useState(true);
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [activeTab, setActiveTab] = useState('problem');

//     // Test API connection
//     useEffect(() => {
//         const testAPI = async () => {
//             try {
//                 console.log('Testing API connection...');
//                 // Try to fetch all problems first to test API
//                 const response = await apiClient.getAllProblems();
//                 console.log('All problems response:', response);
//             } catch (err) {
//                 console.error('API test failed:', err);
//             }
//         };
//         testAPI();
//     }, []);

//     // Fetch problem details
//     useEffect(() => {
//         const fetchProblem = async () => {
//             if (!problemId) {
//                 console.log('No problem ID found');
//                 setError('No problem ID provided');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 setLoading(true);
//                 setError(null);
//                 console.log('Fetching problem with ID:', problemId);
//                 console.log('API Client:', apiClient);

//                 // Try different possible API response structures
//                 const response = await apiClient.getProblem(problemId);
//                 console.log('Full API response:', response);
//                 console.log('Response data:', response.data);

//                 // Handle different possible response structures
//                 let problemData = null;
//                 if (response.data?.data) {
//                     problemData = response.data.data;
//                 } else if (response.data) {
//                     problemData = response.data;
//                 } else if (response) {
//                     problemData = response;
//                 }

//                 console.log('Processed problem data:', problemData);

//                 if (problemData) {
//                     setProblem(problemData);
//                 } else {
//                     setError('Problem data not found in response');
//                 }
//             } catch (err: any) {
//                 console.error('Error fetching problem:', err);
//                 console.error('Error response:', err.response);
//                 console.error('Error message:', err.message);

//                 // More detailed error handling
//                 if (err.response?.status === 404) {
//                     setError('Problem not found');
//                 } else if (err.response?.status === 401) {
//                     setError('Authentication required');
//                 } else {
//                     setError(err.response?.data?.error || err.message || 'Failed to fetch problem');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProblem();
//     }, [problemId]);

//     // Fetch user submissions for this problem
//     useEffect(() => {
//         if (!user || !problemId) return;

//         const fetchSubmissions = async () => {
//             try {
//                 const { data } = await apiClient.getProblemSubmissions(problemId);
//                 setSubmissions(data.data || []);
//             } catch (error) {
//                 console.error('Error fetching submissions:', error);
//             }
//         };

//         fetchSubmissions();
//     }, [user, problemId]);

//     // Handle code submission
//     const handleSubmit = async () => {
//         if (!user) {
//             router.push('/login');
//             return;
//         }

//         if (!code.trim()) {
//             setError('Please enter your code');
//             return;
//         }

//         try {
//             setSubmitting(true);
//             setError(null);

//             const { data } = await apiClient.submitCode({
//                 problemId,
//                 code,
//                 language
//             });

//             // Refresh submissions after successful submission
//             const submissionsResponse = await apiClient.getProblemSubmissions(problemId);
//             setSubmissions(submissionsResponse.data.data || []);

//             // Switch to submissions tab to show result
//             setActiveTab('submissions');
//         } catch (err: any) {
//             setError(err.response?.data?.error || 'Failed to submit code');
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Get difficulty color
//     const getDifficultyColor = (difficulty: string) => {
//         switch (difficulty) {
//             case 'Easy':
//                 return 'text-green-500 bg-green-50 dark:bg-green-950';
//             case 'Medium':
//                 return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950';
//             case 'Hard':
//                 return 'text-red-500 bg-red-50 dark:bg-red-950';
//             default:
//                 return '';
//         }
//     };

//     // Get status color and icon
//     const getStatusDisplay = (status: string) => {
//         switch (status) {
//             case 'Accepted':
//                 return {
//                     color: 'text-green-500',
//                     icon: <CheckCircle size={16} />,
//                     bgColor: 'bg-green-50 dark:bg-green-950'
//                 };
//             case 'Wrong Answer':
//                 return {
//                     color: 'text-red-500',
//                     icon: <XCircle size={16} />,
//                     bgColor: 'bg-red-50 dark:bg-red-950'
//                 };
//             case 'Time Limit Exceeded':
//                 return {
//                     color: 'text-yellow-500',
//                     icon: <Clock size={16} />,
//                     bgColor: 'bg-yellow-50 dark:bg-yellow-950'
//                 };
//             case 'Runtime Error':
//                 return {
//                     color: 'text-red-500',
//                     icon: <AlertTriangle size={16} />,
//                     bgColor: 'bg-red-50 dark:bg-red-950'
//                 };
//             default:
//                 return {
//                     color: 'text-gray-500',
//                     icon: <Info size={16} />,
//                     bgColor: 'bg-gray-50 dark:bg-gray-950'
//                 };
//         }
//     };

//     // Format date
//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     // Get default code template based on language
//     const getCodeTemplate = (lang: string) => {
//         switch (lang) {
//             case 'javascript':
//                 return `function solution() {
//     // Write your solution here

// }`;
//             case 'python':
//                 return `def solution():
//     # Write your solution here
//     pass`;
//             case 'java':
//                 return `public class Solution {
//     public static void main(String[] args) {
//         // Write your solution here

//     }
// }`;
//             case 'cpp':
//                 return `#include <iostream>
// using namespace std;

// int main() {
//     // Write your solution here

//     return 0;
// }`;
//             case 'c':
//                 return `#include <stdio.h>

// int main() {
//     // Write your solution here

//     return 0;
// }`;
//             default:
//                 return '';
//         }
//     };

//     // Update code template when language changes
//     useEffect(() => {
//         if (!code) {
//             setCode(getCodeTemplate(language));
//         }
//     }, [language, code]);

//     // Add debugging information
//     console.log('Current state:', { loading, error, problem, problemId });

//     // Loading state
//     if (loading) {
//         return (
//             <div className="container max-w-6xl mx-auto p-4 py-8">
//                 <div className="flex justify-center items-center min-h-[400px]">
//                     <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//                 </div>
//             </div>
//         );
//     }

//     // Error state
//     if (error) {
//         return (
//             <div className="container max-w-6xl mx-auto p-4 py-8">
//                 <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
//                     <p><strong>Error:</strong> {error}</p>
//                     <p><strong>Problem ID:</strong> {problemId}</p>
//                     <p><strong>User:</strong> {user ? 'Logged in' : 'Not logged in'}</p>
//                 </div>
//                 <div className="mt-4">
//                     <Link href="/problems">
//                         <Button variant="outline">
//                             <ArrowLeft size={16} className="mr-2" />
//                             Back to Problems
//                         </Button>
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     // No problem found
//     if (!problem) {
//         return (
//             <div className="container max-w-6xl mx-auto p-4 py-8">
//                 <div className="text-center py-8">
//                     <p className="text-muted-foreground mb-4">Problem not found</p>
//                     <Link href="/problems">
//                         <Button variant="outline">
//                             <ArrowLeft size={16} className="mr-2" />
//                             Back to Problems
//                         </Button>
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container max-w-7xl mx-auto p-4 py-8">
//             {/* Header */}
//             <div className="mb-6">
//                 <Link href="/problems">
//                     <Button variant="outline" className="mb-4">
//                         <ArrowLeft size={16} className="mr-2" />
//                         Back to Problems
//                     </Button>
//                 </Link>

//                 <div className="flex items-center gap-4 mb-4">
//                     <h1 className="text-3xl font-bold">{problem.title}</h1>
//                     <Badge variant="outline" className={`${getDifficultyColor(problem.difficulty)}`}>
//                         {problem.difficulty}
//                     </Badge>
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                     {problem.tags.map(tag => (
//                         <Badge key={tag} variant="outline" className="text-xs">
//                             <Tag size={12} className="mr-1" />
//                             {tag}
//                         </Badge>
//                     ))}
//                 </div>
//             </div>

//             {/* Main content */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Left column - Problem details */}
//                 <div>
//                     <Tabs value={activeTab} onValueChange={setActiveTab}>
//                         <TabsList className="grid w-full grid-cols-2">
//                             <TabsTrigger value="problem">Problem</TabsTrigger>
//                             <TabsTrigger value="submissions">
//                                 Submissions ({submissions.length})
//                             </TabsTrigger>
//                         </TabsList>

//                         <TabsContent value="problem" className="space-y-6">
//                             {/* Problem Description */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Description</CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="prose dark:prose-invert max-w-none">
//                                         <p className="whitespace-pre-wrap">{problem.description}</p>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             {/* Examples */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Examples</CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="space-y-4">
//                                     {problem.examples.map((example, index) => (
//                                         <div key={index} className="border rounded-lg p-4">
//                                             <h4 className="font-medium mb-2">Example {index + 1}:</h4>
//                                             <div className="space-y-2">
//                                                 <div>
//                                                     <span className="font-medium">Input: </span>
//                                                     <code className="bg-muted px-2 py-1 rounded text-sm">
//                                                         {example.input}
//                                                     </code>
//                                                 </div>
//                                                 <div>
//                                                     <span className="font-medium">Output: </span>
//                                                     <code className="bg-muted px-2 py-1 rounded text-sm">
//                                                         {example.output}
//                                                     </code>
//                                                 </div>
//                                                 {example.explanation && (
//                                                     <div>
//                                                         <span className="font-medium">Explanation: </span>
//                                                         <span className="text-sm">{example.explanation}</span>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </CardContent>
//                             </Card>

//                             {/* Constraints */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Constraints</CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="text-sm whitespace-pre-wrap">{problem.constraints}</div>
//                                 </CardContent>
//                             </Card>

//                             {/* Solution Approach */}
//                             {problem.solutionApproach && (
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle>Solution Approach</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <div className="prose dark:prose-invert max-w-none">
//                                             <p className="whitespace-pre-wrap text-sm">{problem.solutionApproach}</p>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             )}

//                             {/* Complexity Analysis */}
//                             {(problem.timeComplexity || problem.spaceComplexity) && (
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle>Complexity Analysis</CardTitle>
//                                     </CardHeader>
//                                     <CardContent className="space-y-3">
//                                         {problem.timeComplexity && (
//                                             <div className="flex items-center gap-2">
//                                                 <Clock size={16} className="text-blue-500" />
//                                                 <span className="font-medium">Time Complexity:</span>
//                                                 <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
//                                                     {problem.timeComplexity}
//                                                 </code>
//                                             </div>
//                                         )}
//                                         {problem.spaceComplexity && (
//                                             <div className="flex items-center gap-2">
//                                                 <Archive size={16} className="text-purple-500" />
//                                                 <span className="font-medium">Space Complexity:</span>
//                                                 <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
//                                                     {problem.spaceComplexity}
//                                                 </code>
//                                             </div>
//                                         )}
//                                     </CardContent>
//                                 </Card>
//                             )}
//                         </TabsContent>

//                         <TabsContent value="submissions" className="space-y-4">
//                             {submissions.length === 0 ? (
//                                 <div className="text-center py-8 text-muted-foreground">
//                                     No submissions yet. Submit your solution to see results here.
//                                 </div>
//                             ) : (
//                                 <div className="space-y-3">
//                                     {submissions.map((submission) => {
//                                         const statusDisplay = getStatusDisplay(submission.status);
//                                         return (
//                                             <Card key={submission._id}>
//                                                 <CardContent className="p-4">
//                                                     <div className="flex items-center justify-between mb-2">
//                                                         <div className="flex items-center gap-2">
//                                                             <Badge variant="outline" className={`${statusDisplay.color} ${statusDisplay.bgColor}`}>
//                                                                 {statusDisplay.icon}
//                                                                 <span className="ml-1">{submission.status}</span>
//                                                             </Badge>
//                                                             <Badge variant="outline">
//                                                                 {PROGRAMMING_LANGUAGES.find(l => l.value === submission.language)?.label}
//                                                             </Badge>
//                                                         </div>
//                                                         <span className="text-sm text-muted-foreground">
//                                                             {formatDate(submission.createdAt)}
//                                                         </span>
//                                                     </div>

//                                                     {submission.executionTime && (
//                                                         <div className="text-sm text-muted-foreground mb-2">
//                                                             Execution time: {submission.executionTime}ms
//                                                         </div>
//                                                     )}

//                                                     {submission.output && (
//                                                         <div className="mt-2">
//                                                             <div className="text-sm font-medium mb-1">Output:</div>
//                                                             <pre className="bg-muted p-2 rounded text-sm overflow-auto">
//                                                                 {submission.output}
//                                                             </pre>
//                                                         </div>
//                                                     )}

//                                                     {submission.error && (
//                                                         <div className="mt-2">
//                                                             <div className="text-sm font-medium mb-1 text-red-500">Error:</div>
//                                                             <pre className="bg-red-50 dark:bg-red-950 p-2 rounded text-sm text-red-500 overflow-auto">
//                                                                 {submission.error}
//                                                             </pre>
//                                                         </div>
//                                                     )}
//                                                 </CardContent>
//                                             </Card>
//                                         );
//                                     })}
//                                 </div>
//                             )}
//                         </TabsContent>
//                     </Tabs>
//                 </div>

//                 {/* Right column - Code editor */}
//                 <div>
//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="flex items-center gap-2">
//                                 <Code size={20} />
//                                 Solution
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                             {/* Language selector */}
//                             <div>
//                                 <label className="text-sm font-medium mb-2 block">Language</label>
//                                 <Select value={language} onValueChange={setLanguage}>
//                                     <SelectTrigger>
//                                         <SelectValue />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {PROGRAMMING_LANGUAGES.map(lang => (
//                                             <SelectItem key={lang.value} value={lang.value}>
//                                                 {lang.label}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             {/* Code editor */}
//                             <div>
//                                 <label className="text-sm font-medium mb-2 block">Your Solution</label>
//                                 <Textarea
//                                     value={code}
//                                     onChange={(e) => setCode(e.target.value)}
//                                     className="font-mono text-sm min-h-96 resize-none"
//                                     placeholder="Write your solution here..."
//                                 />
//                             </div>

//                             {/* Error message */}
//                             {error && (
//                                 <div className="bg-red-50 dark:bg-red-950 text-red-500 p-3 rounded-md text-sm">
//                                     {error}
//                                 </div>
//                             )}

//                             {/* Submit button */}
//                             <Button
//                                 onClick={handleSubmit}
//                                 disabled={submitting || !user}
//                                 className="w-full"
//                             >
//                                 {submitting ? (
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
//                                         Submitting...
//                                     </div>
//                                 ) : (
//                                     <div className="flex items-center gap-2">
//                                         <Play size={16} />
//                                         {user ? 'Submit Solution' : 'Login to Submit'}
//                                     </div>
//                                 )}
//                             </Button>

//                             {!user && (
//                                 <p className="text-sm text-muted-foreground text-center">
//                                     You need to{' '}
//                                     <Link href="/login" className="text-primary hover:underline">
//                                         login
//                                     </Link>
//                                     {' '}to submit solutions.
//                                 </p>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';
// import apiClient from '@/lib/api';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//     ArrowLeft,
//     Play,
//     CheckCircle,
//     XCircle,
//     Clock,
//     Code,
//     Tag,
//     AlertTriangle,
//     Info,
//     Archive
// } from 'lucide-react';
// import Link from 'next/link';

// interface CodingProblem {
//     _id: string;
//     title: string;
//     description: string;
//     difficulty: 'Easy' | 'Medium' | 'Hard';
//     tags: string[];
//     constraints: string;
//     examples: {
//         input: string;
//         output: string;
//         explanation?: string;
//     }[];
//     solutionApproach: string;
//     timeComplexity: string;
//     spaceComplexity: string;
//     createdAt: string;
// }

// interface Submission {
//     _id: string;
//     problemId: string;
//     code: string;
//     language: string;
//     status: string;
//     output?: string;
//     error?: string;
//     executionTime?: number;
//     createdAt: string;
// }

// const PROGRAMMING_LANGUAGES = [
//     { value: 'javascript', label: 'JavaScript' },
//     { value: 'python', label: 'Python' },
//     { value: 'java', label: 'Java' },
//     { value: 'cpp', label: 'C++' },
//     { value: 'c', label: 'C' },
// ];

// export default function ProblemPage() {
//     const params = useParams();
//     const router = useRouter();
//     const { user } = useAuth();

//     // Add debugging to see what params we're getting
//     console.log('Params:', params);
//     console.log('Problem ID:', params?.id);

//     const problemId = params?.id as string;

//     const [problem, setProblem] = useState<CodingProblem | null>(null);
//     const [submissions, setSubmissions] = useState<Submission[]>([]);
//     const [code, setCode] = useState('');
//     const [language, setLanguage] = useState('javascript');
//     const [loading, setLoading] = useState(true);
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [activeTab, setActiveTab] = useState('problem');

//     // Test API connection
//     useEffect(() => {
//         const testAPI = async () => {
//             try {
//                 console.log('Testing API connection...');
//                 // Try to fetch all problems first to test API
//                 const response = await apiClient.getAllProblems();
//                 console.log('All problems response:', response);
//             } catch (err) {
//                 console.error('API test failed:', err);
//             }
//         };
//         testAPI();
//     }, []);

//     // Fetch problem details
//     useEffect(() => {
//         const fetchProblem = async () => {
//             if (!problemId) {
//                 console.log('No problem ID found');
//                 setError('No problem ID provided');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 setLoading(true);
//                 setError(null);
//                 console.log('Fetching problem with ID:', problemId);
//                 console.log('API Client:', apiClient);

//                 // Try different possible API response structures
//                 const response = await apiClient.getProblem(problemId);
//                 console.log('Full API response:', response);
//                 console.log('Response data:', response.data);

//                 // Handle different possible response structures
//                 let problemData = null;
//                 if (response.data?.data) {
//                     problemData = response.data.data;
//                 } else if (response.data) {
//                     problemData = response.data;
//                 } else if (response) {
//                     problemData = response;
//                 }

//                 console.log('Processed problem data:', problemData);

//                 if (problemData) {
//                     setProblem(problemData);
//                 } else {
//                     setError('Problem data not found in response');
//                 }
//             } catch (err: any) {
//                 console.error('Error fetching problem:', err);
//                 console.error('Error response:', err.response);
//                 console.error('Error message:', err.message);

//                 // More detailed error handling
//                 if (err.response?.status === 404) {
//                     setError('Problem not found');
//                 } else if (err.response?.status === 401) {
//                     setError('Authentication required');
//                 } else {
//                     setError(err.response?.data?.error || err.message || 'Failed to fetch problem');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProblem();
//     }, [problemId]);

//     // Fetch user submissions for this problem
//     useEffect(() => {
//         if (!user || !problemId) return;

//         const fetchSubmissions = async () => {
//             try {
//                 const { data } = await apiClient.getSubmissions(problemId);
//                 setSubmissions(data.data || []);
//             } catch (error) {
//                 console.error('Error fetching submissions:', error);
//             }
//         };

//         fetchSubmissions();
//     }, [user, problemId]);

//     // Handle code submission
//     const handleSubmit = async () => {
//         if (!user) {
//             router.push('/login');
//             return;
//         }

//         if (!code.trim()) {
//             setError('Please enter your code');
//             return;
//         }

//         try {
//             setSubmitting(true);
//             setError(null);

//             console.log('Submitting code for problem:', problemId);
//             console.log('Submission data:', { problemId, code: code.substring(0, 100) + '...', language });

//             // Try the API call and log the full error if it fails
//             const response = await apiClient.submitSolution(problemId, {
//                 code,
//                 language
//             });

//             console.log('Submission response:', response);

//             // Refresh submissions after successful submission
//             const submissionsResponse = await apiClient.getSubmissions(problemId);
//             setSubmissions(submissionsResponse.data.data || []);

//             // Switch to submissions tab to show result
//             setActiveTab('submissions');
//         } catch (err: any) {
//             console.error('Full submission error:', err);
//             console.error('Error response:', err.response);
//             console.error('Error status:', err.response?.status);
//             console.error('Error data:', err.response?.data);

//             // More specific error messages
//             if (err.response?.status === 401) {
//                 setError('Authentication failed. Please login again.');
//             } else if (err.response?.status === 404) {
//                 setError('Problem not found or submission endpoint not available.');
//             } else if (err.response?.status === 400) {
//                 setError(`Invalid submission: ${err.response?.data?.error || 'Bad request'}`);
//             } else {
//                 setError(err.response?.data?.error || err.message || 'Failed to submit code');
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Get difficulty color
//     const getDifficultyColor = (difficulty: string) => {
//         switch (difficulty) {
//             case 'Easy':
//                 return 'text-green-500 bg-green-50 dark:bg-green-950';
//             case 'Medium':
//                 return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950';
//             case 'Hard':
//                 return 'text-red-500 bg-red-50 dark:bg-red-950';
//             default:
//                 return '';
//         }
//     };

//     // Get status color and icon
//     const getStatusDisplay = (status: string) => {
//         switch (status) {
//             case 'Accepted':
//                 return {
//                     color: 'text-green-500',
//                     icon: <CheckCircle size={16} />,
//                     bgColor: 'bg-green-50 dark:bg-green-950'
//                 };
//             case 'Wrong Answer':
//                 return {
//                     color: 'text-red-500',
//                     icon: <XCircle size={16} />,
//                     bgColor: 'bg-red-50 dark:bg-red-950'
//                 };
//             case 'Time Limit Exceeded':
//                 return {
//                     color: 'text-yellow-500',
//                     icon: <Clock size={16} />,
//                     bgColor: 'bg-yellow-50 dark:bg-yellow-950'
//                 };
//             case 'Runtime Error':
//                 return {
//                     color: 'text-red-500',
//                     icon: <AlertTriangle size={16} />,
//                     bgColor: 'bg-red-50 dark:bg-red-950'
//                 };
//             default:
//                 return {
//                     color: 'text-gray-500',
//                     icon: <Info size={16} />,
//                     bgColor: 'bg-gray-50 dark:bg-gray-950'
//                 };
//         }
//     };

//     // Format date
//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     // Get default code template based on language
//     const getCodeTemplate = (lang: string) => {
//         switch (lang) {
//             case 'javascript':
//                 return `function solution() {
//     // Write your solution here

// }`;
//             case 'python':
//                 return `def solution():
//     # Write your solution here
//     pass`;
//             case 'java':
//                 return `public class Solution {
//     public static void main(String[] args) {
//         // Write your solution here

//     }
// }`;
//             case 'cpp':
//                 return `#include <iostream>
// using namespace std;

// int main() {
//     // Write your solution here

//     return 0;
// }`;
//             case 'c':
//                 return `#include <stdio.h>

// int main() {
//     // Write your solution here

//     return 0;
// }`;
//             default:
//                 return '';
//         }
//     };

//     // Update code template when language changes
//     useEffect(() => {
//         if (!code) {
//             setCode(getCodeTemplate(language));
//         }
//     }, [language, code]);

//     // Add debugging information
//     console.log('Current state:', { loading, error, problem, problemId });

//     // Loading state
//     if (loading) {
//         return (
//             <div className="container max-w-6xl mx-auto p-4 py-8">
//                 <div className="flex justify-center items-center min-h-[400px]">
//                     <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//                 </div>
//             </div>
//         );
//     }

//     // Error state
//     if (error) {
//         return (
//             <div className="container max-w-6xl mx-auto p-4 py-8">
//                 <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
//                     <p><strong>Error:</strong> {error}</p>
//                     <p><strong>Problem ID:</strong> {problemId}</p>
//                     <p><strong>User:</strong> {user ? 'Logged in' : 'Not logged in'}</p>
//                 </div>
//                 <div className="mt-4">
//                     <Link href="/problems">
//                         <Button variant="outline">
//                             <ArrowLeft size={16} className="mr-2" />
//                             Back to Problems
//                         </Button>
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     // No problem found
//     if (!problem) {
//         return (
//             <div className="container max-w-6xl mx-auto p-4 py-8">
//                 <div className="text-center py-8">
//                     <p className="text-muted-foreground mb-4">Problem not found</p>
//                     <Link href="/problems">
//                         <Button variant="outline">
//                             <ArrowLeft size={16} className="mr-2" />
//                             Back to Problems
//                         </Button>
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container max-w-7xl mx-auto p-4 py-8">
//             {/* Header */}
//             <div className="mb-6">
//                 <Link href="/problems">
//                     <Button variant="outline" className="mb-4">
//                         <ArrowLeft size={16} className="mr-2" />
//                         Back to Problems
//                     </Button>
//                 </Link>

//                 <div className="flex items-center gap-4 mb-4">
//                     <h1 className="text-3xl font-bold">{problem.title}</h1>
//                     <Badge variant="outline" className={`${getDifficultyColor(problem.difficulty)}`}>
//                         {problem.difficulty}
//                     </Badge>
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                     {problem.tags.map(tag => (
//                         <Badge key={tag} variant="outline" className="text-xs">
//                             <Tag size={12} className="mr-1" />
//                             {tag}
//                         </Badge>
//                     ))}
//                 </div>
//             </div>

//             {/* Main content */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Left column - Problem details */}
//                 <div>
//                     <Tabs value={activeTab} onValueChange={setActiveTab}>
//                         <TabsList className="grid w-full grid-cols-2">
//                             <TabsTrigger value="problem">Problem</TabsTrigger>
//                             <TabsTrigger value="submissions">
//                                 Submissions ({submissions.length})
//                             </TabsTrigger>
//                         </TabsList>

//                         <TabsContent value="problem" className="space-y-6">
//                             {/* Problem Description */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Description</CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="prose dark:prose-invert max-w-none">
//                                         <p className="whitespace-pre-wrap">{problem.description}</p>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             {/* Examples */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Examples</CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="space-y-4">
//                                     {problem.examples.map((example, index) => (
//                                         <div key={index} className="border rounded-lg p-4">
//                                             <h4 className="font-medium mb-2">Example {index + 1}:</h4>
//                                             <div className="space-y-2">
//                                                 <div>
//                                                     <span className="font-medium">Input: </span>
//                                                     <code className="bg-muted px-2 py-1 rounded text-sm">
//                                                         {example.input}
//                                                     </code>
//                                                 </div>
//                                                 <div>
//                                                     <span className="font-medium">Output: </span>
//                                                     <code className="bg-muted px-2 py-1 rounded text-sm">
//                                                         {example.output}
//                                                     </code>
//                                                 </div>
//                                                 {example.explanation && (
//                                                     <div>
//                                                         <span className="font-medium">Explanation: </span>
//                                                         <span className="text-sm">{example.explanation}</span>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </CardContent>
//                             </Card>

//                             {/* Constraints */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Constraints</CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="text-sm whitespace-pre-wrap">{problem.constraints}</div>
//                                 </CardContent>
//                             </Card>

//                             {/* Solution Approach */}
//                             {problem.solutionApproach && (
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle>Solution Approach</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <div className="prose dark:prose-invert max-w-none">
//                                             <p className="whitespace-pre-wrap text-sm">{problem.solutionApproach}</p>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             )}

//                             {/* Complexity Analysis */}
//                             {(problem.timeComplexity || problem.spaceComplexity) && (
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle>Complexity Analysis</CardTitle>
//                                     </CardHeader>
//                                     <CardContent className="space-y-3">
//                                         {problem.timeComplexity && (
//                                             <div className="flex items-center gap-2">
//                                                 <Clock size={16} className="text-blue-500" />
//                                                 <span className="font-medium">Time Complexity:</span>
//                                                 <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
//                                                     {problem.timeComplexity}
//                                                 </code>
//                                             </div>
//                                         )}
//                                         {problem.spaceComplexity && (
//                                             <div className="flex items-center gap-2">
//                                                 <Archive size={16} className="text-purple-500" />
//                                                 <span className="font-medium">Space Complexity:</span>
//                                                 <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
//                                                     {problem.spaceComplexity}
//                                                 </code>
//                                             </div>
//                                         )}
//                                     </CardContent>
//                                 </Card>
//                             )}
//                         </TabsContent>

//                         <TabsContent value="submissions" className="space-y-4">
//                             {submissions.length === 0 ? (
//                                 <div className="text-center py-8 text-muted-foreground">
//                                     No submissions yet. Submit your solution to see results here.
//                                 </div>
//                             ) : (
//                                 <div className="space-y-3">
//                                     {submissions.map((submission) => {
//                                         const statusDisplay = getStatusDisplay(submission.status);
//                                         return (
//                                             <Card key={submission._id}>
//                                                 <CardContent className="p-4">
//                                                     <div className="flex items-center justify-between mb-2">
//                                                         <div className="flex items-center gap-2">
//                                                             <Badge variant="outline" className={`${statusDisplay.color} ${statusDisplay.bgColor}`}>
//                                                                 {statusDisplay.icon}
//                                                                 <span className="ml-1">{submission.status}</span>
//                                                             </Badge>
//                                                             <Badge variant="outline">
//                                                                 {PROGRAMMING_LANGUAGES.find(l => l.value === submission.language)?.label}
//                                                             </Badge>
//                                                         </div>
//                                                         <span className="text-sm text-muted-foreground">
//                                                             {formatDate(submission.createdAt)}
//                                                         </span>
//                                                     </div>

//                                                     {submission.executionTime && (
//                                                         <div className="text-sm text-muted-foreground mb-2">
//                                                             Execution time: {submission.executionTime}ms
//                                                         </div>
//                                                     )}

//                                                     {submission.output && (
//                                                         <div className="mt-2">
//                                                             <div className="text-sm font-medium mb-1">Output:</div>
//                                                             <pre className="bg-muted p-2 rounded text-sm overflow-auto">
//                                                                 {submission.output}
//                                                             </pre>
//                                                         </div>
//                                                     )}

//                                                     {submission.error && (
//                                                         <div className="mt-2">
//                                                             <div className="text-sm font-medium mb-1 text-red-500">Error:</div>
//                                                             <pre className="bg-red-50 dark:bg-red-950 p-2 rounded text-sm text-red-500 overflow-auto">
//                                                                 {submission.error}
//                                                             </pre>
//                                                         </div>
//                                                     )}
//                                                 </CardContent>
//                                             </Card>
//                                         );
//                                     })}
//                                 </div>
//                             )}
//                         </TabsContent>
//                     </Tabs>
//                 </div>

//                 {/* Right column - Code editor */}
//                 <div>
//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="flex items-center gap-2">
//                                 <Code size={20} />
//                                 Solution
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                             {/* Language selector */}
//                             <div>
//                                 <label className="text-sm font-medium mb-2 block">Language</label>
//                                 <Select value={language} onValueChange={setLanguage}>
//                                     <SelectTrigger>
//                                         <SelectValue />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {PROGRAMMING_LANGUAGES.map(lang => (
//                                             <SelectItem key={lang.value} value={lang.value}>
//                                                 {lang.label}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             {/* Code editor */}
//                             <div>
//                                 <label className="text-sm font-medium mb-2 block">Your Solution</label>
//                                 <Textarea
//                                     value={code}
//                                     onChange={(e) => setCode(e.target.value)}
//                                     className="font-mono text-sm min-h-96 resize-none"
//                                     placeholder="Write your solution here..."
//                                 />
//                             </div>

//                             {/* Error message */}
//                             {error && (
//                                 <div className="bg-red-50 dark:bg-red-950 text-red-500 p-3 rounded-md text-sm">
//                                     {error}
//                                 </div>
//                             )}

//                             {/* Submit button */}
//                             <Button
//                                 onClick={handleSubmit}
//                                 disabled={submitting || !user}
//                                 className="w-full"
//                             >
//                                 {submitting ? (
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
//                                         Submitting...
//                                     </div>
//                                 ) : (
//                                     <div className="flex items-center gap-2">
//                                         <Play size={16} />
//                                         {user ? 'Submit Solution' : 'Login to Submit'}
//                                     </div>
//                                 )}
//                             </Button>

//                             {!user && (
//                                 <p className="text-sm text-muted-foreground text-center">
//                                     You need to{' '}
//                                     <Link href="/login" className="text-primary hover:underline">
//                                         login
//                                     </Link>
//                                     {' '}to submit solutions.
//                                 </p>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     );
// }


'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    Play,
    CheckCircle,
    XCircle,
    Clock,
    Code,
    Tag,
    AlertTriangle,
    Info,
    Archive,
    X
} from 'lucide-react';
import Link from 'next/link';
import User from '@/lib/models/User';

interface CodingProblem {
    _id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string[];
    constraints: string;
    examples: {
        input: string;
        output: string;
        explanation?: string;
    }[];
    solutionApproach: string;
    timeComplexity: string;
    spaceComplexity: string;
    createdAt: string;
}

interface Submission {
    _id: string;
    userId: string;
    problemId: string;
    code: string;
    language: string;
    status: string;
    output?: string;
    error?: string;
    executionTime?: number;
    createdAt: string;

}

const PROGRAMMING_LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
];

export default function ProblemPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const problemId = params?.id as string;
    const [problem, setProblem] = useState<CodingProblem | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('problem');
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    useEffect(() => {
        const testAPI = async () => {
            try {
                const response = await apiClient.getAllProblems();
                console.log('All problems response:', response);
            } catch (err) {
                console.error('API test failed:', err);
            }
        };
        testAPI();
    }, []);

    useEffect(() => {
        const fetchProblem = async () => {
            if (!problemId) {
                setError('No problem ID provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await apiClient.getProblem(problemId);
                const problemData = response.data?.data || response.data || response;
                setProblem(problemData);
            } catch (err: any) {
                console.error('Error fetching problem:', err);
                if (err.response?.status === 404) {
                    setError('Problem not found');
                } else if (err.response?.status === 401) {
                    setError('Authentication required');
                } else {
                    setError(err.response?.data?.error || err.message || 'Failed to fetch problem');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [problemId]);

    useEffect(() => {
        if (!user || !problemId) return;

        const fetchSubmissions = async () => {
            try {
                const { data } = await apiClient.getSubmissions(problemId);
                setSubmissions(data.data || []);
            } catch (error) {
                console.error('Error fetching submissions:', error);
            }
        };
        fetchSubmissions();
    }, [user, problemId]);

    const handleSubmit = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (!code.trim()) {
            setError('Please enter your code');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await apiClient.submitSolution(problemId, { code, language });
            const submissionsResponse = await apiClient.getSubmissions(problemId);
            setSubmissions(submissionsResponse.data.data || []);
            setActiveTab('submissions');
        } catch (err: any) {
            console.error('Submission error:', err);
            if (err.response?.status === 401) {
                setError('Authentication failed. Please login again.');
            } else if (err.response?.status === 404) {
                setError('Problem not found');
            } else {
                setError(err.response?.data?.error || err.message || 'Failed to submit code');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-500 bg-green-50 dark:bg-green-950';
            case 'Medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950';
            case 'Hard': return 'text-red-500 bg-red-50 dark:bg-red-950';
            default: return '';
        }
    };

    const getStatusDisplay = (status: string) => ({
        color: {
            'Accepted': 'text-green-500',
            'Wrong Answer': 'text-red-500',
            'Time Limit Exceeded': 'text-yellow-500',
            'Runtime Error': 'text-red-500'
        }[status] || 'text-gray-500',
        icon: {
            'Accepted': <CheckCircle size={16} />,
            'Wrong Answer': <XCircle size={16} />,
            'Time Limit Exceeded': <Clock size={16} />,
            'Runtime Error': <AlertTriangle size={16} />
        }[status] || <Info size={16} />,
        bgColor: {
            'Accepted': 'bg-green-50 dark:bg-green-950',
            'Wrong Answer': 'bg-red-50 dark:bg-red-950',
            'Time Limit Exceeded': 'bg-yellow-50 dark:bg-yellow-950',
            'Runtime Error': 'bg-red-50 dark:bg-red-950'
        }[status] || 'bg-gray-50 dark:bg-gray-950'
    });

    const formatDate = (dateString: string) => new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const getCodeTemplate = (lang: string) => {
        const templates = {
            javascript: `function solution() {\n    // Write your solution here\n}`,
            python: `def solution():\n    # Write your solution here\n    pass`,
            java: `public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}`,
            cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
            c: `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}`
        };
        return templates[lang as keyof typeof templates] || '';
    };

    useEffect(() => {
        if (!code) setCode(getCodeTemplate(language));
    }, [language, code]);

    if (loading) return (
        <div className="container max-w-6xl mx-auto p-4 py-8">
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="container max-w-6xl mx-auto p-4 py-8">
            <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
                <p><strong>Error:</strong> {error}</p>
                <p><strong>Problem ID:</strong> {problemId}</p>
            </div>
            <Link href="/problems"><Button variant="outline"><ArrowLeft size={16} className="mr-2" />Back</Button></Link>
        </div>
    );

    if (!problem) return (
        <div className="container max-w-6xl mx-auto p-4 py-8">
            <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Problem not found</p>
                <Link href="/problems"><Button variant="outline"><ArrowLeft size={16} className="mr-2" />Back</Button></Link>
            </div>
        </div>
    );

    return (
        <div className="container max-w-7xl mx-auto p-4 py-8">
            {/* Submission Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Submission Details</h2>
                            <Button variant="ghost" onClick={() => setSelectedSubmission(null)}>
                                <X size={16} />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div><span className="font-medium">Author:</span> {user?.name}</div>
                            <div><span className="font-medium">Language:</span> {
                                PROGRAMMING_LANGUAGES.find(l => l.value === selectedSubmission.language)?.label
                            }</div>
                            <div>
                                <span className="font-medium">Status:</span>{" "}
                                <Badge variant="outline" className={getStatusDisplay(selectedSubmission.status).bgColor}>
                                    {selectedSubmission.status}
                                </Badge>
                            </div>
                            <div><span className="font-medium">Submitted at:</span> {formatDate(selectedSubmission.createdAt)}</div>

                            <div>
                                <span className="font-medium">Code:</span>
                                <pre className="bg-muted p-4 rounded mt-2 overflow-auto text-sm">
                                    {selectedSubmission.code}
                                </pre>
                            </div>

                            {selectedSubmission.output && (
                                <div>
                                    <span className="font-medium">Output:</span>
                                    <pre className="bg-muted p-4 rounded mt-2 overflow-auto text-sm">
                                        {selectedSubmission.output}
                                    </pre>
                                </div>
                            )}

                            {selectedSubmission.error && (
                                <div>
                                    <span className="font-medium text-red-500">Error:</span>
                                    <pre className="bg-red-50 dark:bg-red-950 p-4 rounded mt-2 overflow-auto text-sm text-red-500">
                                        {selectedSubmission.error}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <Link href="/problems"><Button variant="outline" className="mb-4"><ArrowLeft size={16} className="mr-2" />Back</Button></Link>
                <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold">{problem.title}</h1>
                    <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                    </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                    {problem.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs"><Tag size={12} className="mr-1" />{tag}</Badge>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="problem">Problem</TabsTrigger>
                            <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="problem" className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-wrap">{problem.description}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Examples</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {problem.examples.map((example, index) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <h4 className="font-medium mb-2">Example {index + 1}:</h4>
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="font-medium">Input: </span>
                                                    <code className="bg-muted px-2 py-1 rounded text-sm">{example.input}</code>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Output: </span>
                                                    <code className="bg-muted px-2 py-1 rounded text-sm">{example.output}</code>
                                                </div>
                                                {example.explanation && (
                                                    <div>
                                                        <span className="font-medium">Explanation: </span>
                                                        <span className="text-sm">{example.explanation}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Constraints</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-sm whitespace-pre-wrap">{problem.constraints}</div>
                                </CardContent>
                            </Card>

                            {problem.solutionApproach && (
                                <Card>
                                    <CardHeader><CardTitle>Solution Approach</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="prose dark:prose-invert max-w-none">
                                            <p className="whitespace-pre-wrap text-sm">{problem.solutionApproach}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {(problem.timeComplexity || problem.spaceComplexity) && (
                                <Card>
                                    <CardHeader><CardTitle>Complexity Analysis</CardTitle></CardHeader>
                                    <CardContent className="space-y-3">
                                        {problem.timeComplexity && (
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-blue-500" />
                                                <span className="font-medium">Time Complexity:</span>
                                                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                                    {problem.timeComplexity}
                                                </code>
                                            </div>
                                        )}
                                        {problem.spaceComplexity && (
                                            <div className="flex items-center gap-2">
                                                <Archive size={16} className="text-purple-500" />
                                                <span className="font-medium">Space Complexity:</span>
                                                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                                    {problem.spaceComplexity}
                                                </code>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="submissions" className="space-y-4">
                            {submissions.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No submissions yet. Submit your solution to see results.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {submissions.map((submission) => {
                                        const statusDisplay = getStatusDisplay(submission.status);
                                        return (
                                            <Card key={submission._id}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className={`${statusDisplay.color} ${statusDisplay.bgColor}`}>
                                                                {statusDisplay.icon}
                                                                <span className="ml-1">{submission.status}</span>
                                                            </Badge>
                                                            <Badge variant="outline">
                                                                {PROGRAMMING_LANGUAGES.find(l => l.value === submission.language)?.label}
                                                            </Badge>
                                                            <span className="text-sm text-muted-foreground">
                                                                by {user?.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-muted-foreground">
                                                                {formatDate(submission.createdAt)}
                                                            </span>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setSelectedSubmission(submission)}
                                                            >
                                                                View Submission
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {submission.executionTime && (
                                                        <div className="text-sm text-muted-foreground mb-2">
                                                            Execution time: {submission.executionTime}ms
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code size={20} />
                                Solution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Language selector */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Language</label>
                                <Select value={language} onValueChange={setLanguage}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROGRAMMING_LANGUAGES.map(lang => (
                                            <SelectItem key={lang.value} value={lang.value}>
                                                {lang.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Code editor */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Your Solution</label>
                                <Textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="font-mono text-sm min-h-96 resize-none"
                                    placeholder="Write your solution here..."
                                />
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="bg-red-50 dark:bg-red-950 text-red-500 p-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit button */}
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting || !user}
                                className="w-full"
                            >
                                {submitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                        Submitting...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Play size={16} />
                                        {user ? 'Submit Solution' : 'Login to Submit'}
                                    </div>
                                )}
                            </Button>

                            {!user && (
                                <p className="text-sm text-muted-foreground text-center">
                                    You need to{' '}
                                    <Link href="/login" className="text-primary hover:underline">
                                        login
                                    </Link>{' '}
                                    to submit solutions.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}