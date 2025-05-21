'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import apiClient from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Github, Twitter, Linkedin, Globe, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Form validation schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  avatarUrl: z.string().optional(),
  github: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  personalSite: z.string().url().optional().or(z.literal(''))
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfileForm() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Initialize form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      avatarUrl: user?.avatarUrl || '',
      github: user?.socialLinks.github || '',
      twitter: user?.socialLinks.twitter || '',
      linkedin: user?.socialLinks.linkedin || '',
      personalSite: user?.socialLinks.personalSite || ''
    }
  });

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image must be less than 5MB');
        return;
      }

      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Upload avatar if new one was selected
      let avatarUrl = values.avatarUrl;

      if (avatarPreview) {
        const response = await apiClient.uploadAvatar(avatarPreview);
        avatarUrl = response.data.url;
      }

      // Update user profile
      await updateUser({
        name: values.name,
        avatarUrl,
        socialLinks: {
          github: values.github || '',
          twitter: values.twitter || '',
          linkedin: values.linkedin || '',
          personalSite: values.personalSite || ''
        }
      });

      setSuccess('Profile updated successfully');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your personal information and social links</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={avatarPreview || user?.avatarUrl}
                  alt={user?.name || 'Avatar'}
                />
                <AvatarFallback className="text-2xl">
                  {user?.name.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex items-center">
                <Label
                  htmlFor="avatar-upload"
                  className="flex items-center px-3 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 cursor-pointer rounded-md"
                >
                  <Upload size={16} className="mr-2" />
                  Upload Avatar
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            {/* Name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Social links */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Social Links</h3>

              {/* GitHub */}
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <Github size={16} />
                      <FormControl>
                        <Input placeholder="GitHub profile URL" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Twitter */}
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <Twitter size={16} />
                      <FormControl>
                        <Input placeholder="Twitter profile URL" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LinkedIn */}
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <Linkedin size={16} />
                      <FormControl>
                        <Input placeholder="LinkedIn profile URL" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Personal Website */}
              <FormField
                control={form.control}
                name="personalSite"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <Globe size={16} />
                      <FormControl>
                        <Input placeholder="Personal website URL" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status messages */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
