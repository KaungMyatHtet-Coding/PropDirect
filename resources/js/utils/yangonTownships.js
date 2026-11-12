/**
 * Yangon 33 Townships Constant & Utility Helpers
 */

export const YANGON_TOWNSHIPS = [
    { id: 'sanchaung', en: 'Sanchaung', mm: 'စမ်းချောင်း' },
    { id: 'hlaing', en: 'Hlaing', mm: 'လှိုင်' },
    { id: 'kamayut', en: 'Kamayut', mm: 'ကမာရွတ်' },
    { id: 'yankin', en: 'Yankin', mm: 'ရန်ကင်း' },
    { id: 'tamwe', en: 'Tamwe', mm: 'တာမွေ' },
    { id: 'bahan', en: 'Bahan', mm: 'ဗဟန်း' },
    { id: 'south_okkalapa', en: 'South Okkalapa', mm: 'တောင်ဥက္ကလာပ' },
    { id: 'north_dagon', en: 'North Dagon', mm: 'မြောက်ဒဂုံ' },
    { id: 'thaketa', en: 'Thaketa', mm: 'သာကေတ' },
    { id: 'mingalar_taung_nyunt', en: 'Mingalar Taung Nyunt', mm: 'မင်္ဂလာတောင်ညွန့်' },
    { id: 'ahlone', en: 'Ahlone', mm: 'အလုံ' },
    { id: 'kyimyindaing', en: 'Kyimyindaing', mm: 'ကြည့်မြင်တိုင်' },
    { id: 'lanmadaw', en: 'Lanmadaw', mm: 'လမ်းမတော်' },
    { id: 'latha', en: 'Latha', mm: 'လသာ' },
    { id: 'pabedan', en: 'Pabedan', mm: 'ပန်းဘဲတန်း' },
    { id: 'kyauktada', en: 'Kyauktada', mm: 'ကျောက်တံတား' },
    { id: 'botataung', en: 'Botataung', mm: 'ဗိုလ်တထောင်' },
    { id: 'pazundaung', en: 'Pazundaung', mm: 'ပုဇွန်တောင်' },
    { id: 'dagon', en: 'Dagon', mm: 'ဒဂုံ' },
    { id: 'mayangone', en: 'Mayangone', mm: 'မရမ်းကုန်း' },
    { id: 'insein', en: 'Insein', mm: 'အင်းစိန်' },
    { id: 'mingaladon', en: 'Mingaladon', mm: 'မင်္ဂလာဒုံ' },
    { id: 'north_okkalapa', en: 'North Okkalapa', mm: 'မြောက်ဥက္ကလာပ' },
    { id: 'south_dagon', en: 'South Dagon', mm: 'တောင်ဒဂုံ' },
    { id: 'east_dagon', en: 'East Dagon', mm: 'အရှေ့ဒဂုံ' },
    { id: 'dagon_seikkan', en: 'Dagon Seikkan', mm: 'ဒဂုံဆိပ်ကမ်း' },
    { id: 'dawbon', en: 'Dawbon', mm: 'ဒေါပုံ' },
    { id: 'thingangyun', en: 'Thingangyun', mm: 'သင်္ဃန်းကျွန်း' },
    { id: 'hlaingthaya', en: 'Hlaingthaya', mm: 'လှိုင်သာယာ' },
    { id: 'shwepyitha', en: 'Shwepyitha', mm: 'ရွှေပြည်သာ' },
    { id: 'thanlyin', en: 'Thanlyin', mm: 'သန်လျင်' },
    { id: 'dala', en: 'Dala', mm: 'ဒလ' },
    { id: 'seikkyi_kanaungto', en: 'Seikkyi Kanaungto', mm: 'ဆိပ်ကြီးခနောင်တို' },
];

/**
 * Get localized township name
 * @param {string} townshipEn
 * @param {string} lang ('en' | 'mm')
 * @returns {string}
 */
export function getTownshipName(townshipEn, lang = 'en') {
    if (!townshipEn) return '';
    const match = YANGON_TOWNSHIPS.find(
        (t) => t.en.toLowerCase() === townshipEn.toLowerCase() || t.id === townshipEn.toLowerCase()
    );
    if (!match) return townshipEn;
    return lang === 'mm' ? match.mm : match.en;
}
