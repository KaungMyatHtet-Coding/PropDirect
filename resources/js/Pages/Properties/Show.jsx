import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import Modal from '@/Components/Modal';
import LawyerBookingModal from '@/Components/LawyerBookingModal';
import { useLanguage } from '@/Contexts/LanguageContext';
import { getTownshipName } from '@/utils/yangonTownships';
import { normalizeToUnicode, isZawgyi } from '@/utils/myanmarFontTools';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Building2,
    MapPin,
    ShieldCheck,
    Calendar,
    Lock,
    Unlock,
    Scale,
    ArrowLeft,
    Check,
    Info,
    MessageSquare,
    Phone,
    Clock,
    AlertCircle,
    X,
} from 'lucide-react';

export default function PropertyShow({
    property,
    nearbyLawyers = [],
    isUnlocked = false,
    activeViewingRequest = null,
}) {
    const { lang, t } = useLanguage();
    const { auth } = usePage().props;
    const user = auth?.user;

    const images = property.images && property.images.length > 0 ? property.images : [];
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Modals
    const [viewingModalOpen, setViewingModalOpen] = useState(false);
    const [lawyerModalOpen, setLawyerModalOpen] = useState(false);
    const [selectedLawyer, setSelectedLawyer] = useState(null);

    // Viewing form
    const viewingForm = useForm({
        preferred_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        preferred_time: 'Morning (9:00 AM - 12:00 PM)',
        message: '',
    });

    const isOwnerOfProperty = user && user.id === property.owner_id;
    const isAdmin = user && user.role === 'admin';
    const isProfileComplete = user?.is_profile_complete;

    const handleViewingMessageBlur = () => {
        if (viewingForm.data.message && isZawgyi(viewingForm.data.message)) {
            viewingForm.setData('message', normalizeToUnicode(viewingForm.data.message));
        }
    };

    const handleViewingSubmit = (e) => {
        e.preventDefault();
        viewingForm.post(route('viewing.store', property.slug), {
            onSuccess: () => {
                viewingForm.reset();
                setViewingModalOpen(false);
            },
        });
    };

    const handleOpenLawyerModal = (lawyer) => {
        setSelectedLawyer(lawyer);
        setLawyerModalOpen(true);
    };

    return (
        <PublicLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('properties.index')}
                            className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 text-slate-500 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                {property.listing_type === 'rent' ? t('filter_rent') : t('filter_sale')} • {property.property_type}
                            </span>
                            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white truncate max-w-xl">
                                {property.title}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            Verified Landlord Direct
                        </span>
                    </div>
                </div>
            }
        >
            <Head title={`${property.title} - PropDirect`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* 1. Main Grid: Gallery & Content (Col 2) + Sidebar (Col 1) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left 2 Cols: Gallery, Specs & Descriptions */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Photo Gallery */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-xs">
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
                                {images.length > 0 ? (
                                    <img
                                        src={`/storage/${images[activeImageIndex]}`}
                                        alt={property.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-slate-500">
                                        <Building2 className="h-16 w-16" />
                                    </div>
                                )}

                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="rounded-xl bg-slate-900/80 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white uppercase">
                                        {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                                    </span>
                                    <span className="rounded-xl bg-emerald-600 px-3 py-1 text-xs font-bold text-white uppercase">
                                        {property.property_type}
                                    </span>
                                </div>

                                <div className="absolute bottom-4 right-4 rounded-xl bg-black/70 backdrop-blur-xs px-3 py-1.5 text-xs font-bold text-white font-mono">
                                    {property.width_ft}' x {property.length_ft}' ({property.area_sqft} sqft)
                                </div>
                            </div>

                            {/* Thumbnail Row */}
                            {images.length > 1 && (
                                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setActiveImageIndex(i)}
                                            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                                                activeImageIndex === i
                                                    ? 'border-emerald-600 ring-2 ring-emerald-600/30'
                                                    : 'border-slate-200 dark:border-zinc-700 opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={`/storage/${img}`} alt="" className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Key Specs Card */}
                        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-3">
                                {lang === 'mm' ? 'အိမ်ခြံမြေ အသေးစိတ် အချက်အလက်များ' : 'Property Specifications & Facilities'}
                            </h3>

                            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/60 p-3">
                                    <span className="text-[11px] text-slate-400 uppercase font-semibold">{t('specs_dimensions')}</span>
                                    <div className="text-sm font-bold text-slate-800 dark:text-zinc-100 font-mono mt-0.5">
                                        {property.width_ft}' x {property.length_ft}'
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-mono">({property.area_sqft} sqft)</span>
                                </div>

                                <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/60 p-3">
                                    <span className="text-[11px] text-slate-400 uppercase font-semibold">{t('specs_floor')}</span>
                                    <div className="text-sm font-bold text-slate-800 dark:text-zinc-100 capitalize mt-0.5">
                                        {property.floor_level ? property.floor_level.replace('_', ' ') : 'N/A'}
                                    </div>
                                </div>

                                <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/60 p-3">
                                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Rooms</span>
                                    <div className="text-sm font-bold text-slate-800 dark:text-zinc-100 mt-0.5">
                                        {property.bedrooms} Bed • {property.bathrooms} Bath
                                    </div>
                                </div>

                                <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/60 p-3">
                                    <span className="text-[11px] text-slate-400 uppercase font-semibold">{t('specs_aircons')}</span>
                                    <div className="text-sm font-bold text-slate-800 dark:text-zinc-100 mt-0.5">
                                        {property.aircon_count > 0 ? `${property.aircon_count} Units` : 'None'}
                                    </div>
                                </div>
                            </div>

                            {/* Interior details row */}
                            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                                <div>
                                    <span className="text-xs text-slate-400 font-semibold">{t('specs_toilet')}:</span>
                                    <span className="ml-2 text-xs font-bold text-slate-800 dark:text-zinc-200 capitalize">
                                        {property.toilet_type || 'Standard'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 font-semibold">{t('specs_flooring')}:</span>
                                    <span className="ml-2 text-xs font-bold text-slate-800 dark:text-zinc-200 capitalize">
                                        {property.flooring_type ? property.flooring_type.replace('_', ' ') : 'Standard'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 font-semibold">{t('specs_ownership')}:</span>
                                    <span className="ml-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 capitalize">
                                        {property.ownership_type ? property.ownership_type.replace('_', ' ') : 'Verified'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Amenities & Rules */}
                        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-3">
                                {t('specs_amenities')}
                            </h3>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {property.amenities && property.amenities.length > 0 ? (
                                    property.amenities.map((item, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-zinc-200"
                                        >
                                            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                            {item.replace('_', ' ')}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-400">Standard amenities</span>
                                )}
                            </div>

                            {property.house_rules && property.house_rules.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                        {t('specs_house_rules')}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {property.house_rules.map((rule, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-300"
                                            >
                                                <Info className="h-3.5 w-3.5 text-rose-500" />
                                                {rule.replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-3">
                                {lang === 'mm' ? 'အိမ်ခြံမြေ ဖော်ပြချက်' : 'Description'}
                            </h3>
                            <p className="mt-4 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>
                    </div>

                    {/* Right 1 Col: Landlord Card, Pricing, Viewing Action & Verified Lawyer Sidebar */}
                    <div className="space-y-6">
                        {/* Price & Viewing Action Card */}
                        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs">
                            <span className="text-xs text-slate-400 dark:text-zinc-500 font-semibold uppercase">
                                {property.listing_type === 'rent' ? 'Monthly Rent' : 'Total Sale Price'}
                            </span>
                            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                                {Number(property.price).toLocaleString()} Ks
                                {property.listing_type === 'rent' && (
                                    <span className="text-sm font-normal text-slate-500 dark:text-zinc-400"> / month</span>
                                )}
                            </div>

                            {property.security_deposit && (
                                <div className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
                                    Security Deposit: <strong>{Number(property.security_deposit).toLocaleString()} Ks</strong>
                                </div>
                            )}

                            {/* Contact Box (Masked vs Unlocked) */}
                            <div className="mt-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                                            {property.owner?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">{property.owner?.name}</div>
                                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Verified Landlord ✓</span>
                                        </div>
                                    </div>
                                    {isUnlocked ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                                            <Unlock className="h-3 w-3" /> Unlocked
                                        </span>
                                    ) : (
                                        <Lock className="h-4 w-4 text-slate-400" />
                                    )}
                                </div>

                                <div className="mt-3 flex items-center justify-between rounded-lg bg-white dark:bg-zinc-900 p-2.5 text-xs border border-slate-200 dark:border-zinc-700 font-mono font-bold text-slate-700 dark:text-zinc-200">
                                    <span>📞 {property.owner?.phone || t('owner_phone_masked')}</span>
                                    {isUnlocked ? (
                                        <a
                                            href={`tel:${property.owner?.phone}`}
                                            className="text-[11px] font-sans font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                                        >
                                            Call Now
                                        </a>
                                    ) : (
                                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-sans font-semibold">Protected</span>
                                    )}
                                </div>

                                <p className="mt-2 text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">
                                    {isUnlocked
                                        ? (lang === 'mm' ? 'ပိုင်ရှင်နှင့် တိုက်ရိုက်ချိတ်ဆက်နိုင်ပါပြီ' : 'Direct contact unlocked! You may call or message the landlord.')
                                        : t('unlock_contact_hint')}
                                </p>
                            </div>

                            {/* Active Viewing Status or Action Button */}
                            <div className="mt-5 space-y-3">
                                {!user ? (
                                    <Link
                                        href={route('login')}
                                        className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                                    >
                                        <Calendar className="h-4 w-4" />
                                        <span>{lang === 'mm' ? 'အကောင့်ဝင်၍ အိမ်ကြည့်ရန်' : 'Log In to Schedule Viewing'}</span>
                                    </Link>
                                ) : isOwnerOfProperty ? (
                                    <div className="rounded-xl bg-slate-100 dark:bg-zinc-800 p-3 text-center text-xs font-semibold text-slate-600 dark:text-zinc-300">
                                        🏠 You are the owner of this property.
                                    </div>
                                ) : isAdmin ? (
                                    <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-3 text-center text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                                        🛡️ Administrator View Mode (Auditor Separation)
                                    </div>
                                ) : activeViewingRequest && activeViewingRequest.status === 'pending' ? (
                                    <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                                            <Clock className="h-4 w-4" />
                                            <span>{t('viewing_status_pending')}</span>
                                        </div>
                                        <p className="mt-1 text-xs text-slate-600 dark:text-zinc-300">
                                            Requested for <strong>{activeViewingRequest.preferred_date}</strong> ({activeViewingRequest.preferred_time})
                                        </p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <Link
                                                href={route('my-viewings.index')}
                                                className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
                                            >
                                                {lang === 'mm' ? 'ကျွန်ုပ်၏ မှတ်တမ်းသို့' : 'View in My Viewings'} &rarr;
                                            </Link>
                                            <Link
                                                href={route('viewing.show', activeViewingRequest.id)}
                                                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                                            >
                                                <MessageSquare className="h-3 w-3" />
                                                <span>P2P Chat</span>
                                            </Link>
                                        </div>
                                    </div>
                                ) : activeViewingRequest && activeViewingRequest.status === 'rescheduled' ? (
                                    <div className="rounded-xl border border-orange-200 dark:border-orange-900/60 bg-orange-50 dark:bg-orange-950/30 p-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-orange-800 dark:text-orange-300">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>{t('viewing_status_rescheduled')}</span>
                                        </div>
                                        <p className="mt-1 text-xs text-slate-600 dark:text-zinc-300">
                                            Proposed: <strong>{activeViewingRequest.rescheduled_date}</strong> ({activeViewingRequest.rescheduled_time})
                                        </p>
                                        {activeViewingRequest.owner_note && (
                                            <p className="mt-1 text-xs text-slate-500 italic">
                                                "{activeViewingRequest.owner_note}"
                                            </p>
                                        )}
                                        <div className="mt-3 flex items-center gap-2">
                                            <Link
                                                as="button"
                                                method="post"
                                                href={route('viewing.accept-reschedule', activeViewingRequest.id)}
                                                className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-orange-500 transition"
                                            >
                                                {t('viewing_accept_reschedule')}
                                            </Link>
                                            <Link
                                                href={route('viewing.show', activeViewingRequest.id)}
                                                className="rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300"
                                            >
                                                Chat
                                            </Link>
                                        </div>
                                    </div>
                                ) : activeViewingRequest && (activeViewingRequest.status === 'accepted' || activeViewingRequest.status === 'completed') ? (
                                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                                                <Check className="h-4 w-4 text-emerald-600" />
                                                Viewing Confirmed
                                            </span>
                                            <span className="rounded bg-emerald-200/60 dark:bg-emerald-900 px-2 py-0.5 text-[10px] font-bold text-emerald-900 dark:text-emerald-200 capitalize">
                                                {activeViewingRequest.status}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-slate-600 dark:text-zinc-300">
                                            Scheduled for <strong>{activeViewingRequest.preferred_date}</strong> ({activeViewingRequest.preferred_time})
                                        </p>
                                        <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
                                            <a
                                                href={`tel:${property.owner?.phone}`}
                                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition"
                                            >
                                                <Phone className="h-3 w-3" />
                                                <span>Call Landlord</span>
                                            </a>
                                            <Link
                                                href={route('viewing.show', activeViewingRequest.id)}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                                            >
                                                <MessageSquare className="h-3.5 w-3.5" />
                                                <span>{t('viewing_open_chat')} &rarr;</span>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setViewingModalOpen(true)}
                                        className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                                    >
                                        <Calendar className="h-4 w-4" />
                                        <span>{t('btn_request_viewing')}</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Verified Lawyers Legal Check Sidebar */}
                        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/50 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/20 p-6 shadow-xs">
                            <div className="flex items-center gap-2.5">
                                <div className="rounded-xl bg-amber-500 p-2.5 text-white">
                                    <Scale className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('sidebar_legal_help_title')}</h4>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Bar Council Certified Protection</p>
                                </div>
                            </div>

                            <p className="mt-3 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                                {t('sidebar_legal_help_desc')}
                            </p>

                            {/* Nearby Lawyer Cards */}
                            <div className="mt-4 space-y-3">
                                {nearbyLawyers.map((lawyer) => (
                                    <div
                                        key={lawyer.id}
                                        className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-white dark:bg-zinc-900 p-3 shadow-xs"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">{lawyer.user?.name}</div>
                                            <span className="rounded bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 capitalize">
                                                {lawyer.lawyer_type.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                                            📍 {lawyer.office_township} • {lawyer.experience_years} Yrs Exp
                                        </div>
                                        <div className="mt-1 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800">
                                            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                                                Contract: {Number(lawyer.contract_fee).toLocaleString()} Ks
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleOpenLawyerModal(lawyer)}
                                                className="rounded-lg bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 text-[10px] font-bold shadow-xs transition"
                                            >
                                                {lang === 'mm' ? 'ငှားရမ်းမည်' : 'Hire Lawyer'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-3 border-t border-amber-200 dark:border-amber-900/60 text-center">
                                <Link
                                    href={route('lawyers.index')}
                                    className="text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline"
                                >
                                    {t('sidebar_view_lawyers')} &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Viewing Request Modal */}
            <Modal show={viewingModalOpen} onClose={() => setViewingModalOpen(false)} maxWidth="md">
                <div className="p-6 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-emerald-600" />
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {t('viewing_schedule_title')}
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setViewingModalOpen(false)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {!isProfileComplete ? (
                        <div className="mt-5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                                        {lang === 'mm' ? 'ပရိုဖိုင် အချက်အလက် မပြည့်စုံသေးပါ' : 'Profile Completion Required'}
                                    </h4>
                                    <p className="mt-1 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                                        {lang === 'mm'
                                            ? 'အိမ်ပိုင်ရှင်များထံ အိမ်ကြည့်ခွင့် လျှောက်ထားနိုင်ရန် ပရိုဖိုင်တွင် ဓာတ်ပုံ၊ ဖုန်းနံပါတ်၊ အလုပ်အကိုင်နှင့် လိပ်စာတို့ကို ဦးစွာ ဖြည့်သွင်းပေးပါ။'
                                            : 'To protect homeowners and maintain zero broker spam, please complete your profile (photo, phone, occupation, address) before requesting a viewing.'}
                                    </p>
                                    <div className="mt-3">
                                        <Link
                                            href={route('profile.edit')}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-500 transition"
                                        >
                                            {t('profile_complete_btn')} &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleViewingSubmit} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                    {t('viewing_preferred_date')}
                                </label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={viewingForm.data.preferred_date}
                                    onChange={(e) => viewingForm.setData('preferred_date', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 py-2.5 px-3 focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                />
                                {viewingForm.errors.preferred_date && (
                                    <p className="mt-1 text-xs text-rose-500">{viewingForm.errors.preferred_date}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                    {t('viewing_preferred_time')}
                                </label>
                                <select
                                    value={viewingForm.data.preferred_time}
                                    onChange={(e) => viewingForm.setData('preferred_time', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 py-2.5 px-3 focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="Morning (9:00 AM - 12:00 PM)">{t('viewing_slot_morning')}</option>
                                    <option value="Afternoon (1:00 PM - 5:00 PM)">{t('viewing_slot_afternoon')}</option>
                                    <option value="Evening (5:00 PM - 7:00 PM)">{t('viewing_slot_evening')}</option>
                                </select>
                                {viewingForm.errors.preferred_time && (
                                    <p className="mt-1 text-xs text-rose-500">{viewingForm.errors.preferred_time}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                    {lang === 'mm' ? 'အိမ်ရှင်ထံ ကြိုတင်ပြောလိုသည့် အကြောင်းအရာ (ရွေးချယ်ရန်)' : 'Note for Landlord (Optional)'}
                                </label>
                                <textarea
                                    rows={3}
                                    value={viewingForm.data.message}
                                    onChange={(e) => viewingForm.setData('message', e.target.value)}
                                    onBlur={handleViewingMessageBlur}
                                    placeholder={t('viewing_message_placeholder')}
                                    className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 p-3 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                                />
                                {viewingForm.errors.message && (
                                    <p className="mt-1 text-xs text-rose-500">{viewingForm.errors.message}</p>
                                )}
                            </div>

                            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
                                💡 {t('unlock_contact_hint')}
                            </div>

                            <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setViewingModalOpen(false)}
                                    className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={viewingForm.processing}
                                    className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-600/30 transition disabled:opacity-50"
                                >
                                    {viewingForm.processing ? 'Submitting...' : t('viewing_submit_btn')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>

            {/* Lawyer Booking Modal */}
            <LawyerBookingModal
                show={lawyerModalOpen}
                onClose={() => setLawyerModalOpen(false)}
                lawyer={selectedLawyer}
                property={property}
            />
        </PublicLayout>
    );
}
