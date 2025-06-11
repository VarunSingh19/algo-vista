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
  Github,
  Twitter,
  Linkedin,
  Youtube,
  ArrowUp,
  Menu,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [showBackToTop, setShowBackToTop] = React.useState(false)
  const [navbarVisible, setNavbarVisible] = React.useState(true)
  const [lastScrollY, setLastScrollY] = React.useState(0)

  // Enhanced scroll effects
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Navbar background effect
      setIsScrolled(currentScrollY > 20)

      // Auto-hide navbar on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavbarVisible(false)
      } else {
        setNavbarVisible(true)
      }

      // Back to top button
      setShowBackToTop(currentScrollY > 400)

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Navigation links configuration with enhanced styling
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

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com", color: "hover:text-gray-400" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com", color: "hover:text-blue-400" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com", color: "hover:text-blue-600" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com", color: "hover:text-red-500" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-x-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400/20 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Navbar with auto-hide */}
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-700 ease-out ${navbarVisible ? "translate-y-0" : "-translate-y-full"
          } ${isScrolled
            ? "bg-slate-900/80 backdrop-blur-2xl border-b border-slate-700/50 shadow-2xl shadow-black/20"
            : "bg-transparent"
          }`}
      >
        {/* Gradient line at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

        <div className="container flex h-20 items-center">
          {/* Enhanced Logo with premium animations */}
          <Link href="/" className="flex items-center mr-8 group relative">
            <div className="relative transform transition-all duration-500 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-r from-orange-600 to-orange-600 text-white px-4 py-3 rounded-xl shadow-lg">
                <Sparkles size={24} className="inline mr-3 animate-pulse-glow" />
                <span className="font-bold text-2xl bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
                  VibeArmor
                </span>
              </div>
              {/* Ripple effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            </div>
          </Link>

          {/* Enhanced Desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-8 mx-8">
            {navLinks.map((link, index) => {
              if (link.requiresAuth && !user) return null
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition-all duration-500 hover:scale-110 group ${isActive ? "text-orange-400" : "text-slate-300 hover:text-white"
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="relative z-10 flex items-center px-4 py-2 rounded-lg">
                    {link.icon}
                    {link.name}
                  </span>

                  {/* Active state background */}
                  {isActive && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${link.gradient} opacity-20 rounded-lg animate-pulse-subtle`}
                    ></div>
                  )}

                  {/* Hover underline animation */}
                  <div className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500 group-hover:w-full group-hover:left-0 rounded-full"></div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-white/5 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </Link>
              )
            })}

            {/* Enhanced Resources dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-sm font-medium text-slate-300 transition-all duration-500 hover:text-white hover:scale-110 group px-4 py-2 rounded-lg hover:bg-white/5">
                  <Zap size={16} className="mr-2 group-hover:animate-pulse transition-all duration-300" />
                  Resources
                  <ChevronDown size={16} className="ml-2 transition-transform duration-500 group-hover:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-80 bg-slate-900/95 backdrop-blur-2xl border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden animate-slide-down"
              >
                <DropdownMenuLabel className="text-white font-semibold p-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 mr-3">
                      <GraduationCap size={16} className="text-white" />
                    </div>
                    Learning Resources
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
                {resourcesLinks.map((link, index) => (
                  <DropdownMenuItem key={link.name} asChild className="group p-0">
                    <Link
                      href={link.href}
                      className="flex items-start p-4 rounded-xl transition-all duration-300 hover:bg-slate-800/50 m-2 animate-slide-in-stagger"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${link.gradient} text-white mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        {link.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white group-hover:text-orange-300 transition-colors duration-300">
                          {link.name}
                        </div>
                        <div className="text-slate-400 text-sm mt-1">{link.description}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className={`flex items-center text-sm font-medium transition-all duration-500 hover:scale-110 px-4 py-2 rounded-xl ${pathname === "/admin"
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
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
                  <button className="flex items-center space-x-3 rounded-full p-2 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 group">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-orange-500 ring-offset-2 ring-offset-slate-900 transition-all duration-300 group-hover:ring-4">
                        <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse-glow"></div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-72 bg-slate-900/95 backdrop-blur-2xl border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden animate-slide-down"
                >
                  <DropdownMenuLabel className="font-normal p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-14 w-14 ring-2 ring-orange-500">
                        <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-lg font-semibold text-white">{user.name}</p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                        <div className="flex items-center mt-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          <span className="text-xs text-green-400 font-medium">Online</span>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

                  {[
                    {
                      href: "/profile",
                      icon: User,
                      label: "Profile",
                      desc: "Manage your account",
                      gradient: "from-blue-500 to-purple-500",
                    },
                    {
                      href: "/submissions",
                      icon: ClipboardList,
                      label: "My Submissions",
                      desc: "View your progress",
                      gradient: "from-emerald-500 to-teal-500",
                    },
                  ].map((item, index) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className="flex items-center cursor-pointer p-4 transition-all duration-300 hover:bg-slate-800/50 m-2 rounded-xl animate-slide-in-stagger"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${item.gradient} text-white mr-4 transition-transform duration-300 hover:scale-110`}
                        >
                          <item.icon size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-white">{item.label}</div>
                          <div className="text-xs text-slate-400">{item.desc}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin"
                        className="flex items-center cursor-pointer p-4 transition-all duration-300 hover:bg-slate-800/50 m-2 rounded-xl"
                      >
                        <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white mr-4 transition-transform duration-300 hover:scale-110">
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-white">Admin Panel</div>
                          <div className="text-xs text-slate-400">System management</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer p-4 text-red-400 hover:bg-red-950/50 transition-all duration-300 m-2 rounded-xl"
                    onClick={handleLogout}
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white mr-4 transition-transform duration-300 hover:scale-110">
                      <LogOut size={16} />
                    </div>
                    <div>
                      <div className="font-medium">Logout</div>
                      <div className="text-xs opacity-75">Sign out of your account</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden lg:flex space-x-3">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="transition-all duration-500 hover:scale-110 hover:bg-slate-100 border-slate-600 hover:border-slate-400"
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 shadow-lg hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 hover:scale-110 relative overflow-hidden group"
                >
                  <Link href="/register" className="flex items-center relative z-10">
                    <Sparkles size={16} className="mr-2 animate-pulse" />
                    Sign up
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  </Link>
                </Button>
              </div>
            )}

            {/* Enhanced Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden relative transition-all duration-500 hover:scale-110 hover:bg-slate-800/50 rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="relative w-6 h-6">
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-300 animate-spin-in" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-300 animate-fade-in" />
                )}
              </div>
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile menu with backdrop blur */}
      <div
        className={`fixed inset-0 top-20 z-40 w-full bg-slate-900/95 backdrop-blur-2xl lg:hidden transition-all duration-700 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        <div className="container py-8 space-y-8 h-full overflow-y-auto">
          <nav className="space-y-3">
            {navLinks.map((link, index) => {
              if (link.requiresAuth && !user) return null
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center px-6 py-4 text-lg rounded-2xl transition-all duration-500 hover:scale-105 animate-slide-in-stagger ${isActive
                    ? `bg-gradient-to-r ${link.gradient} text-white shadow-lg shadow-orange-500/25`
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className={`p-2 rounded-lg ${isActive ? "bg-white/20" : "bg-slate-700"} mr-4`}>{link.icon}</div>
                  {link.name}
                </Link>
              )
            })}

            {/* Mobile Resources section */}
            <div className="px-6 py-4">
              <p className="text-lg font-semibold text-white mb-4 flex items-center">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 mr-3">
                  <GraduationCap size={16} className="text-white" />
                </div>
                Resources
              </p>
              <div className="space-y-3 pl-2">
                {resourcesLinks.map((link, index) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center p-4 rounded-2xl hover:bg-slate-800/50 transition-all duration-500 animate-slide-in-stagger"
                    style={{ animationDelay: `${(navLinks.length + index) * 100}ms` }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${link.gradient} text-white mr-4`}>
                      {link.icon}
                    </div>
                    <div>
                      <div className="font-medium text-white">{link.name}</div>
                      <div className="text-sm text-slate-400">{link.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Mobile auth section */}
          {!user ? (
            <div className="grid grid-cols-2 gap-4 px-6">
              <Button
                asChild
                variant="outline"
                className="transition-all duration-500 hover:scale-105 border-slate-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 transition-all duration-500 hover:scale-105"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          ) : (
            <div className="border-t border-slate-700/50 pt-8 px-6">
              <div className="flex items-center justify-between py-4 mb-6">
                <div className="flex items-center">
                  <div className="relative">
                    <Avatar className="h-14 w-14 mr-4 ring-2 ring-orange-500 ring-offset-2 ring-offset-slate-900">
                      <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{user.name}</p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-green-400">Online</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    href: "/profile",
                    icon: User,
                    label: "Profile",
                    desc: "Manage your account",
                    gradient: "from-blue-500 to-purple-500",
                  },
                  {
                    href: "/submissions",
                    icon: ClipboardList,
                    label: "My Submissions",
                    desc: "View your progress",
                    gradient: "from-emerald-500 to-teal-500",
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center p-4 rounded-2xl hover:bg-slate-800/50 transition-all duration-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${item.gradient} text-white mr-4`}>
                      <item.icon size={16} />
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.label}</div>
                      <div className="text-sm text-slate-400">{item.desc}</div>
                    </div>
                  </Link>
                ))}

                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-start p-4 text-left text-red-400 hover:bg-red-950/50 transition-all duration-500 rounded-2xl"
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                >
                  <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white mr-4">
                    <LogOut size={16} />
                  </div>
                  <div>
                    <div className="font-medium">Logout</div>
                    <div className="text-sm opacity-75">Sign out of your account</div>
                  </div>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10 pt-20">{children}</main>

      {/* Enhanced Premium Footer */}
      <footer className="relative border-t border-slate-700/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-300 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent animate-pulse-slow"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/3 via-purple-600/3 to-pink-600/3 animate-gradient-shift"></div>

          {/* Floating geometric shapes */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-float-slow"></div>
            </div>
          ))}
        </div>

        <div className="container relative py-16 md:py-20">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Enhanced Brand section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-r from-orange-600 to-orange-600 text-white px-4 py-3 rounded-xl">
                    <Sparkles size={24} className="inline mr-3 animate-pulse-glow" />
                    <span className="font-bold text-2xl">VibeArmor</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-400 text-lg leading-relaxed max-w-md animate-fade-in-up">
                Mastering algorithms, one problem at a time. Join thousands of developers improving their coding skills
                with our curated problem sets and comprehensive learning resources.
              </p>

              {/* Enhanced social media icons */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 transition-all duration-500 hover:scale-110 hover:bg-slate-700/50 ${social.color} group animate-slide-in-stagger`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <social.icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
                  </a>
                ))}
              </div>

              <div className="flex items-center space-x-6 text-sm text-slate-400">
                <div className="flex items-center animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                  <Heart size={16} className="mr-2 text-red-500 animate-pulse-glow" />
                  Made with love for developers
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <h3 className="font-semibold text-white mb-6 flex items-center text-lg">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 mr-3">
                  <Briefcase size={16} className="text-white" />
                </div>
                Company
              </h3>
              <ul className="space-y-3">
                {["About", "Contact", "Privacy", "Terms"].map((item, index) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-slate-400 hover:text-white transition-all duration-500 hover:translate-x-2 flex items-center group text-sm animate-slide-in-stagger"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-3 opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></span>
                      {item}
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ChevronDown size={14} className="rotate-[-90deg]" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Access */}
            <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <h3 className="font-semibold text-white mb-6 flex items-center text-lg">
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 mr-3">
                  <Zap size={16} className="text-white" />
                </div>
                Quick Access
              </h3>
              <ul className="space-y-3">
                {resourcesLinks.map((item, index) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-white transition-all duration-500 hover:translate-x-2 flex items-center group text-sm animate-slide-in-stagger"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3 opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></span>
                      {item.name}
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ChevronDown size={14} className="rotate-[-90deg]" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Enhanced footer bottom */}
          <div className="border-t border-slate-700/50 pt-8">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start space-x-8 text-sm text-slate-400">
                {[
                  { icon: Shield, text: "Secure & Trusted", color: "text-green-400" },
                  { icon: Zap, text: "Lightning Fast", color: "text-yellow-400" },
                  { icon: Heart, text: "Community Driven", color: "text-red-400" },
                ].map((item, index) => (
                  <div
                    key={item.text}
                    className="flex items-center animate-fade-in-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <item.icon size={16} className={`mr-2 ${item.color} animate-pulse-subtle`} />
                    {item.text}
                  </div>
                ))}
              </div>

              {/* Copyright */}
              <div
                className="text-sm text-slate-400 flex items-center animate-fade-in-up"
                style={{ animationDelay: "600ms" }}
              >
                <Mail size={16} className="mr-2" />© {new Date().getFullYear()} VibeArmor. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-orange-600 to-orange-600 text-white rounded-full shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-orange-500/25 ${showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
      >
        <ArrowUp size={20} className="animate-bounce" />
      </button>
    </div>
  )
}
