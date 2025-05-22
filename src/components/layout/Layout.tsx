// 'use client';

// import React from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   Menu,
//   X,
//   LogOut,
//   Home,
//   User,
//   FilePen,
//   ShieldCheck,
//   BookOpen,
//   ChevronDown,
//   GraduationCap,
//   LayoutDashboard,
//   Code
// } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export default function Layout({ children }: { children: React.ReactNode }) {
//   const { user, logout } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       router.push('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // Navigation links configuration
//   const navLinks = [
//     {
//       name: 'Home',
//       href: '/',
//       icon: <Home size={16} className="mr-2" />,
//     },
//     {
//       name: 'Sheets',
//       href: '/sheets',
//       icon: <BookOpen size={16} className="mr-2" />,
//     },
//   ];

//   const resourcesLinks = [
//     {
//       name: 'DSA Sheets',
//       href: '/sheets',
//       icon: <FilePen size={16} className="mr-2" />,
//       color: 'text-orange-500',
//     },
//     {
//       name: 'System Design',
//       href: '/sheets',
//       icon: <LayoutDashboard size={16} className="mr-2" />,
//       color: 'text-blue-500',
//     },
//     {
//       name: 'Coding Problems',
//       href: '/sheets',
//       icon: <Code size={16} className="mr-2" />,
//       color: 'text-green-500',
//     },
//   ];

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       {/* Navbar */}
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-14 items-center">
//           {/* Logo */}
//           <Link href="/" className="flex items-center mr-6">
//             <span className="font-bold text-xl">AlgoVista</span>
//           </Link>

//           {/* Desktop navigation */}
//           <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
//                   }`}
//               >
//                 {link.name}
//               </Link>
//             ))}

//             {/* Resources dropdown */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <button className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
//                   Resources
//                   <ChevronDown size={16} className="ml-1" />
//                 </button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-56">
//                 <DropdownMenuLabel>Learning Resources</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 {resourcesLinks.map((link) => (
//                   <DropdownMenuItem key={link.name} asChild>
//                     <Link href={link.href} className={`flex items-center ${link.color}`}>
//                       {link.icon}
//                       {link.name}
//                     </Link>
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {user?.role === 'admin' && (
//               <Link
//                 href="/admin"
//                 className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/admin' ? 'text-foreground' : 'text-muted-foreground'
//                   }`}
//               >
//                 Admin
//               </Link>
//             )}
//           </nav>

//           {/* Right side - Auth/Profile section */}
//           <div className="flex items-center space-x-4 ml-auto">
//             {user ? (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <button className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
//                     <Avatar className="h-8 w-8">
//                       <AvatarImage src={user.avatarUrl} alt={user.name} />
//                       <AvatarFallback className="text-xs">
//                         {user.name.charAt(0).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <span className="hidden lg:inline-block text-sm font-medium">
//                       {user.name.split(' ')[0]}
//                     </span>
//                   </button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-56">
//                   <DropdownMenuLabel className="font-normal">
//                     <div className="flex flex-col space-y-1">
//                       <p className="text-sm font-medium leading-none">{user.name}</p>
//                       <p className="text-xs leading-none text-muted-foreground">
//                         {user.email}
//                       </p>
//                     </div>
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem asChild>
//                     <Link href="/profile" className="flex items-center cursor-pointer">
//                       <User size={16} className="mr-2" />
//                       Profile
//                     </Link>
//                   </DropdownMenuItem>
//                   {user.role === 'admin' && (
//                     <DropdownMenuItem asChild>
//                       <Link href="/admin" className="flex items-center cursor-pointer">
//                         <ShieldCheck size={16} className="mr-2" />
//                         Admin Panel
//                       </Link>
//                     </DropdownMenuItem>
//                   )}
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     className="flex items-center cursor-pointer text-destructive focus:text-destructive"
//                     onClick={handleLogout}
//                   >
//                     <LogOut size={16} className="mr-2" />
//                     Logout
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <div className="hidden md:flex space-x-2">
//                 <Button asChild variant="ghost" size="sm">
//                   <Link href="/login">Log in</Link>
//                 </Button>
//                 <Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600">
//                   <Link href="/register">Sign up</Link>
//                 </Button>
//               </div>
//             )}

//             {/* Mobile menu button */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Mobile menu */}
//       {mobileMenuOpen && (
//         <div className="fixed inset-0 top-14 z-40 w-full bg-background md:hidden">
//           <div className="container py-4 space-y-4">
//             <nav className="grid gap-2">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.name}
//                   href={link.href}
//                   className={`flex items-center px-3 py-2 text-sm rounded-md ${pathname === link.href
//                     ? 'bg-accent text-accent-foreground'
//                     : 'hover:bg-accent hover:text-accent-foreground'
//                     }`}
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   {link.icon}
//                   {link.name}
//                 </Link>
//               ))}

//               {/* Resources section in mobile */}
//               <div className="px-3 py-2">
//                 <p className="text-sm font-medium text-muted-foreground mb-2">Resources</p>
//                 <div className="grid gap-1 pl-2">
//                   {resourcesLinks.map((link) => (
//                     <Link
//                       key={link.name}
//                       href={link.href}
//                       className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground ${link.color}`}
//                       onClick={() => setMobileMenuOpen(false)}
//                     >
//                       {link.icon}
//                       {link.name}
//                     </Link>
//                   ))}
//                 </div>
//               </div>

//               {user?.role === 'admin' && (
//                 <Link
//                   href="/admin"
//                   className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <ShieldCheck size={16} className="mr-2" />
//                   Admin Panel
//                 </Link>
//               )}
//             </nav>

//             {!user && (
//               <div className="grid grid-cols-2 gap-2">
//                 <Button asChild variant="outline" size="sm">
//                   <Link href="/login">Log in</Link>
//                 </Button>
//                 <Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600">
//                   <Link href="/register">Sign up</Link>
//                 </Button>
//               </div>
//             )}

//             {user && (
//               <div className="border-t pt-4">
//                 <div className="flex items-center justify-between py-2">
//                   <div className="flex items-center">
//                     <Avatar className="h-8 w-8 mr-2">
//                       <AvatarImage src={user.avatarUrl} alt={user.name} />
//                       <AvatarFallback className="text-xs">
//                         {user.name.charAt(0).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="text-sm font-medium">{user.name}</p>
//                       <p className="text-xs text-muted-foreground">{user.email}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="grid gap-1 mt-2">
//                   <Link
//                     href="/profile"
//                     className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     <User size={16} className="mr-2" />
//                     Profile
//                   </Link>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="flex items-center justify-start px-3 text-left text-destructive hover:bg-destructive/10 hover:text-destructive"
//                     onClick={() => {
//                       handleLogout();
//                       setMobileMenuOpen(false);
//                     }}
//                   >
//                     <LogOut size={16} className="mr-2" />
//                     Logout
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <main className="flex-1">{children}</main>

//       {/* Footer */}
//       <footer className="border-t py-6 md:py-8 bg-zinc-950 text-zinc-400">
//         <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
//           <div className="flex flex-col items-center md:items-start">
//             <div className="font-bold text-white">AlgoVista</div>
//             <p className="text-xs">Mastering algorithms, one problem at a time</p>
//           </div>
//           <div className="flex space-x-4 text-xs">
//             <Link href="/about" className="hover:text-white">About</Link>
//             <Link href="/contact" className="hover:text-white">Contact</Link>
//             <Link href="/privacy" className="hover:text-white">Privacy</Link>
//             <Link href="/terms" className="hover:text-white">Terms</Link>
//           </div>
//           <div className="text-xs text-center md:text-right">
//             © {new Date().getFullYear()} AlgoVista. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Menu,
  X,
  LogOut,
  Home,
  User,
  FilePen,
  ShieldCheck,
  BookOpen,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  Code
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Navigation links configuration
  const navLinks = [
    {
      name: 'Home',
      href: '/',
      icon: <Home size={16} className="mr-2" />,
    },
    {
      name: 'Sheets',
      href: '/sheets',
      icon: <BookOpen size={16} className="mr-2" />,
    },
  ];

  const resourcesLinks = [
    {
      name: 'DSA Sheets',
      href: '/sheets',
      icon: <FilePen size={16} className="mr-2" />,
      color: 'text-orange-500',
    },
    {
      name: 'Tech Blogs',
      href: '/blogs',
      icon: <LayoutDashboard size={16} className="mr-2" />,
      color: 'text-blue-500',
    },
    {
      name: 'Coding Problems',
      href: '/problems',
      icon: <Code size={16} className="mr-2" />,
      color: 'text-green-500',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center mr-6">
            <span className="font-bold text-xl">AlgoVista</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Resources dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Resources
                  <ChevronDown size={16} className="ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Learning Resources</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {resourcesLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link href={link.href} className={`flex items-center ${link.color}`}>
                      {link.icon}
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/admin' ? 'text-foreground' : 'text-muted-foreground'
                  }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right side - Auth/Profile section */}
          <div className="flex items-center space-x-4 ml-auto">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline-block text-sm font-medium">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center cursor-pointer">
                        <ShieldCheck size={16} className="mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-14 z-40 w-full bg-background md:hidden">
          <div className="container py-4 space-y-4">
            <nav className="grid gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-md ${pathname === link.href
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              {/* Resources section in mobile */}
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">Resources</p>
                <div className="grid gap-1 pl-2">
                  {resourcesLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground ${link.color}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShieldCheck size={16} className="mr-2" />
                  Admin Panel
                </Link>
              )}
            </nav>

            {!user && (
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}

            {user && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-1 mt-2">
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center justify-start px-3 text-left text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8 bg-zinc-950 text-zinc-400">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start">
            <div className="font-bold text-white">AlgoVista</div>
            <p className="text-xs">Mastering algorithms, one problem at a time</p>
          </div>
          <div className="flex space-x-4 text-xs">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
          <div className="text-xs text-center md:text-right">
            © {new Date().getFullYear()} AlgoVista. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
