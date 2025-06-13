// import type { Metadata, Viewport } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { AuthProvider } from "@/contexts/AuthContext";
// import Layout from "@/components/layout/Layout";

// const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// export const metadata: Metadata = {
//   title: "VibeArmor - Track Your Algorithm Progress",
//   description: "Track your progress on algorithm problems with personalized sheets and statistics.",
// };

// export const viewport: Viewport = {
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "white" },
//     { media: "(prefers-color-scheme: dark)", color: "black" },
//   ],
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`font-sans ${inter.variable}`}>
//         <AuthProvider>
//           <Layout>{children}</Layout>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }


// import type { Metadata, Viewport } from "next"
// import { Inter, JetBrains_Mono } from 'next/font/google'
// import "./globals.css"
// import { AuthProvider } from "@/contexts/AuthContext"
// import Layout from "@/components/layout/Layout"


// // Optimized font loading with display swap for better performance
// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-sans",
//   display: "swap",
//   preload: true,
// })

// const jetbrainsMono = JetBrains_Mono({
//   subsets: ["latin"],
//   variable: "--font-mono",
//   display: "swap",
// })

// // Enhanced SEO metadata
// export const metadata: Metadata = {
//   // Basic metadata
//   title: {
//     default: "VibeArmor - Master Algorithms & Data Structures",
//     template: "%s | VibeArmor - Algorithm Mastery Platform",
//   },
//   description:
//     "Master algorithms and data structures with VibeArmor's comprehensive tracking system. Practice coding problems, track progress, earn achievements, and level up your programming skills with personalized learning paths.",

//   // Keywords for SEO
//   keywords: [
//     "algorithm practice",
//     "data structures",
//     "coding problems",
//     "leetcode alternative",
//     "programming practice",
//     "coding interview prep",
//     "algorithm visualization",
//     "coding challenges",
//     "software engineering",
//     "competitive programming",
//     "coding bootcamp",
//     "technical interview",
//     "algorithm complexity",
//     "coding skills",
//     "programming fundamentals",
//   ],

//   // Author and creator information
//   authors: [{ name: "VibeArmor Team", url: "https://vibearmor.com/about" }],
//   creator: "VibeArmor",
//   publisher: "VibeArmor",

//   // Robots and indexing
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-video-preview": -1,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },

//   // Open Graph metadata for social sharing
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: "https://vibearmor.com",
//     siteName: "VibeArmor",
//     title: "VibeArmor - Master Algorithms & Data Structures",
//     description:
//       "Transform your coding skills with VibeArmor's interactive algorithm practice platform. Track progress, solve challenges, and master data structures with gamified learning.",
//     images: [
//       {
//         url: "https://res-console.cloudinary.com/dvbw76boh/thumbnails/v1/image/upload/v1749755149/Q2hhdEdQVF9JbWFnZV9KdW5fMTJfMjAyNV8wMV8yMF8xM19QTV95aGJjMG0=/drilldown",
//         width: 1200,
//         height: 630,
//         alt: "VibeArmor - Algorithm Mastery Platform",
//         type: "image/png",
//       },
//       {
//         url: "/logo.png",
//         width: 1200,
//         height: 1200,
//         alt: "https://res-console.cloudinary.com/dvbw76boh/thumbnails/v1/image/upload/v1749755149/Q2hhdEdQVF9JbWFnZV9KdW5fMTJfMjAyNV8wMV8yMF8xM19QTV95aGJjMG0=/drilldown",
//         type: "image/png",
//       },
//     ],
//   },

//   // Twitter Card metadata
//   twitter: {
//     card: "summary_large_image",
//     site: "@vibearmor",
//     creator: "@vibearmor",
//     title: "VibeArmor - Master Algorithms & Data Structures",
//     description:
//       "Transform your coding skills with interactive algorithm practice. Track progress, solve challenges, and master data structures.",
//     images: ["https://vibearmor.com/twitter-image.png"],
//   },

//   // App-specific metadata
//   applicationName: "VibeArmor",
//   referrer: "origin-when-cross-origin",
//   category: "Education",
//   classification: "Educational Technology",

//   // Verification tags for search engines
//   verification: {
//     google: "your-google-verification-code",
//     yandex: "your-yandex-verification-code",
//     yahoo: "your-yahoo-verification-code",
//     other: {
//       "msvalidate.01": "your-bing-verification-code",
//     },
//   },

//   // App icons and manifest
//   manifest: "/manifest.json",
//   icons: {
//     icon: [
//       { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
//       { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
//       { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
//     ],
//     apple: [
//       { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
//       { url: "/apple-touch-icon-152x152.png", sizes: "152x152", type: "image/png" },
//       { url: "/apple-touch-icon-144x144.png", sizes: "144x144", type: "image/png" },
//       { url: "/apple-touch-icon-120x120.png", sizes: "120x120", type: "image/png" },
//     ],
//     other: [
//       {
//         rel: "mask-icon",
//         url: "/safari-pinned-tab.svg",
//         color: "#3b82f6",
//       },
//     ],
//   },

//   // Additional metadata
//   metadataBase: new URL("https://vibearmor.com"),
//   alternates: {
//     canonical: "https://vibearmor.com",
//     languages: {
//       "en-US": "https://vibearmor.com",
//       "es-ES": "https://vibearmor.com/es",
//       "fr-FR": "https://vibearmor.com/fr",
//     },
//   },

//   // App store links
//   appLinks: {
//     ios: {
//       url: "https://apps.apple.com/app/vibearmor",
//       app_store_id: "your-app-store-id",
//     },
//     android: {
//       package: "com.vibearmor.app",
//       url: "https://play.google.com/store/apps/details?id=com.vibearmor.app",
//     },
//   },

//   // Additional tags
//   other: {
//     "apple-mobile-web-app-capable": "yes",
//     "apple-mobile-web-app-status-bar-style": "black-translucent",
//     "apple-mobile-web-app-title": "VibeArmor",
//     "mobile-web-app-capable": "yes",
//     "msapplication-TileColor": "#3b82f6",
//     "msapplication-config": "/browserconfig.xml",
//     "theme-color": "#3b82f6",
//   },
// }

// // Enhanced viewport configuration
// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
//   maximumScale: 5,
//   userScalable: true,
//   viewportFit: "cover",
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "#ffffff" },
//     { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
//   ],
//   colorScheme: "dark light",
// }

// // Structured data for SEO
// const structuredData = {
//   "@context": "https://schema.org",
//   "@type": "WebApplication",
//   name: "VibeArmor",
//   description:
//     "Master algorithms and data structures with VibeArmor's comprehensive tracking system. Practice coding problems, track progress, and level up your programming skills.",
//   url: "https://vibearmor.com",
//   applicationCategory: "EducationalApplication",
//   operatingSystem: "Web Browser",
//   offers: {
//     "@type": "Offer",
//     price: "0",
//     priceCurrency: "USD",
//   },
//   author: {
//     "@type": "Organization",
//     name: "VibeArmor",
//     url: "https://vibearmor.com",
//   },
//   publisher: {
//     "@type": "Organization",
//     name: "VibeArmor",
//     logo: {
//       "@type": "ImageObject",
//       url: "https://play.google.com/store/apps/details?id=com.vibearmor.app",
//     },
//   },
//   featureList: [
//     "Algorithm Practice",
//     "Progress Tracking",
//     "Interactive Challenges",
//     "Performance Analytics",
//     "Achievement System",
//     "Personalized Learning Paths",
//   ],
//   screenshot: "https://play.google.com/store/apps/details?id=com.vibearmor.app",
//   softwareVersion: "1.0.0",
//   datePublished: "2024-01-01",
//   dateModified: new Date().toISOString(),
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en" className="scroll-smooth" suppressHydrationWarning>
//       <head>
//         {/* Preconnect to external domains for performance */}
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link rel="preconnect" href="https://vitals.vercel-analytics.com" />

//         {/* DNS prefetch for external resources */}
//         <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

//         {/* Structured data */}
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(structuredData),
//           }}
//         />

//         {/* Additional meta tags for better SEO */}
//         <meta name="format-detection" content="telephone=no" />
//         <meta name="mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
//         <meta name="apple-mobile-web-app-title" content="VibeArmor" />

//         {/* Security headers */}
//         <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
//         <meta httpEquiv="X-Frame-Options" content="DENY" />
//         <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

//         {/* Performance hints */}
//         <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
//       </head>
//       <body
//         className={`font-sans antialiased ${inter.variable} ${jetbrainsMono.variable} bg-slate-950 text-white selection:bg-blue-500/20 selection:text-blue-200`}
//         suppressHydrationWarning
//       >
//         {/* Skip to main content for accessibility */}
//         <a
//           href="#main-content"
//           className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200"
//         >
//           Skip to main content
//         </a>

//         <AuthProvider>
//           <Layout>
//             <main id="main-content" className="min-h-screen">
//               {children}
//             </main>
//           </Layout>
//         </AuthProvider>



//         {/* Service Worker registration for PWA */}
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               if ('serviceWorker' in navigator) {
//                 window.addEventListener('load', function() {
//                   navigator.serviceWorker.register('/sw.js')
//                     .then(function(registration) {
//                       console.log('SW registered: ', registration);
//                     })
//                     .catch(function(registrationError) {
//                       console.log('SW registration failed: ', registrationError);
//                     });
//                 });
//               }
//             `,
//           }}
//         />
//       </body>
//     </html>
//   )
// }





import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from 'next/font/google'
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import Layout from "@/components/layout/Layout"
import { headers } from 'next/headers'

// Optimized font loading with display swap for better performance
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

// Generate schema.org structured data with dynamic date
function generateStructuredData() {
  // Current URL for canonical references
  const currentDate = new Date().toISOString()

  // Main WebApplication schema
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "VibeArmor",
    description:
      "Master algorithms and data structures with VibeArmor's comprehensive tracking system. Practice coding problems, track progress, and level up your programming skills.",
    url: "https://vibearmor.com",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "VibeArmor",
      url: "https://vibearmor.com",
    },
    publisher: {
      "@type": "Organization",
      name: "VibeArmor",
      logo: {
        "@type": "ImageObject",
        url: "https://res-console.cloudinary.com/dvbw76boh/thumbnails/v1/image/upload/v1749755149/Q2hhdEdQVF9JbWFnZV9KdW5fMTJfMjAyNV8wMV8yMF8xM19QTV95aGJjMG0=/drilldown",
      },
    },
    featureList: [
      "Algorithm Practice",
      "Progress Tracking",
      "Interactive Challenges",
      "Performance Analytics",
      "Achievement System",
      "Personalized Learning Paths",
    ],
    screenshot: "https://res-console.cloudinary.com/dvbw76boh/thumbnails/v1/image/upload/v1749755149/Q2hhdEdQVF9JbWFnZV9KdW5fMTJfMjAyNV8wMV8yMF8xM19QTV95aGJjMG0=/drilldown",
    softwareVersion: "1.0.0",
    datePublished: "2024-01-01",
    dateModified: currentDate,
  }

  // Course schema for educational content
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Algorithm and Data Structure Mastery",
    description: "Comprehensive training on algorithms and data structures for software engineers and competitive programmers",
    provider: {
      "@type": "Organization",
      name: "VibeArmor",
      sameAs: "https://vibearmor.com"
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT10H",
      educationalLevel: "Beginner to Advanced",
    },
    timeRequired: "PT40H",
    educationalUse: "Self-learning",
    audience: {
      "@type": "Audience",
      audienceType: "Software Engineers, Computer Science Students, Competitive Programmers"
    },
    dateModified: currentDate,
  }

  // FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How can VibeArmor help me prepare for technical interviews?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "VibeArmor offers a comprehensive system to track your algorithm practice, providing personalized learning paths, interactive challenges, and detailed analytics to help you master the skills needed for technical interviews."
        }
      },
      {
        "@type": "Question",
        name: "Is VibeArmor suitable for beginners in programming?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, VibeArmor offers content for all skill levels, from beginner-friendly introductions to advanced algorithm challenges, with guided learning paths to help you progress at your own pace."
        }
      },
      {
        "@type": "Question",
        name: "How is VibeArmor different from other coding practice platforms?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "VibeArmor focuses on comprehensive tracking of your progress, offering personalized insights, achievement systems, and an intuitive interface designed to make learning algorithms and data structures more engaging and effective."
        }
      }
    ]
  }

  // Breadcrumb schema for better navigation understanding
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vibearmor.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Algorithm Practice",
        item: "https://vibearmor.com/practice"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Learning Paths",
        item: "https://vibearmor.com/paths"
      }
    ]
  }

  return [webAppSchema, courseSchema, faqSchema, breadcrumbSchema]
}

// Dynamically generate title and descriptions based on URLs for better SEO
function generateDynamicSeoContent() {
  // In a production environment, you could derive this from the current URL
  return {
    title: "VibeArmor - Master Algorithms & Data Structures",
    description: "Master algorithms and data structures with VibeArmor's comprehensive tracking system. Practice coding problems, track progress, earn achievements, and level up your programming skills with personalized learning paths.",
    // More dynamic fields could be added here based on routes
  }
}

// More extensive keyword variations and long-tail keywords
const seoKeywords = [
  // Primary keywords
  "algorithm practice",
  "data structures",
  "coding problems",
  "leetcode alternative",

  // Secondary keywords
  "programming practice",
  "coding interview prep",
  "algorithm visualization",
  "coding challenges",

  // Long-tail keywords
  "how to master data structures for interviews",
  "best platform to practice algorithms",
  "track coding practice progress",
  "personalized algorithm learning path",
  "gamified coding interview preparation",
  "interactive data structure visualization tool",
  "algorithm complexity analysis practice",
  "step-by-step algorithm problem solving",

  // Question-based keywords
  "how to prepare for coding interviews",
  "what algorithms to learn for tech interviews",
  "how to improve algorithm problem solving skills",

  // Industry keywords
  "software engineering skills",
  "competitive programming training",
  "technical interview preparation",
  "computer science fundamentals",
  "coding bootcamp supplement",
]

// Enhanced metadata with dynamically generated content
export const metadata: Metadata = {
  // Dynamic basic metadata
  ...generateDynamicSeoContent(),

  // Extended title patterns
  title: {
    default: "VibeArmor - Master Algorithms & Data Structures",
    template: "%s | VibeArmor - Algorithm Mastery Platform",
  },

  // Enhanced description with clear value proposition and keywords
  description:
    "Master algorithms and data structures with VibeArmor's comprehensive tracking system. Practice 500+ coding problems, visualize concepts, track your progress with AI insights, and prepare for tech interviews with personalized learning paths and expert feedback.",

  // Expanded keywords for better SEO coverage
  keywords: seoKeywords,

  // Enhanced author and creator information
  authors: [
    { name: "VibeArmor Team", url: "https://vibearmor.com/about" },
    { name: "Algorithm Experts", url: "https://vibearmor.com/experts" }
  ],
  creator: "VibeArmor",
  publisher: "VibeArmor",

  // Enhanced robots directives
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Optimized Open Graph metadata with more engaging copy
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibearmor.com",
    siteName: "VibeArmor",
    title: "VibeArmor - Transform Your Coding Skills with Interactive Algorithm Practice",
    description:
      "Level up your programming skills with VibeArmor's interactive algorithm practice platform. Track progress across 500+ challenges, visualize data structures, and master algorithms with personalized learning paths and spaced repetition.",
    images: [
      {
        url: "https://res-console.cloudinary.com/dvbw76boh/thumbnails/v1/image/upload/v1749755149/Q2hhdEdQVF9JbWFnZV9KdW5fMTJfMjAyNV8wMV8yMF8xM19QTV95aGJjMG0=/drilldown",
        width: 1200,
        height: 630,
        alt: "VibeArmor - Algorithm Mastery Platform",
        type: "image/png",
        secureUrl: "https://res-console.cloudinary.com/dvbw76boh/thumbnails/v1/image/upload/v1749755149/Q2hhdEdQVF9JbWFnZV9KdW5fMTJfMjAyNV8wMV8yMF8xM19QTV95aGJjMG0=/drilldown",
      },
      {
        url: "https://res-console.cloudinary.com/dvbw76boh/thumbnails/v1/image/upload/v1749755149/Q2hhdEdQVF9JbWFnZV9KdW5fMTJfMjAyNV8wMV8yMF8xM19QTV95aGJjMG0=/drilldown",
        width: 1200,
        height: 1200,
        alt: "VibeArmor Logo",
        type: "image/png",
      },
    ],
    siteTags: ["algorithms", "coding", "interview prep", "education", "programming"],
  },

  // Optimized Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "@vibearmor",
    creator: "@vibearmor",
    title: "Master Algorithms & Data Structures with VibeArmor",
    description:
      "Ace your next coding interview with our interactive algorithm practice platform. Track progress, visualize concepts, and get AI-powered feedback on your solutions.",
    images: [
      {
        url: "https://res-console.cloudinary.com/dvbw76boh/thumbnails/v1/image/upload/v1749755149/Q2hhdEdQVF9JbWFnZV9KdW5fMTJfMjAyNV8wMV8yMF8xM19QTV95aGJjMG0=/drilldown",
        alt: "VibeArmor - Algorithm Practice Platform",
        width: 1200,
        height: 630,
      }
    ],
  },

  // App-specific metadata with enhanced details
  applicationName: "VibeArmor - Algorithm Practice Platform",
  referrer: "origin-when-cross-origin",
  category: "Education",
  classification: "Educational Technology, Computer Science, Programming",

  // Extended verification tags
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    me: ["info@vibearmor.com"],
    other: {
      "msvalidate.01": "your-bing-verification-code",
      "p:domain_verify": "your-pinterest-verification-code",
      "facebook-domain-verification": "your-facebook-domain-verification",
    },
  },

  // App icons and manifest with more sizes
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-touch-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-touch-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/apple-touch-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-touch-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/apple-touch-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-touch-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-touch-icon-57x57.png", sizes: "57x57", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#3b82f6",
      },
      {
        rel: "shortcut icon",
        url: "/favicon.ico",
      },
    ],
  },

  // Enhanced base URL and alternates with language-specific URLs and content types
  metadataBase: new URL("https://vibearmor.com"),
  alternates: {
    canonical: "https://vibearmor.com",
    languages: {
      "en-US": "https://vibearmor.com",
      "es-ES": "https://vibearmor.com/es",
      "fr-FR": "https://vibearmor.com/fr",
      "de-DE": "https://vibearmor.com/de",
      "ja-JP": "https://vibearmor.com/ja",
      "zh-CN": "https://vibearmor.com/zh",
    },
    types: {
      "application/rss+xml": "https://vibearmor.com/rss.xml",
      "application/atom+xml": "https://vibearmor.com/atom.xml",
      "application/json": "https://vibearmor.com/feed.json",
    },
  },

  // App store links with enhanced parameters
  appLinks: {
    ios: {
      url: "https://apps.apple.com/app/vibearmor",
      app_store_id: "your-app-store-id",
      app_name: "VibeArmor",
    },
    android: {
      package: "com.vibearmor.app",
      url: "https://play.google.com/store/apps/details?id=com.vibearmor.app",
    },
    web: {
      url: "https://vibearmor.com",
      should_fallback: true,
    },
  },

  // Additional tags with enhanced PWA support
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "VibeArmor",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#3b82f6",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#3b82f6",
    "application-name": "VibeArmor",
    "msapplication-tooltip": "Launch VibeArmor",
    "msapplication-starturl": "/",
    "msapplication-navbutton-color": "#3b82f6",
    "msapplication-square70x70logo": "/mstile-70x70.png",
    "msapplication-square150x150logo": "/mstile-150x150.png",
    "msapplication-wide310x150logo": "/mstile-310x150.png",
    "msapplication-square310x310logo": "/mstile-310x310.png",
  },

  // Archives and assets
  archives: ["https://vibearmor.com/archive"],
  assets: ["https://vibearmor.com/assets"],

  // Bookmarks for important pages
  bookmarks: [
    "https://vibearmor.com/algorithms",
    "https://vibearmor.com/data-structures",
    "https://vibearmor.com/learning-paths",
  ],
}

// Enhanced viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "dark light",
  // Additional viewport settings
  minimumScale: 1,
  interactiveWidget: "resizes-visual",
}

// This server component function generates server-side analytics script
async function AnalyticsScripts() {
  // You could use headers() here to conditionally load analytics based on user preferences, etc.
  const headersData = headers()

  return (
    <>
      {/* Google Tag Manager - No-JS fallback */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
      </noscript>

      {/* Optional: Server-side logic could decide which analytics to load based on user preferences */}
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Generate structured data dynamically
  const structuredDataBlocks = generateStructuredData()

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vitals.vercel-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-analytics.com" />

        {/* Structured data blocks - separate them for better readability and maintenance */}
        {structuredDataBlocks.map((dataBlock, index) => (
          <script
            key={`structured-data-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(dataBlock),
            }}
          />
        ))}

        {/* Additional meta tags for better SEO */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VibeArmor" />

        {/* Extended language support */}
        <link rel="alternate" href="https://vibearmor.com" hrefLang="x-default" />
        <link rel="alternate" href="https://vibearmor.com" hrefLang="en" />
        <link rel="alternate" href="https://vibearmor.com/es" hrefLang="es" />
        <link rel="alternate" href="https://vibearmor.com/fr" hrefLang="fr" />
        <link rel="alternate" href="https://vibearmor.com/de" hrefLang="de" />
        <link rel="alternate" href="https://vibearmor.com/ja" hrefLang="ja" />
        <link rel="alternate" href="https://vibearmor.com/zh" hrefLang="zh" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains; preload" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />

        {/* Performance hints - preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/logo.svg" as="image" />
        <link rel="preload" href="/critical.css" as="style" />

        {/* Add breadcrumb navigation JSON-LD for better SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://vibearmor.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Algorithm Practice",
                "item": "https://vibearmor.com/practice"
              }
            ]
          })
        }} />

        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXX');
          `
        }} />
      </head>
      <body
        className={`font-sans antialiased ${inter.variable} ${jetbrainsMono.variable} bg-slate-950 text-white selection:bg-blue-500/20 selection:text-blue-200`}
        suppressHydrationWarning
      >
        {/* Server-side rendered analytics scripts */}
        <AnalyticsScripts />

        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200"
        >
          Skip to main content
        </a>

        <AuthProvider>
          <Layout>
            <main id="main-content" className="min-h-screen">
              {children}
            </main>
          </Layout>
        </AuthProvider>

        {/* Service Worker registration for PWA with improved error handling and update flow */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                      
                      // Check for updates
                      registration.addEventListener('updatefound', function() {
                        // A new service worker is installing
                        const newWorker = registration.installing;
                        
                        newWorker.addEventListener('statechange', function() {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content available - show update prompt to user
                            if (confirm('New version available! Reload to update?')) {
                              window.location.reload();
                            }
                          }
                        });
                      });
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                    
                  // Handle communication between service worker and the page
                  navigator.serviceWorker.addEventListener('message', function(event) {
                    console.log('Message from service worker: ', event.data);
                    // Handle various message types
                    if (event.data.type === 'CACHE_UPDATED') {
                      console.log('New content is available; please refresh.');
                    }
                  });
                });
              }
              
              // Register intersection observer for lazy loading
              document.addEventListener('DOMContentLoaded', function() {
                const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
                
                if ("IntersectionObserver" in window) {
                  let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                    entries.forEach(function(entry) {
                      if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        if (lazyImage.dataset.srcset) {
                          lazyImage.srcset = lazyImage.dataset.srcset;
                        }
                        lazyImage.classList.remove("lazy");
                        lazyImageObserver.unobserve(lazyImage);
                      }
                    });
                  });
                  
                  lazyImages.forEach(function(lazyImage) {
                    lazyImageObserver.observe(lazyImage);
                  });
                }
              });
              
              // Initialize web vitals reporting
              let script = document.createElement('script');
              script.src = 'https://vitals.vercel-analytics.com/v1/vitals.js';
              script.defer = true;
              document.head.appendChild(script);
              
              // Web Vitals
              function sendWebVitals(metric) {
                const body = JSON.stringify(metric);
                (navigator.sendBeacon && navigator.sendBeacon('/api/vitals', body)) || 
                  fetch('/api/vitals', {body, method: 'POST', keepalive: true});
              }
              
              // Initialize Core Web Vitals reporting
              window.addEventListener('DOMContentLoaded', function() {
                if ('web-vitals' in window) {
                  webVitals.getCLS(sendWebVitals);
                  webVitals.getFID(sendWebVitals);
                  webVitals.getLCP(sendWebVitals);
                  webVitals.getFCP(sendWebVitals);
                  webVitals.getTTFB(sendWebVitals);
                }
              });
              
              // Detect user preferences
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              
              // Store user preferences without cookies using localStorage
              if (!localStorage.getItem('color-scheme-set')) {
                localStorage.setItem('color-scheme', prefersDark ? 'dark' : 'light');
              }
              
              if (prefersReducedMotion) {
                document.documentElement.classList.add('reduce-motion');
              }
            `,
          }}
        />

        {/* JSON-LD for Local Business - if you have a physical location */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "VibeArmor",
            "url": "https://vibearmor.com",
            "logo": "https://vibearmor.com/logo.png",
            "sameAs": [
              "https://twitter.com/vibearmor",
              "https://www.facebook.com/vibearmor",
              "https://www.linkedin.com/company/vibearmor",
              "https://github.com/vibearmor"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-123-456-7890",
              "contactType": "customer service",
              "email": "support@vibearmor.com",
              "availableLanguage": ["English", "Spanish", "French"]
            }
          })
        }} />
      </body>
    </html>
  )
}
