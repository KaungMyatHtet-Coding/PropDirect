import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ShieldCheck, Lock, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function VerifySecondary() {
    const { data, setData, post, processing, errors } = useForm({
        secondary_password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.verify-secondary.verify'));
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
            <Head title="Administrative Security Verification - PropDirect" />

            {/* Background glowing gradients */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-emerald-400/30">
                        <ShieldCheck className="h-9 w-9 text-white" />
                    </div>
                </div>
                <h2 className="mt-5 text-center text-2xl font-black tracking-tight text-white">
                    Platform Regulator Security Gate
                </h2>
                <p className="mt-2 text-center text-xs text-slate-400 max-w-sm mx-auto">
                    Two-Layer Administrative Authorization Required. Please enter your secondary administrative key to unlock auditor privileges.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
                <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/80 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <KeyRound className="h-3.5 w-3.5 text-emerald-400" />
                                Secondary Security Password
                            </label>
                            
                            <TextInput
                                id="secondary_password"
                                type="password"
                                name="secondary_password"
                                value={data.secondary_password}
                                onChange={(e) => setData('secondary_password', e.target.value)}
                                placeholder="••••••••"
                                isFocused={true}
                                className="block w-full rounded-xl border-slate-700 bg-slate-900/80 text-white placeholder-slate-500"
                            />

                            <InputError message={errors.secondary_password} className="mt-2" />

                            <p className="mt-2 text-[11px] text-slate-400">
                                Default system credential: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-emerald-400 font-mono">admin1234</code>
                            </p>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-600/30 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition disabled:opacity-50 cursor-pointer"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                {processing ? 'Verifying Security Token...' : 'Unlock Administrative Console'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 border-t border-slate-700/60 pt-4 flex items-center justify-between text-xs">
                        <Link
                            href={route('properties.index')}
                            className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Return to Public Portal
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-slate-400 hover:text-rose-400 transition"
                        >
                            Sign Out
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
