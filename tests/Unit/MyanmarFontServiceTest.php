<?php

namespace Tests\Unit;

use App\Services\MyanmarFontService;
use PHPUnit\Framework\TestCase;

class MyanmarFontServiceTest extends TestCase
{
    public function test_it_detects_zawgyi_text(): void
    {
        $zawgyiText = "စမ္းေခ်ာင္း"; // Zawgyi encoding
        $this->assertTrue(MyanmarFontService::isZawgyi($zawgyiText));

        $unicodeText = "စမ်းချောင်း"; // Standard Unicode
        $this->assertFalse(MyanmarFontService::isZawgyi($unicodeText));
    }

    public function test_it_normalizes_zawgyi_to_unicode(): void
    {
        $zawgyiText = "စမ္းေခ်ာင္း";
        $converted = MyanmarFontService::normalizeToUnicode($zawgyiText);

        $this->assertSame("စမ်းချောင်း", $converted);
    }

    public function test_it_leaves_pure_english_untouched(): void
    {
        $englishText = "Modern Apartment in Sanchaung 15x60";
        $converted = MyanmarFontService::normalizeToUnicode($englishText);

        $this->assertSame($englishText, $converted);
    }
}
