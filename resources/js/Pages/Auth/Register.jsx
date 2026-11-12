import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import PrivacyPolicyModal from '@/Components/PrivacyPolicyModal';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';

export default function Register() {
    const { lang } = useLanguage();
    const isMm = lang === 'mm';

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (!agreedToPrivacy) return;

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={isMm ? 'အကောင့်အသစ်ဖွင့်ရန် - PropDirect' : 'Register - PropDirect'} />

            <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {isMm ? 'အကောင့်အသစ် ဖွင့်လှစ်ပါ' : 'Create an Account'}
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                    {isMm
                        ? 'ပွဲစားကင်းစင်သော တိုက်ရိုက်အိမ်ခြံမြေ ပလက်ဖောင်းသို့ အခမဲ့ ဝင်ရောက်ပါ'
                        : 'Join Myanmar’s verified direct real estate platform for 0% broker fee trading'}
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value={isMm ? 'အမည် (နာမည်အပြည့်အစုံ)' : 'Full Name'} />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value={isMm ? 'အီးမေးလ်လိပ်စာ' : 'Email Address'} />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value={isMm ? 'စကားဝှက်' : 'Password'} />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value={isMm ? 'စကားဝှက် အတည်ပြုပါ' : 'Confirm Password'}
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5"
                    />
                </div>

                {/* Mandatory Privacy & Terms Checkbox */}
                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreedToPrivacy}
                            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded-md border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-400">
                            {isMm ? (
                                <>
                                    PropDirect ၏{' '}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowPrivacyModal(true);
                                        }}
                                        className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline"
                                    >
                                        ကိုယ်ရေးအချက်အလက်နှင့် ဝန်ဆောင်မှုစည်းမျဉ်းများ
                                    </button>{' '}
                                    (Anti-Broker & 0% Broker Fee Policy) အား ဖတ်ရှုသဘောတူပါသည်။
                                </>
                            ) : (
                                <>
                                    I have read and agree to the{' '}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowPrivacyModal(true);
                                        }}
                                        className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline"
                                    >
                                        Privacy Policy & Terms of Service
                                    </button>{' '}
                                    of PropDirect (Anti-Broker & 0% Broker Fee Policy).
                                </>
                            )}
                        </span>
                    </label>
                </div>

                <div>
                    <PrimaryButton
                        className="w-full justify-center py-2.5 text-xs font-bold"
                        disabled={processing || !agreedToPrivacy}
                    >
                        <UserPlus className="h-4 w-4 mr-1.5" />
                        <span>{isMm ? 'အကောင့်ဖွင့်မည်' : 'Create Account'}</span>
                    </PrimaryButton>
                    {!agreedToPrivacy && (
                        <p className="mt-1.5 text-center text-[10px] text-amber-600 dark:text-amber-400">
                            {isMm
                                ? '* ရှေ့ဆက်ရန် စည်းမျဉ်းများကို သဘောတူညီချက် အမှန်ခြစ်ပေးပါ'
                                : '* Please accept the Terms & Privacy Policy to enable account creation'}
                        </p>
                    )}
                </div>

                <div className="pt-3 text-center text-xs text-slate-500 dark:text-zinc-400">
                    {isMm ? 'အကောင့်ရှိပြီးဖြစ်ပါက' : 'Already registered?'}{' '}
                    <Link
                        href={route('login')}
                        className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                        {isMm ? 'အကောင့်ဝင်ရန်' : 'Log in here'}
                    </Link>
                </div>
            </form>

            {/* Privacy Policy Modal */}
            <PrivacyPolicyModal
                show={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
                onAccept={() => setAgreedToPrivacy(true)}
            />
        </GuestLayout>
    );
}
