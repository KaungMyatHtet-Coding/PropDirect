import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import RoleBadge from '@/Components/RoleBadge';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    ShieldCheck,
    FileCheck2,
    Building2,
    UserCheck,
    LogOut,
    User,
    CheckCircle,
    AlertCircle,
    X,
    Scale,
    PlusCircle,
    Globe,
    AlertTriangle,
    ArrowRight,
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const { lang, toggleLang, t } = useLanguage();

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [dismissFlash, setDismissFlash] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isOwner = user?.role === 'owner' || user?.is_verified_owner;
    const isLawyer = user?.role === 'lawyer';
    const isSeeker = !isAdmin && !isOwner && !isLawyer;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
            {/* 1. Mandatory Profile Incomplete Global Warning Bar */}
            {user && !user.is_profile_complete && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-white shadow-sm">
                    <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-white" />
                            <span className="font-semibold">{t('profile_incomplete_title')}:</span>
                            <span className="text-amber-100 hidden md:inline">{t('profile_incomplete_desc')}</span>
                        </div>
                        <Link
                            href={route('profile.edit')}
                            className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1 font-bold text-amber-900 shadow-sm hover:bg-amber-50 shrink-0"
                        >
                            <span>{t('profile_complete_btn')}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            )}

            {/* 2. Top Navigation Bar */}
            <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Left Side: Logo & Main Links */}
                        <div className="flex items-center">
                            <div className="flex shrink-0 items-center">
                                <Link href={route('properties.index')}>
                                    <ApplicationLogo />
                                </Link>
                            </div>

                            <div className="hidden space-x-1 sm:-my-px sm:ms-6 sm:flex items-center">
                                <NavLink
                                    href={route('properties.index')}
                                    active={route().current('properties.index') || route().current('properties.show')}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold"
                                >
                                    <Building2 className="h-4 w-4 text-emerald-600" />
                                    {t('nav_properties')}
                                </NavLink>

                                <NavLink
                                    href={route('lawyers.index')}
                                    active={route().current('lawyers.*')}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold"
                                >
                                    <Scale className="h-4 w-4 text-amber-600" />
                                    {t('nav_lawyers')}
                                </NavLink>

                                {user && (
                                    <NavLink
                                        href={route('dashboard')}
                                        active={route().current('dashboard')}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold"
                                    >
                                        <LayoutDashboard className="h-4 w-4 text-slate-500" />
                                        {t('nav_dashboard')}
                                    </NavLink>
                                )}

                                {isOwner && (
                                    <NavLink
                                        href={route('owner.properties.index')}
                                        active={route().current('owner.properties.*')}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700"
                                    >
                                        <Building2 className="h-4 w-4 text-emerald-600" />
                                        {t('nav_my_properties')}
                                    </NavLink>
                                )}

                                {isSeeker && user && (
                                    <NavLink
                                        href={route('owner.verification.index')}
                                        active={route().current('owner.verification.*')}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                                    >
                                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                        {t('nav_become_owner')}
                                    </NavLink>
                                )}

                                {isAdmin && (
                                    <>
                                        <NavLink
                                            href={route('admin.verifications.index')}
                                            active={route().current('admin.verifications.*')}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-700 hover:text-purple-800"
                                        >
                                            <ShieldCheck className="h-4 w-4 text-purple-600" />
                                            {t('nav_admin_kyc')}
                                        </NavLink>

                                        <NavLink
                                            href={route('admin.lawyers.index')}
                                            active={route().current('admin.lawyers.*')}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-700 hover:text-amber-800"
                                        >
                                            <Scale className="h-4 w-4 text-amber-600" />
                                            {t('nav_admin_lawyers')}
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Language Toggle, Role Badge, List Property CTA, & Profile */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center sm:gap-3">
                            {/* Language Switcher Pill */}
                            <button
                                type="button"
                                onClick={toggleLang}
                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition shadow-xs"
                                title="Switch Language (English / မြန်မာ Unicode)"
                            >
                                <Globe className="h-3.5 w-3.5 text-emerald-600" />
                                <span>{lang === 'en' ? 'EN' : 'မြန်မာ'}</span>
                            </button>

                            {/* List Property Button for Verified Owners */}
                            {isOwner && (
                                <Link
                                    href={route('owner.properties.create')}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Post Direct Listing</span>
                                </Link>
                            )}

                            {/* User Profile or Login */}
                            {user ? (
                                <>
                                    <RoleBadge role={user?.role} isVerifiedOwner={user?.is_verified_owner} />

                                    <div className="relative">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none"
                                                >
                                                    <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-slate-100 font-bold text-slate-700">
                                                        {user?.avatar ? (
                                                            <img
                                                                src={`/storage/${user.avatar}`}
                                                                alt={user.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            user?.name?.charAt(0) || 'U'
                                                        )}
                                                    </div>
                                                    <span className="max-w-[120px] truncate font-semibold">{user?.name}</span>
                                                    <svg
                                                        className="h-3.5 w-3.5 text-slate-400"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content width="56">
                                                <div className="border-b border-slate-100 px-4 py-2.5">
                                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                                        Signed in as
                                                    </p>
                                                    <p className="truncate text-sm font-bold text-slate-800">{user?.name}</p>
                                                    <p className="truncate text-xs text-slate-500">{user?.email}</p>
                                                    <div className="mt-2">
                                                        <RoleBadge role={user?.role} isVerifiedOwner={user?.is_verified_owner} />
                                                    </div>
                                                </div>

                                                <Dropdown.Link
                                                    href={route('profile.edit')}
                                                    className="inline-flex w-full items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                                                >
                                                    <User className="h-4 w-4 text-slate-400" />
                                                    {t('nav_profile')}
                                                </Dropdown.Link>

                                                {isSeeker && (
                                                    <>
                                                        <Dropdown.Link
                                                            href={route('owner.verification.index')}
                                                            className="inline-flex w-full items-center gap-2 px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50"
                                                        >
                                                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                                            {t('nav_become_owner')}
                                                        </Dropdown.Link>
                                                        <Dropdown.Link
                                                            href={route('lawyer.verification.index')}
                                                            className="inline-flex w-full items-center gap-2 px-4 py-2 text-xs text-amber-700 hover:bg-amber-50"
                                                        >
                                                            <Scale className="h-4 w-4 text-amber-600" />
                                                            Apply as Lawyer
                                                        </Dropdown.Link>
                                                    </>
                                                )}

                                                {isOwner && (
                                                    <Dropdown.Link
                                                        href={route('owner.properties.create')}
                                                        className="inline-flex w-full items-center gap-2 px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50 font-bold"
                                                    >
                                                        <PlusCircle className="h-4 w-4 text-emerald-600" />
                                                        + Post Direct Listing
                                                    </Dropdown.Link>
                                                )}

                                                {isAdmin && (
                                                    <>
                                                        <Dropdown.Link
                                                            href={route('admin.verifications.index')}
                                                            className="inline-flex w-full items-center gap-2 px-4 py-2 text-xs text-purple-700 hover:bg-purple-50"
                                                        >
                                                            <ShieldCheck className="h-4 w-4 text-purple-600" />
                                                            {t('nav_admin_kyc')}
                                                        </Dropdown.Link>
                                                        <Dropdown.Link
                                                            href={route('admin.lawyers.index')}
                                                            className="inline-flex w-full items-center gap-2 px-4 py-2 text-xs text-amber-700 hover:bg-amber-50"
                                                        >
                                                            <Scale className="h-4 w-4 text-amber-600" />
                                                            {t('nav_admin_lawyers')}
                                                        </Dropdown.Link>
                                                    </>
                                                )}

                                                <Dropdown.Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className="inline-flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                                                >
                                                    <LogOut className="h-4 w-4 text-red-500" />
                                                    {t('nav_logout')}
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={route('login')}
                                        className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                                    >
                                        {t('nav_login')}
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                                    >
                                        {t('nav_register')}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Right Side: Language Toggle & Menu Button */}
                        <div className="-me-2 flex items-center gap-2 sm:hidden">
                            <button
                                type="button"
                                onClick={toggleLang}
                                className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700"
                            >
                                {lang === 'en' ? 'EN' : 'မြန်မာ'}
                            </button>

                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden border-t border-slate-200 bg-white'}>
                    <div className="space-y-1 px-4 py-3">
                        {user ? (
                            <div className="mb-3 flex items-center justify-between border-b pb-3">
                                <div>
                                    <div className="text-base font-bold text-slate-800">{user?.name}</div>
                                    <div className="text-xs text-slate-500">{user?.email}</div>
                                </div>
                                <RoleBadge role={user?.role} isVerifiedOwner={user?.is_verified_owner} />
                            </div>
                        ) : null}

                        <ResponsiveNavLink href={route('properties.index')} active={route().current('properties.*')}>
                            {t('nav_properties')}
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('lawyers.index')} active={route().current('lawyers.*')}>
                            {t('nav_lawyers')}
                        </ResponsiveNavLink>

                        {user && (
                            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                {t('nav_dashboard')}
                            </ResponsiveNavLink>
                        )}

                        {isOwner && (
                            <>
                                <ResponsiveNavLink href={route('owner.properties.index')} active={route().current('owner.properties.index')}>
                                    {t('nav_my_properties')}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('owner.properties.create')} active={route().current('owner.properties.create')}>
                                    + Post Direct Listing
                                </ResponsiveNavLink>
                            </>
                        )}

                        {isSeeker && user && (
                            <>
                                <ResponsiveNavLink href={route('owner.verification.index')} active={route().current('owner.verification.*')}>
                                    {t('nav_become_owner')}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('lawyer.verification.index')} active={route().current('lawyer.verification.*')}>
                                    Apply as Lawyer
                                </ResponsiveNavLink>
                            </>
                        )}

                        {isAdmin && (
                            <>
                                <ResponsiveNavLink href={route('admin.verifications.index')} active={route().current('admin.verifications.*')}>
                                    {t('nav_admin_kyc')}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('admin.lawyers.index')} active={route().current('admin.lawyers.*')}>
                                    {t('nav_admin_lawyers')}
                                </ResponsiveNavLink>
                            </>
                        )}

                        {user ? (
                            <>
                                <ResponsiveNavLink href={route('profile.edit')}>
                                    {t('nav_profile')}
                                </ResponsiveNavLink>

                                <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                    {t('nav_logout')}
                                </ResponsiveNavLink>
                            </>
                        ) : (
                            <div className="pt-2 flex flex-col gap-2">
                                <Link
                                    href={route('login')}
                                    className="block text-center rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-800"
                                >
                                    {t('nav_login')}
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="block text-center rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white"
                                >
                                    {t('nav_register')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Flash Alerts Banner */}
            {!dismissFlash && (flash?.success || flash?.error || flash?.message) && (
                <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="relative flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                                <span>{flash.success}</span>
                            </div>
                            <button
                                onClick={() => setDismissFlash(true)}
                                className="rounded p-1 text-emerald-600 hover:bg-emerald-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="relative flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm">
                            <div className="flex items-center gap-2.5">
                                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                                <span>{flash.error}</span>
                            </div>
                            <button
                                onClick={() => setDismissFlash(true)}
                                className="rounded p-1 text-red-600 hover:bg-red-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Page Header */}
            {header && (
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Main Content */}
            <main className="pb-16">{children}</main>
        </div>
    );
}
