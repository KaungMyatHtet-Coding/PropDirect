import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { useForm, Link, usePage } from '@inertiajs/react';
import { useLanguage } from '@/Contexts/LanguageContext';
import { normalizeToUnicode, isZawgyi } from '@/utils/myanmarFontTools';
import { Scale, Calendar, AlertCircle, CheckCircle2, DollarSign, X } from 'lucide-react';

export default function LawyerBookingModal({ show, onClose, lawyer, property = null }) {
    const { lang, t } = useLanguage();
    const { auth } = usePage().props;
    const user = auth?.user;

    const form = useForm({
        service_type: 'grant_verification',
        preferred_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        property_id: property?.id || '',
        notes: '',
    });

    const isProfileComplete = user?.is_profile_complete;

    const serviceTypes = [
        { id: 'grant_verification', labelEn: 'Title Deed & Grant Verification', labelMm: 'ဂရန်နှင့် ပိုင်ဆိုင်မှု စစ်ဆေးခြင်း', fee: lawyer?.consultation_fee },
        { id: 'sale_contract', labelEn: 'Sale & Purchase Contract Drafting', labelMm: 'အရောင်းအဝယ်စာချုပ် ချုပ်ဆိုခြင်း', fee: lawyer?.contract_fee },
        { id: 'lease_contract', labelEn: 'Standard Rental / Lease Contract', labelMm: 'အငှားစာချုပ် ချုပ်ဆိုခြင်း', fee: lawyer?.contract_fee },
        { id: 'newspaper_notice', labelEn: 'Newspaper Public Notice Publication', labelMm: 'သတင်းစာကြေညာချက် ထည့်သွင်းခြင်း', fee: lawyer?.consultation_fee },
        { id: 'general_consultation', labelEn: 'General Real Estate Consultation', labelMm: 'အထွေထွေ အိမ်ခြံမြေဥပဒေဆွေးနွေးခြင်း', fee: lawyer?.consultation_fee },
    ];

    const currentService = serviceTypes.find((s) => s.id === form.data.service_type);

    const handleNotesBlur = () => {
        if (form.data.notes && isZawgyi(form.data.notes)) {
            form.setData('notes', normalizeToUnicode(form.data.notes));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!lawyer?.id) return;

        form.post(route('lawyer.inquiries.store', lawyer.id), {
            onSuccess: () => {
                form.reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="p-6 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                            <Scale className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {lang === 'mm' ? 'ရှေ့နေ အကူအညီရယူရန်' : 'Book Legal Consultation'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                {lawyer?.user?.name} • Bar Lic: {lawyer?.license_number}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Profile Completion Warning */}
                {!isProfileComplete ? (
                    <div className="mt-5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                                    {lang === 'mm' ? 'ပရိုဖိုင် အချက်အလက် မပြည့်စုံသေးပါ' : 'Profile Completion Required'}
                                </h4>
                                <p className="mt-1 text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
                                    {lang === 'mm'
                                        ? 'ရှေ့နေနှင့် တိုက်ရိုက်ဆွေးနွေးနိုင်ရန် သင့်ပရိုဖိုင်တွင် ဓာတ်ပုံ၊ ဖုန်းနံပါတ်၊ အလုပ်အကိုင်နှင့် လိပ်စာတို့ကို ဖြည့်သွင်းပေးရန် လိုအပ်ပါသည်။'
                                        : 'To protect both parties, please complete your profile (photo, phone, occupation, address) before hiring a lawyer.'}
                                </p>
                                <div className="mt-3">
                                    <Link
                                        href={route('profile.edit')}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-500 transition"
                                    >
                                        {lang === 'mm' ? 'ပရိုဖိုင် ဖြည့်သွင်းရန်' : 'Complete Profile Now'} &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                        {property && (
                            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 p-3">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                    Target Property
                                </span>
                                <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate mt-0.5">
                                    {property.title} ({property.township})
                                </div>
                            </div>
                        )}

                        {/* Service Type Selection */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                {lang === 'mm' ? 'ဝန်ဆောင်မှု အမျိုးအစား' : 'Legal Service Required'}
                            </label>
                            <select
                                value={form.data.service_type}
                                onChange={(e) => form.setData('service_type', e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 py-2.5 px-3 focus:border-amber-500 focus:ring-amber-500"
                            >
                                {serviceTypes.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {lang === 'mm' ? service.labelMm : service.labelEn}
                                    </option>
                                ))}
                            </select>
                            {form.errors.service_type && (
                                <p className="mt-1 text-xs text-rose-500">{form.errors.service_type}</p>
                            )}
                        </div>

                        {/* Preferred Consultation Date */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                {lang === 'mm' ? 'ဆွေးနွေးလိုသော နေ့ရက်' : 'Preferred Consultation Date'}
                            </label>
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={form.data.preferred_date}
                                onChange={(e) => form.setData('preferred_date', e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 py-2.5 px-3 focus:border-amber-500 focus:ring-amber-500"
                                required
                            />
                            {form.errors.preferred_date && (
                                <p className="mt-1 text-xs text-rose-500">{form.errors.preferred_date}</p>
                            )}
                        </div>

                        {/* Notes / Context */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                {lang === 'mm' ? 'ဆွေးနွေးလိုသည့် အကြောင်းအရာနှင့် အသေးစိတ်' : 'Consultation Notes & Requirements'}
                            </label>
                            <textarea
                                rows={3}
                                value={form.data.notes}
                                onChange={(e) => form.setData('notes', e.target.value)}
                                onBlur={handleNotesBlur}
                                placeholder={t('lawyer_notes_placeholder')}
                                className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 p-3 focus:border-amber-500 focus:ring-amber-500 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                                required
                            />
                            {form.errors.notes && <p className="mt-1 text-xs text-rose-500">{form.errors.notes}</p>}
                        </div>

                        {/* Estimated Fee Preview */}
                        <div className="flex items-center justify-between rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 p-3 text-xs">
                            <span className="text-slate-600 dark:text-zinc-400 font-medium">
                                {lang === 'mm' ? 'ခန့်မှန်း ကုန်ကျစရိတ်နှုန်းထား' : 'Estimated Standard Fee'}:
                            </span>
                            <span className="font-bold font-mono text-amber-700 dark:text-amber-400">
                                {currentService?.fee ? `${Number(currentService.fee).toLocaleString()} Ks` : 'To be confirmed'}
                            </span>
                        </div>

                        <div className="mt-5 flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="rounded-xl bg-amber-600 hover:bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-amber-600/30 transition disabled:opacity-50"
                            >
                                {form.processing
                                    ? 'Sending Inquiry...'
                                    : lang === 'mm'
                                    ? 'ဆွေးနွေးမှု လျှောက်ထားမည်'
                                    : 'Send Inquiry to Lawyer'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}
