import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { YANGON_TOWNSHIPS, getTownshipName } from '@/utils/yangonTownships';
import { normalizeToUnicode } from '@/utils/myanmarFontTools';
import { Head, router } from '@inertiajs/react';
import {
    Scale,
    ShieldCheck,
    Search,
    MapPin,
    Award,
    Briefcase,
    Phone,
    Mail,
    CheckCircle2,
    Calendar,
    DollarSign,
    Filter,
} from 'lucide-react';

export default function LawyersIndex({ lawyers, filters }) {
    const { lang, t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedTownship, setSelectedTownship] = useState(filters?.township || 'all');
    const [selectedType, setSelectedType] = useState(filters?.type || 'all');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('lawyers.index'),
            {
                township: selectedTownship,
                type: selectedType,
                search: normalizeToUnicode(searchTerm),
            },
            { preserveState: true }
        );
    };

    const handleFilterChange = (key, value) => {
        const nextTownship = key === 'township' ? value : selectedTownship;
        const nextType = key === 'type' ? value : selectedType;
        if (key === 'township') setSelectedTownship(value);
        if (key === 'type') setSelectedType(value);

        router.get(
            route('lawyers.index'),
            {
                township: nextTownship,
                type: nextType,
                search: normalizeToUnicode(searchTerm),
            },
            { preserveState: true }
        );
    };

    return (
        <PublicLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {lang === 'mm' ? 'အသိအမှတ်ပြု တရားဝင်ရှေ့နေများ ကွန်ရက်' : 'Verified Legal Lawyers Directory'}
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/50 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                <Scale className="h-3 w-3" />
                                Bar Council Certified
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                            {lang === 'mm'
                                ? 'ဂရန်စစ်ဆေးခြင်း၊ အရောင်းအဝယ်စာချုပ်နှင့် အငှားစာချုပ်များအတွက် တိုက်ရိုက်ဆက်သွယ်ဆွေးနွေးနိုင်ပါသည်'
                                : 'Connect with certified advocates and pleaders for title deed verification and bulletproof rental/sale contracts'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-xs">
                        <span>{lawyers.total || 0} Lawyers Listed</span>
                    </div>
                </div>
            }
        >
            <Head title="Verified Lawyers Directory - PropDirect" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Search & Filters Card */}
                <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                        {/* Search Input */}
                        <div className="sm:col-span-2 relative">
                            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search lawyer name, specialization, or Bar license..."
                                className="w-full pl-10 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-xs focus:border-amber-500 focus:ring-amber-500 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                            />
                        </div>

                        {/* Township Filter */}
                        <div>
                            <select
                                value={selectedTownship}
                                onChange={(e) => handleFilterChange('township', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-xs focus:border-amber-500 focus:ring-amber-500"
                            >
                                <option value="all" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">All Yangon Townships</option>
                                {YANGON_TOWNSHIPS.map((t) => (
                                    <option key={t.id} value={t.en} className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">
                                        {lang === 'mm' ? `${t.mm} (${t.en})` : `${t.en} [${t.mm}]`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Lawyer Type Filter */}
                        <div>
                            <select
                                value={selectedType}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-xs focus:border-amber-500 focus:ring-amber-500"
                            >
                                <option value="all" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">All Designations</option>
                                <option value="advocate" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Advocate [တရားလွှတ်တော်ရှေ့နေ]</option>
                                <option value="higher_grade_pleader" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Higher Grade Pleader [အထက်တန်းရှေ့နေ]</option>
                            </select>
                        </div>
                    </form>
                </div>

                {/* Lawyers Grid */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lawyers.data?.length === 0 ? (
                        <div className="col-span-full py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                                <Scale className="h-7 w-7" />
                            </div>
                            <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No lawyers found</h4>
                            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                Try adjusting your township or search keywords.
                            </p>
                        </div>
                    ) : (
                        lawyers.data.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs transition hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700"
                            >
                                <div className="p-6">
                                    {/* Header: Avatar, Name & Designation */}
                                    <div className="flex items-start gap-4">
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-200 dark:border-amber-800/60 bg-slate-100 dark:bg-zinc-800 shadow-xs">
                                            {item.user?.avatar ? (
                                                <img
                                                    src={`/storage/${item.user.avatar}`}
                                                    alt={item.user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center font-bold text-slate-500 dark:text-zinc-400 text-xl">
                                                    {item.user?.name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <h3 className="font-bold text-slate-900 dark:text-white truncate text-base">
                                                    {item.user?.name}
                                                </h3>
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                            </div>

                                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:text-amber-300 ring-1 ring-inset ring-amber-600/20 dark:ring-amber-500/30 capitalize mt-0.5">
                                                {item.lawyer_type.replace('_', ' ')}
                                            </span>

                                            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                                                <span className="font-mono">{item.degree}</span>
                                                <span>•</span>
                                                <span>{item.experience_years} Years Exp</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bar License Badge */}
                                    <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 dark:bg-zinc-800/60 px-3 py-2 text-xs">
                                        <span className="font-medium text-slate-500 dark:text-zinc-400">Bar Council License:</span>
                                        <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">{item.license_number}</span>
                                    </div>

                                    {/* Location & Specialization */}
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-300">
                                            <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
                                            <span>Office: <strong>{getTownshipName(item.office_township, lang)}</strong>, Yangon</span>
                                        </div>

                                        <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-800/40 p-2.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                                Specializations
                                            </span>
                                            <p className="mt-0.5 text-xs font-medium text-slate-700 dark:text-zinc-300">
                                                {item.specialization}
                                            </p>
                                        </div>

                                        <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                                            {item.bio}
                                        </p>
                                    </div>

                                    {/* Fees Row */}
                                    <div className="mt-5 grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-zinc-800 text-center">
                                        <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/60 p-2">
                                            <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase">Consultation</div>
                                            <div className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
                                                {Number(item.consultation_fee).toLocaleString()} Ks
                                            </div>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/60 p-2">
                                            <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase">Contract Drafting</div>
                                            <div className="text-xs font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
                                                {Number(item.contract_fee).toLocaleString()} Ks
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Button Footer */}
                                <div className="border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 px-6 py-3.5 flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-300">
                                        📞 {item.user?.phone || 'Contact via Platform'}
                                    </span>
                                    <a
                                        href={`tel:${item.user?.phone}`}
                                        className="inline-flex items-center gap-1 rounded-xl bg-slate-900 dark:bg-zinc-800 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 dark:hover:bg-zinc-700 border border-transparent dark:border-zinc-700 transition"
                                    >
                                        <Phone className="h-3 w-3" />
                                        <span>Call Lawyer</span>
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
