'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Github, Twitter, Linkedin, Globe } from 'lucide-react';

export default function ProfileCard() {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">Guest Mode</h3>
            <p className="text-sm text-muted-foreground">
              Login to save your progress across devices
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-2">
          <Button asChild variant="default" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/register">Register</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Social links
  const socialLinks = [
    {
      name: 'GitHub',
      url: user.socialLinks.github,
      icon: <Github size={16} />,
    },
    {
      name: 'Twitter',
      url: user.socialLinks.twitter,
      icon: <Twitter size={16} />,
    },
    {
      name: 'LinkedIn',
      url: user.socialLinks.linkedin,
      icon: <Linkedin size={16} />,
    },
    {
      name: 'Website',
      url: user.socialLinks.personalSite,
      icon: <Globe size={16} />,
    },
  ].filter((link) => link.url); // Only include links that exist

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar */}
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-xl">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User info */}
          <div className="text-center">
            <h3 className="text-xl font-medium">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.role === 'admin' && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                Admin
              </span>
            )}
          </div>

          {/* Social links */}
          {socialLinks.length > 0 && (
            <div className="flex space-x-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors"
                  title={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button asChild variant="outline" size="sm">
          <Link href="/profile">Edit Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
