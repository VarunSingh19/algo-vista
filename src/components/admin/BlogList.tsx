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
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Calendar, PenSquare, Trash2, Eye, Edit, Plus } from 'lucide-react';

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

export default function BlogList() {
    const router = useRouter();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [blogForm, setBlogForm] = useState({
        title: '',
        summary: '',
        content: '',
        tags: '',
        coverImage: '',
        readTime: 5,
        published: true,
    });

    // Fetch blogs
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);

                // Use fetch directly for more control
                const response = await fetch('/api/blogs');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const responseText = await response.text();

                // Check if the response is empty
                if (!responseText) {
                    throw new Error('Empty response received');
                }

                // Try to parse the response text
                let responseData;
                try {
                    responseData = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('JSON parse error:', parseError);
                    console.error('Response text:', responseText);
                    throw new Error('Failed to parse response as JSON');
                }

                console.log('API response:', responseData);

                // Handle different response structures
                if (responseData.data) {
                    // If data is nested inside data property
                    setBlogs(responseData.data);
                } else if (Array.isArray(responseData)) {
                    // If data is directly an array
                    setBlogs(responseData);
                } else {
                    // If data has another structure
                    setBlogs([]);
                    console.error('Unexpected API response structure:', responseData);
                }

                setError(null);
            } catch (err: any) {
                console.error('Error fetching blogs:', err);
                setError(err.message || 'Failed to fetch blogs');
                setBlogs([]); // Ensure blogs is always an array
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    // Filter blogs based on search query
    const filteredBlogs = Array.isArray(blogs) ? blogs.filter(blog =>
        blog?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog?.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog?.authorName?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    // Handle form changes
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBlogForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle checkbox change
    const handleCheckboxChange = (checked: boolean) => {
        setBlogForm(prev => ({ ...prev, published: checked }));
    };

    // Handle create blog
    const handleCreateBlog = async () => {
        try {
            setIsLoading(true);

            // Ensure content has minimum length for validation
            if (blogForm.content.length < 100) {
                setError('Content must be at least 100 characters');
                setIsLoading(false);
                return;
            }

            // Ensure summary has minimum length for validation
            if (blogForm.summary.length < 10) {
                setError('Summary must be at least 10 characters');
                setIsLoading(false);
                return;
            }

            const blogData = {
                ...blogForm,
                tags: blogForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                readTime: parseInt(blogForm.readTime.toString())
            };

            // Use fetch directly for more control
            console.log('Submitting blog data:', blogData);

            const response = await fetch('/api/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blogData),
                credentials: 'include'
            });

            // First get the response as text
            const responseText = await response.text();

            // Check if we have a response
            if (!responseText) {
                throw new Error('Empty response received from server');
            }

            // Try to parse the response text
            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                console.error('Response text:', responseText);
                throw new Error('Failed to parse response as JSON');
            }

            console.log('Blog creation response:', responseData);

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to create blog');
            }

            // Add the new blog to the list
            setBlogs(prev => Array.isArray(prev) ? [...prev, responseData] : [responseData]);
            setIsCreateDialogOpen(false);
            resetForm();
            setError(null);

            // Refresh blogs list
            const refreshResponse = await fetch('/api/blogs');

            if (!refreshResponse.ok) {
                throw new Error(`HTTP error! Status: ${refreshResponse.status}`);
            }

            const refreshText = await refreshResponse.text();

            if (!refreshText) {
                throw new Error('Empty response received while refreshing data');
            }

            let refreshData;
            try {
                refreshData = JSON.parse(refreshText);
            } catch (parseError) {
                console.error('JSON parse error during refresh:', parseError);
                throw new Error('Failed to parse refresh response as JSON');
            }

            if (refreshData.data) {
                setBlogs(refreshData.data);
            } else {
                setBlogs(refreshData);
            }

        } catch (err: any) {
            console.error('Error creating blog:', err);
            setError(err.message ||
                'Failed to create blog. Make sure content is at least 100 characters and summary is at least 10 characters.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle edit blog
    const handleEditBlog = async () => {
        if (!selectedBlog) return;

        try {
            setIsLoading(true);
            const blogData = {
                ...blogForm,
                tags: blogForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            };

            // Use fetch directly for more control
            const response = await fetch(`/api/blogs/${selectedBlog._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blogData),
                credentials: 'include'
            });

            const responseText = await response.text();

            if (!responseText) {
                throw new Error('Empty response received');
            }

            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                throw new Error('Failed to parse response as JSON');
            }

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to update blog');
            }

            const updatedBlog = responseData.data || responseData;

            setBlogs(prev => prev.map(blog => blog._id === selectedBlog._id ? updatedBlog : blog));
            setIsEditDialogOpen(false);
            resetForm();
        } catch (err: any) {
            setError(err.message || 'Failed to update blog');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle delete blog
    const handleDeleteBlog = async () => {
        if (!selectedBlog) return;

        try {
            setIsLoading(true);

            const response = await fetch(`/api/blogs/${selectedBlog._id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                const responseText = await response.text();
                let errorMessage = 'Failed to delete blog';

                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    // If parse fails, use default error message
                }

                throw new Error(errorMessage);
            }

            setBlogs(prev => prev.filter(blog => blog._id !== selectedBlog._id));
            setIsDeleteDialogOpen(false);
        } catch (err: any) {
            setError(err.message || 'Failed to delete blog');
        } finally {
            setIsLoading(false);
        }
    };

    // Open edit dialog and populate form
    const openEditDialog = (blog: Blog) => {
        setSelectedBlog(blog);
        setBlogForm({
            title: blog.title,
            summary: blog.summary,
            content: blog.content,
            tags: blog.tags.join(', '),
            coverImage: blog.coverImage || '',
            readTime: blog.readTime,
            published: blog.published,
        });
        setIsEditDialogOpen(true);
    };

    // Open delete dialog
    const openDeleteDialog = (blog: Blog) => {
        setSelectedBlog(blog);
        setIsDeleteDialogOpen(true);
    };

    // Reset form
    const resetForm = () => {
        setBlogForm({
            title: '',
            summary: '',
            content: '',
            tags: '',
            coverImage: '',
            readTime: 5,
            published: true,
        });
        setSelectedBlog(null);
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

    if (isLoading && blogs.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Manage Blogs</h2>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Create Blog
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
                    placeholder="Search blogs by title, summary, or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredBlogs.length === 0 ? (
                    <div className="text-center p-8 border rounded-md bg-muted/20">
                        <p className="text-muted-foreground">No blogs found</p>
                    </div>
                ) : (
                    filteredBlogs.map((blog) => (
                        <Card key={blog._id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex-grow">
                                        <div className="flex items-center">
                                            <h3 className="font-medium text-lg">{blog.title}</h3>
                                            {!blog.published && (
                                                <Badge variant="outline" className="ml-2 bg-yellow-100 border-yellow-300 text-yellow-800">
                                                    Draft
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                            {blog.summary}
                                        </p>
                                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                                            <div className="flex items-center mr-3">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {formatDate(blog.createdAt)}
                                            </div>
                                            <div className="flex items-center mr-3">
                                                <Eye className="h-3 w-3 mr-1" />
                                                {blog.views} views
                                            </div>
                                            <div>by {blog.authorName}</div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => router.push(`/blogs/${blog._id}`)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => openEditDialog(blog)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => openDeleteDialog(blog)}
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

            {/* Create Blog Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Create Blog</DialogTitle>
                        <DialogDescription>
                            Create a new blog post to share knowledge with your community.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={blogForm.title}
                                    onChange={handleFormChange}
                                    placeholder="Enter blog title..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="readTime">Read Time (minutes)</Label>
                                <Input
                                    id="readTime"
                                    name="readTime"
                                    value={blogForm.readTime.toString()}
                                    onChange={handleFormChange}
                                    type="number"
                                    min={1}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="summary">Summary</Label>
                            <Textarea
                                id="summary"
                                name="summary"
                                value={blogForm.summary}
                                onChange={handleFormChange}
                                placeholder="Write a brief summary of your blog..."
                                rows={2}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="content">Content (Markdown supported)</Label>
                            <Textarea
                                id="content"
                                name="content"
                                value={blogForm.content}
                                onChange={handleFormChange}
                                placeholder="Write your blog content..."
                                rows={10}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input
                                id="tags"
                                name="tags"
                                value={blogForm.tags}
                                onChange={handleFormChange}
                                placeholder="e.g. JavaScript, React, Programming"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="coverImage">Cover Image URL</Label>
                            <Input
                                id="coverImage"
                                name="coverImage"
                                value={blogForm.coverImage}
                                onChange={handleFormChange}
                                placeholder="Enter image URL..."
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="published"
                                checked={blogForm.published}
                                onCheckedChange={handleCheckboxChange}
                            />
                            <Label htmlFor="published">Publish immediately</Label>
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
                        <Button type="submit" onClick={handleCreateBlog} disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Blog"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Blog Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Edit Blog</DialogTitle>
                        <DialogDescription>
                            Make changes to the blog post.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                    id="edit-title"
                                    name="title"
                                    value={blogForm.title}
                                    onChange={handleFormChange}
                                    placeholder="Enter blog title..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-readTime">Read Time (minutes)</Label>
                                <Input
                                    id="edit-readTime"
                                    name="readTime"
                                    value={blogForm.readTime.toString()}
                                    onChange={handleFormChange}
                                    type="number"
                                    min={1}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-summary">Summary</Label>
                            <Textarea
                                id="edit-summary"
                                name="summary"
                                value={blogForm.summary}
                                onChange={handleFormChange}
                                placeholder="Write a brief summary of your blog..."
                                rows={2}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-content">Content (Markdown supported)</Label>
                            <Textarea
                                id="edit-content"
                                name="content"
                                value={blogForm.content}
                                onChange={handleFormChange}
                                placeholder="Write your blog content..."
                                rows={10}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                            <Input
                                id="edit-tags"
                                name="tags"
                                value={blogForm.tags}
                                onChange={handleFormChange}
                                placeholder="e.g. JavaScript, React, Programming"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-coverImage">Cover Image URL</Label>
                            <Input
                                id="edit-coverImage"
                                name="coverImage"
                                value={blogForm.coverImage}
                                onChange={handleFormChange}
                                placeholder="Enter image URL..."
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="edit-published"
                                checked={blogForm.published}
                                onCheckedChange={handleCheckboxChange}
                            />
                            <Label htmlFor="edit-published">Published</Label>
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
                        <Button type="submit" onClick={handleEditBlog} disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Blog Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this blog? This action cannot be undone.
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
                            onClick={handleDeleteBlog}
                            disabled={isLoading}
                        >
                            {isLoading ? "Deleting..." : "Delete Blog"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}