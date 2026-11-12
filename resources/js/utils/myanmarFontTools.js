/**
 * Myanmar Font Detection & Zawgyi-to-Unicode Normalization Utilities
 */

// Common Zawgyi signature regex pattern
const ZAWGYI_REGEX = /[\u1031][\u1000-\u1021]|[\u102d\u1032][\u1039]|[\u1039][\u1038\u1037]|[\u1033\u1034\u105a\u1060-\u1097]/;

/**
 * Detects whether the input string contains Zawgyi encoded Myanmar text.
 * @param {string} text
 * @returns {boolean}
 */
export function isZawgyi(text) {
    if (!text || typeof text !== 'string') return false;
    return ZAWGYI_REGEX.test(text);
}

/**
 * Normalizes input text from Zawgyi to standard Myanmar Unicode.
 * If already Unicode or English, it cleanly passes through.
 * @param {string} text
 * @returns {string}
 */
export function normalizeToUnicode(text) {
    if (!text || typeof text !== 'string') return '';

    // If no Myanmar characters are present, return immediately
    if (!/[\u1000-\u109f]/.test(text)) {
        return text;
    }

    let output = text;

    // 1. In Zawgyi, \u1039 before visarga, dot-below, whitespace, punctuation or end of string is ashtat (\u103a)
    output = output.replace(/\u1039(?=[\u1038\u1037\s\p{P}]|$)/gu, '\u103a');

    // 2. In Zawgyi, \u103a after consonant and before vowels was used as yapin (\u103b)
    output = output.replace(/([\u1000-\u1021])\u103a(?=[\u102b\u102c\u102d\u102e\u102f\u1030])/gu, '$1\u103b');

    // 3. Move e-vowel \u1031 to after consonant and medials
    output = output.replace(/\u1031([\u1000-\u1021])([\u103b\u103c\u103d\u103e\u107b-\u1084]*)/gu, '$1$2\u1031');

    // 4. Medial & diacritic conversions
    const map = [
        [/\u108b/g, '\u103d\u103e'],
        [/\u108a/g, '\u103d'],
        [/\u107d/g, '\u103b\u103d'],
        [/\u107e/g, '\u103b\u103d'],
        [/\u107f/g, '\u103b\u103e'],
        [/\u1080/g, '\u103b\u103d\u103e'],
        [/\u1082/g, '\u103c\u103d'],
        [/\u1083/g, '\u103c\u103e'],
        [/\u1084/g, '\u103c\u103d\u103e'],
        [/\u1033/g, '\u102f'],
        [/\u1034/g, '\u1030'],
        [/\u1087/g, '\u102f'],
        [/\u1088/g, '\u1030'],
        [/\u1089/g, '\u102f'],
        [/\u1064/g, '\u1004\u103a\u1039'], // Kinzi
        [/\u1060/g, '\u1039\u1000'],
        [/\u1061/g, '\u1039\u1001'],
        [/\u1062/g, '\u1039\u1002'],
        [/\u1063/g, '\u1039\u1003'],
        [/\u1065/g, '\u1039\u1005'],
        [/\u1066/g, '\u1039\u1006'],
        [/\u1067/g, '\u1039\u1007'],
        [/\u1068/g, '\u1039\u1008'],
        [/\u1069/g, '\u1039\u100a'],
        [/\u106c/g, '\u1039\u1010'],
        [/\u106d/g, '\u1039\u1011'],
        [/\u106e/g, '\u1039\u1012'],
        [/\u106f/g, '\u1039\u1013'],
        [/\u1070/g, '\u1039\u1014'],
        [/\u1071/g, '\u1039\u1015'],
        [/\u1072/g, '\u1039\u1016'],
        [/\u1073/g, '\u1039\u1017'],
        [/\u1074/g, '\u1039\u1018'],
        [/\u1075/g, '\u1039\u1019'],
        [/\u1076/g, '\u1039\u101c'],
        [/\u1077/g, '\u1039\u101d'],
        [/\u1078/g, '\u1039\u101e'],
        [/\u1079/g, '\u1039\u101f'],
        [/\u107a/g, '\u1039\u1020'],
        [/\u107b/g, '\u103b'],
        [/\u107c/g, '\u103b'],
        [/\u108f/g, '\u1014'],
        [/\u1090/g, '\u101b'],
        [/\u1091/g, '\u107b'],
        [/\u1092/g, '\u107c'],
        [/\u1097/g, '\u1037'],
    ];

    for (const [pattern, replacement] of map) {
        output = output.replace(pattern, replacement);
    }

    return output;
}
