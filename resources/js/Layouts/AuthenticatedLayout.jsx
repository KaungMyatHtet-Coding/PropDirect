import ApplicationLogo from '@/Components/ApplicationLogo';
import RoleBadge from '@/Components/RoleBadge';
import { useLanguage } from '@/Contexts/LanguageContext';
import { useTheme } from '@/Contexts/ThemeContext';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    Bell,
    Building2,
    Check,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Compass,
    FileCheck2,
    FolderKanban,
    Globe,
    HelpCircle,
    Home,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Moon,
    PanelLeftClose,
    PanelLeftOpen,
    PlusCircle,
    Scale,
    Search,
    Settings,
    ShieldAlert,
    ShieldCheck,
    Sun,
    TrendingUp,
    User,
    Users,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export default function AuthenticatedLayout({ header, breadcrumbs, children }) {
    const { auth, flash, notifications } = usePage().props;
    const user = auth?.user;
    const { lang, toggleLang, t } = useLanguage();
    const { isDark, toggleTheme } = useTheme();

    // Sidebar state
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('propdirect_sidebar_collapsed') === 'true';
        }
        return false;
    });

    const [mobileOpen, setMobileOpen] = useState(false);
    const [dismissFlash, setDismissFlash] = useState(false);
    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [helpModalOpen, setHelpModalOpen] = useState(false);
    const [navSearch, setNavSearch] = useState('');

    // Collapsible navigation groups
    const [openGroups, setOpenGroups] = useState({
        verifications: true,
        myProperties: true,
        upgrade: true,
    });

    const notifRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('propdirect_sidebar_collapsed', collapsed ? 'true' : 'false');
    }, [collapsed]);

    // Close notifications on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleGroup = (key) => {
        setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Feedback Form
    const feedbackForm = useForm({
        category: 'feature',
        message: '',
    });

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        feedbackForm.post(route('feedbacks.store'), {
            onSuccess: () => {
                feedbackForm.reset();
                setFeedbackModalOpen(false);
            },
        });
    };

    const handleMarkAllRead = () => {
        feedbackForm.post(route('notifications.mark-all-read'), {
            preserveScroll: true,
            onSuccess: () => setNotifDropdownOpen(false),
        });
    };

    const isAdmin = user?.role === 'admin';
    const isOwner = user?.role === 'owner' || user?.is_verified_owner;
    const isLawyer = user?.role === 'lawyer';
    const isSeeker = !isAdmin && !isOwner && !isLawyer;

    const unreadCount = notifications?.unread_count || 0;
    const recentNotifications = notifications?.recent || [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans transition-colors duration-200 flex">
            {/* 1. Backdrop for mobile drawer */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* 2. Kravio-Style Left Sidebar */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 ease-in-out md:translate-x-0 ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                } ${collapsed ? 'w-20' : 'w-64'}`}
            >
                {/* Brand Logo & Collapse Toggle */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-zinc-800 shrink-0">
                    <Link
                        href={route('dashboard')}
                        className={`flex items-center gap-2.5 overflow-hidden transition-all ${
                            collapsed ? 'justify-center w-full' : ''
                        }`}
                        title="PropDirect Dashboard"
                    >
                        <ApplicationLogo showText={!collapsed} iconSize="h-9 w-9" />
                    </Link>

                    {!collapsed && (
                        <button
                            type="button"
                            onClick={() => setCollapsed(true)}
                            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                            title="Collapse Sidebar"
                        >
                            <PanelLeftClose className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Collapsed Expand Toggle Trigger */}
                {collapsed && (
                    <div className="hidden md:flex justify-center py-2 border-b border-slate-100 dark:border-zinc-800">
                        <button
                            type="button"
                            onClick={() => setCollapsed(false)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                            title="Expand Sidebar"
                        >
                            <PanelLeftOpen className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Quick Search Bar */}
                {!collapsed && (
                    <div className="px-3 pt-3 pb-1">
                        <div className="relative">
                            <Search className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                value={navSearch}
                                onChange={(e) => setNavSearch(e.target.value)}
                                placeholder="Search nav or ⌘K..."
                                className="w-full bg-slate-50 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700/80 rounded-xl pl-8 pr-2 py-1.5 text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                )}

                {/* Scrollable Navigation Area */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800">
                    {/* SECTION: MAIN NAVIGATION */}
                    <div>
                        {!collapsed && (
                            <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                Main Navigation
                            </div>
                        )}

                        <nav className="space-y-1">
                            {/* Main Website / Public Marketplace */}
                            <Link
                                href={route('properties.index')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition ${
                                    collapsed ? 'justify-center px-2' : ''
                                }`}
                                title={lang === 'mm' ? 'ပင်မစာမျက်နှာသို့' : 'Main Website (Marketplace)'}
                            >
                                <Globe className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                {!collapsed && (
                                    <span className="font-bold flex items-center justify-between flex-1">
                                        <span>{lang === 'mm' ? 'ပင်မစာမျက်နှာသို့' : 'Main Website'}</span>
                                        <ArrowRight className="h-3 w-3 opacity-60" />
                                    </span>
                                )}
                            </Link>

                            {/* Overview (Dashboard) */}
                            <Link
                                href={route('dashboard')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                                    route().current('dashboard')
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold'
                                        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-white'
                                } ${collapsed ? 'justify-center px-2' : ''}`}
                                title="Overview Dashboard"
                            >
                                <LayoutDashboard className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                {!collapsed && <span>{t('nav_dashboard')}</span>}
                            </Link>

                            {/* ADMIN ROLE TREE */}
                            {isAdmin && (
                                <>
                                    {/* Verifications Tree */}
                                    <div>
                                        {!collapsed ? (
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleGroup('verifications')}
                                                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition"
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <ShieldCheck className="h-4 w-4 text-indigo-500" />
                                                        <span>Verifications</span>
                                                    </span>
                                                    {openGroups.verifications ? (
                                                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                                                    ) : (
                                                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                                                    )}
                                                </button>

                                                {openGroups.verifications && (
                                                    <div className="ml-5 pl-3 border-l border-slate-200 dark:border-zinc-800 mt-1 space-y-1">
                                                        <Link
                                                            href={route('admin.verifications.index')}
                                                            className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                                                                route().current('admin.verifications.*')
                                                                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold'
                                                                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                                                            }`}
                                                        >
                                                            Owner KYC Queue
                                                        </Link>
                                                        <Link
                                                            href={route('admin.lawyers.index')}
                                                            className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                                                                route().current('admin.lawyers.*')
                                                                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold'
                                                                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                                                            }`}
                                                        >
                                                            Lawyer KYC Queue
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                href={route('admin.verifications.index')}
                                                className="flex justify-center p-2 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60"
                                                title="Owner & Lawyer Verifications"
                                            >
                                                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                                            </Link>
                                        )}
                                    </div>

                                    {/* User Management */}
                                    <Link
                                        href={route('admin.users.index')}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                                            route().current('admin.users.*')
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold'
                                                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-white'
                                        } ${collapsed ? 'justify-center px-2' : ''}`}
                                        title="User Management & History"
                                    >
                                        <Users className="h-4 w-4 shrink-0 text-blue-500" />
                                        {!collapsed && <span>User Management</span>}
                                    </Link>
                                </>
                            )}

                            {/* OWNER ROLE TREE */}
                            {isOwner && (
                                <div>
                                    {!collapsed ? (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => toggleGroup('myProperties')}
                                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition"
                                            >
                                                <span className="flex items-center gap-3">
                                                    <Building2 className="h-4 w-4 text-emerald-600" />
                                                    <span>My Properties</span>
                                                </span>
                                                {openGroups.myProperties ? (
                                                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                                                ) : (
                                                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                                                )}
                                            </button>

                                            {openGroups.myProperties && (
                                                <div className="ml-5 pl-3 border-l border-slate-200 dark:border-zinc-800 mt-1 space-y-1">
                                                    <Link
                                                        href={route('owner.properties.index')}
                                                        className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                                                            route().current('owner.properties.index')
                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold'
                                                                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                                                        }`}
                                                    >
                                                        All Units
                                                    </Link>
                                                    <Link
                                                        href={route('owner.properties.create')}
                                                        className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                                                            route().current('owner.properties.create')
                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold'
                                                                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                                                        }`}
                                                    >
                                                        + Post New Unit
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={route('owner.properties.index')}
                                            className="flex justify-center p-2 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60"
                                            title="My Properties"
                                        >
                                            <Building2 className="h-4 w-4 text-emerald-600" />
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* SEEKER / LAWYER UPGRADE TREE */}
                            {!isAdmin && !isOwner && (
                                <div>
                                    {!collapsed ? (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => toggleGroup('upgrade')}
                                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition"
                                            >
                                                <span className="flex items-center gap-3">
                                                    <PlusCircle className="h-4 w-4 text-amber-500" />
                                                    <span>Upgrade Role</span>
                                                </span>
                                                {openGroups.upgrade ? (
                                                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                                                ) : (
                                                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                                                )}
                                            </button>

                                            {openGroups.upgrade && (
                                                <div className="ml-5 pl-3 border-l border-slate-200 dark:border-zinc-800 mt-1 space-y-1">
                                                    <Link
                                                        href={route('owner.verification.index')}
                                                        className="block px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                                                    >
                                                        Become Verified Owner
                                                    </Link>
                                                    <Link
                                                        href={route('lawyer.verification.index')}
                                                        className="block px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                                                    >
                                                        Register as Lawyer
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={route('owner.verification.index')}
                                            className="flex justify-center p-2 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60"
                                            title="Upgrade to Verified Owner"
                                        >
                                            <PlusCircle className="h-4 w-4 text-amber-500" />
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Public Marketplace Link */}
                            <Link
                                href={route('properties.index')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                                    route().current('properties.index') || route().current('properties.show')
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold'
                                        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-white'
                                } ${collapsed ? 'justify-center px-2' : ''}`}
                                title="Browse Properties"
                            >
                                <Compass className="h-4 w-4 shrink-0 text-teal-600" />
                                {!collapsed && <span>{t('nav_properties')}</span>}
                            </Link>

                            {/* Verified Lawyers Directory */}
                            <Link
                                href={route('lawyers.index')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                                    route().current('lawyers.*')
                                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-bold'
                                        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-white'
                                } ${collapsed ? 'justify-center px-2' : ''}`}
                                title="Verified Lawyers Directory"
                            >
                                <Scale className="h-4 w-4 shrink-0 text-amber-600" />
                                {!collapsed && <span>{t('nav_lawyers')}</span>}
                            </Link>
                        </nav>
                    </div>

                    {/* SECTION: ANALYTICS & INSIGHTS (Admin/Owner) */}
                    {(isAdmin || isOwner) && (
                        <div>
                            {!collapsed && (
                                <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                    Analytics & Insights
                                </div>
                            )}
                            <nav className="space-y-1">
                                <Link
                                    href={route('dashboard')}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition ${
                                        collapsed ? 'justify-center px-2' : ''
                                    }`}
                                    title="Market Demand Trends"
                                >
                                    <TrendingUp className="h-4 w-4 shrink-0 text-purple-500" />
                                    {!collapsed && <span>Market Demand</span>}
                                </Link>
                                <Link
                                    href={route('dashboard')}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition ${
                                        collapsed ? 'justify-center px-2' : ''
                                    }`}
                                    title="Platform Activity Reports"
                                >
                                    <FolderKanban className="h-4 w-4 shrink-0 text-cyan-500" />
                                    {!collapsed && <span>Activity Reports</span>}
                                </Link>
                            </nav>
                        </div>
                    )}

                    {/* SECTION: SUPPORT & SETTINGS */}
                    <div>
                        {!collapsed && (
                            <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                System & Support
                            </div>
                        )}
                        <nav className="space-y-1">
                            <button
                                type="button"
                                onClick={() => setFeedbackModalOpen(true)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition ${
                                    collapsed ? 'justify-center px-2' : ''
                                }`}
                                title="Send Platform Feedback"
                            >
                                <MessageSquare className="h-4 w-4 shrink-0 text-rose-500" />
                                {!collapsed && <span>Feedback</span>}
                            </button>

                            <button
                                type="button"
                                onClick={() => setHelpModalOpen(true)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition ${
                                    collapsed ? 'justify-center px-2' : ''
                                }`}
                                title="Help & Safety Guide"
                            >
                                <HelpCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                                {!collapsed && <span>Help & Support</span>}
                            </button>

                            <Link
                                href={route('profile.edit')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition ${
                                    route().current('profile.edit')
                                        ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-bold'
                                        : ''
                                } ${collapsed ? 'justify-center px-2' : ''}`}
                                title="Settings & Security"
                            >
                                <Settings className="h-4 w-4 shrink-0 text-slate-400" />
                                {!collapsed && <span>Settings</span>}
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Bottom User Card */}
                {user ? (
                    <div className="p-3 border-t border-slate-200/80 dark:border-zinc-800 shrink-0 bg-slate-50/50 dark:bg-zinc-900/50">
                        {!collapsed ? (
                            <div className="flex items-center justify-between gap-2">
                                <Link
                                    href={route('profile.edit')}
                                    className="flex items-center gap-2.5 overflow-hidden flex-1 group"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={`/storage/${user.avatar}`}
                                            alt={user.name}
                                            className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-zinc-700 shrink-0"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                            {user.name?.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex flex-col truncate">
                                        <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate group-hover:text-emerald-600 transition">
                                            {user.name}
                                        </span>
                                        <RoleBadge role={user.role} isVerifiedOwner={user.is_verified_owner} />
                                    </div>
                                </Link>

                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition shrink-0"
                                    title="Sign Out"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <Link href={route('profile.edit')} title={user.name}>
                                    {user.avatar ? (
                                        <img
                                            src={`/storage/${user.avatar}`}
                                            alt={user.name}
                                            className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-zinc-700"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                                            {user.name?.charAt(0)}
                                        </div>
                                    )}
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                                    title="Sign Out"
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-3 border-t border-slate-200 dark:border-zinc-800">
                        <Link
                            href={route('login')}
                            className="w-full flex justify-center py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs"
                        >
                            Sign In
                        </Link>
                    </div>
                )}
            </aside>

            {/* 3. Main Content Wrapper */}
            <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
                    collapsed ? 'md:pl-20' : 'md:pl-64'
                }`}
            >
                {/* Global Mandatory Incomplete Profile Warning */}
                {user && !user.is_profile_complete && (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-white shadow-xs z-30">
                        <div className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 shrink-0 text-white" />
                                <span className="font-semibold">{t('profile_incomplete_title')}:</span>
                                <span className="text-amber-100 hidden md:inline">{t('profile_incomplete_desc')}</span>
                            </div>
                            <Link
                                href={route('profile.edit')}
                                className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1 font-bold text-amber-900 shadow-xs hover:bg-amber-50 shrink-0"
                            >
                                <span>{t('profile_complete_btn')}</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Top Header Bar */}
                <header className="h-16 border-b border-slate-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
                    {/* Left: Mobile hamburger & Breadcrumbs */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                        >
                            <PanelLeftOpen className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                            <span className="font-medium">PropDirect</span>
                            <span>/</span>
                            <span className="font-bold text-slate-900 dark:text-white capitalize">
                                {breadcrumbs || header || 'Platform'}
                            </span>
                        </div>
                    </div>

                    {/* Right Controls: Language, Theme, Notifications, Settings */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Prominent Home / Main Website Link */}
                        <Link
                            href={route('properties.index')}
                            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700/80 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 shadow-xs transition"
                            title={lang === 'mm' ? 'ပင်မစာမျက်နှာသို့' : 'Main Website (Marketplace)'}
                        >
                            <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{lang === 'mm' ? 'ပင်မစာမျက်နှာသို့' : 'Main Website'}</span>
                        </Link>

                        {/* Language Toggle */}
                        <button
                            type="button"
                            onClick={toggleLang}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition"
                            title="Toggle Language"
                        >
                            {lang === 'en' ? 'မြန်မာ' : 'EN'}
                        </button>

                        {/* Light/Dark Mode Toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition"
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
                        </button>

                        {/* Notifications Bell Dropdown */}
                        {user && (
                            <div className="relative" ref={notifRef}>
                                <button
                                    type="button"
                                    onClick={() => setNotifDropdownOpen((prev) => !prev)}
                                    className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition relative"
                                    title="Notifications"
                                >
                                    <Bell className="h-4 w-4" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {notifDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl py-3 z-50">
                                        <div className="px-4 pb-2 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                                    Notifications
                                                </h4>
                                                {unreadCount > 0 && (
                                                    <span className="rounded-full bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-400">
                                                        {unreadCount} unread
                                                    </span>
                                                )}
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={handleMarkAllRead}
                                                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800">
                                            {recentNotifications.length > 0 ? (
                                                recentNotifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        className={`p-3 text-xs transition ${
                                                            !notif.read_at
                                                                ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                                                                : 'hover:bg-slate-50 dark:hover:bg-zinc-800/40'
                                                        }`}
                                                    >
                                                        <div className="font-bold text-slate-900 dark:text-zinc-100">
                                                            {notif.title}
                                                        </div>
                                                        <div className="text-slate-600 dark:text-zinc-400 mt-0.5 text-[11px] line-clamp-2">
                                                            {notif.message}
                                                        </div>
                                                        <div className="mt-1 text-[10px] text-slate-400 dark:text-zinc-500">
                                                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                                                    No notifications yet
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Cog Icon */}
                        {user && (
                            <Link
                                href={route('profile.edit')}
                                className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition"
                                title="Settings & Security"
                            >
                                <Settings className="h-4 w-4 text-slate-600 dark:text-zinc-300" />
                            </Link>
                        )}
                    </div>
                </header>

                {/* Flash Messages */}
                {flash && (flash.success || flash.error || flash.message) && !dismissFlash && (
                    <div className="px-4 sm:px-6 pt-4">
                        {flash.success && (
                            <div className="flex items-center justify-between rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-xs">
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
                            <div className="flex items-center justify-between rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3 text-xs font-semibold text-rose-800 dark:text-rose-300 shadow-xs">
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

                {/* Main Content Body */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>

            {/* FEEDBACK MODAL */}
            {feedbackModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-emerald-600" />
                                Send Platform Feedback
                            </h3>
                            <button
                                type="button"
                                onClick={() => setFeedbackModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                    Category
                                </label>
                                <select
                                    value={feedbackForm.data.category}
                                    onChange={(e) => feedbackForm.setData('category', e.target.value)}
                                    className="w-full text-xs rounded-xl border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200"
                                >
                                    <option value="feature">Feature Request</option>
                                    <option value="bug">Bug Report</option>
                                    <option value="support">General Support</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                    Your Feedback Message
                                </label>
                                <textarea
                                    rows="4"
                                    value={feedbackForm.data.message}
                                    onChange={(e) => feedbackForm.setData('message', e.target.value)}
                                    placeholder="Tell us what could be improved or report any issue..."
                                    required
                                    className="w-full text-xs rounded-xl border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 placeholder-slate-400"
                                />
                                {feedbackForm.errors.message && (
                                    <p className="text-[11px] text-rose-500 mt-1">
                                        {feedbackForm.errors.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setFeedbackModalOpen(false)}
                                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={feedbackForm.processing}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition disabled:opacity-50"
                                >
                                    {feedbackForm.processing ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* HELP & SUPPORT MODAL */}
            {helpModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 text-emerald-600" />
                                PropDirect Platform Guide & Safety
                            </h3>
                            <button
                                type="button"
                                onClick={() => setHelpModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                                <div className="font-bold text-emerald-800 dark:text-emerald-300">
                                    Direct Landlord-Tenant Model (Zero Broker Commission)
                                </div>
                                <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                                    All listings on PropDirect are posted directly by verified owners holding verified NRC & utility bill proof. No middleman broker fee is ever charged.
                                </p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
                                <div className="font-bold text-slate-800 dark:text-zinc-200">
                                    Bar Council Verified Lawyers
                                </div>
                                <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                                    Connect with verified Advocates and Higher Grade Pleaders for title deed verification (60-year grants, BCC approval) and tenancy contract notarization.
                                </p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
                                <div className="font-bold text-slate-800 dark:text-zinc-200">
                                    Phone Privacy Protection
                                </div>
                                <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                                    Owner contact numbers remain shielded from automated scrapers until you submit a viewing appointment request.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setHelpModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-zinc-700 hover:bg-slate-800 transition"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
