'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Eye, Calendar, BookOpen, Search, Tag } from 'lucide-react';

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

export default function BlogsPage() {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [readBlogs, setReadBlogs] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch blogs on component mount
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const { data } = await apiClient.getAllBlogs();
                setBlogs(data.data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    // Fetch user's read blogs if logged in
    useEffect(() => {
        if (!user) return;

        const fetchReadBlogs = async () => {
            try {
                const { data } = await apiClient.getAdminStats();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const blogReads = data.blogReads.filter((read: any) => read.userId === user._id);

                const readBlogsMap: Record<string, boolean> = {};
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                blogReads.forEach((read: any) => {
                    readBlogsMap[read.blogId] = true;
                });

                setReadBlogs(readBlogsMap);
            } catch (err) {
                console.error('Error fetching read blogs:', err);
            }
        };

        fetchReadBlogs();
    }, [user]);

    // Extract all unique tags
    const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags)));

    // Filter blogs based on search query and active tag
    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.summary.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = !activeTag || blog.tags.includes(activeTag);
        return matchesSearch && matchesTag;
    });

    // Get featured (most viewed) blogs
    const featuredBlogs = [...blogs]
        .sort((a, b) => b.views - a.views)
        .slice(0, 3);

    // Get recent blogs
    const recentBlogs = [...blogs]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Loading state
    if (loading) {
        return (
            <div className="container max-w-6xl mx-auto p-4 py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container max-w-6xl mx-auto p-4 py-8">
                <div className="bg-red-50 text-red-500 p-4 rounded-md">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto p-4 py-8">
            {/* Hero section */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4">Tech Blogs</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Dive deep into programming concepts, technologies, and career advice with our comprehensive tech blogs.
                </p>
            </div>

            {/* Search and filter section */}
            <div className="mb-8 space-y-4">
                <div className="relative max-w-xl mx-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        type="text"
                        placeholder="Search blogs..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                        variant={activeTag === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTag(null)}
                    >
                        All
                    </Button>

                    {allTags.map(tag => (
                        <Button
                            key={tag}
                            variant={activeTag === tag ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveTag(tag)}
                        >
                            {tag}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="mb-8">
                <TabsList className="mb-4 justify-center">
                    <TabsTrigger value="all">All Blogs</TabsTrigger>
                    <TabsTrigger value="featured">Featured</TabsTrigger>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                </TabsList>

                {/* All blogs */}
                <TabsContent value="all">
                    {filteredBlogs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No blogs found matching your search criteria
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBlogs.map(blog => (
                                <BlogCard
                                    key={blog._id}
                                    blog={blog}
                                    isRead={readBlogs[blog._id] || false}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Featured blogs */}
                <TabsContent value="featured">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredBlogs.map(blog => (
                            <BlogCard
                                key={blog._id}
                                blog={blog}
                                isRead={readBlogs[blog._id] || false}
                                featured
                            />
                        ))}
                    </div>
                </TabsContent>

                {/* Recent blogs */}
                <TabsContent value="recent">
                    <div className="grid grid-cols-1 gap-4">
                        {recentBlogs.map(blog => (
                            <Link href={`/blogs/${blog._id}`} key={blog._id}>
                                <Card className={`hover:bg-accent/50 transition-colors ${readBlogs[blog._id] ? 'border-blue-200' : ''}`}>
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            {blog.coverImage && (
                                                <div className="w-24 h-24 min-w-[6rem] rounded-md overflow-hidden relative">
                                                    <Image
                                                        src={blog.coverImage}
                                                        alt={blog.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2">{blog.summary}</p>
                                                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                                    <div className="flex items-center mr-3">
                                                        <Calendar size={14} className="mr-1" />
                                                        {formatDate(blog.createdAt)}
                                                    </div>
                                                    <div className="flex items-center mr-3">
                                                        <Eye size={14} className="mr-1" />
                                                        {blog.views} views
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock size={14} className="mr-1" />
                                                        {blog.readTime} min read
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Admin button */}
            {user?.role === 'admin' && (
                <div className="flex justify-center mt-8">
                    <Link href="/admin">
                        <Button>
                            Manage Blogs
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

interface BlogCardProps {
    blog: Blog;
    isRead: boolean;
    featured?: boolean;
}

function BlogCard({ blog, isRead, featured }: BlogCardProps) {
    return (
        <Link href={`/blogs/${blog._id}`}>
            <Card className={`h-full flex flex-col overflow-hidden transition-transform hover:shadow-md hover:-translate-y-1 ${isRead ? 'border-blue-200' : ''} ${featured ? 'border-orange-200 bg-orange-50/20' : ''}`}>
                {blog.coverImage && (
                    <div className="h-40 relative">
                        <Image
                            src={blog.coverImage}
                            alt={blog.title}
                            fill
                            className="object-cover"
                        />
                        {isRead && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                <BookOpen size={14} />
                            </div>
                        )}
                        {featured && (
                            <div className="absolute top-2 left-2">
                                <Badge variant="default" className="bg-orange-500">Featured</Badge>
                            </div>
                        )}
                    </div>
                )}
                <CardContent className="flex-1 p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{blog.summary}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                        {blog.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="bg-blue-50">
                                <Tag size={10} className="mr-1" /> {tag}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2 border-t">
                        <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {blog.readTime} min read
                        </div>
                        <div className="flex items-center">
                            <Eye size={14} className="mr-1" />
                            {blog.views} views
                        </div>
                        <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
