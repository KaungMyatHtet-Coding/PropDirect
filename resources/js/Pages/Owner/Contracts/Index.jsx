import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    FileCheck2,
    FileText,
    GitCompare,
    History,
    Plus,
    Shield,
    User,
} from 'lucide-react';
import React from 'react';

export default function Index({ contracts }) {
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
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
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
            <Head title={lang === 'mm' ? 'အငှားစာချုပ်များ (ပိုင်ရှင်)' : 'Lease Contracts (Landlord)'} />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                            <FileText className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                            <span>{lang === 'mm' ? 'အငှားစာချုပ် စီမံခန့်ခွဲမှု (Lease Contracts)' : 'Lease Contracts Management'}</span>
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                            {lang === 'mm'
                                ? 'အိမ်ငှားများနှင့် ချုပ်ဆိုထားသော တရားဝင်စာချုပ်များ၊ ပြင်ဆင်ချက်မှတ်တမ်းများနှင့် ဒစ်ဂျစ်တယ်လက်မှတ်များကို တစ်နေရာတည်းတွင် စစ်ဆေးပါ'
                                : 'Track all active agreements, version negotiation histories, and digital signatures.'}
                        </p>
                    </div>

                    <Link
                        href={route('owner.contracts.create')}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>{lang === 'mm' ? '+ စာချုပ်အသစ် ရေးဆွဲမည်' : '+ Draft New Contract'}</span>
                    </Link>
                </div>

                {/* Contracts List */}
                {contracts.data && contracts.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {contracts.data.map((c) => (
                            <div
                                key={c.id}
                                className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div className="p-5 space-y-4">
                                    {/* Top Row: Code & Status */}
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

                                    {/* Tenant Info */}
                                    {c.tenant && (
                                        <div className="flex items-center gap-3 text-xs">
                                            {c.tenant.avatar ? (
                                                <img
                                                    src={c.tenant.avatar}
                                                    alt={c.tenant.name}
                                                    className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400 font-bold">
                                                    {c.tenant.name.charAt(0)}
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="font-bold text-slate-900 dark:text-white truncate">
                                                    {c.tenant.name}
                                                </div>
                                                <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                                                    {c.tenant.phone || 'No phone'} {c.tenant.occupation ? `• ${c.tenant.occupation}` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Financial & Dates */}
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

                                    {/* Latest Version Change summary */}
                                    {c.latest_version?.change_summary && (
                                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 italic line-clamp-1 bg-slate-50/70 dark:bg-zinc-800/40 px-2 py-1 rounded-md">
                                            "{c.latest_version.change_summary}"
                                        </div>
                                    )}
                                </div>

                                {/* Footer Action */}
                                <div className="px-5 py-3 bg-slate-50 dark:bg-zinc-800/40 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>{c.start_date} ~ {c.end_date}</span>
                                    </span>

                                    <Link
                                        href={route('contracts.show', c.id)}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                                    >
                                        <span>{lang === 'mm' ? 'စာချုပ်နှင့် ပြင်ဆင်ချက်' : 'View & Diff'}</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-12 text-center space-y-4">
                        <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <FileCheck2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {lang === 'mm' ? 'စာချုပ်မှတ်တမ်း မရှိသေးပါ' : 'No Lease Contracts Yet'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
                            {lang === 'mm'
                                ? 'အိမ်ကြည့်ရှုမှု ပြီးစီးထားသော အိမ်ငှားများနှင့် တရားဝင်စမတ်စာချုပ် စတင်ရေးဆွဲနိုင်ပါသည်။'
                                : 'When you have confirmed viewing inquiries, draft an official lease agreement with pre-filled Yangon property legal terms.'}
                        </p>
                        <Link
                            href={route('owner.contracts.create')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                        >
                            <Plus className="h-4 w-4" />
                            <span>{lang === 'mm' ? 'စာချုပ်အသစ် စတင်ရေးဆွဲမည်' : 'Draft First Contract'}</span>
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
