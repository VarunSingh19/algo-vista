'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface Submission {
    _id: string;
    userId: {
        name: string;
        email: string;
    };
    problemId: string;
    code: string;
    language: string;
    status: string;
    createdAt: string;
}

export default function SubmissionsList() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/submissions');
            const data = await response.json();
            if (data.success) {
                setSubmissions(data.data);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSubmissionStatus = async (submissionId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/submissions/${submissionId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await response.json();
            if (data.success) {
                await fetchSubmissions(); // Refresh the list
            }
        } catch (error) {
            console.error('Error updating submission:', error);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Accepted':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'Wrong Answer':
                return <XCircle className="text-red-500" size={20} />;
            case 'Pending':
                return <Clock className="text-yellow-500" size={20} />;
            default:
                return <AlertTriangle className="text-orange-500" size={20} />;
        }
    };

    if (loading) {
        return <div>Loading submissions...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Submissions</h2>
                <Button onClick={fetchSubmissions}>Refresh</Button>
            </div>

            <div className="grid gap-4">
                {submissions.map((submission) => (
                    <Card key={submission._id}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{submission.userId.name}</p>
                                    <p className="text-sm text-zinc-400">{submission.userId.email}</p>
                                    <p className="text-sm text-zinc-500">
                                        {formatDistance(new Date(submission.createdAt), new Date(), { addSuffix: true })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {getStatusIcon(submission.status)}
                                    <Select
                                        defaultValue={submission.status}
                                        onValueChange={(value) => updateSubmissionStatus(submission._id, value)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Accepted">Accepted</SelectItem>
                                            <SelectItem value="Wrong Answer">Wrong Answer</SelectItem>
                                            <SelectItem value="Runtime Error">Runtime Error</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}