import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    CheckCircle,
    ChevronLeft,
    Clock,
    DollarSign,
    FileCheck2,
    FileText,
    Info,
    Plus,
    Scale,
    Shield,
    Trash2,
    User,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function Create({
    properties = [],
    eligibleSeekers = [],
    preselectedPropertyId,
    preselectedSeekerId,
    viewingRequestId,
    defaultTemplate,
}) {
    const { lang, t } = useLanguage();

    const selectedPropertyInitial = properties.find((p) => p.id === (preselectedPropertyId || properties[0]?.id));
    const [selectedProperty, setSelectedProperty] = useState(selectedPropertyInitial);

    // Compute default dates (starts 1st of next month, 1 year lease)
    const today = new Date();
    const defaultStart = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().split('T')[0];
    const defaultEnd = new Date(today.getFullYear() + 1, today.getMonth() + 1, 0).toISOString().split('T')[0];

    // Initial clauses
    const initialClauses = defaultTemplate?.clauses || [
        {
            clause_number: 1,
            title_en: 'Premises & Permitted Use',
            title_mm: 'ငှားရမ်းသည့်နေရာနှင့် အသုံးပြုခွင့်',
            content_en: `The Landlord agrees to lease the residential premises located at ${selectedProperty?.address || 'the property'}, ${selectedProperty?.township || 'Yangon'} (${selectedProperty?.area_sqft || 0} sqft) strictly for peaceful residential dwelling. Subletting or commercial operations without written consent is prohibited.`,
            content_mm: `အိမ်ရှင်သည် ရန်ကုန်မြို့၊ ${selectedProperty?.township || ''} တွင်တည်ရှိသော နေအိမ်အား ငှားရမ်းသူထံ လူနေထိုင်ရန် ရည်ရွယ်ချက်ဖြင့်သာ ငှားရမ်းသဘောတူပါသည်။ အိမ်ရှင်၏ ကြိုတင်သဘောတူညီချက်မရှိဘဲ တစ်ဆင့်ပြန်လည်ငှားရမ်းခြင်း (Subletting) မပြုလုပ်ရပါ။`,
        },
        {
            clause_number: 2,
            title_en: 'Rent Payment & Security Deposit',
            title_mm: 'ငှားရမ်းခနှင့် အာမခံစပေါ်ငွေ',
            content_en: `The monthly rent is fixed. Payment shall be made directly on or before the due day of each calendar month. The security deposit is refundable upon termination, minus valid utility arrears or damage restorations.`,
            content_mm: `လစဉ်ငှားရမ်းခကို သတ်မှတ်ရက်မတိုင်မီ တိုက်ရိုက်ပေးချေရမည်ဖြစ်ပြီး စပေါ်ငွေအား စာချုပ်သက်တမ်းကုန်ဆုံးချိန်တွင် မီတာခ/ရေဖိုးကြွေးကျန်နှင့် ပျက်စီးဆုံးရှုံးမှုစရိတ်များ နုတ်ပယ်ပြီး ပြန်လည်ထုတ်ပေးပါမည်။`,
        },
        {
            clause_number: 3,
            title_en: 'Utility Bills & Maintenance',
            title_mm: 'မီတာခ၊ ရေဖိုးနှင့် ပြင်ဆင်စရိတ်',
            content_en: 'The Tenant shall be responsible for monthly electricity, water, internet, and garbage collection charges incurred during the tenancy period.',
            content_mm: 'ငှားရမ်းနေထိုင်စဉ်ကာလအတွင်း လစဉ်ကုန်ကျမည့် လျှပ်စစ်မီတာခ၊ ရေဖိုး၊ အင်တာနက်နှင့် အမှိုက်သိမ်းခများကို အိမ်ငှားသူက တာဝန်ယူကျခံရပါမည်။',
        },
        {
            clause_number: 4,
            title_en: 'House Rules & Peaceful Enjoyment',
            title_mm: 'အိမ်တွင်းစည်းကမ်းများနှင့် အေးချမ်းစွာနေထိုင်ခြင်း',
            content_en: 'The Tenant agrees to respect community standards, maintain cleanliness, avoid unreasonable noise after 10:00 PM, and comply with all building regulations.',
            content_mm: 'အိမ်ငှားသူသည် ရပ်ကွက်နှင့် တိုက်တွင်းစည်းကမ်းများကို လိုက်နာပြီး ည ၁၀ နာရီနောက်ပိုင်း ဆူညံသံမဖြစ်စေရန်နှင့် အေးချမ်းစွာ နေထိုင်ရပါမည်။',
        },
        {
            clause_number: 5,
            title_en: 'Inspection, Termination & Handover',
            title_mm: 'စစ်ဆေးခြင်း၊ စာချုပ်ရပ်စဲခြင်းနှင့် ပြန်လည်အပ်နှံခြင်း',
            content_en: 'Either party may terminate the agreement prior to expiry by providing at least 30 days advance written notice. Upon vacating, the premises shall be returned in clean, undamaged condition.',
            content_mm: 'စာချုပ်မကုန်ဆုံးမီ ရပ်စဲလိုပါက အနည်းဆုံး ရက် ၃၀ ကြိုတင်အကြောင်းကြားရမည်ဖြစ်ပြီး အိမ်အား သန့်ရှင်းသပ်ရပ်စွာ ပြန်လည်လွှဲပြောင်းပေးရမည်။',
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        property_id: preselectedPropertyId || properties[0]?.id || '',
        tenant_id: preselectedSeekerId || eligibleSeekers[0]?.id || '',
        viewing_request_id: viewingRequestId || '',
        monthly_rent: selectedProperty?.price || 500000,
        deposit_amount: selectedProperty?.security_deposit || selectedProperty?.price || 500000,
        rent_due_day: 5,
        advance_payment_months: selectedProperty?.advance_payment_months || 1,
        start_date: defaultStart,
        end_date: defaultEnd,
        structured_clauses: initialClauses,
        terms_and_conditions: defaultTemplate?.full_text || initialClauses.map(c => `[Clause ${c.clause_number}: ${c.title_en} / ${c.title_mm}]\n${c.content_en}\n${c.content_mm}`).join('\n\n'),
    });

    // Handle property switch
    const handlePropertyChange = (propertyId) => {
        const prop = properties.find((p) => p.id === parseInt(propertyId));
        setSelectedProperty(prop);
        setData((prev) => ({
            ...prev,
            property_id: propertyId,
            monthly_rent: prop ? prop.price : prev.monthly_rent,
            deposit_amount: prop ? prop.security_deposit || prop.price : prev.deposit_amount,
            advance_payment_months: prop ? prop.advance_payment_months || 1 : prev.advance_payment_months,
        }));
    };

    // Quick duration helpers
    const setLeaseDurationMonths = (months) => {
        const start = new Date(data.start_date || defaultStart);
        const end = new Date(start);
        end.setMonth(start.getMonth() + months);
        end.setDate(end.getDate() - 1);
        setData('end_date', end.toISOString().split('T')[0]);
    };

    // Clause updates
    const updateClauseContent = (index, field, value) => {
        const updated = [...data.structured_clauses];
        updated[index] = { ...updated[index], [field]: value };
        setData('structured_clauses', updated);
    };

    const addClause = () => {
        const newNum = data.structured_clauses.length + 1;
        const newClause = {
            clause_number: newNum,
            title_en: `Special Clause ${newNum}`,
            title_mm: `အထူးသတ်မှတ်ချက် (${newNum})`,
            content_en: 'Enter custom terms in English...',
            content_mm: 'မြန်မာဘာသာဖြင့် သတ်မှတ်ချက်ကို ရေးသားပါ...',
        };
        setData('structured_clauses', [...data.structured_clauses, newClause]);
    };

    const removeClause = (index) => {
        if (data.structured_clauses.length <= 1) return;
        const updated = data.structured_clauses
            .filter((_, i) => i !== index)
            .map((c, i) => ({ ...c, clause_number: i + 1 }));
        setData('structured_clauses', updated);
    };

    // Sync full terms text with clauses
    useEffect(() => {
        const full = data.structured_clauses
            .map(c => `[Clause ${c.clause_number}: ${c.title_en} / ${c.title_mm}]\n${c.content_en}\n${c.content_mm}`)
            .join('\n\n');
        setData('terms_and_conditions', full);
    }, [data.structured_clauses]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('owner.contracts.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title={lang === 'mm' ? 'အငှားစာချုပ်အသစ် ရေးဆွဲမည်' : 'Draft Lease Contract'} />

            <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
                    <div>
                        <Link
                            href={route('owner.contracts.index')}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 mb-2 transition"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            {lang === 'mm' ? 'စာချုပ်များစာရင်းသို့ ပြန်သွားမည်' : 'Back to Contracts'}
                        </Link>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                            <FileCheck2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                            <span>{lang === 'mm' ? 'စမတ်အငှားစာချုပ် ရေးဆွဲမည် (Smart Lease Builder)' : 'Draft Smart Lease Agreement'}</span>
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                            {lang === 'mm'
                                ? 'ပိုင်ရှင်နှင့် အိမ်ငှားကြား တရားဝင် နှစ်ဦးသဘောတူ စာချုပ်မူကြမ်းရေးဆွဲပြီး အလိုအလျောက် ပြင်ဆင်ချက်မှတ်တမ်းဖြင့် စတင်ပါ'
                                : 'Draft a legally structured bilingual lease agreement with automated revision tracking and digital signatures.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800 text-xs font-semibold">
                        <Shield className="h-4 w-4" />
                        <span>{lang === 'mm' ? 'ဗားရှင်း ၁ (Version 1 Draft)' : 'Version 1 Draft'}</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Step 1: Select Property & Tenant */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-3">
                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-600 text-white text-xs font-extrabold">1</span>
                            <span>{lang === 'mm' ? 'အိမ်ခြံမြေနှင့် အိမ်ငှားသူ ရွေးချယ်ခြင်း' : 'Property & Tenant Selection'}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Property Dropdown */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                                    {lang === 'mm' ? 'ငှားရမ်းမည့် အိမ်/တိုက်ခန်း' : 'Property Unit'} *
                                </label>
                                <select
                                    value={data.property_id}
                                    onChange={(e) => handlePropertyChange(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                                >
                                    {properties.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.title} ({p.township}) — {parseInt(p.price).toLocaleString()} MMK
                                        </option>
                                    ))}
                                </select>
                                {errors.property_id && (
                                    <p className="text-xs text-rose-500 mt-1">{errors.property_id}</p>
                                )}

                                {selectedProperty && (
                                    <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-700 text-xs text-slate-600 dark:text-zinc-300 space-y-1">
                                        <div className="font-semibold text-slate-800 dark:text-white">
                                            {selectedProperty.address || selectedProperty.title}
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
                                            <span>{selectedProperty.township}</span>
                                            <span>•</span>
                                            <span>{selectedProperty.area_sqft || (selectedProperty.width_ft * selectedProperty.length_ft)} sqft</span>
                                            <span>•</span>
                                            <span>{selectedProperty.floor_level || 'Standard Floor'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tenant Dropdown */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                                    {lang === 'mm' ? 'စာချုပ်ချုပ်ဆိုမည့် အိမ်ငှားသူ' : 'Tenant (Counterparty)'} *
                                </label>
                                {eligibleSeekers.length > 0 ? (
                                    <select
                                        value={data.tenant_id}
                                        onChange={(e) => setData('tenant_id', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">-- {lang === 'mm' ? 'အိမ်ငှားသူ ရွေးချယ်ပါ' : 'Select Tenant'} --</option>
                                        {eligibleSeekers.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.phone || 'No phone'}) {s.occupation ? `— ${s.occupation}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
                                        {lang === 'mm'
                                            ? 'အိမ်ကြည့်ခွင့် လက်ခံထားသော အိမ်ငှားများ မရှိသေးပါ။ အိမ်ကြည့်ခွင့် မှတ်တမ်းမှတဆင့် စာချုပ်ဖိတ်ခေါ်နိုင်ပါသည်။'
                                            : 'No pre-qualified viewing candidates found. You can draft a contract with any verified tenant once a viewing is accepted.'}
                                    </div>
                                )}
                                {errors.tenant_id && (
                                    <p className="text-xs text-rose-500 mt-1">{errors.tenant_id}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Financial Terms & Duration */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-3">
                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-600 text-white text-xs font-extrabold">2</span>
                            <span>{lang === 'mm' ? 'ငွေကြေးသတ်မှတ်ချက်နှင့် စာချုပ်သက်တမ်း' : 'Financial Terms & Lease Period'}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Monthly Rent */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                    {lang === 'mm' ? 'လစဉ်ငှားရမ်းခ (ကျပ်)' : 'Monthly Rent (MMK)'} *
                                </label>
                                <input
                                    type="number"
                                    min="1000"
                                    step="5000"
                                    value={data.monthly_rent}
                                    onChange={(e) => setData('monthly_rent', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                                />
                                {errors.monthly_rent && <p className="text-xs text-rose-500 mt-1">{errors.monthly_rent}</p>}
                            </div>

                            {/* Security Deposit */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                    {lang === 'mm' ? 'အာမခံစပေါ်ငွေ (ကျပ်)' : 'Security Deposit (MMK)'} *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="5000"
                                    value={data.deposit_amount}
                                    onChange={(e) => setData('deposit_amount', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                                />
                                {errors.deposit_amount && <p className="text-xs text-rose-500 mt-1">{errors.deposit_amount}</p>}
                            </div>

                            {/* Rent Due Day */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                    {lang === 'mm' ? 'လစဉ်ပေးချေရမည့်ရက်' : 'Monthly Rent Due Day'} *
                                </label>
                                <select
                                    value={data.rent_due_day}
                                    onChange={(e) => setData('rent_due_day', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                                >
                                    {[1, 5, 10, 15, 20, 25].map((d) => (
                                        <option key={d} value={d}>
                                            {lang === 'mm' ? `လစဉ် ${d} ရက်` : `${d}th of every month`}
                                        </option>
                                    ))}
                                </select>
                                {errors.rent_due_day && <p className="text-xs text-rose-500 mt-1">{errors.rent_due_day}</p>}
                            </div>

                            {/* Advance Payment Months */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                    {lang === 'mm' ? 'ကြိုတင်ပေးသွင်းလ' : 'Advance Months'} *
                                </label>
                                <select
                                    value={data.advance_payment_months}
                                    onChange={(e) => setData('advance_payment_months', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value={1}>{lang === 'mm' ? '၁ လစာ ကြိုပေး' : '1 Month in Advance'}</option>
                                    <option value={3}>{lang === 'mm' ? '၃ လစာ ကြိုပေး' : '3 Months in Advance'}</option>
                                    <option value={6}>{lang === 'mm' ? '၆ လစာ ကြိုပေး' : '6 Months in Advance'}</option>
                                    <option value={12}>{lang === 'mm' ? '၁ နှစ်စာ ကြိုပေး' : '12 Months in Advance'}</option>
                                </select>
                                {errors.advance_payment_months && <p className="text-xs text-rose-500 mt-1">{errors.advance_payment_months}</p>}
                            </div>
                        </div>

                        {/* Dates & Duration */}
                        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        {lang === 'mm' ? 'စာချုပ်စတင်သည့်ရက်' : 'Lease Start Date'} *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.start_date && <p className="text-xs text-rose-500 mt-1">{errors.start_date}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        {lang === 'mm' ? 'စာချုပ်ကုန်ဆုံးသည့်ရက်' : 'Lease End Date'} *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.end_date && <p className="text-xs text-rose-500 mt-1">{errors.end_date}</p>}
                                </div>
                            </div>

                            {/* Preset Buttons */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">{lang === 'mm' ? 'အမြန်သတ်မှတ်ရန်:' : 'Quick Term:'}</span>
                                <button
                                    type="button"
                                    onClick={() => setLeaseDurationMonths(6)}
                                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition"
                                >
                                    {lang === 'mm' ? '၆ လ' : '6 Months'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLeaseDurationMonths(12)}
                                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition"
                                >
                                    {lang === 'mm' ? '၁ နှစ်' : '1 Year'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Structured Bilingual Clauses */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-3">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-600 text-white text-xs font-extrabold">3</span>
                                <span>{lang === 'mm' ? 'စာချုပ်အပိုဒ်ခွဲများ (Bilingual Clauses & House Rules)' : 'Structured Bilingual Clauses'}</span>
                            </div>

                            <button
                                type="button"
                                onClick={addClause}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>{lang === 'mm' ? '+ အပိုဒ်အသစ်ထည့်မည်' : '+ Add Special Clause'}</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.structured_clauses.map((clause, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-3"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold">
                                                § {clause.clause_number}
                                            </span>
                                            <input
                                                type="text"
                                                value={clause.title_en}
                                                onChange={(e) => updateClauseContent(idx, 'title_en', e.target.value)}
                                                className="text-xs font-bold px-2 py-1 rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white"
                                                placeholder="Clause Title (EN)"
                                            />
                                            <span className="text-slate-400">/</span>
                                            <input
                                                type="text"
                                                value={clause.title_mm}
                                                onChange={(e) => updateClauseContent(idx, 'title_mm', e.target.value)}
                                                className="text-xs font-bold px-2 py-1 rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white"
                                                placeholder="ခေါင်းစဉ် (MM)"
                                            />
                                        </div>

                                        {data.structured_clauses.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeClause(idx)}
                                                className="p-1 text-slate-400 hover:text-rose-500 rounded-md transition"
                                                title="Remove clause"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Clause text inputs (EN + MM) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mb-1">
                                                English Clause Description
                                            </label>
                                            <textarea
                                                rows="3"
                                                value={clause.content_en}
                                                onChange={(e) => updateClauseContent(idx, 'content_en', e.target.value)}
                                                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mb-1">
                                                မြန်မာဘာသာ စာချုပ်အပိုဒ်ဖော်ပြချက် (Myanmar Unicode)
                                            </label>
                                            <textarea
                                                rows="3"
                                                value={clause.content_mm}
                                                onChange={(e) => updateClauseContent(idx, 'content_mm', e.target.value)}
                                                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 4: Submission & Execution Note */}
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <div className="text-xs text-slate-600 dark:text-zinc-300">
                                <span className="font-bold text-slate-900 dark:text-white">
                                    {lang === 'mm' ? 'လက်မှတ်ရေးထိုးမှု အသိပေးချက်:' : 'Digital Execution Notice:'}
                                </span>{' '}
                                {lang === 'mm'
                                    ? 'ဤစာချုပ်မူကြမ်းအား ဖန်တီးလိုက်သည်နှင့် ပိုင်ရှင်၏ လက်မှတ်ရေးထိုးပြီးသားအဖြစ် မှတ်တမ်းတင်မည်ဖြစ်ပြီး အိမ်ငှားသူထံ စိစစ်လက်မှတ်ထိုးရန် ပေးပို့ပါမည်။ အိမ်ငှားသူသည် ပြင်ဆင်ချက် အဆိုပြုနိုင်ပါသည်။'
                                    : 'Submitting this form applies the Landlord digital signature for Version 1 and forwards the agreement to the Tenant for review, counter-proposals, or mutual signature.'}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition disabled:opacity-50"
                        >
                            <FileCheck2 className="h-4 w-4" />
                            <span>
                                {processing
                                    ? (lang === 'mm' ? 'ဖန်တီးနေပါသည်...' : 'Creating Agreement...')
                                    : (lang === 'mm' ? 'စာချုပ်မူကြမ်း ဖန်တီးလက်မှတ်ထိုးမည်' : 'Create & Sign Version 1')}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
