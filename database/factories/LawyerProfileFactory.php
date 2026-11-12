<?php

namespace Database\Factories;

use App\Models\LawyerProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LawyerProfile>
 */
class LawyerProfileFactory extends Factory
{
    protected $model = LawyerProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'license_number' => 'ADV-' . fake()->unique()->numerify('#####') . '/2020',
            'lawyer_type' => 'advocate',
            'degree' => 'LL.B',
            'experience_years' => fake()->numberBetween(3, 20),
            'specialization' => 'Grant Verification, Lease Contracts',
            'consultation_fee' => 40000,
            'contract_fee' => 120000,
            'bio' => fake()->paragraph(),
            'license_card_image' => 'lawyers/licenses/dummy_license_lawyer1.png',
            'office_township' => 'Sanchaung',
            'status' => 'pending',
            'admin_remark' => null,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn () => [
            'status' => 'approved',
            'admin_remark' => 'Verified by Admin',
        ]);
    }
}
