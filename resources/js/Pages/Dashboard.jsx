import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RoleBadge from '@/Components/RoleBadge';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ShieldCheck,
    Building2,
    Users,
    FileCheck2,
    ArrowRight,
    Key,
    CheckCircle2,
    Clock,
    Lock,
    Sparkles,
    ShieldAlert,
} from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    const isAdmin = user?.role === 'admin';
    const isOwner = user?.role === 'owner' || user?.is_verified_owner;
    const isSeeker = !isAdmin && !isOwner;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Welcome, {user.name}
                            </h2>
                            <RoleBadge role={user?.role} isVerifiedOwner={user?.is_verified_owner} />
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            PropDirect Platform Overview & Role Management Hub
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {isSeeker && (
                            <Link
                                href={route('owner.verification.index')}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Verify Ownership
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                href={route('admin.verifications.index')}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-purple-800"
                            >
                                <ShieldAlert className="h-4 w-4" />
                                Open KYC Audit Queue
                            </Link>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Dashboard - PropDirect" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                {/* 1. Role-Specific Banner */}
                {isAdmin && (
                    <div className="relative overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-900 to-indigo-900 p-6 text-white shadow-lg">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-800/80 px-3 py-1 text-xs font-bold text-purple-200">
                                    <ShieldAlert className="h-3.5 w-3.5 text-purple-300" />
                                    Administrator Portal Active
                                </span>
                                <h3 className="text-xl font-black">KYC Verification Gatekeeper</h3>
                                <p className="max-w-2xl text-xs text-purple-200">
                                    You have full administrative privileges to review incoming owner verification documents
                                    (NRC front and utility bills) to ensure only genuine, non-broker property owners can list.
                                </p>
                            </div>
                            <Link
                                href={route('admin.verifications.index')}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-purple-900 shadow-md transition hover:bg-purple-50"
                            >
                                <span>Inspect KYC Queue</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                )}

                {isSeeker && (
                    <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white shadow-lg">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800/80 px-3 py-1 text-xs font-bold text-emerald-100">
                                    <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                                    Are you a Landlord or Property Owner?
                                </span>
                                <h3 className="text-xl font-black">Upgrade to Verified Owner</h3>
                                <p className="max-w-2xl text-xs text-emerald-100">
                                    PropDirect has a strict 0% broker fee rule. To list apartments, condos, or houses, you
                                    must upload your NRC and a utility bill (YESC meter) proving property ownership.
                                </p>
                            </div>
                            <Link
                                href={route('owner.verification.index')}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-emerald-800 shadow-md transition hover:bg-emerald-50"
                            >
                                <span>Submit Verification</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                )}

                {isOwner && (
                    <div className="relative overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-lg">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Verified Owner Privileges Active
                                </span>
                                <h3 className="text-xl font-black">Ready for Direct Listings & Contracts</h3>
                                <p className="max-w-2xl text-xs text-slate-300">
                                    Your KYC verification is verified. You bypass broker middlemen and can view seeker requests
                                    and prepare version-tracked micro-contracts.
                                </p>
                            </div>
                            <Link
                                href={route('owner.verification.index')}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700"
                            >
                                <span>View KYC Record</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* 2. Platform Architecture & Modules Grid */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Platform System Modules</h3>
                    <p className="text-xs text-slate-500">
                        Complete architecture foundation implemented in Phase 1
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Module 1: Anti-Broker KYC */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                    PHASE 1 ACTIVE
                                </span>
                            </div>
                            <h4 className="mt-4 text-base font-bold text-slate-900">
                                Role-Based Auth & Anti-Broker KYC
                            </h4>
                            <p className="mt-1 text-xs text-slate-600">
                                Strict 3-tier role hierarchy (`admin`, `owner`, `seeker`), NRC and electricity bill validation,
                                image upload pipeline, and admin moderation dashboard.
                            </p>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-400">Route</span>
                                <Link
                                    href={isAdmin ? route('admin.verifications.index') : route('owner.verification.index')}
                                    className="font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
                                >
                                    {isAdmin ? 'Admin KYC Dashboard' : 'Owner Verification Form'}
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Module 2: Property Listings */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                                    MIGRATED & READY
                                </span>
                            </div>
                            <h4 className="mt-4 text-base font-bold text-slate-900">
                                Direct Property Listings Schema
                            </h4>
                            <p className="mt-1 text-xs text-slate-600">
                                Complete `properties` table with township, price, security deposit, bedroom/bathroom,
                                area sqft, slug, and JSON photo galleries ready for Phase 2.
                            </p>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                <span>Status</span>
                                <span className="font-semibold text-slate-600">Database Schema Ready</span>
                            </div>
                        </div>

                        {/* Module 3: Privacy Contact Unlock */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                                    <Users className="h-6 w-6" />
                                </div>
                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                                    MIGRATED & READY
                                </span>
                            </div>
                            <h4 className="mt-4 text-base font-bold text-slate-900">
                                Viewing Request & Privacy Unlock
                            </h4>
                            <p className="mt-1 text-xs text-slate-600">
                                Two-way viewing request schema with appointment slots and contact unlocking only upon owner
                                confirmation to prevent broker spam.
                            </p>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                <span>Status</span>
                                <span className="font-semibold text-slate-600">Database Schema Ready</span>
                            </div>
                        </div>

                        {/* Module 4: Contract Diff-Tracker */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
                                    <FileCheck2 className="h-6 w-6" />
                                </div>
                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                                    MIGRATED & READY
                                </span>
                            </div>
                            <h4 className="mt-4 text-base font-bold text-slate-900">
                                Version-Tracked Rental Contracts
                            </h4>
                            <p className="mt-1 text-xs text-slate-600">
                                `contracts` and `contract_versions` tables equipped for automated clause diff-tracking,
                                monthly rent, deposit tracking, and version incrementing.
                            </p>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                <span>Status</span>
                                <span className="font-semibold text-slate-600">Database Schema Ready</span>
                            </div>
                        </div>

                        {/* Module 5: Monthly Rent Ledger */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                                    MIGRATED & READY
                                </span>
                            </div>
                            <h4 className="mt-4 text-base font-bold text-slate-900">
                                Rent Ledger & Due Reminders
                            </h4>
                            <p className="mt-1 text-xs text-slate-600">
                                `rent_payments` ledger table with billing months, due dates, paid_at timestamps, and
                                reminder notification tracking.
                            </p>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                <span>Status</span>
                                <span className="font-semibold text-slate-600">Database Schema Ready</span>
                            </div>
                        </div>

                        {/* Module 6: Demo Testing Credentials Card */}
                        <div className="rounded-2xl border border-slate-300 bg-slate-900 p-6 text-white shadow-sm">
                            <div className="flex items-center gap-2">
                                <Key className="h-5 w-5 text-amber-400" />
                                <h4 className="text-base font-bold">Seed Accounts for Testing</h4>
                            </div>
                            <p className="mt-1 text-xs text-slate-400">
                                All seeded accounts use password: <code className="text-amber-300">password</code>
                            </p>
                            <div className="mt-3 space-y-2 text-xs font-mono">
                                <div className="rounded bg-slate-800 p-2">
                                    <span className="text-purple-400 font-bold">[Admin]</span> admin@propdirect.com
                                </div>
                                <div className="rounded bg-slate-800 p-2">
                                    <span className="text-emerald-400 font-bold">[Owner]</span> owner@propdirect.com
                                </div>
                                <div className="rounded bg-slate-800 p-2">
                                    <span className="text-blue-400 font-bold">[Seeker]</span> seeker@propdirect.com (1 pending KYC)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
