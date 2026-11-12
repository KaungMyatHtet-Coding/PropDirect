import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useLanguage } from '@/Contexts/LanguageContext';
import { useTheme } from '@/Contexts/ThemeContext';
import { ArrowLeft, Sun, Moon, Globe } from 'lucide-react';

export default function GuestLayout({ children }) {
    const { lang, toggleLang } = useLanguage();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans transition-colors duration-200 flex flex-col justify-between p-4 sm:p-6">
            {/* Top Navigation Bar */}
            <div className="mx-auto w-full max-w-5xl flex items-center justify-between py-2">
                <Link
                    href={route('properties.index')}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 bg-white/70 dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 backdrop-blur-xs transition shadow-2xs"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>{lang === 'mm' ? 'ပင်မစာမျက်နှာသို့ ပြန်သွားမည်' : 'Back to Main Page'}</span>
                </Link>

                <div className="flex items-center gap-2">
                    {/* Language Switcher */}
                    <button
                        type="button"
                        onClick={toggleLang}
                        aria-label="Toggle language"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-zinc-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                    >
                        <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{lang === 'mm' ? 'မြန်မာ' : 'EN'}</span>
                    </button>

                    {/* Dark/Light Mode Switcher */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 p-1.5 text-slate-600 dark:text-zinc-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                    >
                        {isDark ? (
                            <Sun className="h-4 w-4 text-amber-400" />
                        ) : (
                            <Moon className="h-4 w-4 text-slate-600" />
                        )}
                    </button>
                </div>
            </div>

            {/* Central Form Container */}
            <div className="flex flex-1 flex-col items-center justify-center py-6 sm:py-10">
                <div className="mb-6">
                    <Link href="/">
                        <ApplicationLogo showText={true} />
                    </Link>
                </div>

                <div className="w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-8 shadow-xl sm:max-w-md sm:px-8 transition-colors duration-200">
                    {children}
                </div>
            </div>

            {/* Subtle Footer */}
            <div className="text-center text-[11px] text-slate-400 dark:text-zinc-500 py-2">
                © {new Date().getFullYear()} PropDirect. Verified Peer-to-Peer Real Estate Myanmar.
            </div>
        </div>
    );
}
