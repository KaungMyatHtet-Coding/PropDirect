<?php

namespace Database\Seeders;

use App\Models\OwnerVerification;
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
        Storage::disk('public')->makeDirectory('verifications/nrc');
        Storage::disk('public')->makeDirectory('verifications/utility_bills');

        // Helper to generate a placeholder PNG image
        $createDummyImage = function (string $relativePath, string $title, string $subtitle, string $bgColorHex = '#1e293b') {
            $fullPath = Storage::disk('public')->path($relativePath);
            if (! file_exists($fullPath)) {
                $width = 700;
                $height = 440;
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
                imagefilledrectangle($image, 10, 10, $width - 10, 60, $border);
                imagestring($image, 5, 25, 25, "PROPDIRECT KYC VERIFICATION DOCUMENT", $emerald);

                // Title and subtitle
                imagestring($image, 5, 40, 120, $title, $white);
                imagestring($image, 4, 40, 160, $subtitle, $slate);
                imagestring($image, 3, 40, 210, "OFFICIAL PROPDIRECT VERIFICATION AUDIT", $white);
                imagestring($image, 3, 40, 240, "Timestamp: " . date('Y-m-d H:i:s'), $slate);
                imagestring($image, 3, 40, 270, "Status: Official KYC Documentation Sample", $emerald);
                imagestring($image, 2, 40, 380, "PropDirect Anti-Broker Trust & Safety System - Verified Document Proof", $slate);

                imagepng($image, $fullPath);
                imagedestroy($image);
            }
        };

        // Create sample images for testing
        $createDummyImage(
            'verifications/nrc/dummy_nrc_seeker.png',
            'NRC CARD (FRONT) - NATIONAL REGISTRATION CARD',
            'Holder: Ko Kyaw Swar | NRC: 12/DAGAMA(N)098765',
            '#0f172a'
        );

        $createDummyImage(
            'verifications/utility_bills/dummy_bill_seeker.png',
            'YESC ELECTRICITY UTILITY BILL & METER RECORD',
            'Account: Daw Hlaing Moe & Ko Kyaw Swar | Township: Dagon, Yangon',
            '#134e4a'
        );

        $createDummyImage(
            'verifications/nrc/dummy_nrc_owner.png',
            'NRC CARD (FRONT) - VERIFIED OWNER CARD',
            'Holder: Daw Hlaing Moe | NRC: 12/BAHANA(N)112233',
            '#0f172a'
        );

        $createDummyImage(
            'verifications/utility_bills/dummy_bill_owner.png',
            'OFFICIAL ELECTRICITY METER BILL - PROVE OWNERSHIP',
            'Account No: YESC-9923841 | Township: Bahan, Yangon',
            '#134e4a'
        );

        // 1. Admin Account
        $admin = User::firstOrCreate(
            ['email' => 'admin@propdirect.com'],
            [
                'name' => 'PropDirect Administrator',
                'phone' => '09999000111',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_verified_owner' => false,
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

        $this->command->info('Seeding completed successfully!');
        $this->command->info('Admin: admin@propdirect.com / password');
        $this->command->info('Owner: owner@propdirect.com / password');
        $this->command->info('Seeker: seeker@propdirect.com / password (with pending KYC application)');
    }
}
