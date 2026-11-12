import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { getTownshipName } from '@/utils/yangonTownships';
import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    MapPin,
    ShieldCheck,
    Calendar,
    Lock,
    Scale,
    ArrowLeft,
    Check,
    Info,
} from 'lucide-react';

export default function PropertyShow({ property, nearbyLawyers = [] }) {
    const { lang, t } = useLanguage();
    const images = property.images && property.images.length > 0 ? property.images : [];
    const [activeImageIndex, setActiveImageIndex] = useState(0);

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
                                    <span className="text-[10px] text-slate-400">({property.area_sqft} sqft)</span>
                                </div>

                                <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/60 p-3">
                                    <span className="text-[11px] text-slate-400 uppercase font-semibold">{t('specs_floor')}</span>
                                    <div className="text-sm font-bold text-slate-800 dark:text-zinc-100 capitalize mt-0.5">
                                        {property.floor_level} Floor
                                    </div>
                                </div>

                                <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/60 p-3">
                                    <span className="text-[11px] text-slate-400 uppercase font-semibold">{t('specs_toilet')}</span>
                                    <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 capitalize mt-0.5">
                                        {property.toilet_type} Sitting
                                    </div>
                                </div>

                                <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/60 p-3">
                                    <span className="text-[11px] text-slate-400 uppercase font-semibold">{t('specs_aircons')}</span>
                                    <div className="text-sm font-bold text-slate-800 dark:text-zinc-100 mt-0.5">
                                        {property.aircon_count} Units
                                    </div>
                                </div>
                            </div>

                            {/* Additional Specs Grid */}
                            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-y-3 text-xs border-t border-slate-100 dark:border-zinc-800 pt-4">
                                <div>
                                    <span className="text-slate-400">Township:</span>{' '}
                                    <strong className="text-slate-800 dark:text-zinc-200">{getTownshipName(property.township, lang)}</strong>
                                </div>
                                <div>
                                    <span className="text-slate-400">Bedrooms:</span>{' '}
                                    <strong className="text-slate-800 dark:text-zinc-200">{property.bedrooms} Bed</strong>
                                </div>
                                <div>
                                    <span className="text-slate-400">Bathrooms:</span>{' '}
                                    <strong className="text-slate-800 dark:text-zinc-200">{property.bathrooms} Bath</strong>
                                </div>
                                <div>
                                    <span className="text-slate-400">Flooring:</span>{' '}
                                    <strong className="text-slate-800 dark:text-zinc-200 capitalize">{property.flooring_type}</strong>
                                </div>
                                {property.min_contract_months && (
                                    <div>
                                        <span className="text-slate-400">Min Contract:</span>{' '}
                                        <strong className="text-slate-800 dark:text-zinc-200">{property.min_contract_months} Months</strong>
                                    </div>
                                )}
                                {property.ownership_type && (
                                    <div>
                                        <span className="text-slate-400">Ownership:</span>{' '}
                                        <strong className="text-emerald-700 dark:text-emerald-400 uppercase">{property.ownership_type.replace('_', ' ')}</strong>
                                    </div>
                                )}
                            </div>

                            {/* Amenities Tag Cloud */}
                            {property.amenities && property.amenities.length > 0 && (
                                <div className="mt-6 border-t border-slate-100 dark:border-zinc-800 pt-5">
                                    <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2.5">
                                        {t('specs_amenities')}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {property.amenities.map((am, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 capitalize"
                                            >
                                                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                                {am.replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* House Rules */}
                            {property.house_rules && property.house_rules.length > 0 && (
                                <div className="mt-6 border-t border-slate-100 dark:border-zinc-800 pt-5">
                                    <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2.5">
                                        {t('specs_house_rules')}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {property.house_rules.map((rule, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 capitalize"
                                            >
                                                <Info className="h-3.5 w-3.5 text-slate-500" />
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
                                Location & Description
                            </h3>
                            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 mb-4">
                                <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span>{property.address}, {getTownshipName(property.township, lang)}, Yangon</span>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>
                    </div>

                    {/* Right 1 Col: Landlord Card, Pricing & Verified Lawyer Sidebar */}
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

                            {/* Masked Owner Phone / Privacy Protection */}
                            <div className="mt-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                                            {property.owner?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">{property.owner?.name}</div>
                                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Verified Landlord ✓</span>
                                        </div>
                                    </div>
                                    <Lock className="h-4 w-4 text-slate-400" />
                                </div>

                                <div className="mt-3 flex items-center justify-between rounded-lg bg-white dark:bg-zinc-900 p-2.5 text-xs border border-slate-200 dark:border-zinc-700 font-mono font-bold text-slate-700 dark:text-zinc-200">
                                    <span>📞 {property.owner?.phone || t('owner_phone_masked')}</span>
                                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-sans font-semibold">Protected</span>
                                </div>

                                <p className="mt-2 text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">
                                    {t('unlock_contact_hint')}
                                </p>
                            </div>

                            {/* Direct Viewing CTA */}
                            <button
                                type="button"
                                className="mt-4 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                            >
                                <Calendar className="h-4 w-4" />
                                <span>{t('btn_request_viewing')}</span>
                            </button>
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
                                        <div className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                                            Contract Fee: {Number(lawyer.contract_fee).toLocaleString()} Ks
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
        </PublicLayout>
    );
}
