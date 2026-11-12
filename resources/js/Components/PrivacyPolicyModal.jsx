import React from 'react';
import Modal from '@/Components/Modal';
import { useLanguage } from '@/Contexts/LanguageContext';
import { ShieldCheck, Lock, Check, X, Scale, FileText } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function PrivacyPolicyModal({ show, onClose, onAccept }) {
    const { lang } = useLanguage();

    const isMm = lang === 'mm';

    return (
        <Modal show={show} onClose={onClose} maxWidth="xl">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {isMm ? 'PropDirect ကိုယ်ရေးအချက်အလက်နှင့် ဝန်ဆောင်မှုစည်းမျဉ်းများ' : 'PropDirect Privacy Policy & Terms'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                {isMm ? 'ပွဲစားကင်းစင်ပြီး တိုက်ရိုက်ယုံကြည်စိတ်ချရသော စနစ်' : 'Zero-Brokerage Direct Property Platform'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                    {/* Section 1 */}
                    <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-3.5 border border-slate-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                            <Scale className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span>{isMm ? '၁။ ပွဲစားကင်းစင်ခြင်း မူဝါဒ (Anti-Broker Policy)' : '1. Anti-Broker & Direct Trading Guarantee'}</span>
                        </div>
                        <p>
                            {isMm
                                ? 'PropDirect သည် အိမ်ရှင်နှင့် အိမ်ငှား/ဝယ်သူတို့ တိုက်ရိုက်ဆက်သွယ်နိုင်သော စနစ်ဖြစ်ပါသည်။ ကြားခံပွဲစားများ၊ အကျိုးဆောင်များမှ အိမ်ရှင်ဟန်ဆောင်၍ ပစ္စည်းတင်ခြင်း၊ ကော်မရှင်တောင်းခံခြင်းကို လုံးဝခွင့်မပြုပါ။ တွေ့ရှိပါက အကောင့်ကို အပြီးပိတ်သိမ်းပါမည်။'
                                : 'PropDirect is exclusively dedicated to direct transactions between genuine owners and verified seekers. Third-party brokers, unauthorized agents, and commission-seeking middlemen are strictly prohibited from misrepresenting property ownership. Violators will face immediate account termination.'}
                        </p>
                    </div>

                    {/* Section 2 */}
                    <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-3.5 border border-slate-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                            <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span>{isMm ? '၂။ ကိုယ်ရေးလုံခြုံမှုနှင့် ဖုန်းနံပါတ် ကာကွယ်ရေး' : '2. Identity & Phone Privacy Protection'}</span>
                        </div>
                        <p>
                            {isMm
                                ? 'အသုံးပြုသူများ၏ မှတ်ပုံတင်၊ ဓာတ်ပုံနှင့် ဆက်သွယ်ရန် ဖုန်းနံပါတ်များကို လုံခြုံစွာ ထိန်းသိမ်းထားပါသည်။ ပရိုဖိုင် အပြည့်အစုံ မဖြည့်စွက်ထားသော အသုံးပြုသူများသည် အိမ်ရှင်ထံ တိုက်ရိုက်ဖုန်းဆက်သွယ်ခွင့် သို့မဟုတ် ကြည့်ရှုခွင့် တောင်းဆိုနိုင်မည်မဟုတ်ပါ။'
                                : 'Your NRC credentials, facial identity, and phone numbers are encrypted with enterprise-grade security. Incomplete or unverified profiles cannot view direct owner contact details, protecting our community from automated scraping and spam.'}
                        </p>
                    </div>

                    {/* Section 3 */}
                    <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-3.5 border border-slate-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                            <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span>{isMm ? '၃။ တရားဝင် စာချုပ်စာတမ်းနှင့် အတည်ပြုချက်' : '3. Legal Due Diligence & Contract Auditing'}</span>
                        </div>
                        <p>
                            {isMm
                                ? 'ပလက်ဖောင်းပေါ်ရှိ ရှေ့နေများသည် Bar Council တရားဝင် အသိအမှတ်ပြုထားသူများဖြစ်ပြီး ဂရန်စာရွက်စာတမ်း စစ်ဆေးခြင်းနှင့် အရောင်း/အငှား စာချုပ်များအား ဥပဒေနှင့်အညီ အကာအကွယ်ပေးမည်ဖြစ်ပါသည်။'
                                : 'Legal services available on the platform are rendered by Bar Council certified Advocates and Higher Grade Pleaders. Parties are strongly encouraged to execute legally binding contracts for all real estate leases and acquisitions.'}
                        </p>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                    <SecondaryButton onClick={onClose} type="button">
                        {isMm ? 'ပိတ်မည်' : 'Close'}
                    </SecondaryButton>
                    {onAccept && (
                        <PrimaryButton
                            type="button"
                            onClick={() => {
                                onAccept();
                                onClose();
                            }}
                            className="flex items-center gap-1.5"
                        >
                            <Check className="h-3.5 w-3.5" />
                            <span>{isMm ? 'သဘောတူပါသည်' : 'I Agree & Accept'}</span>
                        </PrimaryButton>
                    )}
                </div>
            </div>
        </Modal>
    );
}
