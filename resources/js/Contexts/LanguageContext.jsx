import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

const translations = {
    en: {
        // Nav
        nav_dashboard: 'Dashboard',
        nav_properties: 'Browse Properties',
        nav_lawyers: 'Verified Lawyers',
        nav_become_owner: 'Become Verified Owner',
        nav_owner_kyc: 'Owner KYC Status',
        nav_admin_kyc: 'Admin KYC Panel',
        nav_admin_lawyers: 'Admin Lawyers Queue',
        nav_my_properties: 'My Properties',
        nav_profile: 'Profile Settings',
        nav_logout: 'Log Out',
        nav_login: 'Log In',
        nav_register: 'Get Started',

        // Role Badges
        role_admin: 'Admin',
        role_owner: 'Verified Owner ✓',
        role_seeker: 'Property Seeker',
        role_lawyer: 'Verified Lawyer ⚖️',

        // Profile Completion
        profile_incomplete_title: 'Profile Incomplete - Verification Required',
        profile_incomplete_desc:
            'Please upload your real face photo and complete your occupation, phone, and address to request property viewings or apply as an Owner/Lawyer.',
        profile_complete_btn: 'Complete Profile Now',

        // Properties & Marketplace
        properties_title: 'Direct Yangon Properties',
        properties_subtitle: '100% Direct Owners • Verified Anti-Broker Real Estate',
        search_placeholder: 'Search township, street, building (Zawgyi or Unicode)...',
        filter_listing_type: 'Listing Type',
        filter_all: 'All',
        filter_rent: 'For Rent',
        filter_sale: 'For Sale',
        filter_township: 'Township',
        filter_all_townships: 'All Yangon (33 Townships)',
        filter_floor_level: 'Floor Level',
        filter_all_floors: 'All Floors',
        filter_price_budget: 'Target Price / Budget (MMK)',
        filter_price_tolerance: 'Include nearby prices (±15%)',
        filter_dimensions: 'Size / Dimensions (Yangon Standards)',
        filter_dim_tolerance: 'Include similar sizes (±15% sqft)',
        filter_facilities: 'Facilities & Interior',
        filter_toilet: 'Toilet Type',
        filter_aircon: 'Aircon Count',
        filter_flooring: 'Flooring',
        filter_amenities: 'Key Amenities',
        btn_apply_filters: 'Apply Filters',
        btn_reset_filters: 'Reset Filters',
        results_count: 'properties found',
        no_properties_found: 'No properties match your current filters.',

        // Property Details
        specs_dimensions: 'Dimensions',
        specs_area: 'Total Area',
        specs_floor: 'Floor Level',
        specs_bedrooms: 'Bedrooms',
        specs_bathrooms: 'Bathrooms',
        specs_toilet: 'Toilet Type',
        specs_aircons: 'Air Conditioners',
        specs_flooring: 'Flooring',
        specs_amenities: 'Amenities & Facilities',
        specs_house_rules: 'House Rules',
        specs_ownership: 'Land / Ownership Document',
        specs_terms: 'Rental Terms',
        security_deposit: 'Security Deposit',
        advance_months: 'Advance Payment',
        min_contract: 'Min Contract',
        owner_phone_masked: '09-XXXXXXX',
        unlock_contact_hint: 'Direct phone number unlocks once your viewing request is accepted.',
        btn_request_viewing: 'Schedule Free Direct Viewing',
        sidebar_legal_help_title: 'Need Legal Safety Check?',
        sidebar_legal_help_desc: 'Connect with a Bar Council Certified Lawyer to verify ownership grant or draft standard sale/lease contracts.',
        sidebar_view_lawyers: 'Browse Verified Lawyers Directory',

        // Types
        type_apartment: 'Apartment',
        type_condo: 'Condo',
        type_house: 'Whole House',
        type_office: 'Office Space',
        type_shop: 'Shop / Retail',

        // Floors
        floor_ground: 'Ground Floor',
        floor_mezzanine: 'Mezzanine',
        floor_1st: '1st Floor',
        floor_2nd: '2nd Floor',
        floor_3rd: '3rd Floor',
        floor_4th: '4th Floor',
        floor_5th: '5th Floor',
        floor_6th: '6th Floor',
        floor_7th: '7th Floor',
        floor_8th: '8th Floor',
        floor_penthouse: 'Penthouse',
        floor_whole_house: 'Whole House',

        // Toilets
        toilet_western: 'Western (Sitting)',
        toilet_squat: 'Squat',
        toilet_both: 'Both Western & Squat',

        // Flooring
        flooring_parquet: 'Parquet',
        flooring_tiles: 'Tiles',
        flooring_vinyl: 'Vinyl (Korean)',
        flooring_cement_wood: 'Cement / Wood',

        // Amenities
        amenity_lift: 'Elevator / Lift',
        amenity_generator: 'Backup Generator',
        amenity_car_parking: 'Car Parking',
        amenity_water_heater: 'Water Heater',
        amenity_furniture: 'Furnished',
        amenity_own_meter: 'Private YESC Meter',

        // House rules
        rule_no_pets: 'No Pets Allowed',
        rule_family_only: 'Family Tenants Only',
        rule_no_sublease: 'No Subleasing',

        // Ownership
        own_bcc_ready: 'BCC Approved (BCC ကျပြီး)',
        own_grant_60_years: '60-Year Grant (နှစ် ၆၀ ဂရန်)',
        own_freehold: 'Freehold Land (ဘိုးဘွားပိုင်)',
        own_permit: 'Township Permit (ပါမစ်မြေ)',
    },

    mm: {
        // Nav
        nav_dashboard: 'ပင်မဒက်ရှ်ဘုတ်',
        nav_properties: 'အိမ်ခြံမြေ ရှာဖွေရန်',
        nav_lawyers: 'အသိအမှတ်ပြု ရှေ့နေများ',
        nav_become_owner: 'တိုက်ရိုက်ပိုင်ရှင် လျှောက်ထားရန်',
        nav_owner_kyc: 'ပိုင်ရှင်စိစစ်မှု အခြေအနေ',
        nav_admin_kyc: 'အက်ဒမင် KYC စိစစ်ရေး',
        nav_admin_lawyers: 'ရှေ့နေလျှောက်လွှာများ',
        nav_my_properties: 'မိမိ၏ အိမ်ခြံမြေများ',
        nav_profile: 'ပရိုဖိုင် ပြင်ဆင်ရန်',
        nav_logout: 'အကောင့်ထွက်ရန်',
        nav_login: 'အကောင့်ဝင်ရန်',
        nav_register: 'အကောင့်ဖွင့်ရန်',

        // Role Badges
        role_admin: 'အက်ဒမင်',
        role_owner: 'အတည်ပြုပြီးပိုင်ရှင် ✓',
        role_seeker: 'အိမ်ရှာဖွေသူ',
        role_lawyer: 'တရားဝင်ရှေ့နေ ⚖️',

        // Profile Completion
        profile_incomplete_title: 'ပရိုဖိုင် မပြည့်စုံသေးပါ - မျက်နှာဓာတ်ပုံ လိုအပ်ပါသည်',
        profile_incomplete_desc:
            'အိမ်ကြည့်ရှုခွင့်တောင်းဆိုရန် သို့မဟုတ် ပိုင်ရှင်/ရှေ့နေ လျှောက်ထားရန်အတွက် သင့်မျက်နှာဓာတ်ပုံ၊ အလုပ်အကိုင်၊ ဖုန်းနံပါတ်နှင့် လက်ရှိလိပ်စာကို ဖြည့်စွက်ပေးပါ။',
        profile_complete_btn: 'ပရိုဖိုင် အခုဖြည့်စွက်မည်',

        // Properties & Marketplace
        properties_title: 'ရန်ကုန် တိုက်ရိုက်အိမ်ခြံမြေများ',
        properties_subtitle: 'ပွဲစားကော်မရှင်လုံးဝမယူ • တိုက်ရိုက်ပိုင်ရှင်များသာဖြစ်သည်',
        search_placeholder: 'မြို့နယ်၊ လမ်း၊ တိုက်ခန်း ရှာဖွေပါ (ဇော်ဂျီ သို့ ယူနီကုဒ်)...',
        filter_listing_type: 'အရောင်း/အငှား',
        filter_all: 'အားလုံး',
        filter_rent: 'အငှား',
        filter_sale: 'အရောင်း',
        filter_township: 'မြို့နယ်',
        filter_all_townships: 'ရန်ကုန်မြို့နယ် ၃၃ ခုလုံး',
        filter_floor_level: 'အလွှာ',
        filter_all_floors: 'အလွှာအားလုံး',
        filter_price_budget: 'မျှော်မှန်းစျေးနှုန်း / ဘတ်ဂျက် (ကျပ်)',
        filter_price_tolerance: 'အနီးစပ်ဆုံးစျေးနှုန်းများ ထည့်သွင်းမည် (±၁၅%)',
        filter_dimensions: 'အကျယ်အဝန်း / အတိုင်းအတာ (ရန်ကုန်စံနှုန်း)',
        filter_dim_tolerance: 'အနီးစပ်ဆုံး အကျယ်အဝန်းများ ထည့်သွင်းမည် (±၁၅%)',
        filter_facilities: 'အခန်းတွင်း အပြင်အဆင်',
        filter_toilet: 'အိမ်သာအမျိုးအစား',
        filter_aircon: 'အဲကွန်း အရေအတွက်',
        filter_flooring: 'ကြမ်းခင်းအမျိုးအစား',
        filter_amenities: 'ပါဝင်သော အထောက်အပံ့များ',
        btn_apply_filters: 'ရှာဖွေမှု အတည်ပြုရန်',
        btn_reset_filters: 'မူလအတိုင်း ပြန်ထားရန်',
        results_count: 'ခု တွေ့ရှိပါသည်',
        no_properties_found: 'သတ်မှတ်ထားသော စံနှုန်းများနှင့် ကိုက်ညီသည့် အိမ်ခြံမြေ မရှိသေးပါ။',

        // Property Details
        specs_dimensions: 'အတိုင်းအတာ',
        specs_area: 'စတုရန်းပေ စုစုပေါင်း',
        specs_floor: 'အလွှာ',
        specs_bedrooms: 'အိပ်ခန်း',
        specs_bathrooms: 'ရေချိုးခန်း',
        specs_toilet: 'အိမ်သာ',
        specs_aircons: 'အဲကွန်း',
        specs_flooring: 'ကြမ်းခင်း',
        specs_amenities: 'အထောက်အကူပြု ပစ္စည်းများ',
        specs_house_rules: 'အိမ်စည်းကမ်းချက်များ',
        specs_ownership: 'ပိုင်ဆိုင်မှု စာရွက်စာတမ်း',
        specs_terms: 'ငှားရမ်းမှု သဘောတူညီချက်များ',
        security_deposit: 'စပေါ်ငွေ',
        advance_months: 'ကြိုတင်ငွေ',
        min_contract: 'အနည်းဆုံးချုပ်ရမည့်ကာလ',
        owner_phone_masked: '၀၉-XXXXXXX',
        unlock_contact_hint: 'အိမ်ကြည့်ခွင့်ကို ပိုင်ရှင်က လက်ခံပြီးပါက တိုက်ရိုက်ဖုန်းနံပါတ်ကို ကြည့်ရှုနိုင်ပါမည်။',
        btn_request_viewing: 'အခမဲ့ အိမ်တိုက်ရိုက် ကြည့်ရှုခွင့်တောင်းဆိုမည်',
        sidebar_legal_help_title: 'ဥပဒေရေးရာ စစ်ဆေးလိုပါသလား?',
        sidebar_legal_help_desc: 'ဂရန်စာချုပ်စစ်ဆေးခြင်းနှင့် အရောင်းအဝယ်/အငှားစာချုပ်များအတွက် တရားလွှတ်တော်ရှေ့နေများနှင့် ဆွေးနွေးနိုင်ပါသည်။',
        sidebar_view_lawyers: 'အသိအမှတ်ပြု ရှေ့နေများစာရင်း ကြည့်မည်',

        // Types
        type_apartment: 'တိုက်ခန်း',
        type_condo: 'ကွန်ဒို',
        type_house: 'လုံးချင်းအိမ်',
        type_office: 'ရုံးခန်း',
        type_shop: 'ဆိုင်ခန်း',

        // Floors
        floor_ground: 'မြေညီထပ်',
        floor_mezzanine: 'မှန်ခန်း',
        floor_1st: '၁ လွှာ',
        floor_2nd: '၂ လွှာ',
        floor_3rd: '၃ လွှာ',
        floor_4th: '၄ လွှာ',
        floor_5th: '၅ လွှာ',
        floor_6th: '၆ လွှာ',
        floor_7th: '၇ လွှာ',
        floor_8th: '၈ လွှာ',
        floor_penthouse: 'ခေါင်မိုးထပ် (Penthouse)',
        floor_whole_house: 'လုံးချင်းအိမ်',

        // Toilets
        toilet_western: 'ဘိုထိုင်',
        toilet_squat: 'ရိုးရိုး',
        toilet_both: 'ဘိုထိုင် + ရိုးရိုး နှစ်မျိုးလုံး',

        // Flooring
        flooring_parquet: 'ပါကေး',
        flooring_tiles: 'ကြွေပြား',
        flooring_vinyl: 'ကိုရီးယားပါကေး (Vinyl)',
        flooring_cement_wood: 'ရိုးရိုးဘိလပ်မြေ/သစ်သား',

        // Amenities
        amenity_lift: 'ဓာတ်လှေကား',
        amenity_generator: 'မီးစက်ပါဝင်သည်',
        amenity_car_parking: 'ကားပါကင်',
        amenity_water_heater: 'ရေပူစက်',
        amenity_furniture: 'ပရိဘောဂ အစုံပါဝင်',
        amenity_own_meter: 'ကိုယ်ပိုင်မီတာ',

        // House rules
        rule_no_pets: 'အိမ်မွေးတိရစ္ဆာန် မမွေးရ',
        rule_family_only: 'မိသားစုသာ ငှားရမ်းမည်',
        rule_no_sublease: 'တစ်ဆင့်ပြန်ငှားခြင်း မပြုရ',

        // Ownership
        own_bcc_ready: 'BCC ကျပြီး',
        own_grant_60_years: 'နှစ် ၆၀ ဂရန်',
        own_freehold: 'ဘိုးဘွားပိုင်မြေ',
        own_permit: 'ပါမစ်မြေ',
    },
};

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('propdirect_lang') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('propdirect_lang', lang);
    }, [lang]);

    const t = (key) => {
        return translations[lang]?.[key] || translations.en[key] || key;
    };

    const toggleLang = () => {
        setLang((prev) => (prev === 'en' ? 'mm' : 'en'));
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
