'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, User, Tag, ChevronLeft, Edit, Trash, Share2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Blog {
    _id: string;
    title: string;
    summary: string;
    content: string;
    tags: string[];
    coverImage: string;
    published: boolean;
    views: number;
    readTime: number;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
}

export default function BlogDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch blog on component mount
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const { data } = await apiClient.getBlog(id as string);
                setBlog(data);

                // Mark blog as read for logged in users
                if (user) {
                    try {
                        await apiClient.markBlogAsRead(id as string);
                    } catch (error) {
                        console.error('Error marking blog as read:', error);
                    }
                }
            } catch (err: Error | unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch blog';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id, user]);

    // Fetch related blogs based on tags
    useEffect(() => {
        if (!blog?.tags?.length) return;

        const fetchRelatedBlogs = async () => {
            try {
                const { data } = await apiClient.getAllBlogs();
                const allBlogs = data.data || [];

                // Filter and sort related blogs by tag overlap
                const related = allBlogs
                    .filter((b: Blog) => b._id !== blog._id)
                    .map((b: Blog) => {
                        const tagOverlap = b.tags.filter(tag => blog.tags.includes(tag)).length;
                        return { ...b, tagOverlap };
                    })
                    .sort((a: Blog & { tagOverlap: number }, b: Blog & { tagOverlap: number }) => b.tagOverlap - a.tagOverlap || b.views - a.views)
                    .slice(0, 3);

                setRelatedBlogs(related);
            } catch (error) {
                console.error('Error fetching related blogs:', error);
            }
        };

        fetchRelatedBlogs();
    }, [blog]);

    const handleDeleteBlog = async () => {
        if (!blog) return;

        try {
            setDeleteLoading(true);
            await apiClient.deleteBlog(blog._id);
            router.push('/blogs');
        } catch (error) {
            console.error('Error deleting blog:', error);
            setError('Failed to delete blog');
        } finally {
            setDeleteLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blog?.title || 'Tech Blog',
                text: blog?.summary || '',
                url: window.location.href,
            })
                .catch(error => console.error('Error sharing:', error));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Link copied to clipboard!'))
                .catch(error => console.error('Error copying to clipboard:', error));
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="container max-w-4xl mx-auto p-4 py-8">
                <div className="space-y-4">
                    <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                    <div className="h-6 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                    <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mt-6"></div>
                    <div className="space-y-2 mt-6">
                        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                        <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container max-w-4xl mx-auto p-4 py-8">
                <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-300 p-4 rounded-md flex flex-col items-center">
                    <p className="mb-4">{error}</p>
                    <Button variant="outline" asChild>
                        <Link href="/blogs">Go Back to Blogs</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="container max-w-4xl mx-auto p-4 py-8">
                <div className="text-center">
                    <p className="mb-4">Blog not found</p>
                    <Button variant="outline" asChild>
                        <Link href="/blogs">Go Back to Blogs</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto p-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Main content */}
                <div className="flex-1">
                    {/* Back link */}
                    <Link
                        href="/blogs"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
                    >
                        <ChevronLeft size={16} className="mr-1" />
                        Back to all blogs
                    </Link>

                    {/* Blog header */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="px-3 py-1">
                                    <Tag size={12} className="mr-1.5" />
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>

                        <p className="text-xl text-muted-foreground mb-6">{blog.summary}</p>

                        <div className="flex items-center justify-between border-y py-4 mb-6">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                    <User size={20} className="text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{blog.authorName}</p>
                                    <p className="text-sm text-muted-foreground">
                                        <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Clock size={14} className="mr-1" />
                                    {blog.readTime} min read
                                </div>
                                <div className="flex items-center">
                                    <Eye size={14} className="mr-1" />
                                    {blog.views} views
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cover image */}
                    {blog.coverImage && (
                        <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
                            <Image
                                src={blog.coverImage}
                                alt={blog.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Blog content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-between items-center border-t pt-6 mt-8">
                        {user?.role === 'admin' ? (
                            <div className="flex gap-3">
                                <Button asChild variant="outline">
                                    <Link href={`/admin/blogs/edit/${blog._id}`}>
                                        <Edit size={16} className="mr-2" />
                                        Edit
                                    </Link>
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">
                                            <Trash size={16} className="mr-2" />
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the blog post.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteBlog} disabled={deleteLoading}>
                                                {deleteLoading ? 'Deleting...' : 'Delete'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ) : (
                            <div></div>
                        )}

                        <Button variant="outline" onClick={handleShare}>
                            <Share2 size={16} className="mr-2" />
                            Share
                        </Button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-80">
                    <div className="sticky top-24 space-y-6">
                        {/* Related blogs */}
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-lg mb-4">Related Posts</h3>

                                {relatedBlogs.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No related posts found.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {relatedBlogs.map(relatedBlog => (
                                            <Link key={relatedBlog._id} href={`/blogs/${relatedBlog._id}`} className="block group">
                                                <div className="flex gap-3">
                                                    {relatedBlog.coverImage && (
                                                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 relative">
                                                            <Image
                                                                src={relatedBlog.coverImage}
                                                                alt={relatedBlog.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="text-sm font-medium group-hover:text-primary line-clamp-2">
                                                            {relatedBlog.title}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {formatDate(relatedBlog.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Popular tags */}
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-lg mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {blog.tags.map(tag => (
                                        <Link key={tag} href={`/blogs?tag=${tag}`}>
                                            <Badge variant="outline" className="px-3 py-1 hover:bg-secondary">
                                                {tag}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* More from this author - would be implemented if we had authors API */}
                        {user?.role === 'admin' && (
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-lg mb-4">Admin Actions</h3>
                                    <div className="space-y-2">
                                        <Button className="w-full" asChild>
                                            <Link href="/admin/blogs/create">
                                                Create New Blog
                                            </Link>
                                        </Button>
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href="/admin">
                                                Admin Dashboard
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
