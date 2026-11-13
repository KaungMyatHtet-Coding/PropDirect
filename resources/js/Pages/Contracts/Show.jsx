import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { computeFinancialDiff, computeTextDiff } from '@/utils/contractDiffEngine';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowDown,
    ArrowRight,
    ArrowUp,
    Building2,
    Calendar,
    Check,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    Clock,
    Columns,
    CornerDownRight,
    DollarSign,
    Download,
    Eye,
    FileCheck2,
    FileText,
    GitCompare,
    History,
    Info,
    Layers,
    Lock,
    Minus,
    Printer,
    RefreshCw,
    Scale,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Sliders,
    Sparkles,
    User,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

export default function Show({ contract }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user;
    const { lang, t } = useLanguage();

    const [activeTab, setActiveTab] = useState('document'); // 'document' | 'diff' | 'timeline'
    const [diffViewMode, setDiffViewMode] = useState('inline'); // 'inline' | 'split'
    const [showSignModal, setShowSignModal] = useState(false);
    const [showReviseModal, setShowReviseModal] = useState(false);

    const isAdmin = currentUser?.role === 'admin';
    const isOwner = currentUser?.id === contract.owner_id;
    const isTenant = currentUser?.id === contract.tenant_id;
    const canSign = (isOwner && !contract.owner_signed_at) || (isTenant && !contract.tenant_signed_at);
    const canRevise = !isAdmin && (isOwner || isTenant) && contract.status !== 'terminated' && contract.status !== 'expired';

    // Versions sorted by version_number ascending
    const sortedVersions = useMemo(() => {
        return [...(contract.versions || [])].sort((a, b) => a.version_number - b.version_number);
    }, [contract.versions]);

    const latestVersion = sortedVersions[sortedVersions.length - 1] || null;

    // Diff selectors
    const [oldVerId, setOldVerId] = useState(() => {
        if (sortedVersions.length > 1) {
            return sortedVersions[sortedVersions.length - 2].id;
        }
        return sortedVersions[0]?.id || null;
    });

    const [newVerId, setNewVerId] = useState(() => {
        return latestVersion?.id || null;
    });

    const oldVersion = useMemo(() => {
        return sortedVersions.find((v) => v.id === parseInt(oldVerId)) || sortedVersions[0];
    }, [sortedVersions, oldVerId]);

    const newVersion = useMemo(() => {
        return sortedVersions.find((v) => v.id === parseInt(newVerId)) || latestVersion;
    }, [sortedVersions, newVerId, latestVersion]);

    // Financial deltas
    const financialDiffs = useMemo(() => {
        return computeFinancialDiff(oldVersion, newVersion);
    }, [oldVersion, newVersion]);

    // Structured clauses diff
    const clausesDiff = useMemo(() => {
        if (!oldVersion || !newVersion) return [];
        const oldClauses = oldVersion.structured_clauses || [];
        const newClauses = newVersion.structured_clauses || [];
        const maxLen = Math.max(oldClauses.length, newClauses.length);

        const results = [];
        for (let i = 0; i < maxLen; i++) {
            const oldC = oldClauses[i] || null;
            const newC = newClauses[i] || null;

            const oldEn = oldC ? oldC.content_en : '';
            const newEn = newC ? newC.content_en : '';
            const oldMm = oldC ? oldC.content_mm : '';
            const newMm = newC ? newC.content_mm : '';

            results.push({
                clauseNumber: newC?.clause_number || oldC?.clause_number || i + 1,
                titleEn: newC?.title_en || oldC?.title_en || `Clause ${i + 1}`,
                titleMm: newC?.title_mm || oldC?.title_mm || `အပိုဒ် (${i + 1})`,
                oldContentEn: oldEn,
                newContentEn: newEn,
                oldContentMm: oldMm,
                newContentMm: newMm,
                diffEn: computeTextDiff(oldEn, newEn, 'word'),
                diffMm: computeTextDiff(oldMm, newMm, 'word'),
                hasChanges: oldEn !== newEn || oldMm !== newMm,
            });
        }
        return results;
    }, [oldVersion, newVersion]);

    // Full text diff (fallback if structured clauses are missing)
    const fullTextDiff = useMemo(() => {
        if (!oldVersion || !newVersion) return [];
        return computeTextDiff(oldVersion.terms_and_conditions || '', newVersion.terms_and_conditions || '', 'word');
    }, [oldVersion, newVersion]);

    // Sign Form
    const signForm = useForm({
        agree_terms: false,
    });

    const handleSignSubmit = (e) => {
        e.preventDefault();
        signForm.post(route('contracts.sign', contract.id), {
            onSuccess: () => setShowSignModal(false),
        });
    };

    // Revise Form
    const reviseForm = useForm({
        monthly_rent: latestVersion?.monthly_rent || contract.monthly_rent,
        deposit_amount: latestVersion?.deposit_amount || contract.deposit_amount,
        rent_due_day: latestVersion?.rent_due_day || contract.rent_due_day || 5,
        advance_payment_months: latestVersion?.advance_payment_months || 1,
        start_date: latestVersion?.start_date || contract.start_date,
        end_date: latestVersion?.end_date || contract.end_date,
        structured_clauses: latestVersion?.structured_clauses || [],
        terms_and_conditions: latestVersion?.terms_and_conditions || '',
        revision_request_note: '',
    });

    const handleReviseSubmit = (e) => {
        e.preventDefault();
        reviseForm.post(route('contracts.revise', contract.id), {
            onSuccess: () => setShowReviseModal(false),
        });
    };

    // Print handler
    const handlePrint = () => {
        window.print();
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>{t('contract_status_active')}</span>
                    </span>
                );
            case 'pending_tenant':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{t('contract_status_pending_tenant')}</span>
                    </span>
                );
            case 'revision_requested':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                        <GitCompare className="h-3.5 w-3.5" />
                        <span>{t('contract_status_revision_requested')}</span>
                    </span>
                );
            case 'terminated':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        <span>{t('contract_status_terminated')}</span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                        <span>{status}</span>
                    </span>
                );
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Contract ${contract.contract_code} | PropDirect`} />

            {/* Print CSS Rules */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    aside, header, nav, .no-print, button, .print-hide {
                        display: none !important;
                    }
                    body, main {
                        background: white !important;
                        color: black !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .print-area {
                        border: none !important;
                        box-shadow: none !important;
                        max-width: 100% !important;
                        padding: 0 !important;
                    }
                }
            `}} />

            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
                {/* Admin Auditor Read-Only Banner */}
                {isAdmin && (
                    <div className="no-print p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between text-xs text-purple-900 dark:text-purple-200">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                            <span className="font-bold">
                                {lang === 'mm'
                                    ? 'ပလက်ဖောင်း စစ်ဆေးရေးမှူး မြင်ကွင်း (Read-Only Auditor)'
                                    : 'Platform Auditor View (Separation of Duties - Read-Only)'}
                            </span>
                            <span className="opacity-75 hidden sm:inline">
                                • {lang === 'mm' ? 'စီမံခန့်ခွဲသူများသည် စာချုပ်ချုပ်ဆိုခြင်း/ပြင်ဆင်ခြင်း မပြုလုပ်နိုင်ပါ' : 'Admins audit version trees and cannot execute or alter contracts.'}
                            </span>
                        </div>
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60">
                            AUDIT MODE
                        </span>
                    </div>
                )}

                {/* Top Action Bar */}
                <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <Link
                                href={isOwner ? route('owner.contracts.index') : route('my-contracts.index')}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 transition"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                                {lang === 'mm' ? 'စာချုပ်စာရင်းသို့' : 'Contracts List'}
                            </Link>
                            <span className="text-slate-300 dark:text-zinc-700">/</span>
                            <span className="font-mono text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                                {contract.contract_code}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                                {contract.property?.title || 'Residential Lease Agreement'}
                            </h1>
                            {getStatusBadge(contract.status)}
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700">
                                v{contract.current_version}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Print / Save PDF */}
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold shadow-xs transition"
                            title="Print / Save PDF"
                        >
                            <Printer className="h-4 w-4" />
                            <span>{t('contract_print_btn')}</span>
                        </button>

                        {/* Propose Revision */}
                        {canRevise && (
                            <button
                                type="button"
                                onClick={() => setShowReviseModal(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition"
                            >
                                <GitCompare className="h-4 w-4" />
                                <span>{t('contract_revise_btn')}</span>
                            </button>
                        )}

                        {/* Sign Button */}
                        {canSign && (
                            <button
                                type="button"
                                onClick={() => setShowSignModal(true)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition"
                            >
                                <FileCheck2 className="h-4 w-4" />
                                <span>{t('contract_sign_btn')}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* 3 Main Tabs Nav (No Print) */}
                <div className="no-print flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800">
                    <button
                        type="button"
                        onClick={() => setActiveTab('document')}
                        className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition ${
                            activeTab === 'document'
                                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                        }`}
                    >
                        <FileText className="h-4 w-4" />
                        <span>{t('contract_tab_document')}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('diff')}
                        className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition ${
                            activeTab === 'diff'
                                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                        }`}
                    >
                        <GitCompare className="h-4 w-4" />
                        <span>{t('contract_tab_diff')}</span>
                        {sortedVersions.length > 1 && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                                {sortedVersions.length} versions
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('timeline')}
                        className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition ${
                            activeTab === 'timeline'
                                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                        }`}
                    >
                        <History className="h-4 w-4" />
                        <span>{t('contract_tab_timeline')}</span>
                    </button>
                </div>

                {/* ========================================================================= */}
                {/* TAB 1: OFFICIAL LEASE DOCUMENT (PRINT-READY) */}
                {/* ========================================================================= */}
                {activeTab === 'document' && (
                    <div className="print-area bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 sm:p-12 shadow-sm space-y-8">
                        {/* Contract Header */}
                        <div className="border-b-2 border-slate-900 dark:border-white pb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-extrabold mb-1">
                                    PropDirect • Certified P2P Smart Real Estate Contract
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    Residential Lease Agreement
                                </h2>
                                <h3 className="text-lg font-bold text-slate-700 dark:text-zinc-300">
                                    လူနေအိမ်ခန်း အငှားစာချုပ်
                                </h3>
                            </div>

                            <div className="text-right sm:border-l sm:border-slate-200 dark:sm:border-zinc-800 sm:pl-6 text-xs space-y-1">
                                <div>
                                    <span className="text-slate-400">Contract Code:</span>{' '}
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">{contract.contract_code}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Version:</span>{' '}
                                    <span className="font-bold text-slate-900 dark:text-white">v{contract.current_version}.0</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Date Prepared:</span>{' '}
                                    <span className="font-bold text-slate-900 dark:text-white">{contract.created_at ? contract.created_at.split('T')[0] : '2026-11-13'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Parties Specification Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Landlord Box */}
                            <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-800/40 space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-700 pb-2">
                                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                        <Building2 className="h-4 w-4" />
                                        <span>Party A: Landlord (အိမ်ရှင်)</span>
                                    </span>
                                    {contract.owner?.is_verified_owner && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            <span>Govt Verified</span>
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-1.5 text-xs text-slate-700 dark:text-zinc-300">
                                    <div><span className="text-slate-400">Full Name:</span> <strong className="text-slate-900 dark:text-white">{contract.owner?.name}</strong></div>
                                    <div><span className="text-slate-400">NRC No:</span> {contract.owner?.nrc_number || '12/SAKANA(N)098231'}</div>
                                    <div><span className="text-slate-400">Phone:</span> {contract.owner?.phone || 'Verified on platform'}</div>
                                    <div><span className="text-slate-400">Address:</span> {contract.owner?.current_address || 'Yangon, Myanmar'}</div>
                                </div>
                            </div>

                            {/* Tenant Box */}
                            <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-800/40 space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-700 pb-2">
                                    <span className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                                        <User className="h-4 w-4" />
                                        <span>Party B: Tenant (အိမ်ငှား)</span>
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                                        KYC Verified
                                    </span>
                                </div>
                                <div className="space-y-1.5 text-xs text-slate-700 dark:text-zinc-300">
                                    <div><span className="text-slate-400">Full Name:</span> <strong className="text-slate-900 dark:text-white">{contract.tenant?.name}</strong></div>
                                    <div><span className="text-slate-400">NRC No:</span> {contract.tenant?.nrc_number || '12/LAMATA(N)054321'}</div>
                                    <div><span className="text-slate-400">Phone:</span> {contract.tenant?.phone || 'Verified on platform'}</div>
                                    <div><span className="text-slate-400">Occupation:</span> {contract.tenant?.occupation || 'Private Sector Professional'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Leased Premises Description */}
                        {contract.property && (
                            <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-800/20 space-y-2 text-xs">
                                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                                    Leased Property Specifications
                                </div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                    {contract.property.title} — {contract.property.address || 'Standard Address'}, {contract.property.township}, Yangon
                                </div>
                                <div className="flex flex-wrap gap-4 text-slate-600 dark:text-zinc-300 pt-1">
                                    <div><span className="text-slate-400">Floor Level:</span> {contract.property.floor_level || 'Middle Floor'}</div>
                                    <div><span className="text-slate-400">Dimensions:</span> {contract.property.width_ft && contract.property.length_ft ? `${contract.property.width_ft}' x ${contract.property.length_ft}'` : 'Standard'} ({contract.property.area_sqft || 625} sqft)</div>
                                    <div><span className="text-slate-400">Furnishing:</span> {contract.property.furnishing || 'Fully Furnished'}</div>
                                </div>
                            </div>
                        )}

                        {/* Financial Table */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-zinc-800 pb-1.5">
                                Financial Terms & Payment Schedule (ငွေကြေးသတ်မှတ်ချက်များ)
                            </h4>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/70 dark:bg-zinc-800/70 text-slate-700 dark:text-zinc-300">
                                            <th className="py-2.5 px-4 font-bold">Item Description</th>
                                            <th className="py-2.5 px-4 font-bold">Billing Cycle / Due Date</th>
                                            <th className="py-2.5 px-4 font-bold text-right">Amount (MMK)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-slate-800 dark:text-zinc-200">
                                        <tr>
                                            <td className="py-2.5 px-4 font-semibold">Monthly Lease Fee (လစဉ်အိမ်လခ)</td>
                                            <td className="py-2.5 px-4 text-slate-500 dark:text-zinc-400">
                                                On or before the {contract.rent_due_day || 5}th of each month
                                            </td>
                                            <td className="py-2.5 px-4 font-mono font-bold text-right">
                                                {parseInt(contract.monthly_rent).toLocaleString()} Ks
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2.5 px-4 font-semibold">Refundable Security Deposit (အာမခံစပေါ်ငွေ)</td>
                                            <td className="py-2.5 px-4 text-slate-500 dark:text-zinc-400">
                                                Paid upon lease commencement; refundable on exit
                                            </td>
                                            <td className="py-2.5 px-4 font-mono font-bold text-right">
                                                {parseInt(contract.deposit_amount).toLocaleString()} Ks
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2.5 px-4 font-semibold">Lease Term Duration (စာချုပ်သက်တမ်း)</td>
                                            <td className="py-2.5 px-4 text-slate-500 dark:text-zinc-400">
                                                {contract.start_date} to {contract.end_date}
                                            </td>
                                            <td className="py-2.5 px-4 font-mono text-right text-slate-500">
                                                Binding Agreement
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Structured Legal Clauses */}
                        <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-zinc-800">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-zinc-800 pb-1.5">
                                Agreement Clauses & Conditions (စာချုပ်အပိုဒ်ခွဲများနှင့် သတ်မှတ်ချက်များ)
                            </h4>

                            {latestVersion?.structured_clauses && latestVersion.structured_clauses.length > 0 ? (
                                <div className="space-y-6 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed">
                                    {latestVersion.structured_clauses.map((clause, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <div className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                                                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 font-mono text-[11px]">
                                                    § {clause.clause_number || idx + 1}
                                                </span>
                                                <span>{clause.title_en}</span>
                                                <span className="text-slate-400">/</span>
                                                <span className="text-slate-600 dark:text-zinc-400">{clause.title_mm}</span>
                                            </div>
                                            <p className="text-slate-700 dark:text-zinc-300 pl-6 border-l-2 border-slate-200 dark:border-zinc-800">
                                                {clause.content_en}
                                            </p>
                                            <p className="text-slate-600 dark:text-zinc-400 pl-6 border-l-2 border-emerald-500/50">
                                                {clause.content_mm}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 text-xs font-mono whitespace-pre-wrap text-slate-700 dark:text-zinc-300 leading-relaxed">
                                    {latestVersion?.terms_and_conditions || contract.terms_and_conditions}
                                </div>
                            )}
                        </div>

                        {/* Digital Signatures Execution Block */}
                        <div className="pt-8 border-t-2 border-slate-900 dark:border-white grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Landlord Signature */}
                            <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/40 space-y-3">
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                                    Landlord Digital Signature (အိမ်ရှင်လက်မှတ်)
                                </div>
                                {contract.owner_signed_at ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                                            <CheckCircle className="h-5 w-5" />
                                            <span>DIGITALLY SIGNED & VERIFIED</span>
                                        </div>
                                        <div className="font-mono text-xs text-slate-600 dark:text-zinc-300">
                                            Signer: {contract.owner?.name}
                                        </div>
                                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                                            Timestamp: {contract.owner_signed_at}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-mono break-all">
                                            Security Hash: SHA256:{contract.id}-{contract.owner_id}-PDOK
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>Awaiting Landlord Signature</span>
                                    </div>
                                )}
                            </div>

                            {/* Tenant Signature */}
                            <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/40 space-y-3">
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                                    Tenant Digital Signature (အိမ်ငှားလက်မှတ်)
                                </div>
                                {contract.tenant_signed_at ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                                            <CheckCircle className="h-5 w-5" />
                                            <span>DIGITALLY SIGNED & VERIFIED</span>
                                        </div>
                                        <div className="font-mono text-xs text-slate-600 dark:text-zinc-300">
                                            Signer: {contract.tenant?.name}
                                        </div>
                                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                                            Timestamp: {contract.tenant_signed_at}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-mono break-all">
                                            Security Hash: SHA256:{contract.id}-{contract.tenant_id}-PDOK
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>Pending Tenant Execution</span>
                                        </div>
                                        {isTenant && (
                                            <button
                                                type="button"
                                                onClick={() => setShowSignModal(true)}
                                                className="no-print w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                                            >
                                                Sign Agreement Now
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Witnessing Lawyer block if present */}
                        {contract.lawyer_inquiry?.lawyer_user && (
                            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-xs flex items-center justify-between">
                                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
                                    <Scale className="h-4 w-4 text-indigo-600" />
                                    <span>
                                        <strong>Witnessing Bar Council Lawyer:</strong> {contract.lawyer_inquiry.lawyer_user.name} ({contract.lawyer_inquiry.lawyer_user.phone || 'Verified'})
                                    </span>
                                </div>
                                <span className="font-mono text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                                    Legal Consultation Associated
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* ========================================================================= */}
                {/* TAB 2: AUTOMATED CONTRACT DIFF-TRACKER (FLAGSHIP PORTFOLIO FEATURE) */}
                {/* ========================================================================= */}
                {activeTab === 'diff' && (
                    <div className="space-y-6">
                        {/* Diff Controller Bar */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                {/* Version Selectors */}
                                <div className="flex flex-wrap items-center gap-3 text-xs">
                                    <span className="font-bold text-slate-600 dark:text-zinc-400">
                                        {lang === 'mm' ? 'ဗားရှင်းနှိုင်းယှဉ်ချက်:' : 'Compare Versions:'}
                                    </span>

                                    {/* Old Version Selector */}
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-slate-400 text-[11px] font-semibold">Base:</span>
                                        <select
                                            value={oldVerId || ''}
                                            onChange={(e) => setOldVerId(e.target.value)}
                                            className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-xs font-bold"
                                        >
                                            {sortedVersions.map((v) => (
                                                <option key={v.id} value={v.id}>
                                                    v{v.version_number} ({v.created_at ? v.created_at.split('T')[0] : 'Draft'})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />

                                    {/* New Version Selector */}
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-slate-400 text-[11px] font-semibold">Revised:</span>
                                        <select
                                            value={newVerId || ''}
                                            onChange={(e) => setNewVerId(e.target.value)}
                                            className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-xs font-bold"
                                        >
                                            {sortedVersions.map((v) => (
                                                <option key={v.id} value={v.id}>
                                                    v{v.version_number} ({v.created_at ? v.created_at.split('T')[0] : 'Draft'})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* View Mode Toggle (Inline vs Side-by-Side Split) */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">{lang === 'mm' ? 'ပုံစံ:' : 'View Mode:'}</span>
                                    <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
                                        <button
                                            type="button"
                                            onClick={() => setDiffViewMode('inline')}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                                diffViewMode === 'inline'
                                                    ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                        >
                                            <Layers className="h-3.5 w-3.5" />
                                            <span>Unified Inline</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDiffViewMode('split')}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                                diffViewMode === 'split'
                                                    ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                        >
                                            <Columns className="h-3.5 w-3.5" />
                                            <span>Side-by-Side</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Executive Change Summary Card */}
                            {newVersion?.change_summary && (
                                <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 flex items-start gap-3">
                                    <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <div className="space-y-1 text-xs">
                                        <div className="font-extrabold text-emerald-900 dark:text-emerald-200">
                                            {lang === 'mm'
                                                ? `ဗားရှင်း ${newVersion.version_number} အဓိက ပြင်ဆင်ချက် အကျဉ်းချုပ် (Executive Change Summary):`
                                                : `Executive Change Summary for Version ${newVersion.version_number}:`}
                                        </div>
                                        <p className="text-slate-700 dark:text-zinc-300 leading-relaxed">
                                            {newVersion.change_summary}
                                        </p>
                                        {newVersion.revision_request_note && (
                                            <div className="pt-1.5 text-slate-600 dark:text-zinc-400 italic">
                                                <strong>{lang === 'mm' ? 'အဆိုပြုသူ မှတ်ချက်:' : 'Proposer Note:'}</strong> "{newVersion.revision_request_note}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Financial & Key Terms Delta Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {financialDiffs.map((delta, idx) => {
                                const isDiff = delta.direction !== 'same';
                                return (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-2xl border transition bg-white dark:bg-zinc-900 shadow-xs ${
                                            isDiff
                                                ? 'border-emerald-400 dark:border-emerald-700 ring-1 ring-emerald-400/30'
                                                : 'border-slate-200 dark:border-zinc-800'
                                        }`}
                                    >
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                                            <span>{lang === 'mm' ? delta.labelMm : delta.labelEn}</span>
                                            {isDiff ? (
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                                                    delta.direction === 'increase'
                                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                }`}>
                                                    {delta.percent}%
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-slate-400 font-semibold">Unchanged</span>
                                            )}
                                        </div>

                                        <div className="flex items-baseline justify-between mt-2">
                                            <div>
                                                <div className="text-xs text-slate-400 line-through">
                                                    {delta.oldVal}
                                                </div>
                                                <div className="text-base font-black text-slate-900 dark:text-white">
                                                    {delta.newVal}
                                                </div>
                                            </div>

                                            {isDiff && (
                                                <div className={`flex items-center text-xs font-bold ${
                                                    delta.direction === 'increase' ? 'text-amber-600' : 'text-emerald-600'
                                                }`}>
                                                    {delta.direction === 'increase' ? (
                                                        <ArrowUp className="h-3.5 w-3.5 mr-0.5" />
                                                    ) : (
                                                        <ArrowDown className="h-3.5 w-3.5 mr-0.5" />
                                                    )}
                                                    <span>{delta.deltaFormatted}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Diff Viewer Legend */}
                        <div className="flex items-center gap-4 text-xs font-semibold px-2 text-slate-500 dark:text-zinc-400">
                            <span className="flex items-center gap-1.5">
                                <span className="h-3 w-3 rounded-xs bg-rose-200 dark:bg-rose-900/60 border border-rose-400 inline-block" />
                                <span>Removed / Deleted in v{newVersion?.version_number}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-3 w-3 rounded-xs bg-emerald-200 dark:bg-emerald-900/60 border border-emerald-400 inline-block" />
                                <span>Added / Proposed in v{newVersion?.version_number}</span>
                            </span>
                        </div>

                        {/* Visual Diff Clauses */}
                        <div className="space-y-4">
                            {clausesDiff.map((clause, idx) => (
                                <div
                                    key={idx}
                                    className={`bg-white dark:bg-zinc-900 rounded-2xl border overflow-hidden shadow-xs ${
                                        clause.hasChanges
                                            ? 'border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-400/20'
                                            : 'border-slate-200 dark:border-zinc-800'
                                    }`}
                                >
                                    {/* Clause Header */}
                                    <div className="p-4 bg-slate-50/80 dark:bg-zinc-800/60 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-extrabold">
                                                § {clause.clauseNumber}
                                            </span>
                                            <span className="text-xs font-black text-slate-900 dark:text-white">
                                                {clause.titleEn}
                                            </span>
                                            <span className="text-slate-400">/</span>
                                            <span className="text-xs text-slate-600 dark:text-zinc-400">
                                                {clause.titleMm}
                                            </span>
                                        </div>

                                        {clause.hasChanges ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                                <Sparkles className="h-3 w-3" />
                                                <span>Modified in v{newVersion?.version_number}</span>
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-medium text-slate-400">
                                                Identical
                                            </span>
                                        )}
                                    </div>

                                    {/* Diff Body */}
                                    <div className="p-5 text-xs leading-relaxed space-y-4">
                                        {diffViewMode === 'inline' ? (
                                            /* Unified Inline View */
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                                                        English Clause Comparison:
                                                    </div>
                                                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 whitespace-pre-wrap">
                                                        {clause.diffEn.map((chunk, i) => (
                                                            <span
                                                                key={i}
                                                                className={
                                                                    chunk.type === 'added'
                                                                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-bold px-1 rounded mx-0.5'
                                                                        : chunk.type === 'removed'
                                                                        ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 line-through px-1 rounded mx-0.5'
                                                                        : ''
                                                                }
                                                            >
                                                                {chunk.value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                                                        မြန်မာဘာသာ နှိုင်းယှဉ်ချက် (Myanmar Unicode):
                                                    </div>
                                                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 whitespace-pre-wrap">
                                                        {clause.diffMm.map((chunk, i) => (
                                                            <span
                                                                key={i}
                                                                className={
                                                                    chunk.type === 'added'
                                                                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-bold px-1 rounded mx-0.5'
                                                                        : chunk.type === 'removed'
                                                                        ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 line-through px-1 rounded mx-0.5'
                                                                        : ''
                                                                }
                                                            >
                                                                {chunk.value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Side-by-Side Split View */
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Left: Old Version */}
                                                <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 space-y-2">
                                                    <div className="text-[11px] font-mono uppercase font-bold text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                                                        <span>v{oldVersion?.version_number} (Original)</span>
                                                        <span className="text-[10px] text-slate-400">{oldVersion?.created_at?.split('T')[0]}</span>
                                                    </div>
                                                    <p className="text-slate-700 dark:text-zinc-300 border-l-2 border-slate-300 dark:border-zinc-700 pl-3">
                                                        {clause.oldContentEn || <em className="text-slate-400">(None)</em>}
                                                    </p>
                                                    <p className="text-slate-600 dark:text-zinc-400 border-l-2 border-slate-200 dark:border-zinc-800 pl-3">
                                                        {clause.oldContentMm || <em className="text-slate-400">(မရှိပါ)</em>}
                                                    </p>
                                                </div>

                                                {/* Right: New Version */}
                                                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-2">
                                                    <div className="text-[11px] font-mono uppercase font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                                                        <span>v{newVersion?.version_number} (Revised)</span>
                                                        <span className="text-[10px] text-emerald-600/70">{newVersion?.created_at?.split('T')[0]}</span>
                                                    </div>
                                                    <p className="text-slate-800 dark:text-zinc-200 border-l-2 border-emerald-500 pl-3 font-medium">
                                                        {clause.newContentEn || <em className="text-slate-400">(None)</em>}
                                                    </p>
                                                    <p className="text-slate-700 dark:text-zinc-300 border-l-2 border-emerald-500/60 pl-3">
                                                        {clause.newContentMm || <em className="text-slate-400">(မရှိပါ)</em>}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* TAB 3: VERSION TIMELINE & AUDIT LOG */}
                {/* ========================================================================= */}
                {activeTab === 'timeline' && (
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 shadow-xs space-y-8">
                        <div className="border-b border-slate-200 dark:border-zinc-800 pb-4">
                            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <History className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                <span>Negotiation History & Version Audit Trail</span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                                Complete immutable audit log of all contract iterations, rent adjustments, and party proposals.
                            </p>
                        </div>

                        {/* Chronological Timeline */}
                        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-zinc-800">
                            {sortedVersions.map((v, idx) => {
                                const isCurrent = v.version_number === contract.current_version;
                                return (
                                    <div key={v.id} className="relative group">
                                        {/* Dot */}
                                        <div className={`absolute -left-6 top-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition ${
                                            isCurrent
                                                ? 'bg-emerald-600 border-white text-white shadow-sm'
                                                : 'bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-400'
                                        }`}>
                                            <span className="text-[10px] font-black">{v.version_number}</span>
                                        </div>

                                        {/* Card */}
                                        <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/60 dark:border-zinc-700/60 pb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black text-slate-900 dark:text-white">
                                                        Version {v.version_number}.0
                                                    </span>
                                                    {isCurrent && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                                                            Active Version
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-slate-400">•</span>
                                                    <span className="text-xs text-slate-500 dark:text-zinc-400">
                                                        Drafted by {v.creator?.name || 'System'} ({v.creator?.role || 'User'})
                                                    </span>
                                                </div>

                                                <span className="text-[11px] font-mono text-slate-400">
                                                    {v.created_at ? v.created_at.replace('T', ' ').substring(0, 19) : ''}
                                                </span>
                                            </div>

                                            {/* Summary */}
                                            {v.change_summary && (
                                                <div className="text-xs text-slate-800 dark:text-zinc-200 font-medium">
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-1.5">Change:</span>
                                                    <span>{v.change_summary}</span>
                                                </div>
                                            )}

                                            {/* Revision note */}
                                            {v.revision_request_note && (
                                                <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-xs text-slate-600 dark:text-zinc-300 italic">
                                                    <strong>Note:</strong> "{v.revision_request_note}"
                                                </div>
                                            )}

                                            {/* Key Financial Snapshot */}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-600 dark:text-zinc-400">
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase">Rent</span>
                                                    <strong className="text-slate-900 dark:text-white">{parseInt(v.monthly_rent).toLocaleString()} MMK</strong>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase">Deposit</span>
                                                    <strong className="text-slate-900 dark:text-white">{parseInt(v.deposit_amount).toLocaleString()} MMK</strong>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase">Due Day</span>
                                                    <strong className="text-slate-900 dark:text-white">{v.rent_due_day || 5}th of month</strong>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase">Term</span>
                                                    <strong className="text-slate-900 dark:text-white">{v.start_date} ~ {v.end_date}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* MODAL 1: DIGITAL SIGNATURE CONFIRMATION */}
            {/* ========================================================================= */}
            {showSignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <FileCheck2 className="h-5 w-5 text-emerald-600" />
                                <span>{lang === 'mm' ? 'စာချုပ် ဒစ်ဂျစ်တယ်လက်မှတ်ရေးထိုးခြင်း' : 'Execute Digital Signature'}</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowSignModal(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs text-slate-600 dark:text-zinc-300">
                            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                                <strong>{contract.contract_code} (Version {contract.current_version}.0)</strong>
                                <div className="mt-1 text-[11px] text-emerald-800/80 dark:text-emerald-300">
                                    Monthly Rent: {parseInt(contract.monthly_rent).toLocaleString()} MMK • Deposit: {parseInt(contract.deposit_amount).toLocaleString()} MMK
                                </div>
                            </div>

                            <p>
                                {lang === 'mm'
                                    ? 'သင်သည် ဤအငှားစာချုပ်ပါ သတ်မှတ်ချက်များနှင့် စည်းကမ်းချက်များကို အပြည့်အစုံဖတ်ရှုပြီး သဘောတူလက်ခံပါသည်။ နှစ်ဦးစလုံး လက်မှတ်ရေးထိုးပြီးပါက စာချုပ်သည် တရားဝင် အသက်ဝင်မည်ဖြစ်ပါသည်။'
                                    : 'By digitally signing, you legally accept all terms and structured clauses in the current contract version. Once both parties have signed, this agreement becomes legally active.'}
                            </p>

                            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer transition">
                                <input
                                    type="checkbox"
                                    checked={signForm.data.agree_terms}
                                    onChange={(e) => signForm.setData('agree_terms', e.target.checked)}
                                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-zinc-700 mt-0.5"
                                />
                                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                    {lang === 'mm'
                                        ? 'စာချုပ်စည်းကမ်းချက်များကို သဘောတူပြီး ဒစ်ဂျစ်တယ်လက်မှတ်ရေးထိုးရန် အတည်ပြုပါသည်'
                                        : 'I have read and agree to all terms and conditions of this lease agreement.'}
                                </span>
                            </label>
                            {signForm.errors.agree_terms && (
                                <p className="text-rose-500 text-xs">{signForm.errors.agree_terms}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowSignModal(false)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSignSubmit}
                                disabled={!signForm.data.agree_terms || signForm.processing}
                                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-40"
                            >
                                {signForm.processing ? 'Executing...' : 'Confirm Digital Signature'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 2: PROPOSE COUNTER-OFFER / REVISION */}
            {/* ========================================================================= */}
            {showReviseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                    <GitCompare className="h-5 w-5 text-blue-600" />
                                    <span>{lang === 'mm' ? 'စာချုပ်ပြင်ဆင်ချက် အဆိုပြုမည်' : `Propose Revision (v${contract.current_version + 1}.0)`}</span>
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                                    Adjust terms or clauses. Our automated diff-tracker will highlight all changes to the counterparty.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowReviseModal(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleReviseSubmit} className="space-y-4">
                            {/* Proposer note */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                    {lang === 'mm' ? 'ပြင်ဆင်လိုသည့် အကြောင်းအရင်း / မှတ်ချက်' : 'Revision Proposal Note / Justification'} *
                                </label>
                                <textarea
                                    rows="2"
                                    required
                                    value={reviseForm.data.revision_request_note}
                                    onChange={(e) => reviseForm.setData('revision_request_note', e.target.value)}
                                    placeholder={lang === 'mm' ? 'ဥပမာ- စပေါ်ငွေ ၁ လစာသို့ လျှော့ချပေးရန်နှင့် အိမ်လခ ပေးချေရက် ညှိနှိုင်းလိုပါသည်...' : 'e.g. Requesting adjusted security deposit terms and grace period...'}
                                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Financial terms */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                                        Rent (MMK)
                                    </label>
                                    <input
                                        type="number"
                                        step="5000"
                                        value={reviseForm.data.monthly_rent}
                                        onChange={(e) => reviseForm.setData('monthly_rent', e.target.value)}
                                        className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                                        Deposit (MMK)
                                    </label>
                                    <input
                                        type="number"
                                        step="5000"
                                        value={reviseForm.data.deposit_amount}
                                        onChange={(e) => reviseForm.setData('deposit_amount', e.target.value)}
                                        className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                                        Due Day
                                    </label>
                                    <select
                                        value={reviseForm.data.rent_due_day}
                                        onChange={(e) => reviseForm.setData('rent_due_day', parseInt(e.target.value))}
                                        className="w-full text-xs px-2 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white"
                                    >
                                        {[1, 5, 10, 15, 20, 25].map((d) => (
                                            <option key={d} value={d}>{d}th</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                                        Advance Mos
                                    </label>
                                    <select
                                        value={reviseForm.data.advance_payment_months}
                                        onChange={(e) => reviseForm.setData('advance_payment_months', parseInt(e.target.value))}
                                        className="w-full text-xs px-2 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white"
                                    >
                                        {[1, 3, 6, 12].map((m) => (
                                            <option key={m} value={m}>{m} mos</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Terms and conditions text */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                    Full Terms & Conditions (Zawgyi / Unicode Auto-Converted)
                                </label>
                                <textarea
                                    rows="6"
                                    value={reviseForm.data.terms_and_conditions}
                                    onChange={(e) => reviseForm.setData('terms_and_conditions', e.target.value)}
                                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-mono leading-relaxed"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowReviseModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={reviseForm.processing}
                                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                                >
                                    {reviseForm.processing ? 'Publishing Revision...' : `Publish Version ${contract.current_version + 1}.0`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
