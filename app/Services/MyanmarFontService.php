<?php

namespace App\Services;

class MyanmarFontService
{
    /**
     * Common Zawgyi specific patterns:
     * - \x{1031}[\x{1000}-\x{1021}] (E-vowel placed before consonant in storage)
     * - \x{102d}\x{1032} or \x{1039} before visarga/punctuation
     * - \x{1033}, \x{1034} (Zawgyi medial ra / u vowel variants)
     * - \x{1060}-\x{1097} (Zawgyi glyph range)
     */
    public static function isZawgyi(?string $text): bool
    {
        if (empty($text)) {
            return false;
        }

        // Check for dominant Zawgyi signature sequences
        $zawgyiPattern = '/[\x{1031}][\x{1000}-\x{1021}]|[\x{102d}\x{1032}][\x{1039}]|[\x{1039}][\x{1038}\x{1037}]|[\x{1033}\x{1034}\x{105a}\x{1060}-\x{1097}]/u';

        return (bool) preg_match($zawgyiPattern, $text);
    }

    /**
     * Zawgyi-to-Unicode converter for real-estate terms and Myanmar text.
     */
    public static function normalizeToUnicode(?string $text): string
    {
        if (empty($text)) {
            return '';
        }

        // If not containing Myanmar characters, return unchanged
        if (! preg_match('/[\x{1000}-\x{109f}]/u', $text)) {
            return $text;
        }

        $output = $text;

        // 1. In Zawgyi, \x{1039} before visarga (\x{1038}), dot-below (\x{1037}), whitespace, punctuation or end of word is ashtat (\u{103a})
        $output = preg_replace('/\\x{1039}(?=[\\x{1038}\\x{1037}\\s\\p{P}]|$)/u', "\u{103a}", $output);

        // 2. In Zawgyi, \x{103a} after consonant and before vowels was used as yapin (\u{103b})
        $output = preg_replace('/([\\x{1000}-\\x{1021}])\\x{103a}(?=[\\x{102b}\\x{102c}\\x{102d}\\x{102e}\\x{102f}\\x{1030}])/u', "$1\u{103b}", $output);

        // 3. Move e-vowel \x{1031} to after consonant and medials (logical Unicode order)
        $output = preg_replace('/\\x{1031}([\\x{1000}-\\x{1021}])([\\x{103b}\\x{103c}\\x{103d}\\x{103e}\\x{107b}-\\x{1084}]*)/u', "$1$2\u{1031}", $output);

        // 4. Standard mapping for other Zawgyi glyphs
        $replacements = [
            '/\x{108b}/u' => "\u{103d}\u{103e}",
            '/\x{108a}/u' => "\u{103d}",
            '/\x{107d}/u' => "\u{103b}\u{103d}",
            '/\x{107e}/u' => "\u{103b}\u{103d}",
            '/\x{107f}/u' => "\u{103b}\u{103e}",
            '/\x{1080}/u' => "\u{103b}\u{103d}\u{103e}",
            '/\x{1082}/u' => "\u{103c}\u{103d}",
            '/\x{1083}/u' => "\u{103c}\u{103e}",
            '/\x{1084}/u' => "\u{103c}\u{103d}\u{103e}",
            '/\x{1033}/u' => "\u{102f}",
            '/\x{1034}/u' => "\u{1030}",
            '/\x{1087}/u' => "\u{102f}",
            '/\x{1088}/u' => "\u{1030}",
            '/\x{1089}/u' => "\u{102f}",
            '/\x{1064}/u' => "\u{1004}\u{103a}\u{1039}",
            '/\x{1060}/u' => "\u{1039}\u{1000}",
            '/\x{1061}/u' => "\u{1039}\u{1001}",
            '/\x{1062}/u' => "\u{1039}\u{1002}",
            '/\x{1063}/u' => "\u{1039}\u{1003}",
            '/\x{1065}/u' => "\u{1039}\u{1005}",
            '/\x{1066}/u' => "\u{1039}\u{1006}",
            '/\x{1067}/u' => "\u{1039}\u{1007}",
            '/\x{1068}/u' => "\u{1039}\u{1008}",
            '/\x{1069}/u' => "\u{1039}\u{100a}",
            '/\x{106c}/u' => "\u{1039}\u{1010}",
            '/\x{106d}/u' => "\u{1039}\u{1011}",
            '/\x{106e}/u' => "\u{1039}\u{1012}",
            '/\x{106f}/u' => "\u{1039}\u{1013}",
            '/\x{1070}/u' => "\u{1039}\u{1014}",
            '/\x{1071}/u' => "\u{1039}\u{1015}",
            '/\x{1072}/u' => "\u{1039}\u{1016}",
            '/\x{1073}/u' => "\u{1039}\u{1017}",
            '/\x{1074}/u' => "\u{1039}\u{1018}",
            '/\x{1075}/u' => "\u{1039}\u{1019}",
            '/\x{1076}/u' => "\u{1039}\u{101c}",
            '/\x{1077}/u' => "\u{1039}\u{101d}",
            '/\x{1078}/u' => "\u{1039}\u{101e}",
            '/\x{1079}/u' => "\u{1039}\u{101f}",
            '/\x{107a}/u' => "\u{1039}\u{1020}",
            '/\x{107b}/u' => "\u{103b}",
            '/\x{107c}/u' => "\u{103b}",
            '/\x{108f}/u' => "\u{1014}",
            '/\x{1090}/u' => "\u{101b}",
            '/\x{1091}/u' => "\u{107b}",
            '/\x{1092}/u' => "\u{107c}",
            '/\x{1097}/u' => "\u{1037}",
        ];

        return preg_replace(array_keys($replacements), array_values($replacements), $output);
    }
}
