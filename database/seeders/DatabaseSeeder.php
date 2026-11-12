<?php

namespace Database\Seeders;

use App\Models\LawyerProfile;
use App\Models\OwnerVerification;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ensure storage directories exist
        Storage::disk('public')->makeDirectory('avatars');
        Storage::disk('public')->makeDirectory('lawyers/licenses');
        Storage::disk('public')->makeDirectory('properties');
        Storage::disk('public')->makeDirectory('verifications/nrc');
        Storage::disk('public')->makeDirectory('verifications/utility_bills');

        // Helper to generate a placeholder PNG image
        $createDummyImage = function (string $relativePath, string $title, string $subtitle, string $badge = 'PROPDIRECT VERIFIED', string $bgColorHex = '#1e293b', int $width = 700, int $height = 440) {
            $fullPath = Storage::disk('public')->path($relativePath);
            if (! file_exists($fullPath)) {
                $image = imagecreatetruecolor($width, $height);

                // Convert hex to rgb
                $hex = ltrim($bgColorHex, '#');
                $r = hexdec(substr($hex, 0, 2));
                $g = hexdec(substr($hex, 2, 2));
                $b = hexdec(substr($hex, 4, 2));

                $bg = imagecolorallocate($image, $r, $g, $b);
                $white = imagecolorallocate($image, 255, 255, 255);
                $emerald = imagecolorallocate($image, 16, 185, 129);
                $slate = imagecolorallocate($image, 148, 163, 184);
                $border = imagecolorallocate($image, 51, 65, 85);

                imagefilledrectangle($image, 0, 0, $width, $height, $bg);
                imagerectangle($image, 10, 10, $width - 10, $height - 10, $border);

                // Add header banner
                imagefilledrectangle($image, 10, 10, $width - 10, 50, $border);
                imagestring($image, 4, 25, 20, $badge, $emerald);

                // Title and subtitle
                imagestring($image, 5, 30, 90, substr($title, 0, 48), $white);
                imagestring($image, 4, 30, 130, substr($subtitle, 0, 60), $slate);
                imagestring($image, 3, 30, 180, "PROPDIRECT DIRECT P2P REAL ESTATE PLATFORM", $white);
                imagestring($image, 3, 30, 210, "Generated: " . date('Y-m-d H:i:s'), $slate);
                imagestring($image, 3, 30, 240, "Official Authenticated Portfolio Record", $emerald);
                imagestring($image, 2, 30, $height - 40, "PropDirect Trust & Safety - Direct P2P No Brokerage Commission", $slate);

                imagepng($image, $fullPath);
                imagedestroy($image);
            }
        };

        // Create sample KYC verification images
        $createDummyImage(
            'verifications/nrc/dummy_nrc_seeker.png',
            'NRC CARD (FRONT) - NATIONAL REGISTRATION CARD',
            'Holder: Ko Kyaw Swar | NRC: 12/DAGAMA(N)098765',
            'NRC VERIFICATION PROOF',
            '#0f172a'
        );

        $createDummyImage(
            'verifications/utility_bills/dummy_bill_seeker.png',
            'YESC ELECTRICITY UTILITY BILL & METER RECORD',
            'Account: Daw Hlaing Moe & Ko Kyaw Swar | Township: Dagon, Yangon',
            'YESC UTILITY BILL PROOF',
            '#134e4a'
        );

        $createDummyImage(
            'verifications/nrc/dummy_nrc_owner.png',
            'NRC CARD (FRONT) - VERIFIED OWNER CARD',
            'Holder: Daw Hlaing Moe | NRC: 12/BAHANA(N)112233',
            'NRC VERIFICATION PROOF',
            '#0f172a'
        );

        $createDummyImage(
            'verifications/utility_bills/dummy_bill_owner.png',
            'OFFICIAL ELECTRICITY METER BILL - PROVE OWNERSHIP',
            'Account No: YESC-9923841 | Township: Bahan, Yangon',
            'YESC UTILITY BILL PROOF',
            '#134e4a'
        );

        // Avatars
        $createDummyImage('avatars/dummy_admin.png', 'ADMINISTRATOR AVATAR', 'PropDirect System Operations', 'AUTHENTICATED ADMIN', '#1e1b4b', 400, 400);
        $createDummyImage('avatars/dummy_owner.png', 'DAW HLAING MOE', 'Verified Property Owner', 'AUTHENTICATED OWNER', '#064e3b', 400, 400);
        $createDummyImage('avatars/dummy_seeker.png', 'KO KYAW SWAR', 'Verified Tenant / Seeker', 'REGISTERED SEEKER', '#1e293b', 400, 400);
        $createDummyImage('avatars/dummy_lawyer1.png', 'DAW MYA MYA (ADVOCATE)', 'Bar Council Licensed Advocate', 'VERIFIED LAWYER', '#312e81', 400, 400);
        $createDummyImage('avatars/dummy_lawyer2.png', 'U KYAW SWAR (HGP)', 'Higher Grade Pleader', 'VERIFIED LAWYER', '#3730a3', 400, 400);

        // Lawyer License Cards
        $createDummyImage(
            'lawyers/licenses/dummy_license_lawyer1.png',
            'BAR COUNCIL ADVOCATE LICENSE CARD',
            'License No: ADV-10492/2012 | Name: Daw Mya Mya',
            'OFFICIAL ADVOCATE LICENSE',
            '#1e1b4b'
        );

        $createDummyImage(
            'lawyers/licenses/dummy_license_lawyer2.png',
            'BAR COUNCIL HIGHER GRADE PLEADER LICENSE CARD',
            'License No: HGP-24810/2018 | Name: U Kyaw Swar',
            'OFFICIAL HGP LICENSE',
            '#312e81'
        );

        // Property Photos
        $createDummyImage('properties/sanchaung_apt_1.png', 'Sanchaung 2BR Living Room with Parquet', 'Padonmar Street, Sanchaung, Yangon', 'MODERN SANCHAUNG APARTMENT', '#0f766e');
        $createDummyImage('properties/sanchaung_apt_2.png', 'Sanchaung Master Bedroom & Western Bath', 'Padonmar Street, Sanchaung, Yangon', 'BEDROOM PREVIEW', '#0d9488');
        $createDummyImage('properties/hlaing_apt_1.png', 'Hlaing Cozy Apartment & Kitchen', 'Parami Road, Ward 12, Hlaing, Yangon', 'HLAING APARTMENT', '#1d4ed8');
        $createDummyImage('properties/yankin_condo_1.png', 'Yankin Condo Panoramic Living Space', 'Kanbe Road, Yankin, Yangon', 'LUXURY CONDO', '#4338ca');
        $createDummyImage('properties/yankin_condo_2.png', 'Yankin Condo Master Bedroom & Balcony', 'Kanbe Road, Yankin, Yangon', 'CONDO INTERIOR', '#6366f1');
        $createDummyImage('properties/tamwe_apt_1.png', 'Tamwe 1st Floor Furnished Apartment', 'Kyauk Myaung, Tamwe, Yangon', 'FURNISHED 1ST FLOOR', '#b45309');
        $createDummyImage('properties/s_okkalapa_house_1.png', 'South Okkalapa 2-Storey House & Compound', 'Ward 7, South Okkalapa, Yangon', 'WHOLE HOUSE COMPOUND', '#15803d');
        $createDummyImage('properties/n_dagon_land_1.png', 'North Dagon 40x60 Land & House (60-Yr Grant)', 'Ward 33, North Dagon, Yangon', 'DIRECT OWNER SALE', '#7c2d12');

        // 1. Admin Account
        $admin = User::firstOrCreate(
            ['email' => 'admin@propdirect.com'],
            [
                'name' => 'PropDirect Administrator',
                'phone' => '09999000111',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_verified_owner' => false,
                'avatar' => 'avatars/dummy_admin.png',
                'nrc_number' => '12/BAHANA(N)000001',
                'occupation' => 'Platform System Admin',
                'current_address' => 'No. 12, Kabar Aye Pagoda Road, Bahan Township, Yangon',
                'is_profile_complete' => true,
                'email_verified_at' => now(),
            ]
        );

        // 2. Verified Owner Account
        $owner = User::firstOrCreate(
            ['email' => 'owner@propdirect.com'],
            [
                'name' => 'Daw Hlaing Moe',
                'phone' => '09111222333',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'is_verified_owner' => true,
                'avatar' => 'avatars/dummy_owner.png',
                'nrc_number' => '12/BAHANA(N)112233',
                'occupation' => 'Real Estate Investor & Business Owner',
                'current_address' => 'No. 45, Pearl Condo, Bahan Township, Yangon',
                'is_profile_complete' => true,
                'email_verified_at' => now(),
            ]
        );

        // Verified record for Owner
        OwnerVerification::firstOrCreate(
            ['user_id' => $owner->id],
            [
                'nrc_number' => '12/BAHANA(N)112233',
                'nrc_front_image' => 'verifications/nrc/dummy_nrc_owner.png',
                'utility_bill_image' => 'verifications/utility_bills/dummy_bill_owner.png',
                'status' => 'approved',
                'admin_remark' => 'Verified genuine owner via YESC meter inspection and NRC matching.',
                'reviewed_by' => $admin->id,
                'reviewed_at' => now()->subDays(2),
            ]
        );

        // 3. Unverified Seeker Account with 1 PENDING verification request
        $seeker = User::firstOrCreate(
            ['email' => 'seeker@propdirect.com'],
            [
                'name' => 'Ko Kyaw Swar',
                'phone' => '09444555666',
                'password' => Hash::make('password'),
                'role' => 'seeker',
                'is_verified_owner' => false,
                'avatar' => 'avatars/dummy_seeker.png',
                'nrc_number' => '12/DAGAMA(N)098765',
                'occupation' => 'Senior Software Engineer',
                'current_address' => 'No. 78, Insein Road, Hlaing Township, Yangon',
                'is_profile_complete' => true,
                'email_verified_at' => now(),
            ]
        );

        OwnerVerification::firstOrCreate(
            ['user_id' => $seeker->id],
            [
                'nrc_number' => '12/DAGAMA(N)098765',
                'nrc_front_image' => 'verifications/nrc/dummy_nrc_seeker.png',
                'utility_bill_image' => 'verifications/utility_bills/dummy_bill_seeker.png',
                'status' => 'pending',
                'admin_remark' => null,
                'reviewed_by' => null,
                'reviewed_at' => null,
            ]
        );

        // 4. Verified Lawyer 1: Daw Mya Mya (Advocate)
        $lawyer1 = User::firstOrCreate(
            ['email' => 'lawyer1@propdirect.com'],
            [
                'name' => 'Daw Mya Mya',
                'phone' => '09777888999',
                'password' => Hash::make('password'),
                'role' => 'lawyer',
                'is_verified_owner' => false,
                'avatar' => 'avatars/dummy_lawyer1.png',
                'nrc_number' => '12/LATHA(N)054321',
                'occupation' => 'Advocate (တရားလွှတ်တော်ရှေ့နေ)',
                'current_address' => 'No. 24, Sayar San Road, Bahan Township, Yangon',
                'is_profile_complete' => true,
                'email_verified_at' => now(),
            ]
        );

        LawyerProfile::firstOrCreate(
            ['user_id' => $lawyer1->id],
            [
                'license_number' => 'ADV-10492/2012',
                'lawyer_type' => 'advocate',
                'degree' => 'LL.B, D.B.L (Yangon University)',
                'experience_years' => 12,
                'specialization' => 'Grant Verification, Sale & Lease Contracts, Newspaper Notice, Title Clearance',
                'consultation_fee' => 50000.00,
                'contract_fee' => 150000.00,
                'bio' => 'Over 12 years of specialized legal experience in Yangon real estate contracts, land title verifications, BCC compliance, and cross-party lease agreements. Committed to fast, safe, and transparent property transactions without unneeded broker overhead.',
                'license_card_image' => 'lawyers/licenses/dummy_license_lawyer1.png',
                'office_township' => 'Bahan',
                'status' => 'approved',
                'admin_remark' => 'Bar Council Advocate credentials verified and verified active standing.',
            ]
        );

        // 5. Verified Lawyer 2: U Kyaw Swar (HGP)
        $lawyer2 = User::firstOrCreate(
            ['email' => 'lawyer2@propdirect.com'],
            [
                'name' => 'U Kyaw Swar',
                'phone' => '09888999000',
                'password' => Hash::make('password'),
                'role' => 'lawyer',
                'is_verified_owner' => false,
                'avatar' => 'avatars/dummy_lawyer2.png',
                'nrc_number' => '12/KAMAYA(N)041234',
                'occupation' => 'Higher Grade Pleader (အထက်တန်းရှေ့နေ)',
                'current_address' => 'No. 15, Hledan Center, Kamayut Township, Yangon',
                'is_profile_complete' => true,
                'email_verified_at' => now(),
            ]
        );

        LawyerProfile::firstOrCreate(
            ['user_id' => $lawyer2->id],
            [
                'license_number' => 'HGP-24810/2018',
                'lawyer_type' => 'higher_grade_pleader',
                'degree' => 'LL.B, D.B.L',
                'experience_years' => 6,
                'specialization' => 'BCC Title Check, Rental Agreement Drafting, Power of Attorney, Tenancy Disputes',
                'consultation_fee' => 30000.00,
                'contract_fee' => 80000.00,
                'bio' => 'Dedicated Higher Grade Pleader specializing in Yangon residential rental contracts, tenancy disputes, BCC title verification, and notary services. Friendly and prompt consultation for landlords and tenants.',
                'license_card_image' => 'lawyers/licenses/dummy_license_lawyer2.png',
                'office_township' => 'Kamayut',
                'status' => 'approved',
                'admin_remark' => 'Bar Council HGP license and chamber address verified.',
            ]
        );

        // 6. Realistic Yangon Properties (under Owner Daw Hlaing Moe)
        // 1. Sanchaung Apartment (Rent, 400,000 MMK / 4 Lakh)
        Property::updateOrCreate(
            ['slug' => 'modern-sanchaung-2-bedroom-apartment-lift-generator'],
            [
                'owner_id' => $owner->id,
                'title' => 'Modern Sanchaung 2-Bedroom Apartment with Lift & Generator',
                'description' => 'Bright and airy 2nd floor apartment in Sanchaung near Padonmar Park. Fully decorated with high-grade parquet flooring, 2 inverter air conditioners, western toilet, lift with 24/7 backup generator. Ideal for expats or small families looking for quiet yet central living.',
                'listing_type' => 'rent',
                'property_type' => 'apartment',
                'price' => 400000.00,
                'security_deposit' => 400000.00,
                'township' => 'Sanchaung',
                'city' => 'Yangon',
                'address' => 'Padonmar Street, Sanchaung Township, Yangon',
                'width_ft' => 15.00,
                'length_ft' => 60.00,
                'area_sqft' => 900,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'floor_level' => '2nd',
                'toilet_type' => 'western',
                'aircon_count' => 2,
                'flooring_type' => 'parquet',
                'amenities' => ['lift', 'generator', 'water_heater', 'own_meter', 'furniture'],
                'house_rules' => ['no_pets', 'family_only', 'no_sublease'],
                'min_contract_months' => 6,
                'advance_payment_months' => 3,
                'ownership_type' => 'bcc_ready',
                'status' => 'available',
                'images' => ['properties/sanchaung_apt_1.png', 'properties/sanchaung_apt_2.png'],
            ]
        );

        // 2. Hlaing Apartment (Rent, 350,000 MMK - tests 4 Lakh -12.5% tolerance)
        Property::updateOrCreate(
            ['slug' => 'cozy-hlaing-mict-vicinity-apartment-own-meter'],
            [
                'owner_id' => $owner->id,
                'title' => 'Cozy Hlaing MICT Vicinity Apartment with Own Meter',
                'description' => 'Peaceful 3rd floor apartment near MICT Park and Insein Road. Tiled floors, 1 Daikin aircon, clean western toilet, separate meter and water pump. Walkable to bus stops and supermarkets.',
                'listing_type' => 'rent',
                'property_type' => 'apartment',
                'price' => 350000.00,
                'security_deposit' => 350000.00,
                'township' => 'Hlaing',
                'city' => 'Yangon',
                'address' => 'Parami Road, Ward 12, Hlaing Township, Yangon',
                'width_ft' => 12.50,
                'length_ft' => 50.00,
                'area_sqft' => 625,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'floor_level' => '3rd',
                'toilet_type' => 'western',
                'aircon_count' => 1,
                'flooring_type' => 'tiles',
                'amenities' => ['own_meter', 'water_heater'],
                'house_rules' => ['no_sublease'],
                'min_contract_months' => 6,
                'advance_payment_months' => 1,
                'ownership_type' => 'bcc_ready',
                'status' => 'available',
                'images' => ['properties/hlaing_apt_1.png'],
            ]
        );

        // 3. Yankin Condo (Rent, 450,000 MMK - tests 4 Lakh +12.5% tolerance)
        Property::updateOrCreate(
            ['slug' => 'luxury-yankin-sedona-facing-condo-reserved-parking'],
            [
                'owner_id' => $owner->id,
                'title' => 'Luxury Yankin Sedona-Facing Condo with Reserved Parking',
                'description' => 'High-floor premium condo in heart of Yankin. Panoramic views, dual western and squat bathrooms, master bedroom with en-suite, 3 air conditioners, full teak parquet, 24-hr security, lift, standby generator, and designated underground car parking.',
                'listing_type' => 'rent',
                'property_type' => 'condo',
                'price' => 450000.00,
                'security_deposit' => 900000.00,
                'township' => 'Yankin',
                'city' => 'Yangon',
                'address' => 'Kanbe Road, Yankin Township, Yangon',
                'width_ft' => 20.00,
                'length_ft' => 60.00,
                'area_sqft' => 1200,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'floor_level' => '5th',
                'toilet_type' => 'both',
                'aircon_count' => 3,
                'flooring_type' => 'parquet',
                'amenities' => ['lift', 'generator', 'car_parking', 'water_heater', 'security_guard', 'furniture', 'own_meter'],
                'house_rules' => ['no_pets', 'no_sublease'],
                'min_contract_months' => 12,
                'advance_payment_months' => 6,
                'ownership_type' => 'bcc_ready',
                'status' => 'available',
                'images' => ['properties/yankin_condo_1.png', 'properties/yankin_condo_2.png'],
            ]
        );

        // 4. Tamwe Apartment (Rent, 380,000 MMK)
        Property::updateOrCreate(
            ['slug' => 'fully-furnished-tamwe-1st-floor-apartment-ocean'],
            [
                'owner_id' => $owner->id,
                'title' => 'Fully Furnished Tamwe 1st Floor Apartment Near Ocean Supercenter',
                'description' => 'Convenient 1st floor apartment in Tamwe, easy access without lift fatigue. Fully furnished with refrigerator, bed, sofa, dining set, 1 aircon, tiles floor, and western bathroom.',
                'listing_type' => 'rent',
                'property_type' => 'apartment',
                'price' => 380000.00,
                'security_deposit' => 380000.00,
                'township' => 'Tamwe',
                'city' => 'Yangon',
                'address' => 'Kyauk Myaung, Tamwe Township, Yangon',
                'width_ft' => 15.00,
                'length_ft' => 60.00,
                'area_sqft' => 900,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'floor_level' => '1st',
                'toilet_type' => 'western',
                'aircon_count' => 1,
                'flooring_type' => 'tiles',
                'amenities' => ['furniture', 'own_meter', 'water_heater'],
                'house_rules' => ['family_only'],
                'min_contract_months' => 6,
                'advance_payment_months' => 3,
                'ownership_type' => 'bcc_ready',
                'status' => 'available',
                'images' => ['properties/tamwe_apt_1.png'],
            ]
        );

        // 5. South Okkalapa Whole House (Rent, 1,200,000 MMK)
        Property::updateOrCreate(
            ['slug' => 'spacious-2-storey-detached-house-car-compound-south-okkalapa'],
            [
                'owner_id' => $owner->id,
                'title' => 'Spacious 2-Storey Detached House with Car Compound in South Okkalapa',
                'description' => 'Independent 2-storey house situated on a 40x60 plot in South Okkalapa 7th Ward. Features 4 bedrooms, 3 bathrooms, spacious parking for 2 cars, high perimeter wall, private water tube well, own electric meter.',
                'listing_type' => 'rent',
                'property_type' => 'house',
                'price' => 1200000.00,
                'security_deposit' => 2400000.00,
                'township' => 'South Okkalapa',
                'city' => 'Yangon',
                'address' => 'Ward 7, South Okkalapa Township, Yangon',
                'width_ft' => 40.00,
                'length_ft' => 60.00,
                'area_sqft' => 2400,
                'bedrooms' => 4,
                'bathrooms' => 3,
                'floor_level' => 'whole_house',
                'toilet_type' => 'western',
                'aircon_count' => 4,
                'flooring_type' => 'parquet',
                'amenities' => ['car_parking', 'own_meter', 'water_heater'],
                'house_rules' => ['no_sublease'],
                'min_contract_months' => 12,
                'advance_payment_months' => 6,
                'ownership_type' => 'grant_60_years',
                'status' => 'available',
                'images' => ['properties/s_okkalapa_house_1.png'],
            ]
        );

        // 6. North Dagon Landed House (Sale, 350,000,000 MMK / 3,500 Lakh)
        Property::updateOrCreate(
            ['slug' => 'prime-40x60-north-dagon-landed-property-60-year-grant-title'],
            [
                'owner_id' => $owner->id,
                'title' => 'Prime 40x60 North Dagon Landed Property with 60-Year Grant Title',
                'description' => 'Direct owner sale. Genuine 60-year grant (နှစ် ၆၀ ဂရန်) land plot with a solid single-storey brick building in North Dagon 33rd Ward. Clean ownership history, ready for title verification and registration with your chosen lawyer. Wide concrete road with good drainage.',
                'listing_type' => 'sale',
                'property_type' => 'house',
                'price' => 350000000.00,
                'security_deposit' => null,
                'township' => 'North Dagon',
                'city' => 'Yangon',
                'address' => 'Ward 33, North Dagon Township, Yangon',
                'width_ft' => 40.00,
                'length_ft' => 60.00,
                'area_sqft' => 2400,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'floor_level' => 'whole_house',
                'toilet_type' => 'western',
                'aircon_count' => 2,
                'flooring_type' => 'tiles',
                'amenities' => ['car_parking', 'own_meter'],
                'house_rules' => null,
                'min_contract_months' => null,
                'advance_payment_months' => null,
                'ownership_type' => 'grant_60_years',
                'status' => 'available',
                'images' => ['properties/n_dagon_land_1.png'],
            ]
        );

        $this->command->info('Phase 2 Seeding completed successfully!');
        $this->command->info('Admin: admin@propdirect.com / password');
        $this->command->info('Owner: owner@propdirect.com / password (with 6 Yangon properties)');
        $this->command->info('Seeker: seeker@propdirect.com / password (with pending KYC application)');
        $this->command->info('Lawyer 1 (Advocate): lawyer1@propdirect.com / password');
        $this->command->info('Lawyer 2 (HGP): lawyer2@propdirect.com / password');
    }
}
