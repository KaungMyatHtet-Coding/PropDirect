import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { YANGON_TOWNSHIPS, getTownshipName } from '@/utils/yangonTownships';
import { normalizeToUnicode } from '@/utils/myanmarFontTools';
import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Building2,
    SlidersHorizontal,
    MapPin,
    RotateCcw,
    Sparkles,
    Layers,
    Eye,
} from 'lucide-react';

export default function PropertiesIndex({ properties, filters }) {
    const { lang, t } = useLanguage();
    const [showFilters, setShowFilters] = useState(false);

    // Form filter states
    const [search, setSearch] = useState(filters?.search || '');
    const [listingType, setListingType] = useState(filters?.listing_type || 'all');
    const [propertyType, setPropertyType] = useState(filters?.property_type || 'all');
    const [township, setTownship] = useState(filters?.township || 'all');
    const [floorLevel, setFloorLevel] = useState(filters?.floor_level || 'all');
    const [targetPrice, setTargetPrice] = useState(filters?.target_price || '');
    const [priceTolerance, setPriceTolerance] = useState(filters?.price_tolerance ?? true);
    const [dimensionPreset, setDimensionPreset] = useState(filters?.dimension_preset || 'all');
    const [dimTolerance, setDimTolerance] = useState(filters?.dim_tolerance ?? true);
    const [toiletType, setToiletType] = useState(filters?.toilet_type || 'all');
    const [minAircon, setMinAircon] = useState(filters?.min_aircon || '');
    const [flooringType, setFlooringType] = useState(filters?.flooring_type || 'all');
    const [amenity, setAmenity] = useState(filters?.amenity || 'all');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(
            route('properties.index'),
            {
                search: normalizeToUnicode(search),
                listing_type: listingType,
                property_type: propertyType,
                township,
                floor_level: floorLevel,
                target_price: targetPrice,
                price_tolerance: priceTolerance,
                dimension_preset: dimensionPreset,
                dim_tolerance: dimTolerance,
                toilet_type: toiletType,
                min_aircon: minAircon,
                flooring_type: flooringType,
                amenity,
            },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setListingType('all');
        setPropertyType('all');
        setTownship('all');
        setFloorLevel('all');
        setTargetPrice('');
        setPriceTolerance(true);
        setDimensionPreset('all');
        setDimTolerance(true);
        setToiletType('all');
        setMinAircon('');
        setFlooringType('all');
        setAmenity('all');
        router.get(route('properties.index'), {}, { preserveState: false });
    };

    // Calculate budget tolerance bounds for visual pill feedback
    const numPrice = parseFloat(targetPrice) || 0;
    const priceLower = numPrice > 0 ? numPrice * 0.85 : 0;
    const priceUpper = numPrice > 0 ? numPrice * 1.15 : 0;

    // Calculate square footage tolerance bounds
    let targetSqft = 0;
    if (dimensionPreset === '12.5x50') targetSqft = 625;
    else if (dimensionPreset === '15x60') targetSqft = 900;
    else if (dimensionPreset === '20x60') targetSqft = 1200;
    else if (dimensionPreset === '25x50') targetSqft = 1250;
    else if (dimensionPreset === '40x60') targetSqft = 2400;

    const sqftLower = targetSqft > 0 ? Math.round(targetSqft * 0.85) : 0;
    const sqftUpper = targetSqft > 0 ? Math.round(targetSqft * 1.15) : 0;

    return (
        <PublicLayout
            header={
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        {t('properties_title')}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 max-w-2xl">
                        {t('properties_subtitle')}
                    </p>
                </div>
            }
        >
            <Head title="Browse Properties - PropDirect" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* 1. Primary Search & Quick Filters Bar */}
                <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xs sm:p-5 transition-colors">
                    <form onSubmit={handleSearchSubmit} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={t('search_placeholder')}
                                    className="w-full pl-10 rounded-xl border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Listing Type Pills */}
                            <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-800 p-1 shrink-0">
                                {['all', 'rent', 'sale'].map((lt) => (
                                    <button
                                        key={lt}
                                        type="button"
                                        onClick={() => {
                                            setListingType(lt);
                                            router.get(
                                                route('properties.index'),
                                                { ...filters, listing_type: lt, search: normalizeToUnicode(search) },
                                                { preserveState: true }
                                            );
                                        }}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
                                            listingType === lt
                                                ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs'
                                                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        {lt === 'all' ? t('filter_all') : lt === 'rent' ? t('filter_rent') : t('filter_sale')}
                                    </button>
                                ))}
                            </div>

                            {/* Township Dropdown */}
                            <div className="shrink-0 sm:w-56">
                                <select
                                    value={township}
                                    onChange={(e) => {
                                        setTownship(e.target.value);
                                        router.get(
                                            route('properties.index'),
                                            { ...filters, township: e.target.value, search: normalizeToUnicode(search) },
                                            { preserveState: true }
                                        );
                                    }}
                                    className="w-full rounded-xl border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-xs focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="all" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">
                                        {t('filter_all_townships')}
                                    </option>
                                    {YANGON_TOWNSHIPS.map((tw) => (
                                        <option key={tw.id} value={tw.en} className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">
                                            {lang === 'mm' ? `${tw.mm} (${tw.en})` : `${tw.en} [${tw.mm}]`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filters Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition shrink-0 ${
                                    showFilters
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                        : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700'
                                }`}
                            >
                                <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>{lang === 'mm' ? 'အထူးစစ်ဆေးမှုများ (±၁၅%)' : 'Smart Filters (±15%)'}</span>
                            </button>

                            <button
                                type="submit"
                                className="rounded-xl bg-slate-900 dark:bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:hover:bg-emerald-500 transition shrink-0"
                            >
                                {lang === 'mm' ? 'ရှာမည်' : 'Search'}
                            </button>
                        </div>

                        {/* Expandable Advanced Smart Range Filters */}
                        {showFilters && (
                            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Smart Price Filter (±15% Tolerance) */}
                                    <div className="rounded-xl border border-slate-200 dark:border-zinc-700/80 bg-slate-50/70 dark:bg-zinc-800/60 p-3.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                                {t('filter_price_budget')}
                                            </label>
                                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                                                ±15% Smart Match
                                            </span>
                                        </div>
                                        <input
                                            type="number"
                                            step="10000"
                                            value={targetPrice}
                                            onChange={(e) => setTargetPrice(e.target.value)}
                                            placeholder="e.g. 400000"
                                            className="mt-1.5 w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400"
                                        />
                                        <label className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-zinc-400 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={priceTolerance}
                                                onChange={(e) => setPriceTolerance(e.target.checked)}
                                                className="rounded border-slate-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                                            />
                                            <span>{t('filter_price_tolerance')}</span>
                                        </label>
                                        {numPrice > 0 && priceTolerance && (
                                            <div className="mt-1.5 text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">
                                                Matching: {priceLower.toLocaleString()} Ks – {priceUpper.toLocaleString()} Ks
                                            </div>
                                        )}
                                    </div>

                                    {/* Smart Dimension Filter (±15% sqft Tolerance) */}
                                    <div className="rounded-xl border border-slate-200 dark:border-zinc-700/80 bg-slate-50/70 dark:bg-zinc-800/60 p-3.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                                {t('filter_dimensions')}
                                            </label>
                                            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                                                Yangon Standards
                                            </span>
                                        </div>
                                        <select
                                            value={dimensionPreset}
                                            onChange={(e) => setDimensionPreset(e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 focus:border-emerald-500 focus:ring-emerald-500"
                                        >
                                            <option value="all" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Any Dimensions</option>
                                            <option value="12.5x50" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">12.5' x 50' (625 sqft)</option>
                                            <option value="15x60" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">15' x 60' (900 sqft standard)</option>
                                            <option value="20x60" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">20' x 60' (1,200 sqft)</option>
                                            <option value="25x50" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">25' x 50' (1,250 sqft)</option>
                                            <option value="40x60" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">40' x 60' (2,400 sqft house)</option>
                                        </select>
                                        <label className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-zinc-400 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={dimTolerance}
                                                onChange={(e) => setDimTolerance(e.target.checked)}
                                                className="rounded border-slate-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                                            />
                                            <span>{t('filter_dim_tolerance')}</span>
                                        </label>
                                        {targetSqft > 0 && dimTolerance && (
                                            <div className="mt-1.5 text-[10px] text-blue-800 dark:text-blue-300 font-medium">
                                                Matching: {sqftLower} – {sqftUpper} sqft
                                            </div>
                                        )}
                                    </div>

                                    {/* Floor Level Filter */}
                                    <div className="rounded-xl border border-slate-200 dark:border-zinc-700/80 bg-slate-50/70 dark:bg-zinc-800/60 p-3.5">
                                        <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">
                                            {t('filter_floor_level')}
                                        </label>
                                        <select
                                            value={floorLevel}
                                            onChange={(e) => setFloorLevel(e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 focus:border-emerald-500 focus:ring-emerald-500"
                                        >
                                            <option value="all" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">{t('filter_all_floors')}</option>
                                            <option value="ground" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Ground Floor [မြေညီထပ်]</option>
                                            <option value="mezzanine" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Mezzanine [မှန်ခန်း]</option>
                                            <option value="1st" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">1st Floor [၁ လွှာ]</option>
                                            <option value="2nd" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">2nd Floor [၂ လွှာ]</option>
                                            <option value="3rd" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">3rd Floor [၃ လွှာ]</option>
                                            <option value="4th" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">4th Floor [၄ လွှာ]</option>
                                            <option value="5th" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">5th Floor [၅ လွှာ]</option>
                                            <option value="6th" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">6th Floor [၆ လွှာ]</option>
                                            <option value="whole_house" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Whole House [လုံးချင်းအိမ်]</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Facility Specifics Row */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                    {/* Toilet Type */}
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                                            {t('filter_toilet')}
                                        </label>
                                        <select
                                            value={toiletType}
                                            onChange={(e) => setToiletType(e.target.value)}
                                            className="w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100"
                                        >
                                            <option value="all" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Any Toilet</option>
                                            <option value="western" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Western Sitting [ဘိုထိုင်]</option>
                                            <option value="squat" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Squat [ရိုးရိုး]</option>
                                            <option value="both" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Both</option>
                                        </select>
                                    </div>

                                    {/* Aircon */}
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                                            {t('filter_aircon')}
                                        </label>
                                        <select
                                            value={minAircon}
                                            onChange={(e) => setMinAircon(e.target.value)}
                                            className="w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100"
                                        >
                                            <option value="" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Any Aircon</option>
                                            <option value="1" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">1+ Aircons</option>
                                            <option value="2" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">2+ Aircons</option>
                                            <option value="3" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">3+ Aircons</option>
                                        </select>
                                    </div>

                                    {/* Flooring */}
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                                            {t('filter_flooring')}
                                        </label>
                                        <select
                                            value={flooringType}
                                            onChange={(e) => setFlooringType(e.target.value)}
                                            className="w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100"
                                        >
                                            <option value="all" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Any Flooring</option>
                                            <option value="parquet" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Parquet [ပါကေး]</option>
                                            <option value="tiles" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Tiles [ကြွေပြား]</option>
                                            <option value="vinyl" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Korean Vinyl [ကိုရီးယားပါကေး]</option>
                                        </select>
                                    </div>

                                    {/* Amenities */}
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                                            {t('filter_amenities')}
                                        </label>
                                        <select
                                            value={amenity}
                                            onChange={(e) => setAmenity(e.target.value)}
                                            className="w-full rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100"
                                        >
                                            <option value="all" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Any Amenities</option>
                                            <option value="lift" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Elevator / Lift [ဓာတ်လှေကား]</option>
                                            <option value="generator" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Generator [မီးစက်]</option>
                                            <option value="car_parking" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Car Parking [ကားပါကင်]</option>
                                            <option value="water_heater" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Water Heater [ရေပူစက်]</option>
                                            <option value="own_meter" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Own Meter [ကိုယ်ပိုင်မီတာ]</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200"
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        <span>{t('btn_reset_filters')}</span>
                                    </button>

                                    <button
                                        type="submit"
                                        className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm transition"
                                    >
                                        {t('btn_apply_filters')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* 2. Active Tolerance Pills Feedback */}
                {(numPrice > 0 || targetSqft > 0) && (
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        {numPrice > 0 && priceTolerance && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                Budget Range: {priceLower.toLocaleString()} – {priceUpper.toLocaleString()} Ks (±15% of {numPrice.toLocaleString()} Ks)
                            </span>
                        )}
                        {targetSqft > 0 && dimTolerance && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 font-semibold text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                <Layers className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                Area Match: {sqftLower} – {sqftUpper} sqft (±15% of {targetSqft} sqft)
                            </span>
                        )}
                    </div>
                )}

                {/* 3. Property Cards Grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.data?.length === 0 ? (
                        <div className="col-span-full py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500">
                                <Building2 className="h-7 w-7" />
                            </div>
                            <h4 className="mt-4 text-base font-bold text-slate-800 dark:text-zinc-200">{t('no_properties_found')}</h4>
                            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                Try widening your budget tolerance or resetting filters.
                            </p>
                            <button
                                onClick={handleReset}
                                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-zinc-200 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-700"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        properties.data.map((prop) => (
                            <div
                                key={prop.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs transition hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700"
                            >
                                <div>
                                    {/* Property Image Banner */}
                                    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                                        {prop.images && prop.images[0] ? (
                                            <img
                                                src={`/storage/${prop.images[0]}`}
                                                alt={prop.title}
                                                className="h-full w-full object-cover transition group-hover:scale-105 duration-300"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-slate-500">
                                                <Building2 className="h-10 w-10" />
                                            </div>
                                        )}

                                        {/* Status & Type Badges */}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                            <span className="rounded-lg bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white uppercase">
                                                {prop.listing_type === 'rent' ? t('filter_rent') : t('filter_sale')}
                                            </span>
                                            <span className="rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white uppercase">
                                                {prop.property_type}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-3 right-3 rounded-lg bg-black/70 backdrop-blur-sm px-2 py-1 text-[11px] font-bold text-white font-mono">
                                            {prop.width_ft}' x {prop.length_ft}' ({prop.area_sqft} sqft)
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                                            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-zinc-300">
                                                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                {getTownshipName(prop.township, lang)}, Yangon
                                            </span>
                                            <span className="capitalize font-medium text-slate-600 dark:text-zinc-400">
                                                {prop.floor_level} Floor
                                            </span>
                                        </div>

                                        <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                                            {prop.title}
                                        </h3>

                                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-600 dark:text-zinc-400">
                                            <span>{prop.bedrooms} Bed</span>
                                            <span>•</span>
                                            <span>{prop.bathrooms} Bath</span>
                                            <span>•</span>
                                            <span className="capitalize text-emerald-700 dark:text-emerald-400 font-medium">
                                                {prop.toilet_type} Toilet
                                            </span>
                                        </div>

                                        {/* Amenities preview */}
                                        {prop.amenities && prop.amenities.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1">
                                                {prop.amenities.slice(0, 3).map((am, i) => (
                                                    <span
                                                        key={i}
                                                        className="rounded-md bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-zinc-300 capitalize"
                                                    >
                                                        {am.replace('_', ' ')}
                                                    </span>
                                                ))}
                                                {prop.amenities.length > 3 && (
                                                    <span className="text-[10px] text-slate-400">
                                                        +{prop.amenities.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card Footer: Price & Direct CTA */}
                                <div className="border-t border-slate-100 dark:border-zinc-800/80 px-5 py-4 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                                            {prop.listing_type === 'rent' ? 'Direct Rent' : 'Owner Price'}
                                        </div>
                                        <div className="text-lg font-black text-slate-900 dark:text-white">
                                            {Number(prop.price).toLocaleString()}{' '}
                                            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                                                Ks {prop.listing_type === 'rent' && '/ mo'}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        href={route('properties.show', prop.slug)}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>View</span>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {properties.links && properties.links.length > 3 && (
                    <div className="mt-8 flex justify-center gap-1">
                        {properties.links.map((link, idx) => (
                            <button
                                key={idx}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                                    link.active
                                        ? 'bg-emerald-600 text-white font-bold'
                                        : 'bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
