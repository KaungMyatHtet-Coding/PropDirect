<?php

namespace App\Services;

use App\Models\ContractVersion;
use App\Models\Property;
use App\Models\User;
use Carbon\Carbon;

class ContractDiffService
{
    /**
     * Generate standard pre-filled bilingual lease contract clauses based on property details.
     */
    public static function generateSmartTemplate(Property $property, User $owner, User $tenant, ?Carbon $startDate = null, int $durationMonths = 12): array
    {
        $startDate = $startDate ?: Carbon::now()->addMonth()->startOfMonth();
        $endDate = (clone $startDate)->addMonths($durationMonths)->subDay();

        $rent = (float) $property->price;
        $deposit = (float) ($property->security_deposit ?: $property->price);
        $advanceMonths = (int) ($property->advance_payment_months ?: 1);
        $rentDueDay = 5; // Default 5th of every month
        $rules = $property->house_rules ?: [];

        $clauses = [
            [
                'clause_number' => 1,
                'title_en' => 'Premises & Permitted Residential Use',
                'title_mm' => 'ငှားရမ်းသည့်နေရာနှင့် လူနေထိုင်ခွင့်',
                'content_en' => "The Landlord ({$owner->name}) agrees to let and the Tenant ({$tenant->name}) agrees to take the residential premises located at {$property->address}, {$property->township}, Yangon (measuring approximately {$property->area_sqft} sqft) strictly for peaceful residential purposes only. Commercial operations, industrial manufacturing, and unauthorized subletting are strictly prohibited.",
                'content_mm' => "အိမ်ရှင် ({$owner->name}) နှင့် အိမ်ငှား ({$tenant->name}) တို့သည် ရန်ကုန်မြို့၊ {$property->township} တွင် တည်ရှိသော အကျယ်အဝန်း ({$property->area_sqft} စတုရန်းပေ) ရှိ နေအိမ်/တိုက်ခန်းအား အေးချမ်းစွာ လူနေထိုင်ရန် ရည်ရွယ်ချက်ဖြင့်သာ ငှားရမ်းရန် သဘောတူညီကြသည်။ စီးပွားရေးလုပ်ငန်း လုပ်ကိုင်ခြင်းနှင့် အိမ်ရှင်၏ ခွင့်ပြုချက်မရှိဘဲ တစ်ဆင့်ပြန်လည်ငှားရမ်းခြင်း (Subletting) ကို လုံးဝ(လုံးဝ) မပြုလုပ်ရပါ။",
            ],
            [
                'clause_number' => 2,
                'title_en' => 'Monthly Rent & Payment Due Date',
                'title_mm' => 'လစဉ်ငှားရမ်းခနှင့် ပေးချေရမည့် သတ်မှတ်ရက်',
                'content_en' => "The monthly rental fee is agreed at " . number_format($rent) . " MMK payable directly on or before the {$rentDueDay}th day of each calendar month. The initial payment requires {$advanceMonths} month(s) rent in advance.",
                'content_mm' => "လစဉ်ငှားရမ်းခကို ငွေကျပ် " . number_format($rent) . " ကျပ်အဖြစ် သတ်မှတ်ပြီး လစဉ် {$rentDueDay} ရက်နေ့မတိုင်မီ တိုက်ရိုက်ပေးချေရပါမည်။ စာချုပ်စတင်ချုပ်ဆိုချိန်တွင် ကြိုတင်ငှားရမ်းခ {$advanceMonths} လစာကို ပေးချေရမည်။",
            ],
            [
                'clause_number' => 3,
                'title_en' => 'Security Deposit & Arrears Guarantee',
                'title_mm' => 'အာမခံစပေါ်ငွေနှင့် ကြွေးကျန်အာမခံချက်',
                'content_en' => "A refundable security deposit of " . number_format($deposit) . " MMK shall be retained by the Landlord for the duration of the tenancy. Upon contract termination and vacant handover, this deposit shall be refunded in full within 7 business days, deducting any unpaid electricity, water, maintenance bills, or repair costs for damages caused by the Tenant.",
                'content_mm' => "အာမခံစပေါ်ငွေ " . number_format($deposit) . " ကျပ်အား အိမ်ရှင်ထံတွင် စာချုပ်သက်တမ်းတစ်လျှောက် အပ်နှံထားရှိရမည်။ စာချုပ်ကုန်ဆုံး၍ အိမ်ပြန်လည်အပ်နှံချိန်တွင် ပျက်စီးဆုံးရှုံးမှုများနှင့် မီတာခ၊ ရေဖိုးကြွေးကျန်များ နုတ်ပယ်ပြီး ၇ ရက်အတွင်း အိမ်ငှားထံ ပြန်လည်လွှဲပြောင်းပေးရပါမည်။",
            ],
            [
                'clause_number' => 4,
                'title_en' => 'Utility Bills, Municipal Dues & House Rules',
                'title_mm' => 'မီတာခ၊ ရေဖိုး၊ စည်ပင်ခွန်နှင့် အိမ်တွင်းစည်းကမ်းများ',
                'content_en' => "The Tenant is responsible for paying all electricity meter bills, water fees, internet, and municipal garbage fees during occupancy. The Tenant further agrees to abide by building regulations, maintain peace, and observe house rules: " . (empty($rules) ? 'Standard quiet residential standards.' : implode(', ', $rules)),
                'content_mm' => "ငှားရမ်းနေထိုင်စဉ်ကာလအတွင်း လစဉ်ကုန်ကျမည့် လျှပ်စစ်မီတာခ၊ ရေဖိုး၊ အင်တာနက်နှင့် စည်ပင်အမှိုက်ကြေးများကို အိမ်ငှားသူက တာဝန်ယူကျခံရပါမည်။ တိုက်ခန်းနှင့် ပတ်ဝန်းကျင် အေးချမ်းသာယာရေး စည်းကမ်းချက်များကို တိကျစွာ လိုက်နာရပါမည်။",
            ],
            [
                'clause_number' => 5,
                'title_en' => 'Termination, Notice Period & Peaceful Handover',
                'title_mm' => 'စာချုပ်ရပ်စဲခြင်း၊ ကြိုတင်အကြောင်းကြားခြင်းနှင့် ပြန်လည်အပ်နှံခြင်း',
                'content_en' => "Either party may terminate this agreement prior to expiry by providing at least 30 calendar days advance written notice. Upon handover, the premises must be restored to clean, habitable condition normal wear and tear excepted.",
                'content_mm' => "စာချုပ်မကုန်ဆုံးမီ ရပ်စဲလိုပါက အနည်းဆုံး ရက် ၃၀ ကြိုတင်၍ စာဖြင့် အကြောင်းကြားရပါမည်။ အိမ်ပြန်လည်အပ်နှံရာတွင် သန့်ရှင်းသပ်ရပ်စွာ ပြန်လည်လွှဲပြောင်းပေးရပါမည်။",
            ],
        ];

        // Format terms_and_conditions as a complete combined text
        $termsText = '';
        foreach ($clauses as $c) {
            $termsText .= "=== {$c['title_en']} ===\n{$c['content_en']}\n\n=== {$c['title_mm']} ===\n{$c['content_mm']}\n\n";
        }

        return [
            'monthly_rent' => $rent,
            'deposit_amount' => $deposit,
            'advance_payment_months' => $advanceMonths,
            'rent_due_day' => $rentDueDay,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'house_rules_snapshot' => $rules,
            'clauses' => $clauses,
            'full_text' => trim($termsText),
            'terms_and_conditions' => trim($termsText),
        ];
    }

    /**
     * Compare two contract versions and generate a concise executive summary of changes.
     */
    public static function summarizeDiff(ContractVersion $oldVer, ContractVersion $newVer): string
    {
        $changes = [];

        // 1. Monthly Rent
        if ((float) $oldVer->monthly_rent !== (float) $newVer->monthly_rent) {
            $diffRent = (float) $newVer->monthly_rent - (float) $oldVer->monthly_rent;
            $percent = $oldVer->monthly_rent > 0 ? number_format(round(($diffRent / $oldVer->monthly_rent) * 100, 1), 1) : '0.0';
            $verb = $diffRent > 0 ? 'increased' : 'decreased';
            $diffStr = number_format(abs($diffRent));
            $changes[] = "Rent {$verb} by {$diffStr} Ks ({$percent}%)";
        }

        // 2. Deposit Amount
        if ((float) $oldVer->deposit_amount !== (float) $newVer->deposit_amount) {
            $diffDep = (float) $newVer->deposit_amount - (float) $oldVer->deposit_amount;
            $percent = $oldVer->deposit_amount > 0 ? number_format(round(($diffDep / $oldVer->deposit_amount) * 100, 1), 1) : '0.0';
            $verb = $diffDep > 0 ? 'increased' : 'decreased';
            $diffStr = number_format(abs($diffDep));
            $changes[] = "Deposit {$verb} by {$diffStr} Ks ({$percent}%)";
        }

        // 3. Rent Due Day
        if ((int) $oldVer->rent_due_day !== (int) $newVer->rent_due_day) {
            $changes[] = "Rent due day changed from {$oldVer->rent_due_day}st to {$newVer->rent_due_day}th";
        }

        // 4. Advance Months
        if ((int) $oldVer->advance_payment_months !== (int) $newVer->advance_payment_months) {
            $verb = $newVer->advance_payment_months > $oldVer->advance_payment_months ? 'increased' : 'reduced';
            $changes[] = "Advance payment months {$verb} from {$oldVer->advance_payment_months} to {$newVer->advance_payment_months}";
        }

        // 5. Dates
        $oldStart = $oldVer->start_date ? Carbon::parse($oldVer->start_date)->toDateString() : null;
        $newStart = $newVer->start_date ? Carbon::parse($newVer->start_date)->toDateString() : null;
        $oldEnd = $oldVer->end_date ? Carbon::parse($oldVer->end_date)->toDateString() : null;
        $newEnd = $newVer->end_date ? Carbon::parse($newVer->end_date)->toDateString() : null;

        if ($oldStart !== $newStart || $oldEnd !== $newEnd) {
            $changes[] = "Lease period changed from [{$oldStart} to {$oldEnd}] to [{$newStart} to {$newEnd}]";
        }

        // 6. Terms or clauses content change
        if ($oldVer->terms_and_conditions !== $newVer->terms_and_conditions) {
            $changes[] = "Updated terms and conditions document text";
        }

        // 7. Revision note from proposer
        if (! empty($newVer->revision_request_note)) {
            $changes[] = "Note: \"{$newVer->revision_request_note}\"";
        }

        return empty($changes)
            ? 'No material terms altered.'
            : implode('; ', $changes) . '.';
    }
}
