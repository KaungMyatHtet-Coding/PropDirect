import React, { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import PrivacyPolicyModal from '@/Components/PrivacyPolicyModal';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn, ShieldAlert } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { lang } = useLanguage();
    const isMm = lang === 'mm';

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (!agreedToPrivacy) return;

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title={isMm ? 'အကောင့်ဝင်ရန် - PropDirect' : 'Log In - PropDirect'} />

            <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {isMm ? 'ကြိုဆိုပါသည်' : 'Welcome back'}
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                    {isMm
                        ? 'သင့် PropDirect အကောင့်သို့ ဝင်ရောက်ပါ'
                        : 'Enter your credentials to access your direct marketplace account'}
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value={isMm ? 'အီးမေးလ်လိပ်စာ' : 'Email Address'} />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
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
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center cursor-pointer select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded-md border-slate-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="ms-2 text-slate-600 dark:text-zinc-400">
                            {isMm ? 'မှတ်ထားမည်' : 'Remember me'}
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-slate-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 font-medium transition"
                        >
                            {isMm ? 'စကားဝှက်မေ့နေပါသလား?' : 'Forgot password?'}
                        </Link>
                    )}
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
                        <LogIn className="h-4 w-4 mr-1.5" />
                        <span>{isMm ? 'အကောင့်ဝင်ရန်' : 'Log In'}</span>
                    </PrimaryButton>
                    {!agreedToPrivacy && (
                        <p className="mt-1.5 text-center text-[10px] text-amber-600 dark:text-amber-400">
                            {isMm
                                ? '* ရှေ့ဆက်ရန် စည်းမျဉ်းများကို သဘောတူညီချက် အမှန်ခြစ်ပေးပါ'
                                : '* Please accept the Terms & Privacy Policy to enable sign in'}
                        </p>
                    )}
                </div>

                <div className="pt-3 text-center text-xs text-slate-500 dark:text-zinc-400">
                    {isMm ? 'အကောင့်မရှိသေးပါက' : "Don't have an account?"}{' '}
                    <Link
                        href={route('register')}
                        className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                        {isMm ? 'အကောင့်အသစ်ဖွင့်ပါ' : 'Register now'}
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
