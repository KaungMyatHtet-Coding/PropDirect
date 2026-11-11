import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import RoleBadge from '@/Components/RoleBadge';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    ShieldCheck,
    FileCheck2,
    Building,
    UserCheck,
    LogOut,
    User,
    CheckCircle,
    AlertCircle,
    X,
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [dismissFlash, setDismissFlash] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isOwner = user?.role === 'owner' || user?.is_verified_owner;
    const isSeeker = !isAdmin && !isOwner;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Left Side: Logo & Main Links */}
                        <div className="flex items-center">
                            <div className="flex shrink-0 items-center">
                                <Link href="/dashboard">
                                    <ApplicationLogo />
                                </Link>
                            </div>

                            <div className="hidden space-x-2 sm:-my-px sm:ms-8 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </NavLink>

                                {isSeeker && (
                                    <NavLink
                                        href={route('owner.verification.index')}
                                        active={route().current('owner.verification.*')}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                                    >
                                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                        Become Verified Owner
                                    </NavLink>
                                )}

                                {isOwner && (
                                    <NavLink
                                        href={route('owner.verification.index')}
                                        active={route().current('owner.verification.*')}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium"
                                    >
                                        <FileCheck2 className="h-4 w-4 text-emerald-600" />
                                        Ownership KYC Status
                                    </NavLink>
                                )}

                                {isAdmin && (
                                    <NavLink
                                        href={route('admin.verifications.index')}
                                        active={route().current('admin.verifications.*')}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-700 hover:text-purple-800"
                                    >
                                        <ShieldCheck className="h-4 w-4 text-purple-600" />
                                        Admin KYC Panel
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Role Badge & Profile Dropdown */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center sm:gap-4">
                            {/* Role Badge in Header */}
                            <RoleBadge role={user?.role} isVerifiedOwner={user?.is_verified_owner} />

                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none"
                                        >
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                                                {user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <span className="max-w-[130px] truncate">{user?.name}</span>
                                            <svg
                                                className="h-4 w-4 text-slate-400"
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
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                                            className="inline-flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            <User className="h-4 w-4 text-slate-400" />
                                            Profile Settings
                                        </Dropdown.Link>

                                        {isSeeker && (
                                            <Dropdown.Link
                                                href={route('owner.verification.index')}
                                                className="inline-flex w-full items-center gap-2 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
                                            >
                                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                                Verify Ownership
                                            </Dropdown.Link>
                                        )}

                                        {isAdmin && (
                                            <Dropdown.Link
                                                href={route('admin.verifications.index')}
                                                className="inline-flex w-full items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                                            >
                                                <ShieldCheck className="h-4 w-4 text-purple-600" />
                                                KYC Review Queue
                                            </Dropdown.Link>
                                        )}

                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="inline-flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4 text-red-500" />
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Hamburger Button */}
                        <div className="-me-2 flex items-center sm:hidden">
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
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <div className="text-base font-bold text-slate-800">{user?.name}</div>
                                <div className="text-xs text-slate-500">{user?.email}</div>
                            </div>
                            <RoleBadge role={user?.role} isVerifiedOwner={user?.is_verified_owner} />
                        </div>

                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>

                        {isSeeker && (
                            <ResponsiveNavLink
                                href={route('owner.verification.index')}
                                active={route().current('owner.verification.*')}
                            >
                                Verify Ownership (Anti-Broker)
                            </ResponsiveNavLink>
                        )}

                        {isOwner && (
                            <ResponsiveNavLink
                                href={route('owner.verification.index')}
                                active={route().current('owner.verification.*')}
                            >
                                Owner KYC Record
                            </ResponsiveNavLink>
                        )}

                        {isAdmin && (
                            <ResponsiveNavLink
                                href={route('admin.verifications.index')}
                                active={route().current('admin.verifications.*')}
                            >
                                Admin KYC Panel
                            </ResponsiveNavLink>
                        )}

                        <ResponsiveNavLink href={route('profile.edit')}>
                            Profile Settings
                        </ResponsiveNavLink>

                        <ResponsiveNavLink method="post" href={route('logout')} as="button">
                            Log Out
                        </ResponsiveNavLink>
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
