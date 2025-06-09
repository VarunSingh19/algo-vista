"use client"

import React from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LogOut,
  Home,
  User,
  FilePen,
  ShieldCheck,
  BookOpen,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  Code,
  ClipboardList,
  Sparkles,
  Zap,
  Heart,
  Mail,
  Shield,
  Briefcase,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  // Handle scroll effect for navbar
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Navigation links configuration
  const navLinks = [
    {
      name: "Home",
      href: "/",
      icon: <Home size={16} className="mr-2" />,
      gradient: "from-blue-500 to-purple-600",
    },
    {
      name: "Sheets",
      href: "/sheets",
      icon: <BookOpen size={16} className="mr-2" />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      name: "Careers",
      href: "/careers",
      icon: <Briefcase size={16} className="mr-2" />,
      requiresAuth: true,
      gradient: "from-orange-500 to-red-600",
    },
  ]

  const resourcesLinks = [
    {
      name: "DSA Sheets",
      href: "/sheets",
      icon: <FilePen size={16} className="mr-2" />,
      gradient: "from-orange-500 to-amber-500",
      description: "Curated problem sets",
    },
    {
      name: "Tech Blogs",
      href: "/blogs",
      icon: <LayoutDashboard size={16} className="mr-2" />,
      gradient: "from-blue-500 to-indigo-500",
      description: "Latest tech insights",
    },
    {
      name: "Coding Problems",
      href: "/problems",
      icon: <Code size={16} className="mr-2" />,
      gradient: "from-green-500 to-emerald-500",
      description: "Practice challenges",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${isScrolled
          ? "bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-lg shadow-black/20"
          : "bg-transparent"
          }`}
      >
        <div className="container flex h-16 items-center">
          {/* Logo with animation */}
          <Link href="/" className="flex items-center mr-8 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-orange-600 to-orange-600 text-white px-3 py-2 rounded-lg">
                <Sparkles size={20} className="inline mr-2 animate-pulse" />
                <span className="font-bold text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  VibeArmor
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8 mx-6">
            {navLinks.map((link) => {
              if (link.requiresAuth && !user) return null
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition-all duration-300 hover:scale-105 group ${isActive ? "text-orange-400" : "text-slate-300 hover:text-white"
                    }`}
                >
                  <span className="relative z-10 flex items-center">
                    {link.icon}
                    {link.name}
                  </span>
                  {isActive && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${link.gradient} opacity-10 rounded-lg scale-110 animate-pulse`}
                    ></div>
                  )}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-500 transition-all duration-300 group-hover:w-full"></div>
                </Link>
              )
            })}

            {/* Enhanced Resources dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-sm font-medium text-slate-300 transition-all duration-300 hover:text-white hover:scale-105 group">
                  <Zap size={16} className="mr-2 group-hover:animate-pulse" />
                  Resources
                  <ChevronDown size={16} className="ml-1 transition-transform duration-300 group-hover:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-72 bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl"
              >
                <DropdownMenuLabel className="text-white font-semibold">
                  <div className="flex items-center">
                    <GraduationCap size={16} className="mr-2 text-orange-500" />
                    Learning Resources
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700/50" />
                {resourcesLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild className="group">
                    <Link
                      href={link.href}
                      className="flex items-start p-3 rounded-lg transition-all duration-300 hover:bg-slate-800/50"
                    >
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${link.gradient} text-white mr-3 group-hover:scale-110 transition-transform duration-300`}
                      >
                        {link.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white">{link.name}</div>
                        <div className="text-slate-400 mt-1">{link.description}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className={`flex items-center text-sm font-medium transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg ${pathname === "/admin"
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
              >
                <ShieldCheck size={16} className="mr-2" />
                Admin
              </Link>
            )}
          </nav>

          {/* Enhanced Auth/Profile section */}
          <div className="flex items-center space-x-4 ml-auto">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-3 rounded-full p-1 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                    <div className="relative">
                      <Avatar className="h-10 w-10 ring-2 ring-gradient-to-r from-orange-500 to-orange-500 ring-offset-2 ring-offset-slate-900">
                        <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-500 text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl"
                >
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-r from-orange-500 to-orange-500 text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700/50" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center cursor-pointer p-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white mr-3">
                        <User size={14} />
                      </div>
                      <div>
                        <div className="font-medium">Profile</div>
                        <div className="text-xs text-slate-400">Manage your account</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/submissions"
                      className="flex items-center cursor-pointer p-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-950/50 dark:hover:to-teal-950/50"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white mr-3">
                        <ClipboardList size={14} />
                      </div>
                      <div>
                        <div className="font-medium">My Submissions</div>
                        <div className="text-xs text-slate-400">View your progress</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin"
                        className="flex items-center cursor-pointer p-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950/50 dark:hover:to-pink-950/50"
                      >
                        <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white mr-3">
                          <ShieldCheck size={14} />
                        </div>
                        <div>
                          <div className="font-medium">Admin Panel</div>
                          <div className="text-xs text-slate-400">System management</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-slate-700/50" />
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-300"
                    onClick={handleLogout}
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white mr-3">
                      <LogOut size={14} />
                    </div>
                    <div>
                      <div className="font-medium">Logout</div>
                      <div className="text-xs opacity-75">Sign out of your account</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-3">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="transition-all duration-300 hover:scale-105 hover:bg-slate-100"
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                >
                  <Link href="/register" className="flex items-center">
                    <Sparkles size={16} className="mr-2" />
                    Sign up
                  </Link>
                </Button>
              </div>
            )}

            {/* Enhanced Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden relative transition-all duration-300 hover:scale-110 hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute h-0.5 w-6 bg-slate-600 dark:bg-slate-300 transform transition-all duration-300 ${mobileMenuOpen ? "rotate-45 top-3" : "top-1"}`}
                ></span>
                <span
                  className={`absolute h-0.5 w-6 bg-slate-600 dark:bg-slate-300 top-3 transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`}
                ></span>
                <span
                  className={`absolute h-0.5 w-6 bg-slate-600 dark:bg-slate-300 transform transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 top-3" : "top-5"}`}
                ></span>
              </div>
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile menu */}
      <div
        className={`fixed inset-0 top-16 z-40 w-full bg-slate-900/95 backdrop-blur-xl md:hidden transition-all duration-500 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        <div className="container py-6 space-y-6 h-full overflow-y-auto">
          <nav className="space-y-2">
            {navLinks.map((link, index) => {
              if (link.requiresAuth && !user) return null
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-300 hover:scale-105 ${isActive
                    ? `bg-gradient-to-r ${link.gradient} text-white shadow-lg`
                    : "hover:bg-slate-800 text-slate-300"
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              )
            })}

            {/* Resources section in mobile */}
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-white mb-3 flex items-center">
                <GraduationCap size={16} className="mr-2 text-blue-500" />
                Resources
              </p>
              <div className="space-y-2 pl-2">
                {resourcesLinks.map((link, index) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center p-3 rounded-xl hover:bg-slate-800 transition-all duration-300"
                    style={{ animationDelay: `${(navLinks.length + index) * 100}ms` }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${link.gradient} text-white mr-3`}>
                      {link.icon}
                    </div>
                    <div>
                      <div className="font-medium text-white">{link.name}</div>
                      <div className="text-xs text-slate-400">{link.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center px-4 py-3 text-sm rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShieldCheck size={16} className="mr-2" />
                Admin Panel
              </Link>
            )}
          </nav>

          {!user && (
            <div className="grid grid-cols-2 gap-3 px-4">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="transition-all duration-300 hover:scale-105"
                onClick={() => setMobileMenuOpen(false)} // Add this line
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                onClick={() => setMobileMenuOpen(false)} // Add this line
              >
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}
          {user && (
            <div className="border-t border-slate-700 pt-6 px-4">
              <div className="flex items-center justify-between py-3 mb-4">
                <div className="flex items-center">
                  <div className="relative">
                    <Avatar className="h-12 w-12 mr-3 ring-2 ring-orange-500 ring-offset-2 ring-offset-slate-900">
                      <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-orange-500 text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center p-3 rounded-xl hover:bg-slate-800 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-500 text-white mr-3">
                    <User size={14} />
                  </div>
                  <div>
                    <div className="font-medium "><span className="text-white">Profile</span></div>
                    <div className="text-xs text-slate-400">Manage your account</div>
                  </div>
                </Link>
                <Link
                  href="/submissions"
                  className="flex items-center p-3 rounded-xl hover:bg-slate-800 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white mr-3">
                    <ClipboardList size={14} />
                  </div>
                  <div>
                    <div className="font-medium text-white">My Submissions</div>
                    <div className="text-xs text-slate-400">View your progress</div>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center justify-start p-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-300"
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white mr-3">
                    <LogOut size={14} />
                  </div>
                  <div>
                    <div className="font-medium">Logout</div>
                    <div className="text-xs opacity-75">Sign out of your account</div>
                  </div>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10">{children}</main>

      {/* Enhanced Footer */}
      <footer className="relative border-t border-slate-700/50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-300 overflow-hidden">
        {/* Footer background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 animate-pulse"></div>

        <div className="container relative py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand section */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-600 rounded-lg blur opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-orange-600 to-orange-600 text-white px-3 py-2 rounded-lg">
                    <Sparkles size={20} className="inline mr-2" />
                    <span className="font-bold text-xl">VibeArmor</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                Mastering algorithms, one problem at a time. Join thousands of developers improving their coding skills
                with our curated problem sets and comprehensive learning resources.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-sm text-slate-400">
                  <Heart size={16} className="mr-2 text-red-500 animate-pulse" />
                  Made with love for developers
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center">
                <Code size={16} className="mr-2 text-orange-400" />
                Quick Links
              </h3>
              <ul className="space-y-2">
                {["About", "Contact", "Privacy", "Terms"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-orange-400 rounded-full mr-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center">
                <BookOpen size={16} className="mr-2 text-emerald-400" />
                Resources
              </h3>
              <ul className="space-y-2">
                {resourcesLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-emerald-400 rounded-full mr-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="border-t border-slate-700/50 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-slate-400">
                <div className="flex items-center">
                  <Shield size={16} className="mr-2 text-green-400" />
                  Secure & Trusted
                </div>
                <div className="flex items-center">
                  <Zap size={16} className="mr-2 text-yellow-400" />
                  Lightning Fast
                </div>
                <div className="flex items-center">
                  <Heart size={16} className="mr-2 text-red-400" />
                  Community Driven
                </div>
              </div>

              <div className="text-sm text-slate-400 flex items-center">
                <Mail size={16} className="mr-2" />© {new Date().getFullYear()} VibeArmor. All rights reserved.
              </div>
            </div>
          </div>

          {/* Floating particles effect */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
