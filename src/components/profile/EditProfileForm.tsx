"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Github, Twitter, Linkedin, Globe, Upload, MapPin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Form validation schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  avatarUrl: z.string().optional(),
  socialLinks: z.object({
    github: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    personalSite: z.string().url().optional().or(z.literal(""))
  })
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function EditProfileForm() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  // Initialize form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      location: user?.location || "",
      avatarUrl: user?.avatarUrl || "",
      socialLinks: {
        github: user?.socialLinks?.github || "",
        twitter: user?.socialLinks?.twitter || "",
        linkedin: user?.socialLinks?.linkedin || "",
        personalSite: user?.socialLinks?.personalSite || ""
      }
    }
  })

  // Watch the avatarUrl field to get the current value
  const currentAvatarUrl = form.watch("avatarUrl")

  // Handle avatar file selection
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file")
        return
      }

      if (file.size > 2 * 1024 * 1024) { // Reduced to 2MB to avoid timeouts
        setError("Image must be less than 2MB")
        return
      }

      setIsUploadingAvatar(true)
      setError(null)

      // Convert to base64 for your existing API
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64Image = event.target?.result as string

        try {
          console.log("Uploading image to server...");

          // Upload to your existing API that expects base64
          const response = await fetch('/api/upload-avatar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image })
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to upload image')
          }

          const data = await response.json()

          // IMPORTANT: Only store the Cloudinary URL, never the base64
          console.log("API Response:", data) // Debug log
          console.log("Cloudinary URL from API:", data.url) // Debug log

          if (data.url && !data.url.startsWith('data:')) {
            form.setValue("avatarUrl", data.url)
            console.log("Form avatarUrl set to:", data.url)
          } else {
            throw new Error("Invalid URL received from server")
          }

        } catch (uploadError) {
          console.error('Avatar upload error:', uploadError)
          setError('Failed to upload image')
        } finally {
          setIsUploadingAvatar(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('Avatar change error:', err)
      setError('Failed to process image')
      setIsUploadingAvatar(false)
    }
  }

  // Handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const updateData = {
        name: values.name,
        bio: values.bio || "",
        location: values.location || "",
        avatarUrl: values.avatarUrl || "", // This should now contain the Cloudinary URL
        socialLinks: {
          github: values.socialLinks.github || "",
          twitter: values.socialLinks.twitter || "",
          linkedin: values.socialLinks.linkedin || "",
          personalSite: values.socialLinks.personalSite || ""
        }
      }

      console.log('Form values before submit:', form.getValues()) // Debug log
      console.log('Submitting update with avatar URL:', values.avatarUrl) // Debug log

      // Validate that we're not sending base64
      if (values.avatarUrl && values.avatarUrl.startsWith('data:')) {
        throw new Error("Cannot save base64 data. Please re-upload the image.")
      }

      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      const updatedUser = await response.json()
      updateUser(updatedUser) // Update context after successful API call

      setSuccess("Profile updated successfully")
      setTimeout(() => {
        router.refresh() // Use router.refresh() instead of window.location.reload()
      }, 1500)
    } catch (err: any) {
      console.error('Update error:', err)
      setError(err.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar section */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={currentAvatarUrl || user?.avatarUrl}
                alt={user?.name || "Avatar"}
              />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center">
              <Label
                htmlFor="avatar-upload"
                className={`flex items-center px-3 py-2 text-sm font-medium cursor-pointer rounded-md border ${isUploadingAvatar
                  ? 'bg-gray-600 border-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 border-gray-600'
                  }`}
              >
                <Upload size={16} className="mr-2" />
                {isUploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploadingAvatar}
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" className="bg-gray-700 border-gray-600" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location field */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                      <Input placeholder="Your location" className="bg-gray-700 border-gray-600 pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bio field */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    className="bg-gray-700 border-gray-600 min-h-[100px]"
                    {...field}
                  />
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
              name="socialLinks.github"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <Github size={16} className="text-gray-400" />
                    <FormControl>
                      <Input placeholder="GitHub profile URL" className="bg-gray-700 border-gray-600" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Twitter */}
            <FormField
              control={form.control}
              name="socialLinks.twitter"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <Twitter size={16} className="text-gray-400" />
                    <FormControl>
                      <Input placeholder="Twitter profile URL" className="bg-gray-700 border-gray-600" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LinkedIn */}
            <FormField
              control={form.control}
              name="socialLinks.linkedin"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <Linkedin size={16} className="text-gray-400" />
                    <FormControl>
                      <Input placeholder="LinkedIn profile URL" className="bg-gray-700 border-gray-600" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Personal Website */}
            <FormField
              control={form.control}
              name="socialLinks.personalSite"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <Globe size={16} className="text-gray-400" />
                    <FormControl>
                      <Input placeholder="Personal website URL" className="bg-gray-700 border-gray-600" {...field} />
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
            <Alert className="border-green-500/50 bg-green-500/10">
              <AlertDescription className="text-green-400">{success}</AlertDescription>
            </Alert>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={isLoading || isUploadingAvatar}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  )
}