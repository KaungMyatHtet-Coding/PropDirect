import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { useLanguage } from '@/Contexts/LanguageContext';
import { normalizeToUnicode, isZawgyi } from '@/utils/myanmarFontTools';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    UserCheck,
    Phone,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Building2,
    FileText,
    MapPin,
    AlertCircle,
    Check,
    X,
} from 'lucide-react';

export default function OwnerViewingsIndex({ viewings }) {
    const { lang, t } = useLanguage();
    const items = viewings?.data || [];

    // Modals
    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedViewing, setSelectedViewing] = useState(null);

    // Reschedule form
    const rescheduleForm = useForm({
        rescheduled_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        rescheduled_time: 'Afternoon (1:00 PM - 5:00 PM)',
        owner_note: '',
    });

    // Reject form
    const rejectForm = useForm({
        reason: '',
    });

    const handleOpenReschedule = (viewing) => {
        setSelectedViewing(viewing);
        rescheduleForm.setData({
            rescheduled_date: viewing.preferred_date || new Date().toISOString().split('T')[0],
            rescheduled_time: 'Afternoon (1:00 PM - 5:00 PM)',
            owner_note: '',
        });
        setRescheduleModalOpen(true);
    };

    const handleRescheduleNoteBlur = () => {
        if (rescheduleForm.data.owner_note && isZawgyi(rescheduleForm.data.owner_note)) {
            rescheduleForm.setData('owner_note', normalizeToUnicode(rescheduleForm.data.owner_note));
        }
    };

    const handleRescheduleSubmit = (e) => {
        e.preventDefault();
        if (!selectedViewing) return;
        rescheduleForm.post(route('owner.viewings.reschedule', selectedViewing.id), {
            onSuccess: () => {
                setRescheduleModalOpen(false);
                rescheduleForm.reset();
            },
        });
    };

    const handleOpenReject = (viewing) => {
        setSelectedViewing(viewing);
        rejectForm.setData('reason', '');
        setRejectModalOpen(true);
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        if (!selectedViewing) return;
        rejectForm.post(route('owner.viewings.reject', selectedViewing.id), {
            onSuccess: () => {
                setRejectModalOpen(false);
                rejectForm.reset();
            },
        });
    };

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
                            {lang === 'mm' ? 'အိမ်ကြည့်ခွင့် လျှောက်ထားမှုများ' : 'Landlord Viewing Queue'}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                            {lang === 'mm'
                                ? 'အိမ်ငှား/ဝယ်ယူလိုသူများ၏ အချက်အလက်များကို စိစစ်ပြီး အိမ်ကြည့်ခွင့် လက်ခံခြင်း သို့မဟုတ် အချိန်ပြန်ညှိခြင်း ပြုလုပ်နိုင်ပါသည်'
                                : 'Review verified seeker credentials, accept viewing appointments, and unlock contact details'}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Owner Viewing Queue - PropDirect" />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
                {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center">
                        <Calendar className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-zinc-200">
                            {lang === 'mm' ? 'အိမ်ကြည့်ခွင့် လျှောက်ထားချက် မရှိသေးပါ' : 'No Viewing Requests Yet'}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                            {lang === 'mm'
                                ? 'စိတ်ဝင်စားသူများထံမှ အိမ်ကြည့်ခွင့် တောင်းဆိုချက်များ ရောက်ရှိလာပါက ဤနေရာတွင် စိစစ်နိုင်ပါမည်'
                                : 'When seekers request viewings for your properties, they will appear here.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                                    {/* 1. Seeker Profile Details */}
                                    <div className="flex items-start gap-3.5">
                                        <div className="relative">
                                            {item.seeker?.avatar ? (
                                                <img
                                                    src={`/storage/${item.seeker.avatar}`}
                                                    alt={item.seeker.name}
                                                    className="h-12 w-12 rounded-xl object-cover ring-2 ring-emerald-500/30"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-400">
                                                    {item.seeker?.name?.charAt(0)}
                                                </div>
                                            )}
                                            {item.seeker?.is_profile_complete && (
                                                <span className="absolute -bottom-1 -right-1 rounded-full bg-emerald-600 p-0.5 text-white" title="Complete Verified Profile">
                                                    <Check className="h-2.5 w-2.5" />
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {item.seeker?.name}
                                                </h4>
                                                {getStatusBadge(item.status)}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                                                <span>💼 {item.seeker?.occupation || 'Seeker'}</span>
                                                <span>•</span>
                                                <span>📍 {item.seeker?.current_address || 'Yangon'}</span>
                                                {item.seeker?.nrc_number && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="font-mono text-[11px] text-slate-400">NRC: {item.seeker.nrc_number}</span>
                                                    </>
                                                )}
                                            </div>

                                            {item.contact_unlocked && item.seeker?.phone && (
                                                <div className="pt-1 text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400">
                                                    📞 {item.seeker.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 2. Target Property & Appointment Slot */}
                                    <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-3 lg:w-80 space-y-1.5 text-xs">
                                        <div className="font-bold text-slate-800 dark:text-zinc-200 truncate">
                                            🏠 {item.property?.title}
                                        </div>
                                        <div className="text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                                            <span>Requested Date:</span>
                                            <strong className="text-slate-700 dark:text-zinc-200">
                                                {item.status === 'rescheduled' && item.rescheduled_date
                                                    ? item.rescheduled_date
                                                    : item.preferred_date}
                                            </strong>
                                        </div>
                                        <div className="text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                                            <span>Time Slot:</span>
                                            <strong className="text-slate-700 dark:text-zinc-200">
                                                {item.status === 'rescheduled' && item.rescheduled_time
                                                    ? item.rescheduled_time
                                                    : item.preferred_time}
                                            </strong>
                                        </div>
                                        {item.message && (
                                            <div className="mt-2 text-[11px] text-slate-600 dark:text-zinc-400 italic bg-white dark:bg-zinc-800 p-2 rounded-lg border border-slate-200 dark:border-zinc-700">
                                                "{item.message}"
                                            </div>
                                        )}
                                    </div>

                                    {/* 3. Actions */}
                                    <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                                        <Link
                                            href={route('viewing.show', item.id)}
                                            className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 transition"
                                        >
                                            <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>Chat</span>
                                        </Link>

                                        {item.status === 'pending' && (
                                            <>
                                                <Link
                                                    as="button"
                                                    method="post"
                                                    href={route('owner.viewings.accept', item.id)}
                                                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-xs font-bold text-white shadow-xs transition"
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                    <span>Accept & Unlock</span>
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenReschedule(item)}
                                                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-orange-600 hover:bg-orange-500 px-3 py-2 text-xs font-bold text-white shadow-xs transition"
                                                >
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>Propose New Time</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenReject(item)}
                                                    className="inline-flex items-center justify-center rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition"
                                                >
                                                    Decline
                                                </button>
                                            </>
                                        )}

                                        {item.status === 'accepted' && (
                                            <Link
                                                as="button"
                                                method="post"
                                                href={route('owner.viewings.complete', item.id)}
                                                className="inline-flex items-center justify-center gap-1 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-bold text-white shadow-xs transition"
                                            >
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <span>Mark Completed</span>
                                            </Link>
                                        )}

                                        {(item.status === 'accepted' || item.status === 'completed') && (
                                            <Link
                                                href={route('owner.contracts.create', {
                                                    property_id: item.property_id,
                                                    seeker_id: item.seeker_id,
                                                    viewing_request_id: item.id,
                                                })}
                                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-3 py-2 text-xs font-bold text-white shadow-xs transition"
                                            >
                                                <FileText className="h-3.5 w-3.5" />
                                                <span>{lang === 'mm' ? 'အငှားစာချုပ် မူကြမ်းဆွဲမည်' : 'Draft Lease Contract'}</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reschedule Modal */}
            <Modal show={rescheduleModalOpen} onClose={() => setRescheduleModalOpen(false)} maxWidth="md">
                <div className="p-6 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {t('viewing_propose_reschedule')}
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setRescheduleModalOpen(false)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <form onSubmit={handleRescheduleSubmit} className="mt-4 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                {lang === 'mm' ? 'ရွှေ့ဆိုင်းလိုသော နေ့ရက်' : 'Proposed New Date'}
                            </label>
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={rescheduleForm.data.rescheduled_date}
                                onChange={(e) => rescheduleForm.setData('rescheduled_date', e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 py-2.5 px-3 focus:border-orange-500 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                {lang === 'mm' ? 'ရွှေ့ဆိုင်းလိုသော အချိန်' : 'Proposed Time Slot'}
                            </label>
                            <select
                                value={rescheduleForm.data.rescheduled_time}
                                onChange={(e) => rescheduleForm.setData('rescheduled_time', e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 py-2.5 px-3 focus:border-orange-500 focus:ring-orange-500"
                            >
                                <option value="Morning (9:00 AM - 12:00 PM)">{t('viewing_slot_morning')}</option>
                                <option value="Afternoon (1:00 PM - 5:00 PM)">{t('viewing_slot_afternoon')}</option>
                                <option value="Evening (5:00 PM - 7:00 PM)">{t('viewing_slot_evening')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                {lang === 'mm' ? 'အိမ်ငှား/ဝယ်သူထံ အသိပေးချက် (အကြောင်းပြချက်)' : 'Note / Reason for Seeker'}
                            </label>
                            <textarea
                                rows={3}
                                value={rescheduleForm.data.owner_note}
                                onChange={(e) => rescheduleForm.setData('owner_note', e.target.value)}
                                onBlur={handleRescheduleNoteBlur}
                                placeholder="e.g. Busy in the morning, please visit in the afternoon..."
                                className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 p-3 focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>

                        <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-zinc-800">
                            <button
                                type="button"
                                onClick={() => setRescheduleModalOpen(false)}
                                className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={rescheduleForm.processing}
                                className="rounded-xl bg-orange-600 hover:bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-xs transition"
                            >
                                {rescheduleForm.processing ? 'Sending...' : 'Send Reschedule Proposal'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Reject Modal */}
            <Modal show={rejectModalOpen} onClose={() => setRejectModalOpen(false)} maxWidth="sm">
                <div className="p-6 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Decline Viewing Request</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                        Please provide a brief reason for the seeker.
                    </p>

                    <form onSubmit={handleRejectSubmit} className="mt-4 space-y-4">
                        <textarea
                            rows={3}
                            value={rejectForm.data.reason}
                            onChange={(e) => rejectForm.setData('reason', e.target.value)}
                            placeholder="e.g. Property already under deposit agreement..."
                            className="w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 p-3 focus:border-rose-500 focus:ring-rose-500"
                            required
                        />

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-zinc-800">
                            <button
                                type="button"
                                onClick={() => setRejectModalOpen(false)}
                                className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-zinc-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={rejectForm.processing}
                                className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white"
                            >
                                Confirm Decline
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
