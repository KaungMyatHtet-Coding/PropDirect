import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useLanguage } from '@/Contexts/LanguageContext';
import { useTheme } from '@/Contexts/ThemeContext';
import RoleBadge from '@/Components/RoleBadge';
import {
    Building2,
    Scale,
    LayoutDashboard,
    Sun,
    Moon,
    User,
    LogOut,
    Menu,
    X,
    ArrowRight,
    Settings,
} from 'lucide-react';

export default function PublicNavbar() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const { lang, toggleLang, t } = useLanguage();
    const { isDark, toggleTheme } = useTheme();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-40 border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md transition-colors duration-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-8">
                        <Link href={route('properties.index')} className="shrink-0">
                            <ApplicationLogo />
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center space-x-1">
                            <Link
                                href={route('properties.index')}
                                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition ${
                                    route().current('properties.*')
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                                        : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
                                }`}
                            >
                                <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span>{t('nav_properties')}</span>
                            </Link>

                            <Link
                                href={route('lawyers.index')}
                                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition ${
                                    route().current('lawyers.*')
                                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                                        : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
                                }`}
                            >
                                <Scale className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                <span>{t('nav_lawyers')}</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Action Controls */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Language Toggle */}
                        <button
                            type="button"
                            onClick={toggleLang}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition"
                            title="Toggle Language"
                        >
                            {lang === 'en' ? 'မြန်မာ' : 'EN'}
                        </button>

                        {/* Theme Toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition"
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
                        </button>

                        {/* Auth state: Guest vs Logged In */}
                        {user ? (
                            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-zinc-800">
                                {/* Prominent Dashboard Button */}
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold shadow-sm shadow-emerald-600/20 transition"
                                >
                                    <LayoutDashboard className="h-3.5 w-3.5" />
                                    <span>{lang === 'mm' ? 'ပင်မဒက်ရှ်ဘုတ်' : 'Dashboard'}</span>
                                    <ArrowRight className="h-3 w-3" />
                                </Link>

                                {/* User Profile Dropdown Button */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                        className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                                    >
                                        {user.avatar ? (
                                            <img
                                                src={`/storage/${user.avatar}`}
                                                alt={user.name}
                                                className="h-8 w-8 rounded-full object-cover ring-1 ring-emerald-500"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center">
                                                {user.name?.charAt(0)}
                                            </div>
                                        )}
                                    </button>

                                    {userDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-2xl z-50">
                                            <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-800">
                                                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                    {user.name}
                                                </div>
                                                <div className="text-[10px] text-slate-400 truncate">
                                                    {user.email}
                                                </div>
                                                <div className="mt-1">
                                                    <RoleBadge role={user.role} isVerifiedOwner={user.is_verified_owner} />
                                                </div>
                                            </div>

                                            <div className="mt-1 space-y-0.5">
                                                <Link
                                                    href={route('dashboard')}
                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                                                >
                                                    <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                                                    <span>{t('nav_dashboard')}</span>
                                                </Link>
                                                <Link
                                                    href={route('profile.edit')}
                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                                                >
                                                    <Settings className="h-4 w-4 text-slate-400" />
                                                    <span>Settings & Profile</span>
                                                </Link>
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    <span>Sign Out</span>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 pl-2">
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-600/20 transition"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-4 space-y-3">
                    <div className="space-y-1">
                        <Link
                            href={route('properties.index')}
                            className="block px-3 py-2 text-xs font-bold text-slate-700 dark:text-zinc-200 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800"
                        >
                            {t('nav_properties')}
                        </Link>
                        <Link
                            href={route('lawyers.index')}
                            className="block px-3 py-2 text-xs font-bold text-slate-700 dark:text-zinc-200 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800"
                        >
                            {t('nav_lawyers')}
                        </Link>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={toggleLang}
                                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold"
                            >
                                {lang === 'en' ? 'မြန်မာ' : 'EN'}
                            </button>
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs"
                            >
                                {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
                            </button>
                        </div>

                        {user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href={route('login')} className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                                    Sign In
                                </Link>
                                <Link href={route('register')} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
