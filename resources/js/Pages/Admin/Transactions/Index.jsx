import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    Scale,
    CheckCircle2,
    Clock,
    XCircle,
    Unlock,
    Lock,
    ShieldAlert,
    MessageSquare,
    Eye,
    FileText,
    GitCompare,
} from 'lucide-react';

export default function AdminTransactionsIndex({ viewings, inquiries, contracts, metrics }) {
    const { lang, t } = useLanguage();
    const [activeTab, setActiveTab] = useState('viewings'); // 'viewings', 'inquiries', or 'contracts'

    const viewingList = viewings?.data || [];
    const inquiryList = inquiries?.data || [];
    const contractList = contracts?.data || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {t('nav_transactions')}
                            </h2>
                            <span className="rounded-full bg-indigo-100 dark:bg-indigo-950 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                Platform Audit
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                            Unified oversight for direct viewing appointments and legal consultation transactions
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Platform Transactions & Audits - PropDirect" />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
                {/* 1. KPI Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Viewings</span>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                            {metrics?.total_viewings || 0}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Accepted</span>
                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                            {metrics?.accepted_viewings || 0}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Completed</span>
                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                            {metrics?.completed_viewings || 0}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Unlocked Contacts</span>
                        <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                            {metrics?.unlocked_contacts || 0}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Legal Inquiries</span>
                        <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                            {metrics?.total_inquiries || 0}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Accepted Inquiries</span>
                        <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
                            {metrics?.accepted_inquiries || 0}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Active Contracts</span>
                        <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                            {metrics?.active_contracts || 0}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Total Contracts</span>
                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                            {metrics?.total_contracts || 0}
                        </div>
                    </div>
                </div>

                {/* 2. Navigation Tabs */}
                <div className="flex border-b border-slate-200 dark:border-zinc-800">
                    <button
                        type="button"
                        onClick={() => setActiveTab('viewings')}
                        className={`flex items-center gap-2 py-3 px-5 text-xs font-bold border-b-2 transition ${
                            activeTab === 'viewings'
                                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white'
                        }`}
                    >
                        <Calendar className="h-4 w-4" />
                        <span>Viewing Requests ({viewingList.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('inquiries')}
                        className={`flex items-center gap-2 py-3 px-5 text-xs font-bold border-b-2 transition ${
                            activeTab === 'inquiries'
                                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white'
                        }`}
                    >
                        <Scale className="h-4 w-4" />
                        <span>Legal Consultations ({inquiryList.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('contracts')}
                        className={`flex items-center gap-2 py-3 px-5 text-xs font-bold border-b-2 transition ${
                            activeTab === 'contracts'
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white'
                        }`}
                    >
                        <FileText className="h-4 w-4" />
                        <span>Lease Contracts ({contractList.length})</span>
                    </button>
                </div>

                {/* 3. Tab Contents */}
                {activeTab === 'viewings' && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">
                                    <tr>
                                        <th className="py-3 px-4">ID</th>
                                        <th className="py-3 px-4">Property</th>
                                        <th className="py-3 px-4">Seeker</th>
                                        <th className="py-3 px-4">Owner</th>
                                        <th className="py-3 px-4">Preferred Slot</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Contact</th>
                                        <th className="py-3 px-4 text-right">Audit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
                                    {viewingList.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40">
                                            <td className="py-3 px-4 font-mono font-bold">#{item.id}</td>
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-slate-900 dark:text-white truncate max-w-xs">
                                                    {item.property?.title}
                                                </div>
                                                <span className="text-[10px] text-slate-400">{item.property?.township}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-slate-900 dark:text-white">{item.seeker?.name}</div>
                                                <span className="text-[10px] font-mono text-slate-400">{item.seeker?.email}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-slate-900 dark:text-white">{item.owner?.name}</div>
                                                <span className="text-[10px] font-mono text-slate-400">{item.owner?.email}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>{item.rescheduled_date || item.preferred_date}</div>
                                                <span className="text-[10px] text-slate-400">
                                                    {item.rescheduled_time || item.preferred_time}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="rounded-full bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold capitalize">
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {item.contact_unlocked ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                                        <Unlock className="h-3 w-3" /> Unlocked
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                        <Lock className="h-3 w-3" /> Masked
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Link
                                                    href={route('viewing.show', item.id)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-zinc-200 hover:bg-slate-50"
                                                >
                                                    <MessageSquare className="h-3 w-3" />
                                                    <span>Chat</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'inquiries' && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">
                                    <tr>
                                        <th className="py-3 px-4">ID</th>
                                        <th className="py-3 px-4">Client</th>
                                        <th className="py-3 px-4">Lawyer</th>
                                        <th className="py-3 px-4">Service</th>
                                        <th className="py-3 px-4">Date</th>
                                        <th className="py-3 px-4">Quoted Fee</th>
                                        <th className="py-3 px-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
                                    {inquiryList.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40">
                                            <td className="py-3 px-4 font-mono font-bold">#{item.id}</td>
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-slate-900 dark:text-white">{item.client?.name}</div>
                                                <span className="text-[10px] font-mono text-slate-400">{item.client?.email}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-slate-900 dark:text-white">{item.lawyer_user?.name}</div>
                                                <span className="text-[10px] font-mono text-slate-400">Lic: {item.lawyer_profile?.license_number}</span>
                                            </td>
                                            <td className="py-3 px-4 capitalize">
                                                {item.service_type.replace('_', ' ')}
                                            </td>
                                            <td className="py-3 px-4">{item.preferred_date}</td>
                                            <td className="py-3 px-4 font-mono font-bold text-amber-700 dark:text-amber-400">
                                                {item.quoted_fee ? `${Number(item.quoted_fee).toLocaleString()} Ks` : 'Pending'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="rounded-full bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold capitalize">
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'contracts' && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">
                                    <tr>
                                        <th className="py-3 px-4">Code</th>
                                        <th className="py-3 px-4">Property</th>
                                        <th className="py-3 px-4">Landlord</th>
                                        <th className="py-3 px-4">Tenant</th>
                                        <th className="py-3 px-4">Rent / Deposit</th>
                                        <th className="py-3 px-4">Version</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Audit Diff</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
                                    {contractList.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40">
                                            <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                {item.contract_code}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-slate-900 dark:text-white truncate max-w-xs">
                                                    {item.property?.title}
                                                </div>
                                                <span className="text-[10px] text-slate-400">{item.property?.township}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-slate-900 dark:text-white">{item.owner?.name}</div>
                                                <span className="text-[10px] font-mono text-slate-400">{item.owner?.email}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-slate-900 dark:text-white">{item.tenant?.name}</div>
                                                <span className="text-[10px] font-mono text-slate-400">{item.tenant?.email}</span>
                                            </td>
                                            <td className="py-3 px-4 font-mono">
                                                <div>{Number(item.monthly_rent).toLocaleString()} Ks</div>
                                                <div className="text-[10px] text-slate-400">Dep: {Number(item.deposit_amount).toLocaleString()} Ks</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-extrabold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                                                    v{item.current_version}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                                                    item.status === 'active'
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                        : item.status === 'pending_tenant'
                                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                        : 'bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-300'
                                                }`}>
                                                    {item.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Link
                                                    href={route('contracts.show', item.id)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 text-[11px] font-bold transition"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    <span>Audit</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
