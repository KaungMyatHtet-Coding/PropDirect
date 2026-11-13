import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { useLanguage } from '@/Contexts/LanguageContext';
import { normalizeToUnicode, isZawgyi } from '@/utils/myanmarFontTools';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Scale,
    Calendar,
    Phone,
    CheckCircle2,
    Clock,
    XCircle,
    Building2,
    User,
    Check,
    X,
} from 'lucide-react';

export default function LawyerInquiriesIndex({ inquiries }) {
    const { lang, t } = useLanguage();
    const items = inquiries?.data || [];

    // Modals
    const [acceptModalOpen, setAcceptModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    // Accept form
    const acceptForm = useForm({
        quoted_fee: '',
        lawyer_response: '',
    });

    // Reject form
    const rejectForm = useForm({
        reason: '',
    });

    const handleOpenAccept = (inquiry) => {
        setSelectedInquiry(inquiry);
        acceptForm.setData({
            quoted_fee: inquiry.quoted_fee || '',
            lawyer_response: '',
        });
        setAcceptModalOpen(true);
    };

    const handleAcceptResponseBlur = () => {
        if (acceptForm.data.lawyer_response && isZawgyi(acceptForm.data.lawyer_response)) {
            acceptForm.setData('lawyer_response', normalizeToUnicode(acceptForm.data.lawyer_response));
        }
    };

    const handleAcceptSubmit = (e) => {
        e.preventDefault();
        if (!selectedInquiry) return;

        acceptForm.post(route('lawyer.inquiries.accept', selectedInquiry.id), {
            onSuccess: () => {
                setAcceptModalOpen(false);
                acceptForm.reset();
            },
        });
    };

    const handleOpenReject = (inquiry) => {
        setSelectedInquiry(inquiry);
        rejectForm.setData('reason', '');
        setRejectModalOpen(true);
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        if (!selectedInquiry) return;

        rejectForm.post(route('lawyer.inquiries.reject', selectedInquiry.id), {
            onSuccess: () => {
                setRejectModalOpen(false);
                rejectForm.reset();
            },
        });
    };

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
                        Accepted
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
                            {lang === 'mm' ? 'ရှေ့နေလုပ်ငန်းခွင် - အမှုသည် လျှောက်ထားချက်များ' : 'Lawyer Inquiries Workspace'}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                            {lang === 'mm'
                                ? 'အိမ်ခြံမြေစာချုပ် ချုပ်ဆိုလိုသူများနှင့် ဂရန်စစ်ဆေးလိုသော အမှုသည်များ၏ လျှောက်ထားချက်များကို စီမံနိုင်ပါသည်'
                                : 'Review client consultation inquiries, confirm legal service fee quotes, and complete legal tasks'}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Lawyer Inquiries Workspace - PropDirect" />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
                {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center">
                        <Scale className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-zinc-200">
                            {lang === 'mm' ? 'အမှုသည် လျှောက်ထားချက် မရှိသေးပါ' : 'No Client Inquiries Yet'}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                            When seekers or landlords request contract drafting or grant verifications, they will appear in this workspace.
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
                                    {/* 1. Client Profile Details */}
                                    <div className="flex items-start gap-3.5">
                                        <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-slate-700 dark:text-zinc-300 shrink-0">
                                            {item.client?.avatar ? (
                                                <img
                                                    src={`/storage/${item.client.avatar}`}
                                                    alt={item.client.name}
                                                    className="h-full w-full object-cover rounded-xl"
                                                />
                                            ) : (
                                                <User className="h-6 w-6" />
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {item.client?.name}
                                                </h4>
                                                {getStatusBadge(item.status)}
                                            </div>

                                            <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                                                Requested: {getServiceLabel(item.service_type)}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                                                <span>💼 {item.client?.occupation || 'Client'}</span>
                                                <span>•</span>
                                                <span>📍 {item.client?.current_address || 'Yangon'}</span>
                                                {item.client?.nrc_number && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="font-mono text-[11px] text-slate-400">NRC: {item.client.nrc_number}</span>
                                                    </>
                                                )}
                                            </div>

                                            {item.client?.phone && (
                                                <div className="pt-1 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                                    📞 {item.client.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 2. Target Property & Client Notes */}
                                    <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-3 lg:w-80 space-y-1.5 text-xs">
                                        {item.property && (
                                            <div className="font-bold text-slate-800 dark:text-zinc-200 truncate">
                                                🏠 {item.property.title} ({item.property.township})
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                                            <span>Preferred Date:</span>
                                            <strong className="text-slate-800 dark:text-zinc-200">
                                                {item.preferred_date}
                                            </strong>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                                            <span>Quoted Fee:</span>
                                            <strong className="font-mono font-bold text-amber-700 dark:text-amber-400">
                                                {item.quoted_fee ? `${Number(item.quoted_fee).toLocaleString()} Ks` : 'None'}
                                            </strong>
                                        </div>
                                        {item.notes && (
                                            <div className="mt-2 text-[11px] text-slate-600 dark:text-zinc-400 italic bg-white dark:bg-zinc-800 p-2 rounded-lg border border-slate-200 dark:border-zinc-700">
                                                "{item.notes}"
                                            </div>
                                        )}
                                    </div>

                                    {/* 3. Actions */}
                                    <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                                        {item.status === 'pending' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenAccept(item)}
                                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition"
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                    <span>Accept & Quote</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenReject(item)}
                                                    className="inline-flex items-center justify-center rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition"
                                                >
                                                    Decline
                                                </button>
                                            </>
                                        )}

                                        {item.status === 'accepted' && (
                                            <Link
                                                as="button"
                                                method="post"
                                                href={route('lawyer.inquiries.complete', item.id)}
                                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition"
                                            >
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <span>Mark Completed</span>
                                            </Link>
                                        )}

                                        {item.client?.phone && (
                                            <a
                                                href={`tel:${item.client.phone}`}
                                                className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 transition"
                                            >
                                                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                                                <span>Call Client</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Accept Modal */}
            <Modal show={acceptModalOpen} onClose={() => setAcceptModalOpen(false)} maxWidth="md">
                <div className="p-6 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Accept Client Inquiry & Confirm Fee Quote
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                        Set the final fee quote and write an initial response message for {selectedInquiry?.client?.name}.
                    </p>

                    <form onSubmit={handleAcceptSubmit} className="mt-4 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                Quoted Consultation / Contract Fee (MMK)
                            </label>
                            <input
                                type="number"
                                step="1000"
                                min="0"
                                value={acceptForm.data.quoted_fee}
                                onChange={(e) => acceptForm.setData('quoted_fee', e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 py-2.5 px-3 focus:border-emerald-500 focus:ring-emerald-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                Message to Client (Appointment confirmation or instructions)
                            </label>
                            <textarea
                                rows={3}
                                value={acceptForm.data.lawyer_response}
                                onChange={(e) => acceptForm.setData('lawyer_response', e.target.value)}
                                onBlur={handleAcceptResponseBlur}
                                placeholder="e.g. Please bring original NRC and title deed copies to my office..."
                                className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 p-3 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-zinc-800">
                            <button
                                type="button"
                                onClick={() => setAcceptModalOpen(false)}
                                className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-zinc-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={acceptForm.processing}
                                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-xs"
                            >
                                {acceptForm.processing ? 'Saving...' : 'Accept & Notify Client'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Reject Modal */}
            <Modal show={rejectModalOpen} onClose={() => setRejectModalOpen(false)} maxWidth="sm">
                <div className="p-6 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Decline Legal Inquiry</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                        Provide a brief reason for the client.
                    </p>

                    <form onSubmit={handleRejectSubmit} className="mt-4 space-y-4">
                        <textarea
                            rows={3}
                            value={rejectForm.data.reason}
                            onChange={(e) => rejectForm.setData('reason', e.target.value)}
                            placeholder="e.g. Currently unavailable due to pending court appearances..."
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
