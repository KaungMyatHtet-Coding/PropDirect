import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { YANGON_TOWNSHIPS, getTownshipName } from '@/utils/yangonTownships';
import { normalizeToUnicode } from '@/utils/myanmarFontTools';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    Building2,
    SlidersHorizontal,
    MapPin,
    ShieldCheck,
    CheckCircle2,
    DollarSign,
    Layers,
    Sparkles,
    Eye,
    RotateCcw,
    X,
    Filter,
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
        if (e) e.preventDefault();
        router.get(
            route('properties.index'),
            {
                search: normalizeToUnicode(search),
                listing_type: listingType,
                property_type: propertyType,
                township,
                floor_level: floorLevel,
                target_price: targetPrice || undefined,
                price_tolerance: priceTolerance ? 1 : 0,
                dimension_preset: dimensionPreset,
                dim_tolerance: dimTolerance ? 1 : 0,
                toilet_type: toiletType,
                min_aircon: minAircon || undefined,
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

    // Calculate tolerance bounds for user feedback
    const numPrice = Number(targetPrice) || 0;
    const priceLower = numPrice > 0 ? Math.round(numPrice * 0.85) : 0;
    const priceUpper = numPrice > 0 ? Math.round(numPrice * 1.15) : 0;

    let targetSqft = 0;
    if (dimensionPreset === '12.5x50') targetSqft = 625;
    else if (dimensionPreset === '15x60') targetSqft = 900;
    else if (dimensionPreset === '20x60') targetSqft = 1200;
    else if (dimensionPreset === '25x50') targetSqft = 1250;
    else if (dimensionPreset === '40x60') targetSqft = 2400;

    const sqftLower = targetSqft > 0 ? Math.round(targetSqft * 0.85) : 0;
    const sqftUpper = targetSqft > 0 ? Math.round(targetSqft * 1.15) : 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                {t('properties_title')}
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                0% Broker Fee
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{t('properties_subtitle')}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                        <span>{properties.total || 0} {t('results_count')}</span>
                    </div>
                </div>
            }
        >
            <Head title="Browse Properties - PropDirect" />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* 1. Primary Search & Quick Filters Bar */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <form onSubmit={handleSearchSubmit} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={t('search_placeholder')}
                                    className="w-full pl-10 rounded-xl border-slate-300 text-xs focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Listing Type Pills */}
                            <div className="flex rounded-xl bg-slate-100 p-1 shrink-0">
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
                                                ? 'bg-white text-slate-900 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
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
                                    className="w-full rounded-xl border-slate-300 text-xs focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="all">{t('filter_all_townships')}</option>
                                    {YANGON_TOWNSHIPS.map((t) => (
                                        <option key={t.id} value={t.en}>
                                            {lang === 'mm' ? `${t.mm} (${t.en})` : `${t.en} [${t.mm}]`}
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
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
                                <span>{lang === 'mm' ? 'အထူးစစ်ဆေးမှုများ (±၁၅%)' : 'Smart Filters (±15%)'}</span>
                            </button>

                            <button
                                type="submit"
                                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shrink-0"
                            >
                                {lang === 'mm' ? 'ရှာမည်' : 'Search'}
                            </button>
                        </div>

                        {/* Expandable Advanced Smart Range Filters */}
                        {showFilters && (
                            <div className="pt-4 border-t border-slate-100 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Smart Price Filter (±15% Tolerance) */}
                                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-slate-800">
                                                {t('filter_price_budget')}
                                            </label>
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                                ±15% Smart Match
                                            </span>
                                        </div>
                                        <input
                                            type="number"
                                            step="10000"
                                            value={targetPrice}
                                            onChange={(e) => setTargetPrice(e.target.value)}
                                            placeholder="e.g. 400000"
                                            className="mt-1.5 w-full rounded-lg border-slate-300 text-xs font-mono font-bold text-emerald-700"
                                        />
                                        <label className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={priceTolerance}
                                                onChange={(e) => setPriceTolerance(e.target.checked)}
                                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                                            />
                                            <span>{t('filter_price_tolerance')}</span>
                                        </label>
                                        {numPrice > 0 && priceTolerance && (
                                            <div className="mt-1.5 text-[10px] text-emerald-800 font-medium">
                                                Matching: {priceLower.toLocaleString()} Ks – {priceUpper.toLocaleString()} Ks
                                            </div>
                                        )}
                                    </div>

                                    {/* Smart Dimension Filter (±15% sqft Tolerance) */}
                                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-slate-800">
                                                {t('filter_dimensions')}
                                            </label>
                                            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                                                Yangon Standards
                                            </span>
                                        </div>
                                        <select
                                            value={dimensionPreset}
                                            onChange={(e) => setDimensionPreset(e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border-slate-300 text-xs focus:border-emerald-500 focus:ring-emerald-500"
                                        >
                                            <option value="all">Any Dimensions</option>
                                            <option value="12.5x50">12.5' x 50' (625 sqft)</option>
                                            <option value="15x60">15' x 60' (900 sqft standard)</option>
                                            <option value="20x60">20' x 60' (1,200 sqft)</option>
                                            <option value="25x50">25' x 50' (1,250 sqft)</option>
                                            <option value="40x60">40' x 60' (2,400 sqft house)</option>
                                        </select>
                                        <label className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={dimTolerance}
                                                onChange={(e) => setDimTolerance(e.target.checked)}
                                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                                            />
                                            <span>{t('filter_dim_tolerance')}</span>
                                        </label>
                                        {targetSqft > 0 && dimTolerance && (
                                            <div className="mt-1.5 text-[10px] text-blue-800 font-medium">
                                                Matching: {sqftLower} – {sqftUpper} sqft
                                            </div>
                                        )}
                                    </div>

                                    {/* Floor Level Filter */}
                                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                                        <label className="text-xs font-bold text-slate-800 block">
                                            {t('filter_floor_level')}
                                        </label>
                                        <select
                                            value={floorLevel}
                                            onChange={(e) => setFloorLevel(e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border-slate-300 text-xs focus:border-emerald-500 focus:ring-emerald-500"
                                        >
                                            <option value="all">{t('filter_all_floors')}</option>
                                            <option value="ground">Ground Floor [မြေညီထပ်]</option>
                                            <option value="mezzanine">Mezzanine [မှန်ခန်း]</option>
                                            <option value="1st">1st Floor [၁ လွှာ]</option>
                                            <option value="2nd">2nd Floor [၂ လွှာ]</option>
                                            <option value="3rd">3rd Floor [၃ လွှာ]</option>
                                            <option value="4th">4th Floor [၄ လွှာ]</option>
                                            <option value="5th">5th Floor [၅ လွှာ]</option>
                                            <option value="6th">6th Floor [၆ လွှာ]</option>
                                            <option value="whole_house">Whole House [လုံးချင်းအိမ်]</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Facility Specifics Row */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                    {/* Toilet Type */}
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                            {t('filter_toilet')}
                                        </label>
                                        <select
                                            value={toiletType}
                                            onChange={(e) => setToiletType(e.target.value)}
                                            className="w-full rounded-lg border-slate-300 text-xs"
                                        >
                                            <option value="all">Any Toilet</option>
                                            <option value="western">Western Sitting [ဘိုထိုင်]</option>
                                            <option value="squat">Squat [ရိုးရိုး]</option>
                                            <option value="both">Both</option>
                                        </select>
                                    </div>

                                    {/* Aircon */}
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                            {t('filter_aircon')}
                                        </label>
                                        <select
                                            value={minAircon}
                                            onChange={(e) => setMinAircon(e.target.value)}
                                            className="w-full rounded-lg border-slate-300 text-xs"
                                        >
                                            <option value="">Any Aircon</option>
                                            <option value="1">1+ Aircons</option>
                                            <option value="2">2+ Aircons</option>
                                            <option value="3">3+ Aircons</option>
                                        </select>
                                    </div>

                                    {/* Flooring */}
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                            {t('filter_flooring')}
                                        </label>
                                        <select
                                            value={flooringType}
                                            onChange={(e) => setFlooringType(e.target.value)}
                                            className="w-full rounded-lg border-slate-300 text-xs"
                                        >
                                            <option value="all">Any Flooring</option>
                                            <option value="parquet">Parquet [ပါကေး]</option>
                                            <option value="tiles">Tiles [ကြွေပြား]</option>
                                            <option value="vinyl">Korean Vinyl [ကိုရီးယားပါကေး]</option>
                                        </select>
                                    </div>

                                    {/* Amenities */}
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                            {t('filter_amenities')}
                                        </label>
                                        <select
                                            value={amenity}
                                            onChange={(e) => setAmenity(e.target.value)}
                                            className="w-full rounded-lg border-slate-300 text-xs"
                                        >
                                            <option value="all">Any Amenities</option>
                                            <option value="lift">Elevator / Lift [ဓာတ်လှေကား]</option>
                                            <option value="generator">Generator [မီးစက်]</option>
                                            <option value="car_parking">Car Parking [ကားပါကင်]</option>
                                            <option value="water_heater">Water Heater [ရေပူစက်]</option>
                                            <option value="own_meter">Own Meter [ကိုယ်ပိုင်မီတာ]</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        <span>{t('btn_reset_filters')}</span>
                                    </button>

                                    <button
                                        type="submit"
                                        className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition"
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
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-800 border border-emerald-200">
                                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                                Budget Range: {priceLower.toLocaleString()} – {priceUpper.toLocaleString()} Ks (±15% of {numPrice.toLocaleString()} Ks)
                            </span>
                        )}
                        {targetSqft > 0 && dimTolerance && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-800 border border-blue-200">
                                <Layers className="h-3.5 w-3.5 text-blue-600" />
                                Area Match: {sqftLower} – {sqftUpper} sqft (±15% of {targetSqft} sqft)
                            </span>
                        )}
                    </div>
                )}

                {/* 3. Property Cards Grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.data?.length === 0 ? (
                        <div className="col-span-full py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <Building2 className="h-7 w-7" />
                            </div>
                            <h4 className="mt-4 text-base font-bold text-slate-800">{t('no_properties_found')}</h4>
                            <p className="mt-1 text-xs text-slate-500">
                                Try widening your budget tolerance or resetting filters.
                            </p>
                            <button
                                onClick={handleReset}
                                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        properties.data.map((prop) => (
                            <div
                                key={prop.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:border-slate-300"
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

                                        <div className="absolute bottom-3 right-3 rounded-lg bg-black/70 backdrop-blur-sm px-2 py-1 text-[11px] font-bold text-white">
                                            {prop.width_ft}' x {prop.length_ft}' ({prop.area_sqft} sqft)
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span className="flex items-center gap-1 font-semibold text-slate-700">
                                                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                {getTownshipName(prop.township, lang)}, Yangon
                                            </span>
                                            <span className="capitalize font-medium text-slate-600">
                                                {prop.floor_level} Floor
                                            </span>
                                        </div>

                                        <h3 className="mt-2 text-base font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition">
                                            {prop.title}
                                        </h3>

                                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
                                            <span>{prop.bedrooms} Bed</span>
                                            <span>•</span>
                                            <span>{prop.bathrooms} Bath</span>
                                            <span>•</span>
                                            <span className="capitalize text-emerald-700 font-medium">
                                                {prop.toilet_type} Toilet
                                            </span>
                                        </div>

                                        {/* Amenities Preview */}
                                        {prop.amenities && prop.amenities.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                {prop.amenities.slice(0, 3).map((am, i) => (
                                                    <span
                                                        key={i}
                                                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 capitalize"
                                                    >
                                                        {am.replace('_', ' ')}
                                                    </span>
                                                ))}
                                                {prop.amenities.length > 3 && (
                                                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                                                        +{prop.amenities.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Price & Action Footer */}
                                <div className="border-t border-slate-100 bg-slate-50/60 p-5 flex items-center justify-between">
                                    <div>
                                        <span className="text-[11px] text-slate-400 uppercase font-semibold">
                                            {prop.listing_type === 'rent' ? 'Monthly Rent' : 'Total Price'}
                                        </span>
                                        <div className="text-lg font-black text-slate-900">
                                            {Number(prop.price).toLocaleString()} Ks
                                            {prop.listing_type === 'rent' && (
                                                <span className="text-xs font-normal text-slate-500">/mo</span>
                                            )}
                                        </div>
                                    </div>

                                    <Link
                                        href={route('properties.show', prop.slug)}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>View Details</span>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {properties.links && properties.links.length > 3 && (
                    <div className="mt-8 flex items-center justify-center gap-1">
                        {properties.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                preserveState
                                className={`rounded-xl px-3.5 py-2 text-xs font-bold ${
                                    link.active
                                        ? 'bg-emerald-600 text-white'
                                        : link.url
                                        ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                        : 'text-slate-300 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
