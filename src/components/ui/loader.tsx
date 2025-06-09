"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence, useAnimation, type Variants } from "framer-motion"
import { useWindowSize } from "react-use"

// Animated Algorithm Visualization Component
const AlgorithmVisualizer = () => {
    const [currentAlgo, setCurrentAlgo] = useState(0)
    const algorithms = ['Binary Search', 'Quick Sort', 'DFS Traversal', 'Dijkstra']

    // Binary search visualization
    const BinarySearchViz = () => (
        <div className="flex space-x-1">
            {[1, 3, 5, 7, 9, 11, 13, 15].map((num, idx) => (
                <motion.div
                    key={idx}
                    className="w-8 h-8 bg-blue-500/30 border border-blue-400/50 rounded flex items-center justify-center text-xs text-blue-200"
                    animate={{
                        backgroundColor: idx === 3 ? "rgba(59, 130, 246, 0.8)" : "rgba(59, 130, 246, 0.3)",
                        scale: idx === 3 ? 1.1 : 1
                    }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                    {num}
                </motion.div>
            ))}
        </div>
    )

    // Sorting visualization
    const QuickSortViz = () => {
        const heights = [4, 8, 2, 6, 1, 5, 3, 7]
        return (
            <div className="flex items-end space-x-1">
                {heights.map((height, idx) => (
                    <motion.div
                        key={idx}
                        className="w-4 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                        style={{ height: `${height * 4}px` }}
                        animate={{
                            height: `${height * 4}px`,
                            backgroundColor: idx % 2 === 0 ? "#8b5cf6" : "#a78bfa"
                        }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                    />
                ))}
            </div>
        )
    }

    // Tree traversal visualization
    const DFSViz = () => (
        <div className="relative w-32 h-24">
            {/* Tree nodes */}
            <motion.div className="absolute top-0 left-1/2 w-6 h-6 bg-green-500 rounded-full transform -translate-x-1/2 flex items-center justify-center text-xs text-white font-bold">A</motion.div>
            <motion.div className="absolute top-8 left-1/4 w-6 h-6 bg-green-400 rounded-full transform -translate-x-1/2 flex items-center justify-center text-xs text-white font-bold" animate={{ scale: [1, 1.2, 1] }} transition={{ delay: 0.5, duration: 0.5 }}>B</motion.div>
            <motion.div className="absolute top-8 right-1/4 w-6 h-6 bg-green-400 rounded-full transform translate-x-1/2 flex items-center justify-center text-xs text-white font-bold" animate={{ scale: [1, 1.2, 1] }} transition={{ delay: 1, duration: 0.5 }}>C</motion.div>
            <motion.div className="absolute bottom-0 left-2 w-6 h-6 bg-green-300 rounded-full flex items-center justify-center text-xs text-white font-bold" animate={{ scale: [1, 1.2, 1] }} transition={{ delay: 1.5, duration: 0.5 }}>D</motion.div>
            <motion.div className="absolute bottom-0 right-2 w-6 h-6 bg-green-300 rounded-full flex items-center justify-center text-xs text-white font-bold" animate={{ scale: [1, 1.2, 1] }} transition={{ delay: 2, duration: 0.5 }}>E</motion.div>

            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full">
                <line x1="50%" y1="12" x2="25%" y2="32" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
                <line x1="50%" y1="12" x2="75%" y2="32" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
                <line x1="25%" y1="44" x2="12%" y2="80" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
                <line x1="75%" y1="44" x2="88%" y2="80" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
            </svg>
        </div>
    )

    // Graph visualization
    const DijkstraViz = () => (
        <div className="relative w-32 h-24">
            {/* Graph nodes */}
            {['A', 'B', 'C', 'D'].map((node, idx) => {
                const positions = [
                    { x: '20%', y: '20%' },
                    { x: '80%', y: '20%' },
                    { x: '20%', y: '80%' },
                    { x: '80%', y: '80%' }
                ]
                return (
                    <motion.div
                        key={node}
                        className="absolute w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white font-bold"
                        style={{ left: positions[idx].x, top: positions[idx].y, transform: 'translate(-50%, -50%)' }}
                        animate={{
                            backgroundColor: idx === 0 ? "#f97316" : "#fb923c",
                            scale: idx === 0 ? 1.2 : 1
                        }}
                        transition={{ delay: idx * 0.2 }}
                    >
                        {node}
                    </motion.div>
                )
            })}

            {/* Connecting lines with weights */}
            <svg className="absolute inset-0 w-full h-full">
                <line x1="20%" y1="20%" x2="80%" y2="20%" stroke="#f97316" strokeWidth="2" opacity="0.6" />
                <line x1="20%" y1="20%" x2="20%" y2="80%" stroke="#f97316" strokeWidth="2" opacity="0.6" />
                <line x1="80%" y1="20%" x2="80%" y2="80%" stroke="#f97316" strokeWidth="2" opacity="0.6" />
                <line x1="20%" y1="80%" x2="80%" y2="80%" stroke="#f97316" strokeWidth="2" opacity="0.6" />
            </svg>
        </div>
    )

    const visualizations = [BinarySearchViz, QuickSortViz, DFSViz, DijkstraViz]
    const CurrentViz = visualizations[currentAlgo]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAlgo((prev) => (prev + 1) % algorithms.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <motion.div
            className="relative w-48 h-32 mx-auto mb-8 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="mb-4 text-center">
                <motion.h3
                    key={currentAlgo}
                    className="text-sm font-mono text-blue-300"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {algorithms[currentAlgo]}
                </motion.h3>
            </div>

            <motion.div
                key={currentAlgo}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
            >
                <CurrentViz />
            </motion.div>
        </motion.div>
    )
}

// Floating code snippets
const FloatingCodeSnippets = () => {
    const codeSnippets = [
        "for(int i=0; i<n; i++)",
        "if(left <= right)",
        "return merge(left, right)",
        "graph[u].push_back(v)",
        "visited[node] = true",
        "dp[i][j] = min(dp[i-1][j])",
        "while(!queue.empty())",
        "Time: O(log n)"
    ]

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {codeSnippets.map((code, index) => {
                const angle = (index / codeSnippets.length) * Math.PI * 2
                const radius = 180 + Math.random() * 120
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                    <motion.div
                        key={code}
                        className="absolute text-gray-400/40 text-xs font-mono"
                        style={{
                            left: 'calc(50% + 0px)',
                            top: 'calc(50% + 0px)',
                            x, y,
                            originX: 0.5,
                            originY: 0.5,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 0.6, 0],
                            scale: [0.8, 1, 0.8],
                            x: [x, x + (Math.random() * 40 - 20)],
                            y: [y, y + (Math.random() * 40 - 20)],
                        }}
                        transition={{
                            duration: 6 + Math.random() * 4,
                            delay: index * 0.4,
                            repeat: Infinity,
                            repeatDelay: Math.random() * 8,
                        }}
                    >
                        {code}
                    </motion.div>
                )
            })}
        </div>
    )
}

// Animated logo component
const AnimatedLogo = () => {
    const wordVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            },
        }),
    }

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <motion.div
                className="text-4xl md:text-6xl font-bold text-white mb-2"
                variants={wordVariants}
                custom={0}
                initial="hidden"
                animate="visible"
            >
                <span className="text-blue-400">Algo</span>
                <span className="text-white">Vista</span>
            </motion.div>

            <motion.div
                className="text-sm md:text-base text-blue-100/70 tracking-widest font-light font-mono"
                variants={wordVariants}
                custom={1}
                initial="hidden"
                animate="visible"
            >
                DSA MASTERY SHEET
            </motion.div>

            <motion.div
                className="flex justify-center mt-2 overflow-hidden h-1"
                initial={{ width: 0 }}
                animate={{ width: "80%" }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
            >
                <motion.div
                    className="h-full w-full bg-gradient-to-r from-blue-500/0 via-blue-300 to-purple-500/0"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut"
                    }}
                />
            </motion.div>
        </div>
    )
}

// Modern loading indicator
const LoadingIndicator = ({ progress }: { progress: number }) => {
    return (
        <div className="relative w-24 h-24">
            {/* Circular progress track */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background track */}
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                />

                {/* Progress circle */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)}
                    transform="rotate(-90 50 50)"
                />

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Pulsing center with binary pattern */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 blur-sm" />
            </motion.div>

            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                    className="text-white text-sm font-mono font-bold"
                    key={Math.round(progress)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {Math.round(progress)}%
                </motion.span>
            </div>
        </div>
    )
}

// Matrix rain effect particle
const MatrixParticle = () => {
    const characters = ['0', '1', '{', '}', '(', ')', '[', ']', '<', '>', '/', '*', '+', '-', '=']
    const char = characters[Math.floor(Math.random() * characters.length)]
    const initialX = Math.random() * 100
    const duration = Math.random() * 8 + 4
    const delay = Math.random() * 3

    return (
        <motion.div
            className="absolute text-green-400/20 font-mono text-sm"
            style={{
                left: `${initialX}%`,
                top: '-5%',
            }}
            animate={{
                y: ['0vh', '105vh'],
                opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "linear",
            }}
        >
            {char}
        </motion.div>
    )
}

// Regular particle for background
const Particle = () => {
    const size = Math.random() * 2 + 1
    const initialX = Math.random() * 100
    const initialY = Math.random() * 100
    const duration = Math.random() * 20 + 10
    const delay = Math.random() * 2

    return (
        <motion.div
            className="absolute rounded-full bg-blue-300/30"
            style={{
                width: size,
                height: size,
                left: `${initialX}%`,
                top: `${initialY}%`,
                filter: "blur(0.5px)",
            }}
            animate={{
                scale: [1, Math.random() * 0.5 + 1, 1],
                opacity: [0.1, Math.random() * 0.6 + 0.4, 0.1],
            }}
            transition={{
                duration: Math.random() * 3 + 2,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    )
}

// Loading text phrases
const loadingPhrases = [
    "Compiling algorithms...",
    "Optimizing data structures...",
    "Analyzing complexity...",
    "Building solution trees...",
    "Loading problem sets...",
    "Preparing coding challenges...",
    "Initializing practice mode...",
    "Sorting your progress...",
]

// Main Loader component
export function Loader() {
    const [progress, setProgress] = useState(0)
    const [loadingPhrase, setLoadingPhrase] = useState(loadingPhrases[0])
    const controls = useAnimation()
    const { width, height } = useWindowSize()

    // Progress calculation
    useEffect(() => {
        let lastUpdate = Date.now()
        let currentProgress = 0

        const getNextIncrement = () => {
            if (currentProgress < 20) return Math.random() * 0.8 + 0.3
            if (currentProgress < 80) return Math.random() * 1.2 + 0.5
            return Math.random() * 0.4 + 0.1
        }

        const timer = setInterval(() => {
            const now = Date.now()
            const delta = now - lastUpdate

            if (delta > 120) {
                currentProgress += getNextIncrement()

                if (currentProgress >= 100) {
                    currentProgress = 100
                    clearInterval(timer)
                }

                setProgress(currentProgress)
                lastUpdate = now

                if (Math.random() > 0.85 && currentProgress < 95) {
                    const newPhrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]
                    setLoadingPhrase(newPhrase)
                }
            }
        }, 30)

        return () => clearInterval(timer)
    }, [])

    // Fade out animation when complete
    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {
                controls.start({
                    opacity: 0,
                    scale: 1.05,
                    transition: { duration: 0.8, ease: "easeInOut" },
                })
            }, 500)
        }
    }, [progress, controls])

    const particleCount = Math.min(Math.floor((width * height) / 20000), 40)
    const matrixCount = Math.min(Math.floor(width / 100), 15)

    return (
        <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={controls}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Dark tech background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Matrix rain effect */}
            {Array.from({ length: matrixCount }).map((_, index) => (
                <MatrixParticle key={`matrix-${index}`} />
            ))}

            {/* Regular particles */}
            {Array.from({ length: particleCount }).map((_, index) => (
                <Particle key={`particle-${index}`} />
            ))}

            {/* Floating code snippets */}
            <FloatingCodeSnippets />

            {/* Content container */}
            <motion.div
                className="relative z-10 flex flex-col items-center max-w-md text-center px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Algorithm visualization */}
                <AlgorithmVisualizer />

                {/* Logo and tagline */}
                <div className="mb-8">
                    <AnimatedLogo />
                </div>

                {/* Loading indicator */}
                <div className="mb-6">
                    <LoadingIndicator progress={progress} />
                </div>

                {/* Loading text */}
                <motion.div
                    className="text-blue-100/80 text-sm font-mono tracking-wider"
                    key={loadingPhrase}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {loadingPhrase}
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export function LoaderWrapper({ isloading, error, children }: { isloading?: boolean; error?: any; children: React.ReactNode }) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 4000) // Slightly longer to showcase all animations

        return () => clearTimeout(timer)
    }, [])

    return (
        <>
            <AnimatePresence>
                {loading && (
                    <motion.div
                        key="loader"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Loader />
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: loading ? 0 : 1,
                }}
                transition={{ duration: 0.8 }}
                className="min-h-screen"
            >
                {children}
            </motion.div>
        </>
    )
}