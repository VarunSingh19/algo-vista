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
//     Archive,
//     X
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
//     userId: {
//         name: string;
//         email: string;
//     },
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

//     const problemId = params?.id as string;
//     const [problem, setProblem] = useState<CodingProblem | null>(null);
//     const [submissions, setSubmissions] = useState<Submission[]>([]);
//     const [code, setCode] = useState('');
//     const [language, setLanguage] = useState('javascript');
//     const [loading, setLoading] = useState(true);
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [activeTab, setActiveTab] = useState('problem');
//     const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

//     useEffect(() => {
//         const testAPI = async () => {
//             try {
//                 const response = await apiClient.getAllProblems();
//                 console.log('All problems response:', response);
//             } catch (err) {
//                 console.error('API test failed:', err);
//             }
//         };
//         testAPI();
//     }, []);

//     useEffect(() => {
//         const fetchProblem = async () => {
//             if (!problemId) {
//                 setError('No problem ID provided');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 setLoading(true);
//                 setError(null);
//                 const response = await apiClient.getProblem(problemId);
//                 const problemData = response.data?.data || response.data || response;
//                 setProblem(problemData);
//             } catch (err: unknown) {
//                 console.error('Error fetching problem:', err);
//                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                 if ((err as any).response?.status === 404) {
//                     setError('Problem not found');
//                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                 } else if ((err as any).response?.status === 401) {
//                     setError('Authentication required');
//                 } else {
//                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                     setError((err as any).response?.data?.error || (err as Error).message || 'Failed to fetch problem');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProblem();
//     }, [problemId]);

//     useEffect(() => {
//         if (!user || !problemId) return;

//         const fetchSubmissions = async () => {
//             try {
//                 const { data } = await apiClient.getSubmissions({ problemId });
//                 setSubmissions(data.data || []);
//             } catch (error) {
//                 console.error('Error fetching submissions:', error);
//             }
//         };
//         fetchSubmissions();
//     }, [user, problemId]);

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
//             await apiClient.submitSolution(problemId, { code, language });
//             const submissionsResponse = await apiClient.getSubmissions({ problemId });
//             setSubmissions(submissionsResponse.data.data || []);
//             setActiveTab('submissions');
//         } catch (err: any) {
//             console.error('Submission error:', err);
//             if (err.response?.status === 401) {
//                 setError('Authentication failed. Please login again.');
//             } else if (err.response?.status === 404) {
//                 setError('Problem not found');
//             } else {
//                 setError(err.response?.data?.error || err.message || 'Failed to submit code');
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const getDifficultyColor = (difficulty: string) => {
//         switch (difficulty) {
//             case 'Easy': return 'text-green-500 bg-green-50 dark:bg-green-950';
//             case 'Medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950';
//             case 'Hard': return 'text-red-500 bg-red-50 dark:bg-red-950';
//             default: return '';
//         }
//     };

//     const getStatusDisplay = (status: string) => ({
//         color: {
//             'Accepted': 'text-green-500',
//             'Wrong Answer': 'text-red-500',
//             'Time Limit Exceeded': 'text-yellow-500',
//             'Runtime Error': 'text-red-500'
//         }[status] || 'text-gray-500',
//         icon: {
//             'Accepted': <CheckCircle size={16} />,
//             'Wrong Answer': <XCircle size={16} />,
//             'Time Limit Exceeded': <Clock size={16} />,
//             'Runtime Error': <AlertTriangle size={16} />
//         }[status] || <Info size={16} />,
//         bgColor: {
//             'Accepted': 'bg-green-50 dark:bg-green-950',
//             'Wrong Answer': 'bg-red-50 dark:bg-red-950',
//             'Time Limit Exceeded': 'bg-yellow-50 dark:bg-yellow-950',
//             'Runtime Error': 'bg-red-50 dark:bg-red-950'
//         }[status] || 'bg-gray-50 dark:bg-gray-950'
//     });

//     const formatDate = (dateString: string) => new Date(dateString).toLocaleString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//     });

//     const getCodeTemplate = (lang: string) => {
//         const templates = {
//             javascript: `function solution() {\n    // Write your solution here\n}`,
//             python: `def solution():\n    # Write your solution here\n    pass`,
//             java: `public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}`,
//             cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
//             c: `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}`
//         };
//         return templates[lang as keyof typeof templates] || '';
//     };

//     useEffect(() => {
//         if (!code) setCode(getCodeTemplate(language));
//     }, [language, code]);

//     if (loading) return (
//         <div className="container max-w-6xl mx-auto p-4 py-8">
//             <div className="flex justify-center items-center min-h-[400px]">
//                 <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//             </div>
//         </div>
//     );

//     if (error) return (
//         <div className="container max-w-6xl mx-auto p-4 py-8">
//             <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
//                 <p><strong>Error:</strong> {error}</p>
//                 <p><strong>Problem ID:</strong> {problemId}</p>
//             </div>
//             <Link href="/problems"><Button variant="outline"><ArrowLeft size={16} className="mr-2" />Back</Button></Link>
//         </div>
//     );

//     if (!problem) return (
//         <div className="container max-w-6xl mx-auto p-4 py-8">
//             <div className="text-center py-8">
//                 <p className="text-muted-foreground mb-4">Problem not found</p>
//                 <Link href="/problems"><Button variant="outline"><ArrowLeft size={16} className="mr-2" />Back</Button></Link>
//             </div>
//         </div>
//     );

//     return (
//         <div className="container max-w-7xl mx-auto p-4 py-8">
//             {/* Submission Modal */}
//             {selectedSubmission && (
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//                     <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-xl font-bold">Submission Details</h2>
//                             <Button variant="ghost" onClick={() => setSelectedSubmission(null)}>
//                                 <X size={16} />
//                             </Button>
//                         </div>

//                         <div className="space-y-4">
//                             <div><span className="font-medium">Author:</span> {selectedSubmission.userId.name}</div>
//                             <div><span className="font-medium">Language:</span> {
//                                 PROGRAMMING_LANGUAGES.find(l => l.value === selectedSubmission.language)?.label
//                             }</div>
//                             <div>
//                                 <span className="font-medium">Status:</span>{" "}
//                                 <Badge variant="outline" className={getStatusDisplay(selectedSubmission.status).bgColor}>
//                                     {selectedSubmission.status}
//                                 </Badge>
//                             </div>
//                             <div><span className="font-medium">Submitted at:</span> {formatDate(selectedSubmission.createdAt)}</div>

//                             <div>
//                                 <span className="font-medium">Code:</span>
//                                 <pre className="bg-muted p-4 rounded mt-2 overflow-auto text-sm">
//                                     {selectedSubmission.code}
//                                 </pre>
//                             </div>

//                             {selectedSubmission.output && (
//                                 <div>
//                                     <span className="font-medium">Output:</span>
//                                     <pre className="bg-muted p-4 rounded mt-2 overflow-auto text-sm">
//                                         {selectedSubmission.output}
//                                     </pre>
//                                 </div>
//                             )}

//                             {selectedSubmission.error && (
//                                 <div>
//                                     <span className="font-medium text-red-500">Error:</span>
//                                     <pre className="bg-red-50 dark:bg-red-950 p-4 rounded mt-2 overflow-auto text-sm text-red-500">
//                                         {selectedSubmission.error}
//                                     </pre>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className="mb-6">
//                 <Link href="/problems"><Button variant="outline" className="mb-4"><ArrowLeft size={16} className="mr-2" />Back</Button></Link>
//                 <div className="flex items-center gap-4 mb-4">
//                     <h1 className="text-3xl font-bold">{problem.title}</h1>
//                     <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
//                         {problem.difficulty}
//                     </Badge>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                     {problem.tags.map(tag => (
//                         <Badge key={tag} variant="outline" className="text-xs"><Tag size={12} className="mr-1" />{tag}</Badge>
//                     ))}
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div>
//                     <Tabs value={activeTab} onValueChange={setActiveTab}>
//                         <TabsList className="grid w-full grid-cols-2">
//                             <TabsTrigger value="problem">Problem</TabsTrigger>
//                             <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
//                         </TabsList>

//                         <TabsContent value="problem" className="space-y-6">
//                             <Card>
//                                 <CardHeader><CardTitle>Description</CardTitle></CardHeader>
//                                 <CardContent>
//                                     <div className="prose dark:prose-invert max-w-none">
//                                         <p className="whitespace-pre-wrap">{problem.description}</p>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             <Card>
//                                 <CardHeader><CardTitle>Examples</CardTitle></CardHeader>
//                                 <CardContent className="space-y-4">
//                                     {problem.examples.map((example, index) => (
//                                         <div key={index} className="border rounded-lg p-4">
//                                             <h4 className="font-medium mb-2">Example {index + 1}:</h4>
//                                             <div className="space-y-2">
//                                                 <div>
//                                                     <span className="font-medium">Input: </span>
//                                                     <code className="bg-muted px-2 py-1 rounded text-sm">{example.input}</code>
//                                                 </div>
//                                                 <div>
//                                                     <span className="font-medium">Output: </span>
//                                                     <code className="bg-muted px-2 py-1 rounded text-sm">{example.output}</code>
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

//                             <Card>
//                                 <CardHeader><CardTitle>Constraints</CardTitle></CardHeader>
//                                 <CardContent>
//                                     <div className="text-sm whitespace-pre-wrap">{problem.constraints}</div>
//                                 </CardContent>
//                             </Card>

//                             {problem.solutionApproach && (
//                                 <Card>
//                                     <CardHeader><CardTitle>Solution Approach</CardTitle></CardHeader>
//                                     <CardContent>
//                                         <div className="prose dark:prose-invert max-w-none">
//                                             <p className="whitespace-pre-wrap text-sm">{problem.solutionApproach}</p>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             )}

//                             {(problem.timeComplexity || problem.spaceComplexity) && (
//                                 <Card>
//                                     <CardHeader><CardTitle>Complexity Analysis</CardTitle></CardHeader>
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
//                                     No submissions yet. Submit your solution to see results.
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
//                                                             <span className="text-sm text-muted-foreground">
//                                                                 by {submission.userId.name}

//                                                             </span>
//                                                         </div>
//                                                         <div className="flex items-center gap-2">
//                                                             <span className="text-sm text-muted-foreground">
//                                                                 {formatDate(submission.createdAt)}
//                                                             </span>
//                                                             <Button
//                                                                 variant="outline"
//                                                                 size="sm"
//                                                                 onClick={() => setSelectedSubmission(submission)}
//                                                             >
//                                                                 View Submission
//                                                             </Button>
//                                                         </div>
//                                                     </div>

//                                                     {submission.executionTime && (
//                                                         <div className="text-sm text-muted-foreground mb-2">
//                                                             Execution time: {submission.executionTime}ms
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
//                                     </Link>{' '}
//                                     to submit solutions.
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
//     Archive,
//     X,
//     Users,
//     Eye,
//     Trophy,
//     User as UserIcon
// } from 'lucide-react';
// import Link from 'next/link';
// import User from '@/lib/models/User';

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
//     userId: {
//         _id: string;
//         name: string;
//         email: string;
//     };
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

//     const problemId = params?.id as string;
//     const [problem, setProblem] = useState<CodingProblem | null>(null);
//     const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
//     const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
//     const [code, setCode] = useState('');
//     const [language, setLanguage] = useState('javascript');
//     const [loading, setLoading] = useState(true);
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [activeTab, setActiveTab] = useState('problem');
//     const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
//     const [submissionFilter, setSubmissionFilter] = useState<'all' | 'accepted' | 'mine'>('all');

//     useEffect(() => {
//         const testAPI = async () => {
//             try {
//                 const response = await apiClient.getAllProblems();
//                 console.log('All problems response:', response);
//             } catch (err) {
//                 console.error('API test failed:', err);
//             }
//         };
//         testAPI();
//     }, []);

//     useEffect(() => {
//         const fetchProblem = async () => {
//             if (!problemId) {
//                 setError('No problem ID provided');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 setLoading(true);
//                 setError(null);
//                 const response = await apiClient.getProblem(problemId);
//                 const problemData = response.data?.data || response.data || response;
//                 setProblem(problemData);
//             } catch (err: any) {
//                 console.error('Error fetching problem:', err);
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

//     useEffect(() => {
//         if (!problemId) return;

//         const fetchAllSubmissions = async () => {
//             try {
//                 // First try to get all submissions (this will work if the API supports it)
//                 const { data } = await apiClient.getSubmissions();
//                 const allSubs = data.data || data || [];

//                 // Filter submissions for this specific problem
//                 const problemSubmissions = allSubs.filter((sub: Submission) =>
//                     sub.problemId === problemId
//                 );

//                 setAllSubmissions(problemSubmissions);

//                 // Filter my submissions if user is logged in
//                 if (user) {
//                     const userSubmissions = problemSubmissions.filter((sub: Submission) =>
//                         sub.userId._id === user._id || sub.userId._id === user._id
//                     );
//                     setMySubmissions(userSubmissions);
//                 }
//             } catch (error) {
//                 console.error('Error fetching all submissions:', error);
//                 // Fallback to problem-specific submissions if available
//                 if (user) {
//                     try {
//                         const { data } = await apiClient.getProblemSubmissions(problemId);
//                         const userSubmissions = data.data || data || [];
//                         setMySubmissions(userSubmissions);
//                         setAllSubmissions(userSubmissions);
//                     } catch (fallbackError) {
//                         console.error('Error fetching problem submissions:', fallbackError);
//                     }
//                 }
//             }
//         };

//         fetchAllSubmissions();
//     }, [user, problemId]);

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
//             await apiClient.submitSolution(problemId, { code, language });

//             // Refresh all submissions after successful submission
//             const { data } = await apiClient.getSubmissions();
//             const allSubs = data.data || data || [];
//             const problemSubmissions = allSubs.filter((sub: Submission) =>
//                 sub.problemId === problemId
//             );
//             setAllSubmissions(problemSubmissions);

//             const userSubmissions = problemSubmissions.filter((sub: Submission) =>
//                 sub.userId._id === user._id || sub.userId._id === user.id
//             );
//             setMySubmissions(userSubmissions);

//             setActiveTab('submissions');
//         } catch (err: any) {
//             console.error('Submission error:', err);
//             if (err.response?.status === 401) {
//                 setError('Authentication failed. Please login again.');
//             } else if (err.response?.status === 404) {
//                 setError('Problem not found');
//             } else {
//                 setError(err.response?.data?.error || err.message || 'Failed to submit code');
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const getDifficultyColor = (difficulty: string) => {
//         switch (difficulty) {
//             case 'Easy': return 'text-green-500 bg-green-50 dark:bg-green-950';
//             case 'Medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950';
//             case 'Hard': return 'text-red-500 bg-red-50 dark:bg-red-950';
//             default: return '';
//         }
//     };

//     const getStatusDisplay = (status: string) => ({
//         color: {
//             'Accepted': 'text-green-500',
//             'Wrong Answer': 'text-red-500',
//             'Time Limit Exceeded': 'text-yellow-500',
//             'Runtime Error': 'text-red-500'
//         }[status] || 'text-gray-500',
//         icon: {
//             'Accepted': <CheckCircle size={16} />,
//             'Wrong Answer': <XCircle size={16} />,
//             'Time Limit Exceeded': <Clock size={16} />,
//             'Runtime Error': <AlertTriangle size={16} />
//         }[status] || <Info size={16} />,
//         bgColor: {
//             'Accepted': 'bg-green-50 dark:bg-green-950',
//             'Wrong Answer': 'bg-red-50 dark:bg-red-950',
//             'Time Limit Exceeded': 'bg-yellow-50 dark:bg-yellow-950',
//             'Runtime Error': 'bg-red-50 dark:bg-red-950'
//         }[status] || 'bg-gray-50 dark:bg-gray-950'
//     });

//     const formatDate = (dateString: string) => new Date(dateString).toLocaleString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//     });

//     const getCodeTemplate = (lang: string) => {
//         const templates = {
//             javascript: `function solution() {\n    // Write your solution here\n}`,
//             python: `def solution():\n    # Write your solution here\n    pass`,
//             java: `public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}`,
//             cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
//             c: `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}`
//         };
//         return templates[lang as keyof typeof templates] || '';
//     };

//     useEffect(() => {
//         if (!code) setCode(getCodeTemplate(language));
//     }, [language, code]);

//     const getFilteredSubmissions = () => {
//         switch (submissionFilter) {
//             case 'accepted':
//                 return allSubmissions.filter(sub => sub.status === 'Accepted');
//             case 'mine':
//                 return mySubmissions;
//             default:
//                 return allSubmissions;
//         }
//     };

//     const getSubmissionStats = () => {
//         const total = allSubmissions.length;
//         const accepted = allSubmissions.filter(sub => sub.status === 'Accepted').length;
//         const uniqueUsers = new Set(allSubmissions.map(sub => sub.userId._id)).size;

//         return { total, accepted, uniqueUsers };
//     };

//     const canViewSubmission = (submission: Submission) => {
//         // Users can view their own submissions or accepted submissions from others
//         if (!user) return submission.status === 'Accepted';
//         return submission.userId._id === user._id ||
//             submission.userId._id === user.id ||
//             submission.status === 'Accepted';
//     };

//     if (loading) return (
//         <div className="container max-w-6xl mx-auto p-4 py-8">
//             <div className="flex justify-center items-center min-h-[400px]">
//                 <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//             </div>
//         </div>
//     );

//     if (error) return (
//         <div className="container max-w-6xl mx-auto p-4 py-8">
//             <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
//                 <p><strong>Error:</strong> {error}</p>
//                 <p><strong>Problem ID:</strong> {problemId}</p>
//             </div>
//             <Link href="/problems"><Button variant="outline"><ArrowLeft size={16} className="mr-2" />Back</Button></Link>
//         </div>
//     );

//     if (!problem) return (
//         <div className="container max-w-6xl mx-auto p-4 py-8">
//             <div className="text-center py-8">
//                 <p className="text-muted-foreground mb-4">Problem not found</p>
//                 <Link href="/problems"><Button variant="outline"><ArrowLeft size={16} className="mr-2" />Back</Button></Link>
//             </div>
//         </div>
//     );

//     const stats = getSubmissionStats();
//     const filteredSubmissions = getFilteredSubmissions();

//     return (
//         <div className="container max-w-7xl mx-auto p-4 py-8">
//             {/* Submission Modal */}
//             {selectedSubmission && (
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//                     <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-xl font-bold">Submission Details</h2>
//                             <Button variant="ghost" onClick={() => setSelectedSubmission(null)}>
//                                 <X size={16} />
//                             </Button>
//                         </div>

//                         <div className="space-y-4">
//                             <div className="flex items-center gap-2">
//                                 <UserIcon size={16} />
//                                 <span className="font-medium">Author:</span>
//                                 <span className="flex items-center gap-1">
//                                     {selectedSubmission.userId.name}
//                                     {user && (selectedSubmission.userId._id === user._id || selectedSubmission.userId._id === user._id) && (
//                                         <Badge variant="secondary" className="text-xs">You</Badge>
//                                     )}
//                                 </span>
//                             </div>
//                             <div><span className="font-medium">Language:</span> {
//                                 PROGRAMMING_LANGUAGES.find(l => l.value === selectedSubmission.language)?.label
//                             }</div>
//                             <div>
//                                 <span className="font-medium">Status:</span>{" "}
//                                 <Badge variant="outline" className={getStatusDisplay(selectedSubmission.status).bgColor}>
//                                     <span className="flex items-center gap-1">
//                                         {getStatusDisplay(selectedSubmission.status).icon}
//                                         {selectedSubmission.status}
//                                     </span>
//                                 </Badge>
//                             </div>
//                             <div><span className="font-medium">Submitted at:</span> {formatDate(selectedSubmission.createdAt)}</div>

//                             {selectedSubmission.executionTime && (
//                                 <div><span className="font-medium">Execution time:</span> {selectedSubmission.executionTime}ms</div>
//                             )}

//                             <div>
//                                 <span className="font-medium">Code:</span>
//                                 <pre className="bg-muted p-4 rounded mt-2 overflow-auto text-sm">
//                                     {selectedSubmission.code}
//                                 </pre>
//                             </div>

//                             {selectedSubmission.output && (
//                                 <div>
//                                     <span className="font-medium">Output:</span>
//                                     <pre className="bg-muted p-4 rounded mt-2 overflow-auto text-sm">
//                                         {selectedSubmission.output}
//                                     </pre>
//                                 </div>
//                             )}

//                             {selectedSubmission.error && (
//                                 <div>
//                                     <span className="font-medium text-red-500">Error:</span>
//                                     <pre className="bg-red-50 dark:bg-red-950 p-4 rounded mt-2 overflow-auto text-sm text-red-500">
//                                         {selectedSubmission.error}
//                                     </pre>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className="mb-6">
//                 <Link href="/problems"><Button variant="outline" className="mb-4"><ArrowLeft size={16} className="mr-2" />Back</Button></Link>
//                 <div className="flex items-center gap-4 mb-4">
//                     <h1 className="text-3xl font-bold">{problem.title}</h1>
//                     <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
//                         {problem.difficulty}
//                     </Badge>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                     {problem.tags.map(tag => (
//                         <Badge key={tag} variant="outline" className="text-xs"><Tag size={12} className="mr-1" />{tag}</Badge>
//                     ))}
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div>
//                     <Tabs value={activeTab} onValueChange={setActiveTab}>
//                         <TabsList className="grid w-full grid-cols-2">
//                             <TabsTrigger value="problem">Problem</TabsTrigger>
//                             <TabsTrigger value="submissions" className="flex items-center gap-2">
//                                 <Users size={16} />
//                                 Submissions ({stats.total})
//                             </TabsTrigger>
//                         </TabsList>

//                         <TabsContent value="problem" className="space-y-6">
//                             <Card>
//                                 <CardHeader><CardTitle>Description</CardTitle></CardHeader>
//                                 <CardContent>
//                                     <div className="prose dark:prose-invert max-w-none">
//                                         <p className="whitespace-pre-wrap">{problem.description}</p>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             <Card>
//                                 <CardHeader><CardTitle>Examples</CardTitle></CardHeader>
//                                 <CardContent className="space-y-4">
//                                     {problem.examples.map((example, index) => (
//                                         <div key={index} className="border rounded-lg p-4">
//                                             <h4 className="font-medium mb-2">Example {index + 1}:</h4>
//                                             <div className="space-y-2">
//                                                 <div>
//                                                     <span className="font-medium">Input: </span>
//                                                     <code className="bg-muted px-2 py-1 rounded text-sm">{example.input}</code>
//                                                 </div>
//                                                 <div>
//                                                     <span className="font-medium">Output: </span>
//                                                     <code className="bg-muted px-2 py-1 rounded text-sm">{example.output}</code>
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

//                             <Card>
//                                 <CardHeader><CardTitle>Constraints</CardTitle></CardHeader>
//                                 <CardContent>
//                                     <div className="text-sm whitespace-pre-wrap">{problem.constraints}</div>
//                                 </CardContent>
//                             </Card>

//                             {problem.solutionApproach && (
//                                 <Card>
//                                     <CardHeader><CardTitle>Solution Approach</CardTitle></CardHeader>
//                                     <CardContent>
//                                         <div className="prose dark:prose-invert max-w-none">
//                                             <p className="whitespace-pre-wrap text-sm">{problem.solutionApproach}</p>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             )}

//                             {(problem.timeComplexity || problem.spaceComplexity) && (
//                                 <Card>
//                                     <CardHeader><CardTitle>Complexity Analysis</CardTitle></CardHeader>
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
//                             {/* Submission Statistics */}
//                             <Card>
//                                 <CardContent className="p-4">
//                                     <div className="grid grid-cols-3 gap-4 text-center">
//                                         <div>
//                                             <div className="text-2xl font-bold text-blue-500">{stats.total}</div>
//                                             <div className="text-sm text-muted-foreground">Total Submissions</div>
//                                         </div>
//                                         <div>
//                                             <div className="text-2xl font-bold text-green-500">{stats.accepted}</div>
//                                             <div className="text-sm text-muted-foreground">Accepted</div>
//                                         </div>
//                                         <div>
//                                             <div className="text-2xl font-bold text-purple-500">{stats.uniqueUsers}</div>
//                                             <div className="text-sm text-muted-foreground">Users</div>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             {/* Filter Controls */}
//                             <div className="flex gap-2 flex-wrap">
//                                 <Button
//                                     variant={submissionFilter === 'all' ? 'default' : 'outline'}
//                                     size="sm"
//                                     onClick={() => setSubmissionFilter('all')}
//                                 >
//                                     All ({allSubmissions.length})
//                                 </Button>
//                                 <Button
//                                     variant={submissionFilter === 'accepted' ? 'default' : 'outline'}
//                                     size="sm"
//                                     onClick={() => setSubmissionFilter('accepted')}
//                                     className="text-green-600"
//                                 >
//                                     <Trophy size={14} className="mr-1" />
//                                     Accepted ({stats.accepted})
//                                 </Button>
//                                 {user && mySubmissions.length > 0 && (
//                                     <Button
//                                         variant={submissionFilter === 'mine' ? 'default' : 'outline'}
//                                         size="sm"
//                                         onClick={() => setSubmissionFilter('mine')}
//                                     >
//                                         <UserIcon size={14} className="mr-1" />
//                                         My Submissions ({mySubmissions.length})
//                                     </Button>
//                                 )}
//                             </div>

//                             {/* Submissions List */}
//                             {filteredSubmissions.length === 0 ? (
//                                 <div className="text-center py-8 text-muted-foreground">
//                                     {submissionFilter === 'mine' ?
//                                         'You haven\'t submitted any solutions yet.' :
//                                         'No submissions found for this filter.'
//                                     }
//                                 </div>
//                             ) : (
//                                 <div className="space-y-3">
//                                     {filteredSubmissions
//                                         .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//                                         .map((submission) => {
//                                             const statusDisplay = getStatusDisplay(submission.status);
//                                             const isMySubmission = user && (submission.userId._id === user._id || submission.userId._id === user.id);

//                                             return (
//                                                 <Card key={submission._id} className={isMySubmission ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}>
//                                                     <CardContent className="p-4">
//                                                         <div className="flex items-center justify-between mb-2">
//                                                             <div className="flex items-center gap-2">
//                                                                 <Badge variant="outline" className={`${statusDisplay.color} ${statusDisplay.bgColor}`}>
//                                                                     {statusDisplay.icon}
//                                                                     <span className="ml-1">{submission.status}</span>
//                                                                 </Badge>
//                                                                 <Badge variant="outline">
//                                                                     {PROGRAMMING_LANGUAGES.find(l => l.value === submission.language)?.label}
//                                                                 </Badge>
//                                                                 <span className="text-sm text-muted-foreground flex items-center gap-1">
//                                                                     <UserIcon size={14} />
//                                                                     {submission.userId.name}
//                                                                     {isMySubmission && (
//                                                                         <Badge variant="secondary" className="text-xs ml-1">You</Badge>
//                                                                     )}
//                                                                 </span>
//                                                             </div>
//                                                             <div className="flex items-center gap-2">
//                                                                 <span className="text-sm text-muted-foreground">
//                                                                     {formatDate(submission.createdAt)}
//                                                                 </span>
//                                                                 {canViewSubmission(submission) && (
//                                                                     <Button
//                                                                         variant="outline"
//                                                                         size="sm"
//                                                                         onClick={() => setSelectedSubmission(submission)}
//                                                                     >
//                                                                         <Eye size={14} className="mr-1" />
//                                                                         View Code
//                                                                     </Button>
//                                                                 )}
//                                                             </div>
//                                                         </div>

//                                                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                                                             {submission.executionTime && (
//                                                                 <span>⏱️ {submission.executionTime}ms</span>
//                                                             )}
//                                                             {submission.status === 'Accepted' && (
//                                                                 <span className="text-green-600 flex items-center gap-1">
//                                                                     <Trophy size={12} />
//                                                                     Accepted Solution
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                     </CardContent>
//                                                 </Card>
//                                             );
//                                         })}
//                                 </div>
//                             )}
//                         </TabsContent>
//                     </Tabs>
//                 </div>

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
//                                     </Link>{' '}
//                                     to submit solutions.
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
//     Archive,
//     X,
//     Users,
//     User
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
//     userId: {
//         name: string;
//         email: string;
//     },
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

//     const problemId = params?.id as string;
//     const [problem, setProblem] = useState<CodingProblem | null>(null);
//     const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
//     const [userSubmissions, setUserSubmissions] = useState<Submission[]>([]);
//     const [code, setCode] = useState('');
//     const [language, setLanguage] = useState('javascript');
//     const [loading, setLoading] = useState(true);
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [activeTab, setActiveTab] = useState('problem');
//     const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
//     const [submissionFilter, setSubmissionFilter] = useState<'all' | 'mine'>('all');

//     useEffect(() => {
//         const testAPI = async () => {
//             try {
//                 const response = await apiClient.getAllProblems();
//                 console.log('All problems response:', response);
//             } catch (err) {
//                 console.error('API test failed:', err);
//             }
//         };
//         testAPI();
//     }, []);

//     useEffect(() => {
//         const fetchProblem = async () => {
//             if (!problemId) {
//                 setError('No problem ID provided');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 setLoading(true);
//                 setError(null);
//                 const response = await apiClient.getProblem(problemId);
//                 const problemData = response.data?.data || response.data || response;
//                 setProblem(problemData);
//             } catch (err: unknown) {
//                 console.error('Error fetching problem:', err);
//                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                 if ((err as any).response?.status === 404) {
//                     setError('Problem not found');
//                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                 } else if ((err as any).response?.status === 401) {
//                     setError('Authentication required');
//                 } else {
//                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                     setError((err as any).response?.data?.error || (err as Error).message || 'Failed to fetch problem');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProblem();
//     }, [problemId]);

//     useEffect(() => {
//         if (!problemId) return;

//         const fetchAllSubmissions = async () => {
//             try {
//                 // Fetch all submissions for this problem (from all users)
//                 const { data } = await apiClient.getSubmissions({
//                     problemId,
//                     allUsers: true // Add this parameter to indicate we want all user submissions
//                 });
//                 const submissions = data.data || [];
//                 setAllSubmissions(submissions);

//                 // Filter user's own submissions if user is logged in
//                 if (user) {
//                     const userSubs = submissions.filter((sub: Submission) =>
//                         sub.userId.email === user.email || sub.userId._id === user._id
//                     );
//                     setUserSubmissions(userSubs);
//                 }
//             } catch (error) {
//                 console.error('Error fetching submissions:', error);
//                 // Fallback to original API call if the new parameter is not supported
//                 try {
//                     const { data } = await apiClient.getSubmissions({ problemId });
//                     const submissions = data.data || [];
//                     setAllSubmissions(submissions);
//                     setUserSubmissions(submissions);
//                 } catch (fallbackError) {
//                     console.error('Error fetching submissions (fallback):', fallbackError);
//                 }
//             }
//         };

//         fetchAllSubmissions();
//     }, [user, problemId]);

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
//             await apiClient.submitSolution(problemId, { code, language });

//             // Refresh all submissions after successful submission
//             const submissionsResponse = await apiClient.getSubmissions({
//                 problemId,
//                 allUsers: true
//             });
//             const submissions = submissionsResponse.data.data || [];
//             setAllSubmissions(submissions);

//             if (user) {
//                 const userSubs = submissions.filter((sub: Submission) =>
//                     sub.userId.email === user.email || sub.userId._id === user._id
//                 );
//                 setUserSubmissions(userSubs);
//             }

//             setActiveTab('submissions');
//         } catch (err: any) {
//             console.error('Submission error:', err);
//             if (err.response?.status === 401) {
//                 setError('Authentication failed. Please login again.');
//             } else if (err.response?.status === 404) {
//                 setError('Problem not found');
//             } else {
//                 setError(err.response?.data?.error || err.message || 'Failed to submit code');
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const getDifficultyColor = (difficulty: string) => {
//         switch (difficulty) {
//             case 'Easy': return 'text-green-500 bg-green-50 dark:bg-green-950';
//             case 'Medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950';
//             case 'Hard': return 'text-red-500 bg-red-50 dark:bg-red-950';
//             default: return '';
//         }
//     };

//     const getStatusDisplay = (status: string) => ({
//         color: {
//             'Accepted': 'text-green-500',
//             'Wrong Answer': 'text-red-500',
//             'Time Limit Exceeded': 'text-yellow-500',
//             'Runtime Error': 'text-red-500'
//         }[status] || 'text-gray-500',
//         icon: {
//             'Accepted': <CheckCircle size={16} />,
//             'Wrong Answer': <XCircle size={16} />,
//             'Time Limit Exceeded': <Clock size={16} />,
//             'Runtime Error': <AlertTriangle size={16} />
//         }[status] || <Info size={16} />,
//         bgColor: {
//             'Accepted': 'bg-green-50 dark:bg-green-950',
//             'Wrong Answer': 'bg-red-50 dark:bg-red-950',
//             'Time Limit Exceeded': 'bg-yellow-50 dark:bg-yellow-950',
//             'Runtime Error': 'bg-red-50 dark:bg-red-950'
//         }[status] || 'bg-gray-50 dark:bg-gray-950'
//     });

//     const formatDate = (dateString: string) => new Date(dateString).toLocaleString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//     });

//     const getCodeTemplate = (lang: string) => {
//         const templates = {
//             javascript: `function solution() {\n    // Write your solution here\n}`,
//             python: `def solution():\n    # Write your solution here\n    pass`,
//             java: `public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}`,
//             cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
//             c: `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}`
//         };
//         return templates[lang as keyof typeof templates] || '';
//     };

//     useEffect(() => {
//         if (!code) setCode(getCodeTemplate(language));
//     }, [language, code]);

//     // Get submissions to display based on filter
//     const getDisplayedSubmissions = () => {
//         if (submissionFilter === 'mine') {
//             return userSubmissions;
//         }
//         return allSubmissions;
//     };

//     // Check if user owns a submission
//     const isMySubmission = (submission: Submission) => {
//         if (!user) return false;
//         return submission.userId.email === user.email || submission.userId._id === user._id;
//     };

//     const displayedSubmissions = getDisplayedSubmissions();
//     const totalSubmissions = allSubmissions.length;
//     const mySubmissions = userSubmissions.length;

//     if (loading) return (
//         <div className="container max-w-6xl mx-auto p-4 py-8">
//             <div className="flex justify-center items-center min-h-[400px]">
//                 <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//             </div>
//         </div>
//     );

//     if (error) return (
//         <div className="container max-w-6xl mx-auto p-4 py-8">
//             <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
//                 <p><strong>Error:</strong> {error}</p>
//                 <p><strong>Problem ID:</strong> {problemId}</p>
//             </div>
//             <Link href="/problems"><Button variant="outline"><ArrowLeft size={16} className="mr-2" />Back</Button></Link>
//         </div>
//     );

//     if (!problem) return (
//         <div className="container max-w-6xl mx-auto p-4 py-8">
//             <div className="text-center py-8">
//                 <p className="text-muted-foreground mb-4">Problem not found</p>
//                 <Link href="/problems"><Button variant="outline"><ArrowLeft size={16} className="mr-2" />Back</Button></Link>
//             </div>
//         </div>
//     );

//     return (
//         <div className="container max-w-7xl mx-auto p-4 py-8">
//             {/* Submission Modal */}
//             {selectedSubmission && (
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//                     <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
//                         <div className="flex justify-between items-center mb-4">
//                             <div className="flex items-center gap-2">
//                                 <h2 className="text-xl font-bold">Submission Details</h2>
//                                 {isMySubmission(selectedSubmission) && (
//                                     <Badge variant="outline" className="text-blue-500 bg-blue-50 dark:bg-blue-950">
//                                         <User size={12} className="mr-1" />
//                                         Your Submission
//                                     </Badge>
//                                 )}
//                             </div>
//                             <Button variant="ghost" onClick={() => setSelectedSubmission(null)}>
//                                 <X size={16} />
//                             </Button>
//                         </div>

//                         <div className="space-y-4">
//                             <div><span className="font-medium">Author:</span> {selectedSubmission.userId.name}</div>
//                             <div><span className="font-medium">Language:</span> {
//                                 PROGRAMMING_LANGUAGES.find(l => l.value === selectedSubmission.language)?.label
//                             }</div>
//                             <div>
//                                 <span className="font-medium">Status:</span>{" "}
//                                 <Badge variant="outline" className={getStatusDisplay(selectedSubmission.status).bgColor}>
//                                     {selectedSubmission.status}
//                                 </Badge>
//                             </div>
//                             <div><span className="font-medium">Submitted at:</span> {formatDate(selectedSubmission.createdAt)}</div>

//                             <div>
//                                 <span className="font-medium">Code:</span>
//                                 <pre className="bg-muted p-4 rounded mt-2 overflow-auto text-sm">
//                                     {selectedSubmission.code}
//                                 </pre>
//                             </div>

//                             {selectedSubmission.output && (
//                                 <div>
//                                     <span className="font-medium">Output:</span>
//                                     <pre className="bg-muted p-4 rounded mt-2 overflow-auto text-sm">
//                                         {selectedSubmission.output}
//                                     </pre>
//                                 </div>
//                             )}

//                             {selectedSubmission.error && (
//                                 <div>
//                                     <span className="font-medium text-red-500">Error:</span>
//                                     <pre className="bg-red-50 dark:bg-red-950 p-4 rounded mt-2 overflow-auto text-sm text-red-500">
//                                         {selectedSubmission.error}
//                                     </pre>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className="mb-6">
//                 <Link href="/problems"><Button variant="outline" className="mb-4"><ArrowLeft size={16} className="mr-2" />Back</Button></Link>
//                 <div className="flex items-center gap-4 mb-4">
//                     <h1 className="text-3xl font-bold">{problem.title}</h1>
//                     <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
//                         {problem.difficulty}
//                     </Badge>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                     {problem.tags.map(tag => (
//                         <Badge key={tag} variant="outline" className="text-xs"><Tag size={12} className="mr-1" />{tag}</Badge>
//                     ))}
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div>
//                     <Tabs value={activeTab} onValueChange={setActiveTab}>
//                         <TabsList className="grid w-full grid-cols-2">
//                             <TabsTrigger value="problem">Problem</TabsTrigger>
//                             <TabsTrigger value="submissions">
//                                 Submissions ({submissionFilter === 'all' ? totalSubmissions : mySubmissions})
//                             </TabsTrigger>
//                         </TabsList>

//                         <TabsContent value="problem" className="space-y-6">
//                             <Card>
//                                 <CardHeader><CardTitle>Description</CardTitle></CardHeader>
//                                 <CardContent>
//                                     <div className="prose dark:prose-invert max-w-none">
//                                         <p className="whitespace-pre-wrap">{problem.description}</p>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             <Card>
//                                 <CardHeader><CardTitle>Examples</CardTitle></CardHeader>
//                                 <CardContent className="space-y-4">
//                                     {problem.examples.map((example, index) => (
//                                         <div key={index} className="border rounded-lg p-4">
//                                             <h4 className="font-medium mb-2">Example {index + 1}:</h4>
//                                             <div className="space-y-2">
//                                                 <div>
//                                                     <span className="font-medium">Input: </span>
//                                                     <code className="bg-muted px-2 py-1 rounded text-sm">{example.input}</code>
//                                                 </div>
//                                                 <div>
//                                                     <span className="font-medium">Output: </span>
//                                                     <code className="bg-muted px-2 py-1 rounded text-sm">{example.output}</code>
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

//                             <Card>
//                                 <CardHeader><CardTitle>Constraints</CardTitle></CardHeader>
//                                 <CardContent>
//                                     <div className="text-sm whitespace-pre-wrap">{problem.constraints}</div>
//                                 </CardContent>
//                             </Card>

//                             {problem.solutionApproach && (
//                                 <Card>
//                                     <CardHeader><CardTitle>Solution Approach</CardTitle></CardHeader>
//                                     <CardContent>
//                                         <div className="prose dark:prose-invert max-w-none">
//                                             <p className="whitespace-pre-wrap text-sm">{problem.solutionApproach}</p>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             )}

//                             {(problem.timeComplexity || problem.spaceComplexity) && (
//                                 <Card>
//                                     <CardHeader><CardTitle>Complexity Analysis</CardTitle></CardHeader>
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
//                             {/* Submission Filter */}
//                             <div className="flex justify-between items-center">
//                                 <div className="flex items-center gap-2">
//                                     <Button
//                                         variant={submissionFilter === 'all' ? 'default' : 'outline'}
//                                         size="sm"
//                                         onClick={() => setSubmissionFilter('all')}
//                                         className="flex items-center gap-1"
//                                     >
//                                         <Users size={14} />
//                                         All ({totalSubmissions})
//                                     </Button>
//                                     {user && (
//                                         <Button
//                                             variant={submissionFilter === 'mine' ? 'default' : 'outline'}
//                                             size="sm"
//                                             onClick={() => setSubmissionFilter('mine')}
//                                             className="flex items-center gap-1"
//                                         >
//                                             <User size={14} />
//                                             Mine ({mySubmissions})
//                                         </Button>
//                                     )}
//                                 </div>
//                             </div>

//                             {displayedSubmissions.length === 0 ? (
//                                 <div className="text-center py-8 text-muted-foreground">
//                                     {submissionFilter === 'mine'
//                                         ? "You haven't submitted any solutions yet."
//                                         : "No submissions yet. Submit your solution to see results."
//                                     }
//                                 </div>
//                             ) : (
//                                 <div className="space-y-3">
//                                     {displayedSubmissions.map((submission) => {
//                                         const statusDisplay = getStatusDisplay(submission.status);
//                                         const isOwn = isMySubmission(submission);

//                                         return (
//                                             <Card key={submission._id} className={isOwn ? 'ring-1 ring-blue-200 dark:ring-blue-800' : ''}>
//                                                 <CardContent className="p-4">
//                                                     <div className="flex items-center justify-between mb-2">
//                                                         <div className="flex items-center gap-2 flex-wrap">
//                                                             <Badge variant="outline" className={`${statusDisplay.color} ${statusDisplay.bgColor}`}>
//                                                                 {statusDisplay.icon}
//                                                                 <span className="ml-1">{submission.status}</span>
//                                                             </Badge>
//                                                             <Badge variant="outline">
//                                                                 {PROGRAMMING_LANGUAGES.find(l => l.value === submission.language)?.label}
//                                                             </Badge>
//                                                             <span className="text-sm text-muted-foreground flex items-center gap-1">
//                                                                 by {submission.userId.name}
//                                                                 {isOwn && (
//                                                                     <Badge variant="outline" className="text-xs text-blue-500 bg-blue-50 dark:bg-blue-950">
//                                                                         You
//                                                                     </Badge>
//                                                                 )}
//                                                             </span>
//                                                         </div>
//                                                         <div className="flex items-center gap-2">
//                                                             <span className="text-sm text-muted-foreground">
//                                                                 {formatDate(submission.createdAt)}
//                                                             </span>
//                                                             <Button
//                                                                 variant="outline"
//                                                                 size="sm"
//                                                                 onClick={() => setSelectedSubmission(submission)}
//                                                             >
//                                                                 View Code
//                                                             </Button>
//                                                         </div>
//                                                     </div>

//                                                     {submission.executionTime && (
//                                                         <div className="text-sm text-muted-foreground mb-2">
//                                                             Execution time: {submission.executionTime}ms
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
//                                     </Link>{' '}
//                                     to submit solutions.
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
import { Alert, AlertDescription } from '@/components/ui/alert';
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
    X,
    Users,
    User,
    Zap,
    Target,
    BookOpen,
    Activity,
    Trophy,
    Monitor
} from 'lucide-react';
import Link from 'next/link';

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
    userId: {
        name: string;
        email: string;
    },
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
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚡' },
    { value: 'c', label: 'C', icon: '🔧' },
];

export default function ProblemPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const problemId = params?.id as string;
    const [problem, setProblem] = useState<CodingProblem | null>(null);
    const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
    const [userSubmissions, setUserSubmissions] = useState<Submission[]>([]);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('problem');
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [submissionFilter, setSubmissionFilter] = useState<'all' | 'mine'>('all');
    const [showValidationWarning, setShowValidationWarning] = useState(false);

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
            } catch (err: unknown) {
                console.error('Error fetching problem:', err);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((err as any).response?.status === 404) {
                    setError('Problem not found');
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } else if ((err as any).response?.status === 401) {
                    setError('Authentication required');
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setError((err as any).response?.data?.error || (err as Error).message || 'Failed to fetch problem');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [problemId]);

    useEffect(() => {
        if (!problemId) return;

        const fetchAllSubmissions = async () => {
            try {
                // Fetch all submissions for this problem (from all users)
                const { data } = await apiClient.getSubmissions({
                    problemId,
                    allUsers: true // Add this parameter to indicate we want all user submissions
                });
                const submissions = data.data || [];
                setAllSubmissions(submissions);

                // Filter user's own submissions if user is logged in
                if (user) {
                    const userSubs = submissions.filter((sub: Submission) =>
                        sub.userId.email === user.email || sub.userId._id === user._id
                    );
                    setUserSubmissions(userSubs);
                }
            } catch (error) {
                console.error('Error fetching submissions:', error);
                // Fallback to original API call if the new parameter is not supported
                try {
                    const { data } = await apiClient.getSubmissions({ problemId });
                    const submissions = data.data || [];
                    setAllSubmissions(submissions);
                    setUserSubmissions(submissions);
                } catch (fallbackError) {
                    console.error('Error fetching submissions (fallback):', fallbackError);
                }
            }
        };

        fetchAllSubmissions();
    }, [user, problemId]);

    const handleSubmit = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (!code.trim() || code.trim() === getCodeTemplate(language).trim()) {
            setShowValidationWarning(true);
            setError('Please enter your code before submitting');
            setTimeout(() => setShowValidationWarning(false), 3000);
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            setShowValidationWarning(false);
            await apiClient.submitSolution(problemId, { code, language });

            // Refresh all submissions after successful submission
            const submissionsResponse = await apiClient.getSubmissions({
                problemId,
                allUsers: true
            });
            const submissions = submissionsResponse.data.data || [];
            setAllSubmissions(submissions);

            if (user) {
                const userSubs = submissions.filter((sub: Submission) =>
                    sub.userId.email === user.email || sub.userId._id === user._id
                );
                setUserSubmissions(userSubs);
            }

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
            case 'Easy': return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800';
            case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800';
            case 'Hard': return 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800';
            default: return '';
        }
    };

    const getStatusDisplay = (status: string) => ({
        color: {
            'Accepted': 'text-emerald-600 dark:text-emerald-400',
            'Wrong Answer': 'text-rose-600 dark:text-rose-400',
            'Time Limit Exceeded': 'text-amber-600 dark:text-amber-400',
            'Runtime Error': 'text-red-600 dark:text-red-400'
        }[status] || 'text-slate-500',
        icon: {
            'Accepted': <CheckCircle size={16} />,
            'Wrong Answer': <XCircle size={16} />,
            'Time Limit Exceeded': <Clock size={16} />,
            'Runtime Error': <AlertTriangle size={16} />
        }[status] || <Info size={16} />,
        bgColor: {
            'Accepted': 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800',
            'Wrong Answer': 'bg-rose-50 border-rose-200 dark:bg-rose-950 dark:border-rose-800',
            'Time Limit Exceeded': 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800',
            'Runtime Error': 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
        }[status] || 'bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800'
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

    // Get submissions to display based on filter
    const getDisplayedSubmissions = () => {
        if (submissionFilter === 'mine') {
            return userSubmissions;
        }
        return allSubmissions;
    };

    // Check if user owns a submission
    const isMySubmission = (submission: Submission) => {
        if (!user) return false;
        return submission.userId.email === user.email || submission.userId._id === user._id;
    };

    const displayedSubmissions = getDisplayedSubmissions();
    const totalSubmissions = allSubmissions.length;
    const mySubmissions = userSubmissions.length;

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="container max-w-7xl mx-auto p-4 py-8">
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
                            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">Loading problem...</p>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="container max-w-7xl mx-auto p-4 py-8">
                <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Error Loading Problem</h3>
                        </div>
                        <p className="text-red-700 dark:text-red-300 mb-2"><strong>Error:</strong> {error}</p>
                        <p className="text-red-600 dark:text-red-400 text-sm mb-4"><strong>Problem ID:</strong> {problemId}</p>
                        <Link href="/problems">
                            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300">
                                <ArrowLeft size={16} className="mr-2" />Back to Problems
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    if (!problem) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="container max-w-7xl mx-auto p-4 py-8">
                <div className="text-center py-12">
                    <div className="mb-6">
                        <Archive className="mx-auto text-slate-400 dark:text-slate-600" size={64} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Problem Not Found</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">The problem you're looking for doesn't exist or has been removed.</p>
                    <Link href="/problems">
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            <ArrowLeft size={16} className="mr-2" />Back to Problems
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            {/* Submission Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <Monitor className="text-blue-600 dark:text-blue-400" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Submission Details</h2>
                                    {isMySubmission(selectedSubmission) && (
                                        <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800 mt-1">
                                            <User size={12} className="mr-1" />
                                            Your Submission
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <Button variant="ghost" onClick={() => setSelectedSubmission(null)} className="hover:bg-slate-100 dark:hover:bg-slate-800">
                                <X size={20} />
                            </Button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <User className="text-slate-500" size={16} />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Author:</span>
                                        <span className="text-slate-600 dark:text-slate-400">{selectedSubmission.userId.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Code className="text-slate-500" size={16} />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Language:</span>
                                        <Badge variant="outline" className="border-slate-300 dark:border-slate-600">
                                            {PROGRAMMING_LANGUAGES.find(l => l.value === selectedSubmission.language)?.icon}{' '}
                                            {PROGRAMMING_LANGUAGES.find(l => l.value === selectedSubmission.language)?.label}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Activity className="text-slate-500" size={16} />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Status:</span>
                                        <Badge variant="outline" className={`${getStatusDisplay(selectedSubmission.status).bgColor} ${getStatusDisplay(selectedSubmission.status).color} border`}>
                                            {getStatusDisplay(selectedSubmission.status).icon}
                                            <span className="ml-2">{selectedSubmission.status}</span>
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="text-slate-500" size={16} />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Submitted:</span>
                                        <span className="text-slate-600 dark:text-slate-400 text-sm">{formatDate(selectedSubmission.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Code className="text-slate-600 dark:text-slate-400" size={16} />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Code Solution</span>
                                </div>
                                <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                    <pre className="text-slate-100 dark:text-slate-300 text-sm overflow-auto font-mono leading-relaxed">
                                        {selectedSubmission.code}
                                    </pre>
                                </div>
                            </div>

                            {selectedSubmission.output && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Target className="text-green-600 dark:text-green-400" size={16} />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Output</span>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-950 rounded-xl p-4 border border-green-200 dark:border-green-800">
                                        <pre className="text-green-800 dark:text-green-300 text-sm overflow-auto font-mono">
                                            {selectedSubmission.output}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {selectedSubmission.error && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertTriangle className="text-red-600 dark:text-red-400" size={16} />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Error Details</span>
                                    </div>
                                    <div className="bg-red-50 dark:bg-red-950 rounded-xl p-4 border border-red-200 dark:border-red-800">
                                        <pre className="text-red-800 dark:text-red-300 text-sm overflow-auto font-mono">
                                            {selectedSubmission.error}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="container max-w-7xl mx-auto p-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <Link href="/problems">
                        <Button variant="outline" className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800">
                            <ArrowLeft size={16} className="mr-2" />Back to Problems
                        </Button>
                    </Link>

                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                                        {problem.title}
                                    </h1>
                                    <Badge variant="outline" className={`${getDifficultyColor(problem.difficulty)} border font-medium px-3 py-1`}>
                                        {problem.difficulty === 'Easy' && <Zap size={14} className="mr-1" />}
                                        {problem.difficulty === 'Medium' && <Target size={14} className="mr-1" />}
                                        {problem.difficulty === 'Hard' && <Trophy size={14} className="mr-1" />}
                                        {problem.difficulty}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {problem.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                            <Tag size={12} className="mr-1" />{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Panel */}
                    <div className="space-y-6">
                        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                    <TabsTrigger value="problem" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-lg font-medium">
                                        <BookOpen size={16} />
                                        Problem
                                    </TabsTrigger>
                                    <TabsTrigger value="submissions" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-lg font-medium">
                                        <Activity size={16} />
                                        Submissions ({submissionFilter === 'all' ? totalSubmissions : mySubmissions})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="problem" className="space-y-6 mt-6">
                                    <CardContent className="space-y-6 p-0">
                                        {/* Description */}
                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                                                <Info className="text-blue-600 dark:text-blue-400" size={20} />
                                                Description
                                            </h3>
                                            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                                                <p className="whitespace-pre-wrap leading-relaxed">{problem.description}</p>
                                            </div>
                                        </div>

                                        {/* Examples */}
                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                                                <Target className="text-green-600 dark:text-green-400" size={20} />
                                                Examples
                                            </h3>
                                            <div className="space-y-4">
                                                {problem.examples.map((example, index) => (
                                                    <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                                        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Example {index + 1}:</h4>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <span className="font-medium text-slate-700 dark:text-slate-300">Input: </span>
                                                                <code className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md text-sm font-mono text-slate-800 dark:text-slate-200">
                                                                    {example.input}
                                                                </code>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-slate-700 dark:text-slate-300">Output: </span>
                                                                <code className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md text-sm font-mono text-slate-800 dark:text-slate-200">
                                                                    {example.output}
                                                                </code>
                                                            </div>
                                                            {example.explanation && (
                                                                <div>
                                                                    <span className="font-medium text-slate-700 dark:text-slate-300">Explanation: </span>
                                                                    <span className="text-sm text-slate-600 dark:text-slate-400">{example.explanation}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Constraints */}
                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                                                <AlertTriangle className="text-amber-600 dark:text-amber-400" size={20} />
                                                Constraints
                                            </h3>
                                            <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                                {problem.constraints}
                                            </div>
                                        </div>

                                        {/* Solution Approach */}
                                        {problem.solutionApproach && (
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                                                    <BookOpen className="text-purple-600 dark:text-purple-400" size={20} />
                                                    Solution Approach
                                                </h3>
                                                <div className="prose dark:prose-invert max-w-none">
                                                    <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                                        {problem.solutionApproach}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Complexity Analysis */}
                                        {(problem.timeComplexity || problem.spaceComplexity) && (
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                                                    <Activity className="text-indigo-600 dark:text-indigo-400" size={20} />
                                                    Complexity Analysis
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {problem.timeComplexity && (
                                                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Clock size={16} className="text-blue-500" />
                                                                <span className="font-medium text-slate-700 dark:text-slate-300">Time Complexity</span>
                                                            </div>
                                                            <code className="bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-md text-sm font-mono block">
                                                                {problem.timeComplexity}
                                                            </code>
                                                        </div>
                                                    )}
                                                    {problem.spaceComplexity && (
                                                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Archive size={16} className="text-purple-500" />
                                                                <span className="font-medium text-slate-700 dark:text-slate-300">Space Complexity</span>
                                                            </div>
                                                            <code className="bg-purple-50 dark:bg-purple-950 text-purple-800 dark:text-purple-200 px-3 py-2 rounded-md text-sm font-mono block">
                                                                {problem.spaceComplexity}
                                                            </code>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </TabsContent>

                                <TabsContent value="submissions" className="space-y-6 mt-6">
                                    <CardContent className="p-0">
                                        {/* Submission Filter */}
                                        <div className="flex justify-between items-center mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant={submissionFilter === 'all' ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setSubmissionFilter('all')}
                                                    className={`flex items-center gap-2 ${submissionFilter === 'all'
                                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                                                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                                >
                                                    <Users size={14} />
                                                    All Submissions ({totalSubmissions})
                                                </Button>
                                                {user && (
                                                    <Button
                                                        variant={submissionFilter === 'mine' ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => setSubmissionFilter('mine')}
                                                        className={`flex items-center gap-2 ${submissionFilter === 'mine'
                                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                                                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                                    >
                                                        <User size={14} />
                                                        My Submissions ({mySubmissions})
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {displayedSubmissions.length === 0 ? (
                                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                                <div className="mb-4">
                                                    <Archive className="mx-auto text-slate-400 dark:text-slate-600" size={48} />
                                                </div>
                                                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No Submissions Yet</h3>
                                                <p className="text-slate-500 dark:text-slate-400">
                                                    {submissionFilter === 'mine'
                                                        ? "You haven't submitted any solutions yet. Try solving this problem!"
                                                        : "No one has submitted a solution yet. Be the first to solve it!"
                                                    }
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {displayedSubmissions.map((submission) => {
                                                    const statusDisplay = getStatusDisplay(submission.status);
                                                    const isOwn = isMySubmission(submission);

                                                    return (
                                                        <div key={submission._id} className={`bg-white dark:bg-slate-900 rounded-xl border transition-all hover:shadow-md ${isOwn
                                                                ? 'border-blue-200 dark:border-blue-800 ring-1 ring-blue-100 dark:ring-blue-900'
                                                                : 'border-slate-200 dark:border-slate-700'
                                                            }`}>
                                                            <div className="p-5">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <div className="flex items-center gap-3 flex-wrap">
                                                                        <Badge variant="outline" className={`${statusDisplay.color} ${statusDisplay.bgColor} border font-medium px-3 py-1`}>
                                                                            {statusDisplay.icon}
                                                                            <span className="ml-2">{submission.status}</span>
                                                                        </Badge>
                                                                        <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                                                                            {PROGRAMMING_LANGUAGES.find(l => l.value === submission.language)?.icon}{' '}
                                                                            {PROGRAMMING_LANGUAGES.find(l => l.value === submission.language)?.label}
                                                                        </Badge>
                                                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                                            <User size={14} />
                                                                            <span>by {submission.userId.name}</span>
                                                                            {isOwn && (
                                                                                <Badge variant="outline" className="text-xs text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800">
                                                                                    You
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                                                            {formatDate(submission.createdAt)}
                                                                        </span>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => setSelectedSubmission(submission)}
                                                                            className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                                        >
                                                                            <Monitor size={14} className="mr-1" />
                                                                            View Code
                                                                        </Button>
                                                                    </div>
                                                                </div>

                                                                {submission.executionTime && (
                                                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                                        <Clock size={14} />
                                                                        <span>Execution time: {submission.executionTime}ms</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </CardContent>
                                </TabsContent>
                            </Tabs>
                        </Card>
                    </div>

                    {/* Right Panel - Code Editor */}
                    <div className="space-y-6">
                        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                                        <Code size={20} className="text-white" />
                                    </div>
                                    <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                                        Code Solution
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Language selector */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block flex items-center gap-2">
                                        <Tag size={14} />
                                        Programming Language
                                    </label>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                                            {PROGRAMMING_LANGUAGES.map(lang => (
                                                <SelectItem key={lang.value} value={lang.value} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                                    <span className="flex items-center gap-2">
                                                        {lang.icon} {lang.label}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Code editor */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block flex items-center gap-2">
                                        <Code size={14} />
                                        Your Solution
                                    </label>
                                    <div className="relative">
                                        <Textarea
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className={`font-mono text-sm min-h-96 resize-none bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${showValidationWarning ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''
                                                }`}
                                            placeholder="Write your solution here..."
                                        />
                                        {showValidationWarning && (
                                            <div className="absolute -bottom-1 left-0 right-0 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-b-lg px-3 py-2">
                                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                                    <AlertTriangle size={14} />
                                                    <span>Please enter your code before submitting</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Error message */}
                                {error && !showValidationWarning && (
                                    <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        <AlertDescription className="text-red-800 dark:text-red-200">
                                            {error}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Submit button */}
                                <div className="pt-2">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={submitting || !user}
                                        className={`w-full h-12 text-base font-semibold transition-all duration-200 ${user
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                                                : 'bg-slate-400 dark:bg-slate-600'
                                            }`}
                                    >
                                        {submitting ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Submitting Solution...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                {user ? <Play size={18} /> : <User size={18} />}
                                                <span>{user ? 'Submit Solution' : 'Login to Submit'}</span>
                                            </div>
                                        )}
                                    </Button>
                                </div>

                                {!user && (
                                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            You need to{' '}
                                            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline underline-offset-2">
                                                login
                                            </Link>{' '}
                                            to submit solutions and track your progress.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}