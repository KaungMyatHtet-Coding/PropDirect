import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useLanguage } from '@/Contexts/LanguageContext';
import { YANGON_TOWNSHIPS } from '@/utils/yangonTownships';
import { normalizeToUnicode, isZawgyi } from '@/utils/myanmarFontTools';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Building2,
    PlusCircle,
    UploadCloud,
    ArrowLeft,
    CheckCircle2,
    ShieldCheck,
    Layers,
    DollarSign,
    Sparkles,
    X,
} from 'lucide-react';

export default function OwnerPropertiesCreate() {
    const { lang, t } = useLanguage();
    const [imagePreviews, setImagePreviews] = useState([]);
    const [autoConvertedNotice, setAutoConvertedNotice] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        listing_type: 'rent',
        property_type: 'apartment',
        price: '',
        security_deposit: '',
        township: 'sanchaung',
        address: '',
        bedrooms: 2,
        bathrooms: 1,
        width_ft: 15,
        length_ft: 60,
        floor_level: '2nd',
        toilet_type: 'western',
        aircon_count: 1,
        flooring_type: 'parquet',
        amenities: ['water_heater', 'own_meter'],
        house_rules: ['no_sublease'],
        min_contract_months: 6,
        advance_payment_months: 1,
        ownership_type: 'bcc_ready',
        images: [],
    });

    const calculatedSqft = Math.round((Number(data.width_ft) || 0) * (Number(data.length_ft) || 0));

    // Handle text blur to auto-convert Zawgyi to Unicode
    const handleTextBlur = (field, value) => {
        if (isZawgyi(value)) {
            const unicode = normalizeToUnicode(value);
            setData(field, unicode);
            setAutoConvertedNotice(true);
        }
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setData('images', files);

        const previews = [];
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                previews.push(event.target.result);
                if (previews.length === files.length) {
                    setImagePreviews([...previews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const toggleArrayItem = (field, item) => {
        const current = [...data[field]];
        const idx = current.indexOf(item);
        if (idx > -1) {
            current.splice(idx, 1);
        } else {
            current.push(item);
        }
        setData(field, current);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('owner.properties.store'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('owner.properties.index')}
                            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 transition"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Post Direct Property Listing
                            </h2>
                            <p className="text-xs text-slate-500">
                                0% Broker Fee • Verified Landlord Direct to Seeker
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Create Property - PropDirect" />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                {autoConvertedNotice && (
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>Zawgyi text was detected and automatically converted to standard Myanmar Unicode.</span>
                        </div>
                        <button onClick={() => setAutoConvertedNotice(false)}>
                            <X className="h-4 w-4 text-emerald-600" />
                        </button>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-8">
                    {/* Section 1: Basic Info */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-emerald-600" />
                            1. Basic Information
                        </h3>

                        <div className="mt-5 space-y-5">
                            <div>
                                <InputLabel htmlFor="title" value="Property Listing Title" />
                                <TextInput
                                    id="title"
                                    className="mt-1 block w-full rounded-xl border-slate-300"
                                    placeholder="e.g. Spacious 2BR Apartment with Lift & Parquet, Sanchaung"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    onBlur={(e) => handleTextBlur('title', e.target.value)}
                                    required
                                />
                                <InputError message={errors.title} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <InputLabel htmlFor="listing_type" value="Listing Purpose" />
                                    <select
                                        id="listing_type"
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        value={data.listing_type}
                                        onChange={(e) => setData('listing_type', e.target.value)}
                                    >
                                        <option value="rent">For Rent (အငှား)</option>
                                        <option value="sale">For Sale (အရောင်း)</option>
                                    </select>
                                </div>

                                <div>
                                    <InputLabel htmlFor="property_type" value="Property Type" />
                                    <select
                                        id="property_type"
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        value={data.property_type}
                                        onChange={(e) => setData('property_type', e.target.value)}
                                    >
                                        <option value="apartment">Apartment (တိုက်ခန်း)</option>
                                        <option value="condo">Condo (ကွန်ဒို)</option>
                                        <option value="house">Whole House (လုံးချင်းအိမ်)</option>
                                        <option value="office">Office (ရုံးခန်း)</option>
                                        <option value="shop">Shop / Commercial (ဆိုင်ခန်း)</option>
                                    </select>
                                </div>

                                <div>
                                    <InputLabel htmlFor="township" value="Township (Yangon)" />
                                    <select
                                        id="township"
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        value={data.township}
                                        onChange={(e) => setData('township', e.target.value)}
                                    >
                                        {YANGON_TOWNSHIPS.map((t) => (
                                            <option key={t.id} value={t.en}>
                                                {lang === 'mm' ? `${t.mm} (${t.en})` : `${t.en} [${t.mm}]`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="address" value="Street Address" />
                                <TextInput
                                    id="address"
                                    className="mt-1 block w-full rounded-xl border-slate-300"
                                    placeholder="e.g. No. 128, Shin Saw Pu Road, Sanchaung"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    onBlur={(e) => handleTextBlur('address', e.target.value)}
                                    required
                                />
                                <InputError message={errors.address} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Full Description" />
                                <textarea
                                    id="description"
                                    rows="4"
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    placeholder="Describe surrounding environment, nearby markets, bus stops, building age, natural lighting..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    onBlur={(e) => handleTextBlur('description', e.target.value)}
                                    required
                                />
                                <InputError message={errors.description} className="mt-1" />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Dimensions & Floor Specs */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <Layers className="h-4 w-4 text-emerald-600" />
                            2. Dimensions, Area & Floor Level
                        </h3>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div>
                                <InputLabel htmlFor="width_ft" value="Width (Feet)" />
                                <TextInput
                                    id="width_ft"
                                    type="number"
                                    step="0.5"
                                    className="mt-1 block w-full rounded-xl border-slate-300 font-mono"
                                    value={data.width_ft}
                                    onChange={(e) => setData('width_ft', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="length_ft" value="Length (Feet)" />
                                <TextInput
                                    id="length_ft"
                                    type="number"
                                    step="0.5"
                                    className="mt-1 block w-full rounded-xl border-slate-300 font-mono"
                                    value={data.length_ft}
                                    onChange={(e) => setData('length_ft', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <InputLabel value="Calculated Area" />
                                <div className="mt-1 flex h-10 items-center rounded-xl bg-slate-50 px-3 font-mono font-bold text-emerald-700 text-sm border border-slate-200">
                                    {calculatedSqft} sqft
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="floor_level" value="Floor Level" />
                                <select
                                    id="floor_level"
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    value={data.floor_level}
                                    onChange={(e) => setData('floor_level', e.target.value)}
                                >
                                    <option value="ground">Ground Floor [မြေညီထပ်]</option>
                                    <option value="mezzanine">Mezzanine [မှန်ခန်း]</option>
                                    <option value="1st">1st Floor [၁ လွှာ]</option>
                                    <option value="2nd">2nd Floor [၂ လွှာ]</option>
                                    <option value="3rd">3rd Floor [၃ လွှာ]</option>
                                    <option value="4th">4th Floor [၄ လွှာ]</option>
                                    <option value="5th">5th Floor [၅ လွှာ]</option>
                                    <option value="6th">6th Floor [၆ လွှာ]</option>
                                    <option value="7th">7th Floor [၇ လွှာ]</option>
                                    <option value="8th">8th Floor [၈ လွှာ]</option>
                                    <option value="penthouse">Penthouse [ခေါင်မိုးထပ်]</option>
                                    <option value="whole_house">Whole House [လုံးချင်းအိမ်]</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="bedrooms" value="Bedrooms Count" />
                                <TextInput
                                    id="bedrooms"
                                    type="number"
                                    min="0"
                                    className="mt-1 block w-full rounded-xl border-slate-300"
                                    value={data.bedrooms}
                                    onChange={(e) => setData('bedrooms', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="bathrooms" value="Bathrooms Count" />
                                <TextInput
                                    id="bathrooms"
                                    type="number"
                                    min="1"
                                    className="mt-1 block w-full rounded-xl border-slate-300"
                                    value={data.bathrooms}
                                    onChange={(e) => setData('bathrooms', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Interior & Facilities */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-emerald-600" />
                            3. Facilities & Interior Specs
                        </h3>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <InputLabel htmlFor="toilet_type" value="Toilet Type (အိမ်သာ)" />
                                <select
                                    id="toilet_type"
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    value={data.toilet_type}
                                    onChange={(e) => setData('toilet_type', e.target.value)}
                                >
                                    <option value="western">Western Sitting [ဘိုထိုင်]</option>
                                    <option value="squat">Squat [ရိုးရိုး]</option>
                                    <option value="both">Both [ဘိုထိုင် + ရိုးရိုး]</option>
                                </select>
                            </div>

                            <div>
                                <InputLabel htmlFor="aircon_count" value="Air Conditioners (အဲကွန်း)" />
                                <TextInput
                                    id="aircon_count"
                                    type="number"
                                    min="0"
                                    className="mt-1 block w-full rounded-xl border-slate-300"
                                    value={data.aircon_count}
                                    onChange={(e) => setData('aircon_count', e.target.value)}
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="flooring_type" value="Flooring Type (ကြမ်းခင်း)" />
                                <select
                                    id="flooring_type"
                                    className="mt-1 block w-full rounded-xl border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    value={data.flooring_type}
                                    onChange={(e) => setData('flooring_type', e.target.value)}
                                >
                                    <option value="parquet">Parquet [ပါကေး]</option>
                                    <option value="tiles">Tiles [ကြွေပြား]</option>
                                    <option value="vinyl">Korean Vinyl [ကိုရီးယားပါကေး]</option>
                                    <option value="cement_wood">Cement / Wood [ရိုးရိုး]</option>
                                </select>
                            </div>
                        </div>

                        {/* Amenities Checkboxes */}
                        <div className="mt-5">
                            <InputLabel value="Key Amenities (ပါဝင်သော အထောက်အပံ့များ)" />
                            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    { id: 'lift', label: 'Elevator / Lift (ဓာတ်လှေကား)' },
                                    { id: 'generator', label: 'Backup Generator (မီးစက်)' },
                                    { id: 'car_parking', label: 'Car Parking (ကားပါကင်)' },
                                    { id: 'water_heater', label: 'Water Heater (ရေပူစက်)' },
                                    { id: 'furniture', label: 'Furnished (ပရိဘောဂပါပြီး)' },
                                    { id: 'own_meter', label: 'Private YESC Meter (ကိုယ်ပိုင်မီတာ)' },
                                ].map((item) => (
                                    <label
                                        key={item.id}
                                        className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold cursor-pointer transition ${
                                            data.amenities.includes(item.id)
                                                ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-500'
                                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            checked={data.amenities.includes(item.id)}
                                            onChange={() => toggleArrayItem('amenities', item.id)}
                                        />
                                        <span>{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Pricing & Lease/Sale Terms */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                            4. Pricing & {data.listing_type === 'rent' ? 'Rental Terms' : 'Sale Ownership Documents'}
                        </h3>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel
                                    htmlFor="price"
                                    value={data.listing_type === 'rent' ? 'Monthly Rent (MMK / ကျပ်)' : 'Sale Price (MMK / ကျပ်)'}
                                />
                                <TextInput
                                    id="price"
                                    type="number"
                                    step="10000"
                                    className="mt-1 block w-full rounded-xl border-slate-300 font-mono text-base font-bold text-emerald-700"
                                    placeholder="e.g. 400000"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    required
                                />
                                <InputError message={errors.price} className="mt-1" />
                            </div>

                            {data.listing_type === 'rent' ? (
                                <div>
                                    <InputLabel htmlFor="security_deposit" value="Security Deposit (စပေါ်ငွေ MMK)" />
                                    <TextInput
                                        id="security_deposit"
                                        type="number"
                                        step="10000"
                                        className="mt-1 block w-full rounded-xl border-slate-300 font-mono"
                                        placeholder="e.g. 400000"
                                        value={data.security_deposit}
                                        onChange={(e) => setData('security_deposit', e.target.value)}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <InputLabel htmlFor="ownership_type" value="Ownership Document Type (ပိုင်ဆိုင်မှု စာရွက်စာတမ်း)" />
                                    <select
                                        id="ownership_type"
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        value={data.ownership_type}
                                        onChange={(e) => setData('ownership_type', e.target.value)}
                                    >
                                        <option value="bcc_ready">BCC Approved [BCC ကျပြီး]</option>
                                        <option value="grant_60_years">60-Year Grant [နှစ် ၆၀ ဂရန်]</option>
                                        <option value="freehold">Freehold Land [ဘိုးဘွားပိုင်မြေ]</option>
                                        <option value="permit">Township Permit [ပါမစ်မြေ]</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {data.listing_type === 'rent' && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="min_contract_months" value="Min Contract Duration (Months)" />
                                    <select
                                        id="min_contract_months"
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-sm"
                                        value={data.min_contract_months}
                                        onChange={(e) => setData('min_contract_months', e.target.value)}
                                    >
                                        <option value="3">3 Months</option>
                                        <option value="6">6 Months (စံနှုန်း)</option>
                                        <option value="12">12 Months (၁ နှစ်)</option>
                                        <option value="24">24 Months (၂ နှစ်)</option>
                                    </select>
                                </div>

                                <div>
                                    <InputLabel htmlFor="advance_payment_months" value="Advance Rent Payment (Months)" />
                                    <select
                                        id="advance_payment_months"
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-sm"
                                        value={data.advance_payment_months}
                                        onChange={(e) => setData('advance_payment_months', e.target.value)}
                                    >
                                        <option value="1">1 Month Advance</option>
                                        <option value="3">3 Months Advance</option>
                                        <option value="6">6 Months Advance</option>
                                        <option value="12">1 Year Advance</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* House rules */}
                        {data.listing_type === 'rent' && (
                            <div className="mt-4">
                                <InputLabel value="House Rules (အိမ်စည်းကမ်းချက်များ)" />
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {[
                                        { id: 'no_pets', label: 'No Pets [အိမ်မွေးတိရစ္ဆာန်မရ]' },
                                        { id: 'family_only', label: 'Family Tenants Only [မိသားစုသာ]' },
                                        { id: 'no_sublease', label: 'No Subleasing [ပြန်ငှားခွင့်မပြု]' },
                                    ].map((rule) => (
                                        <label
                                            key={rule.id}
                                            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold cursor-pointer transition ${
                                                data.house_rules.includes(rule.id)
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                                                    : 'border-slate-200 bg-white text-slate-700'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                checked={data.house_rules.includes(rule.id)}
                                                onChange={() => toggleArrayItem('house_rules', rule.id)}
                                            />
                                            <span>{rule.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 5: Photos */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <UploadCloud className="h-4 w-4 text-emerald-600" />
                            5. Property Photographs
                        </h3>

                        <div className="mt-4">
                            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:bg-slate-100 transition">
                                <UploadCloud className="h-10 w-10 text-slate-400" />
                                <span className="mt-2 text-sm font-semibold text-slate-700">
                                    Upload Multiple Property Photos
                                </span>
                                <span className="text-xs text-slate-500 mt-0.5">
                                    Living room, bedrooms, kitchen, bathroom, building front (PNG/JPG up to 5MB each)
                                </span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImagesChange}
                                    className="mt-4 block text-xs text-slate-500 file:mr-2 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
                                    required
                                />
                            </div>
                            <InputError message={errors.images} className="mt-2" />

                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {imagePreviews.map((src, i) => (
                                        <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                            <img src={src} alt="Upload Preview" className="h-full w-full object-cover" />
                                            <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                                                Photo {i + 1}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Link
                            href={route('owner.properties.index')}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </Link>
                        <PrimaryButton
                            className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-6 py-2.5 text-xs font-bold gap-2"
                            disabled={processing}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {processing ? 'Publishing Listing...' : 'Publish Direct Listing'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
