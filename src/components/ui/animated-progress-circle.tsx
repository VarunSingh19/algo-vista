"use client"

import { useEffect, useState } from "react"

interface AnimatedProgressCircleProps {
    percentage: number
    size?: number
    strokeWidth?: number
    className?: string
}

export default function AnimatedProgressCircle({
    percentage,
    size = 80,
    strokeWidth = 6,
    className = "",
}: AnimatedProgressCircleProps) {
    const [animatedPercentage, setAnimatedPercentage] = useState(0)

    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedPercentage(percentage)
        }, 500)

        return () => clearTimeout(timer)
    }, [percentage])

    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background circle */}
                <circle
                    className="stroke-white/10"
                    strokeWidth={strokeWidth}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                />

                {/* Progress circle */}
                <circle
                    className={`transition-all duration-1000 ease-out ${animatedPercentage === 100
                            ? "stroke-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                            : "stroke-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]"
                        }`}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        filter: `drop-shadow(0 0 8px ${animatedPercentage === 100 ? "rgba(34, 197, 94, 0.4)" : "rgba(251, 146, 60, 0.4)"
                            })`,
                    }}
                />
            </svg>

            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span
                    className={`text-2xl font-bold transition-colors duration-500 ${animatedPercentage === 100 ? "text-green-400" : "text-orange-400"
                        }`}
                >
                    {Math.round(animatedPercentage)}%
                </span>
            </div>
        </div>
    )
}
