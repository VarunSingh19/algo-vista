"use client"

export default function LoadingSkeleton() {
    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header skeleton */}
            <div className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl animate-pulse">
                <div className="text-center space-y-4">
                    <div className="h-6 bg-white/10 rounded-full w-48 mx-auto" />
                    <div className="h-12 bg-white/10 rounded-lg w-96 mx-auto" />
                    <div className="h-4 bg-white/10 rounded w-64 mx-auto" />
                </div>
            </div>

            {/* Progress card skeleton */}
            <div className="glass-card p-8 rounded-2xl border border-white/10 backdrop-blur-xl animate-pulse">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex items-center space-x-8">
                        <div className="w-24 h-24 bg-white/10 rounded-full" />
                        <div className="space-y-2">
                            <div className="h-8 bg-white/10 rounded w-32" />
                            <div className="h-4 bg-white/10 rounded w-24" />
                            <div className="h-3 bg-white/10 rounded w-20" />
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <div className="h-8 bg-white/10 rounded-full w-16" />
                        <div className="h-8 bg-white/10 rounded-full w-20" />
                        <div className="h-8 bg-white/10 rounded-full w-16" />
                    </div>
                </div>
            </div>

            {/* Search skeleton */}
            <div className="flex gap-4">
                <div className="flex-grow h-12 bg-white/10 rounded-xl animate-pulse" />
                <div className="h-12 bg-white/10 rounded-xl w-24 animate-pulse" />
                <div className="h-12 bg-white/10 rounded-xl w-32 animate-pulse" />
            </div>

            {/* Section skeletons */}
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card p-6 rounded-2xl border border-white/10 backdrop-blur-xl animate-pulse">
                        <div className="flex justify-between items-center mb-4">
                            <div className="h-6 bg-white/10 rounded w-48" />
                            <div className="h-2 bg-white/10 rounded-full w-32" />
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((j) => (
                                <div key={j} className="h-16 bg-white/5 rounded-xl" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
