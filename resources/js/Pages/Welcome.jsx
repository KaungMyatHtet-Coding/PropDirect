import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';
import {
    ShieldCheck,
    Building2,
    Users,
    FileCheck2,
    ArrowRight,
    Lock,
    CheckCircle2,
    Sparkles,
    Key,
} from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
            <Head title="PropDirect - P2P No-Broker Real Estate Marketplace" />

            {/* Top Navigation */}
            <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <ApplicationLogo />

                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                            >
                                <span>Go to Dashboard</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 transition hover:text-white hover:bg-slate-800"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-500"
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main>
                <div className="relative overflow-hidden py-20 sm:py-28">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]"></div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400">
                            <ShieldCheck className="h-4 w-4" />
                            <span>100% Direct Landlords • 0% Broker Commission</span>
                        </div>

                        <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl">
                            Real Estate Direct from Owners.{' '}
                            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                                Zero Broker Fees.
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">
                            PropDirect eliminates deceptive middlemen through a strict anti-broker KYC verification pipeline,
                            privacy-guarded contact unlocking, and version-tracked rental contracts with automated clause diff-tracking.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href={auth.user ? route('dashboard') : route('register')}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
                            >
                                <span>{auth.user ? 'Open Dashboard' : 'Create Free Account'}</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-700"
                            >
                                <span>Sign In to Demo</span>
                            </Link>
                        </div>

                        {/* Demo Accounts Quick-View */}
                        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-slate-800 bg-slate-800/50 p-6 backdrop-blur-sm text-left">
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                                <Key className="h-4 w-4" />
                                <span>Pre-Seeded Accounts for Testing (Password: password)</span>
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs font-mono">
                                <div className="rounded-xl border border-purple-500/30 bg-purple-950/40 p-3">
                                    <div className="font-bold text-purple-400">[Admin]</div>
                                    <div className="text-slate-200 truncate">admin@propdirect.com</div>
                                    <div className="mt-1 text-[11px] text-slate-400">Can audit & approve KYC</div>
                                </div>
                                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3">
                                    <div className="font-bold text-emerald-400">[Verified Owner]</div>
                                    <div className="text-slate-200 truncate">owner@propdirect.com</div>
                                    <div className="mt-1 text-[11px] text-slate-400">Verified Landlord account</div>
                                </div>
                                <div className="rounded-xl border border-blue-500/30 bg-blue-950/40 p-3">
                                    <div className="font-bold text-blue-400">[Seeker]</div>
                                    <div className="text-slate-200 truncate">seeker@propdirect.com</div>
                                    <div className="mt-1 text-[11px] text-slate-400">Has 1 pending KYC request</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pillars Grid */}
                <div className="border-t border-slate-800 bg-slate-900/50 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-white">Anti-Broker KYC Audit</h3>
                                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                                    Every landlord must provide their NRC identity and YESC electricity/water utility bill.
                                    Admin moderation verifies document authenticity before listings go live.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                                    <Lock className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-white">Privacy Contact Unlock</h3>
                                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                                    Phone numbers and contact info remain protected from automated scrapers and aggressive brokers.
                                    Contact is only unlocked when the owner accepts an appointment.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                    <FileCheck2 className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-white">Contract Diff-Tracker</h3>
                                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                                    Track rental contract versions, clause amendments, and monthly payment obligations in
                                    an immutable structured ledger without manual paperwork.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    PropDirect &copy; {new Date().getFullYear()} • P2P Real Estate Marketplace & Contract Tracker
                </div>
            </footer>
        </div>
    );
}
