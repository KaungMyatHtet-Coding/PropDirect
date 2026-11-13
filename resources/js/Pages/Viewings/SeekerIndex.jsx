import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    Phone,
    MessageSquare,
    Unlock,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Building2,
    ArrowRight,
    MapPin,
} from 'lucide-react';

export default function SeekerIndex({ viewings }) {
    const { lang, t } = useLanguage();
    const items = viewings?.data || [];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t('viewing_status_accepted')}
                    </span>
                );
            case 'rescheduled':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-950/70 px-2.5 py-1 text-xs font-bold text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                        <Clock className="h-3.5 w-3.5" />
                        {t('viewing_status_rescheduled')}
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950/70 px-2.5 py-1 text-xs font-bold text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t('viewing_status_completed')}
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950/70 px-2.5 py-1 text-xs font-bold text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        <XCircle className="h-3.5 w-3.5" />
                        {t('viewing_status_rejected')}
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                        {t('viewing_status_cancelled')}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/70 px-2.5 py-1 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <Clock className="h-3.5 w-3.5" />
                        {t('viewing_status_pending')}
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
                            {lang === 'mm' ? 'ကျွန်ုပ်၏ အိမ်ကြည့်မှတ်တမ်းများ' : 'My Viewing Appointments'}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                            {lang === 'mm'
                                ? 'တိုက်ရိုက်အိမ်ကြည့်ခွင့် လျှောက်ထားချက်များနှင့် အိမ်ရှင်ဆက်သွယ်ရန် အချက်အလက်များ'
                                : 'Track direct viewing appointments and access unlocked landlord contact details'}
                        </p>
                    </div>
                    <Link
                        href={route('properties.index')}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition w-fit"
                    >
                        <span>Browse More Units</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            }
        >
            <Head title="My Viewings - PropDirect" />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
                {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center">
                        <Calendar className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-zinc-200">
                            {lang === 'mm' ? 'အိမ်ကြည့်မှတ်တမ်း မရှိသေးပါ' : 'No Scheduled Viewings Yet'}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                            {lang === 'mm'
                                ? 'အိမ်ခြံမြေစာရင်းတွင် သင်စိတ်ဝင်စားသော အိမ်များကို ရှာဖွေပြီး တိုက်ရိုက်အိမ်ကြည့်ရန် လျှောက်ထားနိုင်ပါသည်'
                                : 'Find a property you like on the marketplace and schedule a free viewing directly with the landlord.'}
                        </p>
                        <div className="mt-5">
                            <Link
                                href={route('properties.index')}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition"
                            >
                                Browse Properties
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
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Left: Property & Landlord Details */}
                                    <div className="flex items-start gap-4">
                                        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-900">
                                            {item.property?.images && item.property.images.length > 0 ? (
                                                <img
                                                    src={`/storage/${item.property.images[0]}`}
                                                    alt={item.property.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-slate-500">
                                                    <Building2 className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(item.status)}
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                    {item.property?.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                                                </span>
                                            </div>

                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                                                <Link href={route('properties.show', item.property?.slug)}>
                                                    {item.property?.title}
                                                </Link>
                                            </h3>

                                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {item.property?.township}
                                                </span>
                                                <span>•</span>
                                                <span className="font-bold text-slate-700 dark:text-zinc-200">
                                                    {Number(item.property?.price).toLocaleString()} Ks
                                                </span>
                                            </div>

                                            <div className="text-xs text-slate-600 dark:text-zinc-400 pt-1">
                                                Landlord: <strong>{item.owner?.name}</strong>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle: Appointment Details */}
                                    <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-3 lg:w-72 space-y-1.5 text-xs">
                                        <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                Date:
                                            </span>
                                            <strong className="text-slate-800 dark:text-zinc-200">
                                                {item.status === 'rescheduled' && item.rescheduled_date
                                                    ? item.rescheduled_date
                                                    : item.preferred_date}
                                            </strong>
                                        </div>

                                        <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                                Time Window:
                                            </span>
                                            <strong className="text-slate-800 dark:text-zinc-200">
                                                {item.status === 'rescheduled' && item.rescheduled_time
                                                    ? item.rescheduled_time
                                                    : item.preferred_time}
                                            </strong>
                                        </div>

                                        {item.status === 'rescheduled' && item.owner_note && (
                                            <div className="mt-2 text-[11px] text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 p-2 rounded-lg border border-orange-200 dark:border-orange-900/60">
                                                <strong>Landlord Note:</strong> {item.owner_note}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Actions & Unlocked Phone */}
                                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                                        {item.contact_unlocked && item.owner?.phone ? (
                                            <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-2 text-center">
                                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1">
                                                    <Unlock className="h-3 w-3" /> Landlord Phone
                                                </span>
                                                <a
                                                    href={`tel:${item.owner.phone}`}
                                                    className="block font-mono text-xs font-bold text-emerald-900 dark:text-emerald-200 mt-0.5 hover:underline"
                                                >
                                                    📞 {item.owner.phone}
                                                </a>
                                            </div>
                                        ) : null}

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={route('viewing.show', item.id)}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 transition"
                                            >
                                                <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                                                <span>P2P Chat</span>
                                            </Link>

                                            {item.status === 'rescheduled' && (
                                                <Link
                                                    as="button"
                                                    method="post"
                                                    href={route('viewing.accept-reschedule', item.id)}
                                                    className="inline-flex items-center justify-center rounded-xl bg-orange-600 hover:bg-orange-500 px-3 py-2 text-xs font-bold text-white shadow-xs transition"
                                                >
                                                    {t('viewing_accept_reschedule')}
                                                </Link>
                                            )}

                                            {(item.status === 'pending' || item.status === 'rescheduled') && (
                                                <Link
                                                    as="button"
                                                    method="post"
                                                    href={route('viewing.cancel', item.id)}
                                                    className="inline-flex items-center justify-center rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition"
                                                >
                                                    Cancel
                                                </Link>
                                            )}
                                        </div>
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
