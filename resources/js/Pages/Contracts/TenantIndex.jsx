import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    FileCheck2,
    FileText,
    GitCompare,
    ShieldCheck,
    User,
} from 'lucide-react';
import React from 'react';

export default function TenantIndex({ contracts }) {
    const { lang, t } = useLanguage();

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>{t('contract_status_active')}</span>
                    </span>
                );
            case 'pending_tenant':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{t('contract_status_pending_tenant')}</span>
                    </span>
                );
            case 'revision_requested':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                        <GitCompare className="h-3.5 w-3.5" />
                        <span>{t('contract_status_revision_requested')}</span>
                    </span>
                );
            case 'terminated':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        <span>{t('contract_status_terminated')}</span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                        <span>{status}</span>
                    </span>
                );
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={lang === 'mm' ? 'ကျွန်ုပ်၏ အငှားစာချုပ်များ' : 'My Lease Agreements'} />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
                {/* Header */}
                <div className="border-b border-slate-200 dark:border-zinc-800 pb-5">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                        <FileText className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                        <span>{lang === 'mm' ? 'ကျွန်ုပ်၏ အငှားစာချုပ်များ (My Contracts)' : 'My Lease Agreements'}</span>
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                        {lang === 'mm'
                            ? 'အိမ်ရှင်များနှင့် ချုပ်ဆိုထားသော အငှားစာချုပ်များ၊ ပြင်ဆင်ချက်မှတ်တမ်းများနှင့် အပြန်အလှန်ဒစ်ဂျစ်တယ်လက်မှတ်များ'
                            : 'Review incoming lease agreements, propose counter-revisions, track clause changes, and sign digitally.'}
                    </p>
                </div>

                {/* Contracts List */}
                {contracts.data && contracts.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {contracts.data.map((c) => {
                            const needsAction = c.status === 'pending_tenant' || (c.status === 'revision_requested' && !c.tenant_signed_at);
                            return (
                                <div
                                    key={c.id}
                                    className={`bg-white dark:bg-zinc-900 rounded-2xl border transition flex flex-col justify-between shadow-xs hover:shadow-md ${
                                        needsAction
                                            ? 'border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/20'
                                            : 'border-slate-200 dark:border-zinc-800'
                                    }`}
                                >
                                    <div className="p-5 space-y-4">
                                        {/* Status & Code */}
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                                                    {c.contract_code}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                                                    v{c.current_version}
                                                </span>
                                            </div>
                                            {getStatusBadge(c.status)}
                                        </div>

                                        {/* Needs Signature Banner */}
                                        {needsAction && (
                                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                                                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                                                <span>
                                                    {lang === 'mm' ? 'သင်၏ စိစစ်လက်မှတ်ထိုးမှု လိုအပ်နေပါသည်' : 'Your review & signature is needed'}
                                                </span>
                                            </div>
                                        )}

                                        {/* Property Card */}
                                        {c.property && (
                                            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                                                <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                                                        {c.property.title}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                        {c.property.township}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Landlord Info */}
                                        {c.owner && (
                                            <div className="flex items-center gap-3 text-xs">
                                                {c.owner.avatar ? (
                                                    <img
                                                        src={c.owner.avatar}
                                                        alt={c.owner.name}
                                                        className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                                                    />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400 font-bold">
                                                        {c.owner.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                                                        <span>{c.owner.name}</span>
                                                        {c.owner.is_verified_owner && (
                                                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" title="Verified Landlord" />
                                                        )}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                                                        {lang === 'mm' ? 'တိုက်ရိုက်အိမ်ရှင်' : 'Direct Landlord'} • {c.owner.phone || 'Verified'}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Financial details */}
                                        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                                                    {lang === 'mm' ? 'လစဉ်ငှားရမ်းခ' : 'Monthly Rent'}
                                                </span>
                                                <span className="font-extrabold text-slate-900 dark:text-white">
                                                    {parseInt(c.monthly_rent).toLocaleString()} MMK
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                                                    {lang === 'mm' ? 'အာမခံစပေါ်ငွေ' : 'Deposit'}
                                                </span>
                                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                                    {parseInt(c.deposit_amount).toLocaleString()} MMK
                                                </span>
                                            </div>
                                        </div>

                                        {/* Latest change note */}
                                        {c.latest_version?.change_summary && (
                                            <div className="text-[11px] text-slate-500 dark:text-zinc-400 italic line-clamp-1 bg-slate-50/70 dark:bg-zinc-800/40 px-2 py-1 rounded-md">
                                                "{c.latest_version.change_summary}"
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Footer */}
                                    <div className="px-5 py-3 bg-slate-50 dark:bg-zinc-800/40 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{c.start_date} ~ {c.end_date}</span>
                                        </span>

                                        <Link
                                            href={route('contracts.show', c.id)}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                                        >
                                            <span>{needsAction ? (lang === 'mm' ? 'စိစစ်လက်မှတ်ထိုးမည်' : 'Review & Sign') : (lang === 'mm' ? 'အသေးစိတ်ကြည့်မည်' : 'View Agreement')}</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-12 text-center space-y-4">
                        <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <FileText className="h-8 w-8" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {lang === 'mm' ? 'စာချုပ်မှတ်တမ်း မရှိသေးပါ' : 'No Lease Agreements Yet'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
                            {lang === 'mm'
                                ? 'အိမ်ကြည့်ရှုပြီးနောက် အိမ်ရှင်နှင့် သဘောတူညီချက်ရရှိပါက တရားဝင်စမတ်စာချုပ်မူကြမ်း ဤနေရာသို့ ရောက်ရှိလာပါမည်။'
                                : 'Once you inspect an apartment and confirm with the direct landlord, official lease agreements will appear here for your review and digital signing.'}
                        </p>
                        <Link
                            href={route('properties.index')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                        >
                            <span>{lang === 'mm' ? 'အိမ်ခြံမြေများ ရှာဖွေမည်' : 'Browse Properties'}</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
