import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Head, Link } from '@inertiajs/react';
import {
    Scale,
    Calendar,
    Phone,
    CheckCircle2,
    Clock,
    XCircle,
    Building2,
    ArrowRight,
    MapPin,
    DollarSign,
} from 'lucide-react';

export default function LegalInquiriesIndex({ inquiries }) {
    const { lang, t } = useLanguage();
    const items = inquiries?.data || [];

    const getServiceLabel = (type) => {
        switch (type) {
            case 'grant_verification':
                return lang === 'mm' ? 'ဂရန်နှင့် ပိုင်ဆိုင်မှု စစ်ဆေးခြင်း' : 'Title Deed & Grant Verification';
            case 'sale_contract':
                return lang === 'mm' ? 'အရောင်းအဝယ်စာချုပ် ချုပ်ဆိုခြင်း' : 'Sale & Purchase Contract';
            case 'lease_contract':
                return lang === 'mm' ? 'အငှားစာချုပ် ချုပ်ဆိုခြင်း' : 'Standard Rental / Lease Contract';
            case 'newspaper_notice':
                return lang === 'mm' ? 'သတင်းစာကြေညာချက် ထည့်သွင်းခြင်း' : 'Newspaper Public Notice';
            default:
                return lang === 'mm' ? 'အထွေထွေ ဥပဒေဆွေးနွေးခြင်း' : 'General Legal Consultation';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Accepted & Confirmed
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950/70 px-2.5 py-1 text-xs font-bold text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Completed
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950/70 px-2.5 py-1 text-xs font-bold text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        <XCircle className="h-3.5 w-3.5" />
                        Declined
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/70 px-2.5 py-1 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <Clock className="h-3.5 w-3.5" />
                        Pending Review
                    </span>
                );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {lang === 'mm' ? 'ကျွန်ုပ်၏ ဥပဒေဆွေးနွေးမှုများ' : 'My Legal Consultations'}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                            {lang === 'mm'
                                ? 'တရားဝင်ရှေ့နေများနှင့် တိုင်ပင်ဆွေးနွေးထားသော စာချုပ်နှင့် ဂရန်စစ်ဆေးမှု မှတ်တမ်းများ'
                                : 'Track Bar Council certified lawyer consultations, contract drafting, and title verifications'}
                        </p>
                    </div>

                    <Link
                        href={route('lawyers.index')}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-500 transition w-fit"
                    >
                        <Scale className="h-3.5 w-3.5" />
                        <span>Find More Lawyers</span>
                    </Link>
                </div>
            }
        >
            <Head title="My Legal Consultations - PropDirect" />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
                {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center">
                        <Scale className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-zinc-200">
                            {lang === 'mm' ? 'ဥပဒေဆွေးနွေးမှု မှတ်တမ်း မရှိသေးပါ' : 'No Legal Inquiries Yet'}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                            {lang === 'mm'
                                ? 'အိမ်ခြံမြေစာချုပ် ချုပ်ဆိုရန် သို့မဟုတ် ဂရန်စစ်ဆေးရန် အသိအမှတ်ပြုရှေ့နေများနှင့် တိုက်ရိုက်ဆက်သွယ်နိုင်ပါသည်'
                                : 'Hire certified advocates and pleaders for title deed verification and bulletproof rental/sale contracts.'}
                        </p>
                        <div className="mt-5">
                            <Link
                                href={route('lawyers.index')}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-500 transition"
                            >
                                Browse Verified Lawyers
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs transition hover:border-slate-300 dark:hover:border-zinc-700"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                                    {/* 1. Lawyer & Service Details */}
                                    <div className="flex items-start gap-3.5">
                                        <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center font-bold text-amber-700 dark:text-amber-400 shrink-0">
                                            <Scale className="h-6 w-6" />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Advocate {item.lawyer_user?.name}
                                                </h4>
                                                {getStatusBadge(item.status)}
                                            </div>

                                            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                                Service: {getServiceLabel(item.service_type)}
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
                                                <span>Bar Lic: <strong className="font-mono">{item.lawyer_profile?.license_number}</strong></span>
                                                <span>•</span>
                                                <span>📍 {item.lawyer_profile?.office_township}</span>
                                            </div>

                                            {item.property && (
                                                <div className="text-xs text-slate-600 dark:text-zinc-400 pt-1">
                                                    Property: <strong>{item.property.title}</strong>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 2. Fee & Consultation Details */}
                                    <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-3 lg:w-80 space-y-1.5 text-xs">
                                        <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                                            <span>Preferred Date:</span>
                                            <strong className="text-slate-800 dark:text-zinc-200">
                                                {item.preferred_date}
                                            </strong>
                                        </div>

                                        <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                                            <span>Quoted Fee:</span>
                                            <strong className="font-mono font-bold text-amber-700 dark:text-amber-400 text-sm">
                                                {item.quoted_fee ? `${Number(item.quoted_fee).toLocaleString()} Ks` : 'Under Review'}
                                            </strong>
                                        </div>

                                        {item.lawyer_response && (
                                            <div className="mt-2 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900/60">
                                                <strong>Lawyer Response:</strong> {item.lawyer_response}
                                            </div>
                                        )}
                                    </div>

                                    {/* 3. Contact Actions */}
                                    <div className="flex flex-col gap-2 shrink-0">
                                        {item.status === 'accepted' && item.lawyer_user?.phone && (
                                            <a
                                                href={`tel:${item.lawyer_user.phone}`}
                                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-xs transition"
                                            >
                                                <Phone className="h-3.5 w-3.5" />
                                                <span>Call Lawyer ({item.lawyer_user.phone})</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
