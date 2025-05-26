'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import SheetList from '@/components/sheets/SheetList';

export default function SheetsPage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="w-full min-h-screen bg-black text-white">
            <div className="max-w-6xl mx-auto p-4 py-12">
                {/* Hero section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">DSA Sheets</h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Accelerate your coding journey with our carefully curated problem sheets
                    </p>
                </div>

                {/* Search */}
                <div className="mb-8 relative max-w-xl mx-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        type="text"
                        placeholder="Search sheets..."
                        className="pl-10 bg-zinc-900/60 border-zinc-800 text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Sheets list component */}
                <SheetList />

                {/* Admin button */}
                {user?.role === 'admin' && (
                    <div className="flex justify-center mt-12">
                        <Button asChild className="bg-orange-500 hover:bg-orange-600">
                            <Link href="/admin">Manage Sheets</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
