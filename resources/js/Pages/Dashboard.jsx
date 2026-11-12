import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RoleBadge from '@/Components/RoleBadge';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ShieldCheck,
    Building2,
    Users,
    FileCheck2,
    ArrowRight,
    TrendingUp,
    Compass,
    Scale,
    AlertCircle,
    CheckCircle2,
    Clock,
    Search,
    MapPin,
    Layers,
    MessageSquare,
    Sparkles,
    ShieldAlert,
} from 'lucide-react';

export default function Dashboard({
    role = 'seeker',
    adminMetrics,
    trendData = [],
    trendRange = 'week',
    marketDemand,
    activityFeed = { today: [], yesterday: [], this_week: [] },
    ownerMetrics,
    myProperties = [],
    featuredProperties = [],
    verifiedLawyers = [],
}) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [activeFeedTab, setActiveFeedTab] = useState('today');
    const [selectedTrendRange, setSelectedTrendRange] = useState(trendRange);

    const isAdmin = user?.role === 'admin';
    const isOwner = user?.role === 'owner' || user?.is_verified_owner;

    // Helper for trend bar max height calculation
    const maxTrendVal = Math.max(
        ...trendData.map((d) => Math.max(d.rent || 0, d.sale || 0, d.searches || 0)),
        10
    );

    return (
        <AuthenticatedLayout header="Overview Dashboard">
            <Head title="Dashboard - PropDirect" />

            <div className="space-y-8">
                {/* ADMIN KRAVIO DASHBOARD */}
                {isAdmin && adminMetrics && (
                    <div className="space-y-8">
                        {/* 1. Top 3 KPI Cards with SVG Sparklines */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {/* Card 1: Total Properties */}
                            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs transition hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                                        Total Properties Listed
                                    </span>
                                    <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-baseline justify-between">
                                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                                        {adminMetrics.totalProperties}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        +18.4%
                                    </span>
                                </div>
                                {/* SVG Sparkline */}
                                <div className="mt-3 h-9 w-full">
                                    <svg className="h-full w-full overflow-visible" viewBox="0 0 120 30">
                                        <path
                                            d="M0,25 Q30,5 60,18 T120,8"
                                            fill="none"
                                            stroke="#10B981"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M0,25 Q30,5 60,18 T120,8 L120,30 L0,30 Z"
                                            fill="rgba(16, 185, 129, 0.12)"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Card 2: Verified Stakeholders */}
                            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs transition hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                                        Verified Stakeholders
                                    </span>
                                    <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                        <Users className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-baseline justify-between">
                                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                                        {adminMetrics.verifiedUsersTotal}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        {adminMetrics.verifiedOwnersCount} Owners • {adminMetrics.approvedLawyersCount} Lawyers
                                    </span>
                                </div>
                                {/* SVG Sparkline */}
                                <div className="mt-3 h-9 w-full">
                                    <svg className="h-full w-full overflow-visible" viewBox="0 0 120 30">
                                        <path
                                            d="M0,22 Q25,28 50,12 T120,4"
                                            fill="none"
                                            stroke="#6366F1"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M0,22 Q25,28 50,12 T120,4 L120,30 L0,30 Z"
                                            fill="rgba(99, 102, 241, 0.12)"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Card 3: Pending KYC Approvals */}
                            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs transition hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                                        Pending KYC Approvals
                                    </span>
                                    <div className="h-8 w-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                        <ShieldAlert className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-baseline justify-between">
                                    <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
                                        {adminMetrics.totalPendingKYC}
                                    </span>
                                    <Link
                                        href={route('admin.verifications.index')}
                                        className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                                    >
                                        Inspect Queue <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                                {/* SVG Sparkline */}
                                <div className="mt-3 h-9 w-full">
                                    <svg className="h-full w-full overflow-visible" viewBox="0 0 120 30">
                                        <path
                                            d="M0,15 Q40,30 80,10 T120,18"
                                            fill="none"
                                            stroke="#F59E0B"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M0,15 Q40,30 80,10 T120,18 L120,30 L0,30 Z"
                                            fill="rgba(245, 158, 11, 0.12)"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* 2. Middle Row: Interactive Trend Bar Chart & Right Live Feed */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Trend Bar Chart (2 Cols) */}
                            <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs flex flex-col justify-between">
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                Market Volume Trends & Demands
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                                Daily comparison of rent, sale, and seeker inquiry activity
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" /> Rent
                                            </span>
                                            <span className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                                <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block" /> Sale
                                            </span>
                                            <span className="flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                                                <span className="h-2.5 w-2.5 rounded-full bg-purple-500 inline-block" /> Inquiries
                                            </span>
                                        </div>
                                    </div>

                                    {/* SVG / Pure Tailwind Bar Chart */}
                                    <div className="mt-6 h-56 flex items-end justify-between gap-2 pt-6 pb-2">
                                        {trendData.map((item, idx) => {
                                            const rentHeight = Math.max(8, (item.rent / maxTrendVal) * 160);
                                            const saleHeight = Math.max(8, (item.sale / maxTrendVal) * 160);
                                            const searchHeight = Math.max(8, (item.searches / maxTrendVal) * 160);

                                            return (
                                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                                    <div className="w-full flex items-end justify-center gap-1 h-44">
                                                        {/* Rent Bar */}
                                                        <div
                                                            style={{ height: `${rentHeight}px` }}
                                                            className="w-2.5 rounded-t-md bg-emerald-500/80 group-hover:bg-emerald-500 transition-all duration-300"
                                                            title={`Rent: ${item.rent}`}
                                                        />
                                                        {/* Sale Bar */}
                                                        <div
                                                            style={{ height: `${saleHeight}px` }}
                                                            className="w-2.5 rounded-t-md bg-blue-500/80 group-hover:bg-blue-500 transition-all duration-300"
                                                            title={`Sale: ${item.sale}`}
                                                        />
                                                        {/* Searches Bar */}
                                                        <div
                                                            style={{ height: `${searchHeight}px` }}
                                                            className="w-2.5 rounded-t-md bg-purple-500/80 group-hover:bg-purple-500 transition-all duration-300"
                                                            title={`Searches: ${item.searches}`}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 truncate max-w-full">
                                                        {item.date}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                                    <span>Total Logged Search Inquiries: <strong>{adminMetrics.totalSearches}</strong></span>
                                    <Link href={route('properties.index')} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                                        Explore Marketplace →
                                    </Link>
                                </div>
                            </div>

                            {/* Right Live Updates Feed (1 Col) */}
                            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Latest Platform Updates
                                        </h3>
                                        {/* Tabs */}
                                        <div className="flex rounded-lg bg-slate-100 dark:bg-zinc-800 p-0.5 text-[11px] font-semibold">
                                            {['today', 'yesterday', 'this_week'].map((tab) => (
                                                <button
                                                    key={tab}
                                                    type="button"
                                                    onClick={() => setActiveFeedTab(tab)}
                                                    className={`px-2 py-1 rounded-md capitalize transition ${
                                                        activeFeedTab === tab
                                                            ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs'
                                                            : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700'
                                                    }`}
                                                >
                                                    {tab.replace('_', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Feed Items List */}
                                    <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
                                        {activityFeed[activeFeedTab]?.length > 0 ? (
                                            activityFeed[activeFeedTab].map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-start gap-3 p-2 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 text-xs"
                                                >
                                                    <div className="p-1.5 rounded-lg bg-white dark:bg-zinc-700 shadow-xs shrink-0 mt-0.5">
                                                        {item.type === 'kyc_owner' && <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />}
                                                        {item.type === 'kyc_lawyer' && <Scale className="h-3.5 w-3.5 text-amber-500" />}
                                                        {item.type === 'property' && <Building2 className="h-3.5 w-3.5 text-emerald-500" />}
                                                        {item.type === 'feedback' && <MessageSquare className="h-3.5 w-3.5 text-rose-500" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold text-slate-800 dark:text-zinc-200 truncate">
                                                            {item.title}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                                                            {item.subtitle}
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 shrink-0">
                                                        {item.time}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center text-xs text-slate-400 dark:text-zinc-500">
                                                No events logged for {activeFeedTab.replace('_', ' ')}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 mt-4 flex items-center justify-between text-xs">
                                    <Link href={route('admin.verifications.index')} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                                        Owner Queue
                                    </Link>
                                    <Link href={route('admin.lawyers.index')} className="text-amber-600 dark:text-amber-400 font-bold hover:underline">
                                        Lawyer Queue
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* 3. Bottom Row: Market Demand Insights (Townships, Dimensions, Floors) */}
                        {marketDemand && (
                            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs">
                                <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-purple-600" />
                                        Market Demand Intelligence (From Real Seeker Search Logs)
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                                        Aggregated data on which Yangon townships and unit dimensions tenants are seeking most
                                    </p>
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Top Townships */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-emerald-500" /> Top Searched Townships
                                        </h4>
                                        <div className="space-y-2">
                                            {marketDemand.topTownships?.map((ts, idx) => (
                                                <div key={idx} className="space-y-1">
                                                    <div className="flex justify-between text-xs text-slate-700 dark:text-zinc-300">
                                                        <span className="font-medium">{ts.township}</span>
                                                        <span className="font-bold">{ts.count} searches</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-500 rounded-full"
                                                            style={{ width: `${Math.min(100, ts.count * 12)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Top Dimensions */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Layers className="h-3.5 w-3.5 text-blue-500" /> Requested Dimensions
                                        </h4>
                                        <div className="space-y-2">
                                            {marketDemand.topDimensions?.map((dim, idx) => (
                                                <div key={idx} className="space-y-1">
                                                    <div className="flex justify-between text-xs text-slate-700 dark:text-zinc-300">
                                                        <span className="font-medium">{dim.dimension_preset}</span>
                                                        <span className="font-bold">{dim.count} queries</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full"
                                                            style={{ width: `${Math.min(100, dim.count * 15)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Top Floor Levels */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Building2 className="h-3.5 w-3.5 text-purple-500" /> Floor Level Preferences
                                        </h4>
                                        <div className="space-y-2">
                                            {marketDemand.topFloors?.map((fl, idx) => (
                                                <div key={idx} className="space-y-1">
                                                    <div className="flex justify-between text-xs text-slate-700 dark:text-zinc-300">
                                                        <span className="font-medium capitalize">{fl.floor_level}</span>
                                                        <span className="font-bold">{fl.count} hits</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-purple-500 rounded-full"
                                                            style={{ width: `${Math.min(100, fl.count * 15)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* OWNER / SEEKER DASHBOARD VIEW */}
                {!isAdmin && (
                    <div className="space-y-8">
                        {/* Welcome Banner */}
                        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800/60 px-3 py-1 text-xs font-bold text-emerald-100">
                                        <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                                        Direct P2P Real Estate Platform
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black mt-2">
                                        Welcome, {user.name}
                                    </h2>
                                    <p className="text-xs text-emerald-100 mt-1 max-w-xl">
                                        Find verified Yangon properties, connect directly with genuine owners, and access Bar Council certified legal advice without paying broker commissions.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <Link
                                        href={route('properties.index')}
                                        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-md hover:bg-emerald-50 transition"
                                    >
                                        <Compass className="h-4 w-4" />
                                        Browse Properties
                                    </Link>
                                    {isOwner && (
                                        <Link
                                            href={route('owner.properties.create')}
                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-950 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-900 transition"
                                        >
                                            + Post Property
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Owner Stats if Owner */}
                        {isOwner && ownerMetrics && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
                                    <div className="text-xs text-slate-500 uppercase font-semibold">Total Properties</div>
                                    <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{ownerMetrics.total}</div>
                                </div>
                                <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
                                    <div className="text-xs text-emerald-600 uppercase font-semibold">Available for Rent/Sale</div>
                                    <div className="text-3xl font-black text-emerald-600 mt-2">{ownerMetrics.available}</div>
                                </div>
                                <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
                                    <div className="text-xs text-blue-600 uppercase font-semibold">Rented / In Contract</div>
                                    <div className="text-3xl font-black text-blue-600 mt-2">{ownerMetrics.rented}</div>
                                </div>
                            </div>
                        )}

                        {/* Quick Action Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
                                <div className="h-9 w-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center">
                                    <Compass className="h-5 w-5" />
                                </div>
                                <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Yangon Marketplace</h4>
                                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                    Explore verified apartments, condos, and houses in Sanchaung, Hlaing, Yankin, and across 33 townships.
                                </p>
                                <Link href={route('properties.index')} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline">
                                    Browse listings →
                                </Link>
                            </div>

                            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
                                <div className="h-9 w-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                                    <Scale className="h-5 w-5" />
                                </div>
                                <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Legal Document Safety</h4>
                                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                    Connect directly with Bar Council Advocates for BCC approval, 60-year grant checks, and tenancy contracts.
                                </p>
                                <Link href={route('lawyers.index')} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline">
                                    Find certified lawyer →
                                </Link>
                            </div>

                            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
                                <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Anti-Broker Verification</h4>
                                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                    Every owner is vetted with national registration cards and YESC electric bills to prevent broker inflation.
                                </p>
                                <Link href={route('owner.verification.index')} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline">
                                    Verify your ownership →
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
