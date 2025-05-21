'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Home, User, FilePen, ShieldCheck } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed p-2 m-4 text-white bg-primary rounded-md lg:hidden z-50"
        aria-label="Toggle Menu"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-card shadow-lg lg:sticky lg:top-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & App Name */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">AlgoVista</h1>
            <p className="text-sm text-muted-foreground">Track your algorithm progress</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow p-4 space-y-1">
            <Link
              href="/"
              className={`flex items-center space-x-2 p-2 rounded-md ${
                pathname === '/' ? 'bg-accent' : 'hover:bg-accent/50'
              }`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>

            {user && (
              <Link
                href="/profile"
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  pathname === '/profile' ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
              >
                <User size={20} />
                <span>Profile</span>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  pathname === '/admin' ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
              >
                <ShieldCheck size={20} />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push('/register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4 lg:p-8">
        {/* Dark overlay when sidebar is open on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Page Content */}
        <main className="max-w-5xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
