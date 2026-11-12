import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useLanguage } from '@/Contexts/LanguageContext';
import {
    ShieldCheck,
    CheckCircle,
    AlertCircle,
    X,
    Building2,
    Scale,
    PhoneCall,
    Mail,
    Heart,
} from 'lucide-react';

export default function PublicLayout({ header, children }) {
    const { flash } = usePage().props;
    const { lang, t } = useLanguage();
    const [dismissFlash, setDismissFlash] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans transition-colors duration-200 flex flex-col justify-between">
            <div>
                {/* Public Top Navbar (NO Left Sidebar for Guests!) */}
                <PublicNavbar />

                {/* Flash Messages */}
                {flash && (flash.success || flash.error || flash.message) && !dismissFlash && (
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
                        {flash.success && (
                            <div className="flex items-center justify-between rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-xs">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                    <span>{flash.success}</span>
                                </div>
                                <button type="button" onClick={() => setDismissFlash(true)}>
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        )}
                        {flash.error && (
                            <div className="flex items-center justify-between rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3.5 text-xs font-semibold text-rose-800 dark:text-rose-300 shadow-xs">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                                    <span>{flash.error}</span>
                                </div>
                                <button type="button" onClick={() => setDismissFlash(true)}>
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Optional Header Banner if provided */}
                {header && (
                    <header className="border-b border-slate-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xs py-6">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Main Content Area */}
                <main className="w-full">
                    {children}
                </main>
            </div>

            {/* Public Footer */}
            <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-16 transition-colors duration-200">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Col 1: Brand & Mission */}
                        <div className="md:col-span-2 space-y-3">
                            <ApplicationLogo />
                            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-md">
                                PropDirect is Myanmar's first verified peer-to-peer real estate platform. We connect genuine property owners directly with tenants and buyers, backed by Bar Council certified legal contract verification—with 0% middleman broker fees.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                                <ShieldCheck className="h-4 w-4" />
                                <span>Anti-Broker Verified • 100% Direct Contact</span>
                            </div>
                        </div>

                        {/* Col 2: Marketplace Links */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                Marketplace
                            </h4>
                            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
                                <li>
                                    <Link href={route('properties.index', { listing_type: 'rent' })} className="hover:text-emerald-600 transition">
                                        Yangon Apartments for Rent
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('properties.index', { listing_type: 'sale' })} className="hover:text-emerald-600 transition">
                                        Landed Properties for Sale
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('lawyers.index')} className="hover:text-emerald-600 transition">
                                        Verified Legal Advocates
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3: Legal & Safety */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                Trust & Safety
                            </h4>
                            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
                                <li>
                                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                        <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                                        NRC + YESC Meter Verified
                                    </span>
                                </li>
                                <li>
                                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                        <Scale className="h-3.5 w-3.5 text-amber-500" />
                                        Bar Council License Check
                                    </span>
                                </li>
                                <li>
                                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                        <PhoneCall className="h-3.5 w-3.5 text-blue-500" />
                                        Anti-Scraping Phone Masking
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-zinc-500">
                        <div>
                            © {new Date().getFullYear()} PropDirect Co., Ltd. All rights reserved. Yangon, Myanmar.
                        </div>
                        <div className="flex items-center gap-4">
                            <span>Dual Language MM/EN</span>
                            <span>•</span>
                            <span>Standard Myanmar Unicode</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
