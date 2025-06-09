// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { useRouter } from 'next/navigation';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Clock, Code, MoreVertical, Search, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
// import apiClient from '@/lib/api';

// interface Submission {
//     _id: string;
//     userId: string;
//     problemId: {
//         _id: string;
//         title: string;
//     };
//     code: string;
//     language: string;
//     status: 'Pending' | 'Accepted' | 'Rejected';
//     feedback?: string;
//     createdAt: string;
//     updatedAt: string;
// }

// export default function SubmissionsPage() {
//     const router = useRouter();
//     const { user, isLoading: authLoading } = useAuth();
//     const [submissions, setSubmissions] = useState<Submission[]>([]);
//     const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [activeFilter, setActiveFilter] = useState('all');

//     useEffect(() => {
//         // 1. If we're still checking auth status, do nothing.
//         if (authLoading) return;

//         // 2. Once authLoading is false:
//         if (!user) {
//             // no user → send to login
//             router.push('/login');
//         } else {
//             // we have a user → grab their submissions
//             fetchSubmissions();
//         }
//     }, [authLoading, user, router]);


//     const fetchSubmissions = async () => {
//         try {
//             setIsLoading(true);
//             setError(null);

//             // FIXED: Changed from getSubmissions to getUserSubmissions
//             const response = await apiClient.getUserSubmissions({
//                 status: activeFilter !== 'all' ? activeFilter : undefined
//             });

//             console.log('Submissions data:', response.data);

//             if (response.data && response.data.data) {
//                 const formattedSubmissions = response.data.data.map((sub: any) => ({
//                     ...sub,
//                     // Keep the original structure for compatibility
//                     problemTitle: sub.problemId?.title || 'Unknown Problem'
//                 }));
//                 setSubmissions(formattedSubmissions);
//                 setFilteredSubmissions(formattedSubmissions);
//             } else {
//                 setSubmissions([]);
//                 setFilteredSubmissions([]);
//             }
//         } catch (err: any) {
//             console.error('Error fetching submissions:', err);
//             setError(err.response?.data?.error || err.message || 'Failed to fetch submissions');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Filter submissions based on search
//     useEffect(() => {
//         if (!Array.isArray(submissions)) {
//             setFilteredSubmissions([]);
//             return;
//         }

//         let filtered = submissions;

//         // Apply search filter
//         if (searchQuery) {
//             filtered = filtered.filter(submission =>
//                 submission.problemTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 submission.problemId?.title?.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }

//         setFilteredSubmissions(filtered);
//     }, [submissions, searchQuery]);

//     // Format date
//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             month: 'short',
//             day: 'numeric',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//         });
//     };

//     // Get appropriate badge for status
//     const getStatusBadge = (status: string) => {
//         switch (status) {
//             case 'Accepted':
//                 return (
//                     <Badge className="bg-green-100 text-green-800 border-green-200">
//                         <CheckCircle2 className="w-3 h-3 mr-1" />
//                         Accepted
//                     </Badge>
//                 );
//             case 'Rejected':
//                 return (
//                     <Badge className="bg-red-100 text-red-800 border-red-200">
//                         <XCircle className="w-3 h-3 mr-1" />
//                         Rejected
//                     </Badge>
//                 );
//             default:
//                 return (
//                     <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
//                         <Clock className="w-3 h-3 mr-1" />
//                         Pending
//                     </Badge>
//                 );
//         }
//     };

//     // Handle filter change
//     const handleFilterChange = (value: string) => {
//         setActiveFilter(value);
//         // Refetch with the new filter
//         // FIXED: Ensure we use the same method as fetchSubmissions
//         apiClient.getUserSubmissions({
//             status: value !== 'all' ? value : undefined
//         }).then(response => {
//             if (response.data && response.data.data) {
//                 const formattedSubmissions = response.data.data.map((sub: any) => ({
//                     ...sub,
//                     problemTitle: sub.problemId?.title || 'Unknown Problem'
//                 }));
//                 setSubmissions(formattedSubmissions);
//                 setFilteredSubmissions(formattedSubmissions);
//             }
//         }).catch(err => {
//             console.error('Error fetching filtered submissions:', err);
//             setError(err.response?.data?.error || err.message || 'Failed to fetch submissions');
//         });
//     };

//     if (authLoading || isLoading) {
//         return (
//             <div className="container max-w-6xl mx-auto p-4 py-8">
//                 <div className="flex justify-center items-center min-h-[300px]">
//                     <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container max-w-6xl mx-auto p-4 py-8">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//                 <div>
//                     <h1 className="text-3xl font-bold mb-2">My Submissions</h1>
//                     <p className="text-muted-foreground">View and manage all your problem submissions</p>
//                 </div>

//                 <Button className="mt-4 md:mt-0" onClick={() => router.push('/problems')}>
//                     <Code className="mr-2 h-4 w-4" />
//                     Solve Problems
//                 </Button>
//             </div>

//             {error && (
//                 <div className="bg-red-100 border border-red-300 text-red-800 rounded-md p-4 mb-6">
//                     <div className="flex items-center">
//                         <AlertCircle className="h-5 w-5 mr-2" />
//                         <p>{error}</p>
//                     </div>
//                 </div>
//             )}

//             <div className="mb-6 space-y-4">
//                 <div className="relative max-w-md">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
//                     <Input
//                         type="text"
//                         placeholder="Search by problem title..."
//                         className="pl-10"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                 </div>

//                 <Tabs value={activeFilter} onValueChange={handleFilterChange} className="w-full">
//                     <TabsList>
//                         <TabsTrigger value="all">All</TabsTrigger>
//                         <TabsTrigger value="Accepted">Accepted</TabsTrigger>
//                         <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//                         <TabsTrigger value="Pending">Pending</TabsTrigger>
//                     </TabsList>
//                 </Tabs>
//             </div>

//             {filteredSubmissions.length === 0 ? (
//                 <div className="text-center py-12 border rounded-md bg-muted/10">
//                     <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//                     <h3 className="text-lg font-medium mb-2">No submissions found</h3>
//                     <p className="text-muted-foreground mb-6">
//                         {searchQuery || activeFilter !== 'all'
//                             ? 'Try adjusting your search filters'
//                             : 'Submit solutions to coding problems to see them listed here'}
//                     </p>
//                     {(searchQuery || activeFilter !== 'all') && (
//                         <Button
//                             variant="outline"
//                             onClick={() => {
//                                 setSearchQuery('');
//                                 setActiveFilter('all');
//                                 fetchSubmissions();
//                             }}
//                         >
//                             Clear Filters
//                         </Button>
//                     )}
//                 </div>
//             ) : (
//                 <div className="space-y-4">
//                     {filteredSubmissions.map((submission) => (
//                         <Card key={submission._id} className="overflow-hidden">
//                             <CardContent className="p-0">
//                                 <div className="p-4 md:p-6">
//                                     <div className="flex flex-col md:flex-row md:items-center justify-between">
//                                         <div className="flex-1">
//                                             <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
//                                                 <h3 className="font-medium">
//                                                     {submission.problemTitle || submission.problemId?.title || 'Problem Title'}
//                                                 </h3>
//                                                 {getStatusBadge(submission.status)}
//                                             </div>

//                                             <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
//                                                 <div className="flex items-center">
//                                                     <Code className="h-4 w-4 mr-1" />
//                                                     {submission.language}
//                                                 </div>
//                                                 <div className="flex items-center">
//                                                     <Clock className="h-4 w-4 mr-1" />
//                                                     {formatDate(submission.createdAt)}
//                                                 </div>
//                                             </div>

//                                             {submission.feedback && (
//                                                 <div className="mt-4 p-3 bg-muted/30 rounded-md">
//                                                     <p className="text-sm font-medium mb-1">Feedback:</p>
//                                                     <p className="text-sm text-muted-foreground">{submission.feedback}</p>
//                                                 </div>
//                                             )}
//                                         </div>

//                                         <div className="mt-4 md:mt-0 flex justify-end">
//                                             <DropdownMenu>
//                                                 <DropdownMenuTrigger asChild>
//                                                     <Button variant="ghost" size="icon">
//                                                         <MoreVertical className="h-4 w-4" />
//                                                     </Button>
//                                                 </DropdownMenuTrigger>
//                                                 <DropdownMenuContent align="end">
//                                                     <DropdownMenuItem
//                                                         onClick={() => router.push(`/problems/${submission.problemId?._id || submission.problemId}`)}
//                                                     >
//                                                         View Problem
//                                                     </DropdownMenuItem>
//                                                     <DropdownMenuItem
//                                                         onClick={() => router.push(`/submissions/${submission._id}`)}
//                                                     >
//                                                         View Details
//                                                     </DropdownMenuItem>
//                                                 </DropdownMenuContent>
//                                             </DropdownMenu>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }



// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { useRouter } from 'next/navigation';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//     Clock,
//     Code,
//     MoreVertical,
//     Search,
//     CheckCircle2,
//     XCircle,
//     AlertCircle,
// } from 'lucide-react';
// import apiClient from '@/lib/api';

// import {
//     Dialog as Modal,
//     DialogTrigger as ModalTrigger,
//     DialogContent as ModalContent,
//     DialogHeader as ModalHeader,
//     DialogTitle as ModalTitle,
//     DialogDescription as ModalDescription,
//     DialogFooter as ModalFooter,
// } from '@/components/ui/dialog';

// interface Submission {
//     _id: string;
//     userId: string;
//     problemId: {
//         _id: string;
//         title: string;
//     };
//     code: string;
//     language: string;
//     status: 'Pending' | 'Accepted' | 'Rejected';
//     feedback?: string;
//     createdAt: string;
//     updatedAt: string;
// }

// export default function SubmissionsPage() {
//     const router = useRouter();
//     const { user, isLoading: authLoading } = useAuth();
//     const [submissions, setSubmissions] = useState<Submission[]>([]);
//     const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [activeFilter, setActiveFilter] = useState<'all' | 'Accepted' | 'Rejected' | 'Pending'>('all');
//     const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

//     useEffect(() => {
//         if (authLoading) return;
//         if (!user) {
//             router.push('/login');
//         } else {
//             fetchSubmissions(activeFilter);
//         }
//     }, [authLoading, user, activeFilter]);

//     const fetchSubmissions = async (filter: typeof activeFilter) => {
//         try {
//             setIsLoading(true);
//             setError(null);
//             const response = await apiClient.getUserSubmissions({
//                 status: filter !== 'all' ? filter : undefined,
//             });
//             const data = response.data?.data || [];
//             setSubmissions(data);
//             setFilteredSubmissions(data);
//         } catch (err: any) {
//             console.error('Error fetching submissions:', err);
//             setError(err.response?.data?.error || err.message || 'Failed to fetch submissions');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (!submissions) return;
//         let filtered = submissions;
//         if (searchQuery) {
//             filtered = filtered.filter((sub) =>
//                 sub.problemId.title.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }
//         setFilteredSubmissions(filtered);
//     }, [searchQuery, submissions]);

//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             month: 'short',
//             day: 'numeric',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//         });
//     };

//     const getStatusBadge = (status: string) => {
//         switch (status) {
//             case 'Accepted':
//                 return (
//                     <Badge className="bg-green-100 text-green-800 border-green-200">
//                         <CheckCircle2 className="w-3 h-3 mr-1" /> Accepted
//                     </Badge>
//                 );
//             case 'Rejected':
//                 return (
//                     <Badge className="bg-red-100 text-red-800 border-red-200">
//                         <XCircle className="w-3 h-3 mr-1" /> Rejected
//                     </Badge>
//                 );
//             default:
//                 return (
//                     <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
//                         <Clock className="w-3 h-3 mr-1" /> Pending
//                     </Badge>
//                 );
//         }
//     };

//     if (authLoading || isLoading) {
//         return (
//             <div className="container max-w-6xl mx-auto p-4 py-8">
//                 <div className="flex justify-center items-center min-h-[300px]">
//                     <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container max-w-6xl mx-auto p-4 py-8">
//             <Modal open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
//                 <ModalContent>
//                     <ModalHeader>
//                         <ModalTitle>
//                             {selectedSubmission?.problemId.title} - {selectedSubmission?.language}
//                         </ModalTitle>
//                         <ModalDescription>
//                             Submitted on {selectedSubmission && formatDate(selectedSubmission.createdAt)}
//                         </ModalDescription>
//                     </ModalHeader>
//                     <pre className="p-4 overflow-auto bg-gray-100 rounded-md">
//                         {selectedSubmission?.code}
//                     </pre>
//                     <ModalFooter>
//                         <Button onClick={() => setSelectedSubmission(null)}>Close</Button>
//                     </ModalFooter>
//                 </ModalContent>
//             </Modal>

//             <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//                 <div>
//                     <h1 className="text-3xl font-bold mb-2">My Submissions</h1>
//                     <p className="text-muted-foreground">View and manage all your problem submissions</p>
//                 </div>
//                 <Button className="mt-4 md:mt-0" onClick={() => router.push('/problems')}>
//                     <Code className="mr-2 h-4 w-4" /> Solve Problems
//                 </Button>
//             </div>

//             {error && (
//                 <div className="bg-red-100 border border-red-300 text-red-800 rounded-md p-4 mb-6">
//                     <div className="flex items-center">
//                         <AlertCircle className="h-5 w-5 mr-2" /> <p>{error}</p>
//                     </div>
//                 </div>
//             )}

//             <div className="mb-6 space-y-4">
//                 <div className="relative max-w-md">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
//                     <Input
//                         type="text"
//                         placeholder="Search by problem title..."
//                         className="pl-10"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                 </div>

//                 <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value)} className="w-full">
//                     <TabsList>
//                         <TabsTrigger value="all">All</TabsTrigger>
//                         <TabsTrigger value="Accepted">Accepted</TabsTrigger>
//                         <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//                         <TabsTrigger value="Pending">Pending</TabsTrigger>
//                     </TabsList>
//                 </Tabs>
//             </div>

//             {filteredSubmissions.length === 0 ? (
//                 <div className="text-center py-12 border rounded-md bg-muted/10">
//                     <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//                     <h3 className="text-lg font-medium mb-2">No submissions found</h3>
//                     <p className="text-muted-foreground mb-6">
//                         {searchQuery || activeFilter !== 'all'
//                             ? 'Try adjusting your search filters'
//                             : 'Submit solutions to coding problems to see them listed here'}
//                     </p>
//                     {(searchQuery || activeFilter !== 'all') && (
//                         <Button
//                             variant="outline"
//                             onClick={() => {
//                                 setSearchQuery('');
//                                 setActiveFilter('all');
//                             }}
//                         >
//                             Clear Filters
//                         </Button>
//                     )}
//                 </div>
//             ) : (
//                 <div className="grid gap-4">
//                     {filteredSubmissions.map((sub) => (
//                         <Card key={sub._id} className="hover:shadow-md transition-shadow">
//                             <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                                 <div className="space-y-1">
//                                     <h3 className="text-lg font-semibold">
//                                         {sub.problemId.title}
//                                     </h3>
//                                     <div className="text-sm text-muted-foreground">
//                                         {formatDate(sub.createdAt)}
//                                     </div>
//                                     <div className="text-sm font-mono">{sub.language}</div>
//                                 </div>
//                                 <div className="flex items-center gap-4">
//                                     {getStatusBadge(sub.status)}
//                                     <DropdownMenu>
//                                         <DropdownMenuTrigger asChild>
//                                             <Button variant="ghost" size="icon">
//                                                 <MoreVertical className="w-4 h-4" />
//                                             </Button>
//                                         </DropdownMenuTrigger>
//                                         <DropdownMenuContent align="end">
//                                             <DropdownMenuItem onClick={() => setSelectedSubmission(sub)}>
//                                                 View Code
//                                             </DropdownMenuItem>
//                                         </DropdownMenuContent>
//                                     </DropdownMenu>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

















'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Clock,
    Code,
    MoreVertical,
    Search,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import apiClient from '@/lib/api';
import {
    Dialog as Modal,
    DialogTrigger as ModalTrigger,
    DialogContent as ModalContent,
    DialogHeader as ModalHeader,
    DialogTitle as ModalTitle,
    DialogDescription as ModalDescription,
    DialogFooter as ModalFooter,
} from '@/components/ui/dialog';

interface Submission {
    _id: string;
    userId: string;
    problemId: {
        _id: string;
        title: string;
    };
    code: string;
    language: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    feedback?: string;
    createdAt: string;
    updatedAt: string;
}

export default function SubmissionsPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'Accepted' | 'Rejected' | 'Pending'>('all');
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/login');
        } else {
            fetchSubmissions(activeFilter);
        }
    }, [authLoading, user, activeFilter]);

    const fetchSubmissions = async (filter: typeof activeFilter) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiClient.getUserSubmissions({
                status: filter !== 'all' ? filter : undefined,
            });
            const data = response.data?.data || [];
            setSubmissions(data);
            setFilteredSubmissions(data);
        } catch (err: any) {
            console.error('Error fetching submissions:', err);
            setError(err.response?.data?.error || err.message || 'Failed to fetch submissions');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!submissions) return;
        let filtered = submissions;
        if (searchQuery) {
            filtered = filtered.filter((sub) =>
                sub.problemId.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredSubmissions(filtered);
    }, [searchQuery, submissions]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Accepted':
                return (
                    <Badge className="bg-green-900/30 text-green-400 border-green-700/50 hover:bg-green-900/50">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Accepted
                    </Badge>
                );
            case 'Rejected':
                return (
                    <Badge className="bg-red-900/30 text-red-400 border-red-700/50 hover:bg-red-900/50">
                        <XCircle className="w-3 h-3 mr-1" /> Rejected
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-700/50 hover:bg-yellow-900/50">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                    </Badge>
                );
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="container max-w-6xl mx-auto p-4 py-8">
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="relative w-16 h-16">
                        <div className="absolute top-0 left-0 w-full h-full border-t-4 border-b-4 border-orange-500/20 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-t-4 border-b-4 border-orange-500 rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto p-4 py-8 bg-zinc-950">
            <Modal open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
                <ModalContent className="bg-zinc-900 border border-zinc-800">
                    <ModalHeader>
                        <ModalTitle className="text-white">
                            {selectedSubmission?.problemId.title} - {selectedSubmission?.language}
                        </ModalTitle>
                        <ModalDescription className="text-zinc-400">
                            Submitted on {selectedSubmission && formatDate(selectedSubmission.createdAt)}
                        </ModalDescription>
                    </ModalHeader>
                    <div className="relative p-4 overflow-auto bg-zinc-800/50 rounded-md font-mono text-sm">
                        <pre className="whitespace-pre-wrap break-words">
                            {selectedSubmission?.code}
                        </pre>
                    </div>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            onClick={() => setSelectedSubmission(null)}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-white">My Submissions</h1>
                    <p className="text-zinc-400">View and manage all your problem submissions</p>
                </div>
                <Button
                    className="mt-4 md:mt-0 bg-orange-500 hover:bg-orange-600"
                    onClick={() => router.push('/problems')}
                >
                    <Code className="mr-2 h-4 w-4" /> Solve Problems
                </Button>
            </div>

            {error && (
                <div className="bg-red-900/30 border border-red-800/50 text-red-300 rounded-lg p-4 mb-6 backdrop-blur-sm">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" /> <p>{error}</p>
                    </div>
                </div>
            )}

            <div className="mb-6 space-y-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <Input
                        type="text"
                        placeholder="Search by problem title..."
                        className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-orange-500/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Tabs
                    value={activeFilter}
                    onValueChange={(value) => setActiveFilter(value as any)}
                    className="w-full"
                >
                    <TabsList className="bg-zinc-800/50 border border-zinc-700 p-1 h-auto flex-wrap">
                        <TabsTrigger
                            value="all"
                            className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 px-4 py-2 rounded-md transition-colors"
                        >
                            All
                        </TabsTrigger>
                        <TabsTrigger
                            value="Accepted"
                            className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 px-4 py-2 rounded-md transition-colors"
                        >
                            Accepted
                        </TabsTrigger>
                        <TabsTrigger
                            value="Rejected"
                            className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 px-4 py-2 rounded-md transition-colors"
                        >
                            Rejected
                        </TabsTrigger>
                        <TabsTrigger
                            value="Pending"
                            className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 px-4 py-2 rounded-md transition-colors"
                        >
                            Pending
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {filteredSubmissions.length === 0 ? (
                <div className="text-center py-12 border border-zinc-800 rounded-lg bg-zinc-900/50">
                    <Code className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-white">No submissions found</h3>
                    <p className="text-zinc-400 mb-6">
                        {searchQuery || activeFilter !== 'all'
                            ? 'Try adjusting your search filters'
                            : 'Submit solutions to coding problems to see them listed here'}
                    </p>
                    {(searchQuery || activeFilter !== 'all') && (
                        <Button
                            variant="outline"
                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            onClick={() => {
                                setSearchQuery('');
                                setActiveFilter('all');
                            }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredSubmissions.map((sub) => (
                        <Card
                            key={sub._id}
                            className="hover:border-orange-500/50 transition-all duration-300 bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm"
                        >
                            <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-white">
                                        {sub.problemId?.title || 'Untitled Problem'}
                                    </h3>
                                    <div className="text-sm text-zinc-400">
                                        {formatDate(sub.createdAt)}
                                    </div>
                                    <div className="text-sm font-mono text-zinc-500">{sub.language}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {getStatusBadge(sub.status)}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-zinc-800/50 text-zinc-400 hover:text-white"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="bg-zinc-900 border border-zinc-800"
                                        >
                                            <DropdownMenuItem
                                                onClick={() => setSelectedSubmission(sub)}
                                                className="text-zinc-300 hover:bg-zinc-800"
                                            >
                                                View Code
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}