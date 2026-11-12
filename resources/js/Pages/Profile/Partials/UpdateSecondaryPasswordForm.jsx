import React from 'react';
import { useForm } from '@inertiajs/react';
import { ShieldCheck, KeyRound, Check } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function UpdateSecondaryPasswordForm({ className = '' }) {
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        current_secondary_password: '',
        new_secondary_password: '',
        new_secondary_password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.secondary-password.update'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <section className={className}>
            <header className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        Administrator Secondary Security Key
                    </h2>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                    Two-layer gate key used for approving verifications and platform audit actions. Default: <code className="text-emerald-600 dark:text-emerald-400 font-mono">admin1234</code>.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                    <InputLabel htmlFor="current_secondary_password" value="Current Secondary Password *" />
                    <TextInput
                        id="current_secondary_password"
                        type="password"
                        value={data.current_secondary_password}
                        onChange={(e) => setData('current_secondary_password', e.target.value)}
                        required
                        className="mt-1 block w-full rounded-xl"
                    />
                    <InputError message={errors.current_secondary_password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="new_secondary_password" value="New Secondary Password (min 6 characters) *" />
                    <TextInput
                        id="new_secondary_password"
                        type="password"
                        value={data.new_secondary_password}
                        onChange={(e) => setData('new_secondary_password', e.target.value)}
                        required
                        className="mt-1 block w-full rounded-xl"
                    />
                    <InputError message={errors.new_secondary_password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="new_secondary_password_confirmation" value="Confirm New Secondary Password *" />
                    <TextInput
                        id="new_secondary_password_confirmation"
                        type="password"
                        value={data.new_secondary_password_confirmation}
                        onChange={(e) => setData('new_secondary_password_confirmation', e.target.value)}
                        required
                        className="mt-1 block w-full rounded-xl"
                    />
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
                    <PrimaryButton
                        type="submit"
                        disabled={processing}
                        className="rounded-xl px-5 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700"
                    >
                        {processing ? 'Updating...' : 'Update Secondary Key'}
                    </PrimaryButton>

                    {recentlySuccessful && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Check className="h-4 w-4" /> Updated Successfully
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
