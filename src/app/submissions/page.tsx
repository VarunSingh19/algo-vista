
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
        <div className="bg-zinc-950  max-w-full ">


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
                        <div className="relative p-4 text-white overflow-auto bg-zinc-800/50 rounded-md font-mono text-sm">
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
                                            {sub.problemId.title}
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
        </div>
    );
}