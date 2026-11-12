import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateSecondaryPasswordForm from './Partials/UpdateSecondaryPasswordForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';

    return (
        <AuthenticatedLayout header="Account Settings & Security">
            <Head title="Profile & Settings" />

            <div className="py-6 space-y-6">
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-2xl"
                    />
                </div>

                {isAdmin && (
                    <div className="bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-950/80 p-6 rounded-2xl shadow-xs">
                        <UpdateSecondaryPasswordForm className="max-w-2xl" />
                    </div>
                )}

                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs">
                    <UpdatePasswordForm className="max-w-2xl" />
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs">
                    <DeleteUserForm className="max-w-2xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
