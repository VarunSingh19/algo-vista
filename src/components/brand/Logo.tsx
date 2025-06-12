import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
    size?: 'sm' | 'md' | 'lg'
    withText?: boolean
    className?: string
}

export default function Logo({ size = 'md', withText = true, className = '' }: LogoProps) {
    const sizes = {
        sm: 32,
        md: 40,
        lg: 48,
    }

    const logoSize = sizes[size]

    return (
        <Link href="/" className={`flex items-center gap-2 ${className}`}>
            <div className="relative overflow-hidden rounded-lg">
                <Image
                    src="/logo.svg"
                    alt="VibeArmor Logo"
                    width={logoSize}
                    height={logoSize}
                    className="transition-transform duration-300 hover:scale-110"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 mix-blend-overlay" />
            </div>

            {withText && (
                <div className="flex flex-col">
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        VibeArmor
                    </span>
                    <span className="text-xs text-gray-400 -mt-1">Algorithm Mastery</span>
                </div>
            )}
        </Link>
    )
}
