import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RoleBadge from '@/Components/RoleBadge';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    ShieldCheck,
    ShieldAlert,
    Clock,
    CheckCircle2,
    XCircle,
    FileText,
    UploadCloud,
    Building2,
    Eye,
    AlertTriangle,
    ArrowRight,
    RefreshCw,
    Lock,
} from 'lucide-react';

export default function OwnerVerificationIndex({ verification, user }) {
    const [previewNrc, setPreviewNrc] = useState(null);
    const [previewUtility, setPreviewUtility] = useState(null);
    const [selectedDocModal, setSelectedDocModal] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        phone: user?.phone || '',
        nrc_number: verification?.nrc_number || '',
        nrc_front_image: null,
        utility_bill_image: null,
    });

    const handleFileChange = (field, file) => {
        if (!file) return;
        setData(field, file);

        const reader = new FileReader();
        reader.onload = (e) => {
            if (field === 'nrc_front_image') setPreviewNrc(e.target.result);
            if (field === 'utility_bill_image') setPreviewUtility(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('owner.verification.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset('nrc_front_image', 'utility_bill_image');
                setPreviewNrc(null);
                setPreviewUtility(null);
            },
        });
    };

    const isPending = verification?.status === 'pending';
    const isApproved = verification?.status === 'approved';
    const isRejected = verification?.status === 'rejected';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Owner KYC Verification
                            </h2>
                            <RoleBadge role={user?.role} isVerifiedOwner={user?.is_verified_owner} />
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                            Anti-Broker Property Trust Network • 100% Direct Landlord Authentication
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                        <Lock className="h-4 w-4" />
                        <span>Zero Agent Fees Guarantee</span>
                    </div>
                </div>
            }
        >
            <Head title="Owner Verification - PropDirect" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* 1. Status Cards Banner */}
                {isApproved && (
                    <div className="mb-8 overflow-hidden rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-6 shadow-xs">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="rounded-xl bg-emerald-600 p-3 text-white shadow-md shadow-emerald-500/20">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <div>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                        Approved & Active
                                    </span>
                                    <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                        You are a Verified Property Owner!
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">
                                        Your identity and property utility documents have been reviewed and approved. You
                                        now hold full privileges to list properties, manage rental contracts, and communicate
                                        directly with seekers without any intermediaries.
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium text-slate-600 dark:text-zinc-400">
                                        <span>• NRC: <strong className="text-slate-800 dark:text-white">{verification.nrc_number}</strong></span>
                                        <span>• Reviewed: <strong className="text-slate-800 dark:text-white">{new Date(verification.reviewed_at).toLocaleDateString()}</strong></span>
                                        {verification.admin_remark && (
                                            <span>• Admin Remark: <em className="text-slate-700 dark:text-zinc-300">"{verification.admin_remark}"</em></span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isPending && (
                    <div className="mb-8 overflow-hidden rounded-2xl border border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-6 shadow-xs">
                        <div className="flex items-start gap-4">
                            <div className="rounded-xl bg-amber-500 p-3 text-white shadow-md shadow-amber-500/20">
                                <Clock className="h-8 w-8 animate-pulse" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 text-xs font-bold text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                        Pending Admin Review
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-zinc-400">
                                        Submitted {new Date(verification.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                    Verification Application Under Review
                                </h3>
                                <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">
                                    Our safety team is currently cross-verifying your NRC Number (<strong>{verification.nrc_number}</strong>)
                                    and utility meter record against public township records. This manual anti-broker check prevents middlemen
                                    from posing as owners. Verification typically takes less than 24 hours.
                                </p>

                                {/* Submitted files preview snippet */}
                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDocModal(`/storage/${verification.nrc_front_image}`)}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-amber-50 dark:hover:bg-zinc-700 shadow-2xs transition"
                                    >
                                        <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                        View Submitted NRC Card
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDocModal(`/storage/${verification.utility_bill_image}`)}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-amber-50 dark:hover:bg-zinc-700 shadow-2xs transition"
                                    >
                                        <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                        View Submitted Utility Bill
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isRejected && (
                    <div className="mb-8 overflow-hidden rounded-2xl border border-red-200 dark:border-rose-800 bg-gradient-to-r from-red-50 to-rose-50 dark:from-rose-950/30 dark:to-red-950/30 p-6 shadow-xs">
                        <div className="flex items-start gap-4">
                            <div className="rounded-xl bg-rose-600 p-3 text-white shadow-md shadow-rose-500/20">
                                <XCircle className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                    Verification Rejected
                                </span>
                                <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                    Application Could Not Be Approved
                                </h3>
                                <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">
                                    The administration team was unable to verify your ownership proof. Please check the remark
                                    below and submit updated, clear documentation using the form below.
                                </p>

                                {verification.admin_remark && (
                                    <div className="mt-3 rounded-xl border border-rose-200 dark:border-rose-800 bg-white dark:bg-zinc-800 p-3 text-xs text-rose-900 dark:text-rose-200 shadow-2xs">
                                        <strong className="font-semibold">Reason from Admin:</strong> {verification.admin_remark}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left 2 Cols: Verification Form (Only if not pending, or if rejected/not submitted) */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs sm:p-8">
                            <div className="border-b border-slate-100 dark:border-zinc-800 pb-5">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {isPending
                                        ? 'Application Record'
                                        : isRejected
                                        ? 'Re-Submit Owner Verification'
                                        : 'Become a Verified Owner (No Brokers Allowed)'}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                                    Provide authentic documentation to obtain the <strong>Verified Owner ✓</strong> badge.
                                </p>
                            </div>

                            {isPending ? (
                                <div className="py-8 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                                        <Clock className="h-7 w-7" />
                                    </div>
                                    <h4 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                                        Application Under Audit
                                    </h4>
                                    <p className="mx-auto mt-1 max-w-md text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                                        Your submitted NRC Card and utility meter proof are currently in the administrator's review queue.
                                        You cannot submit another request until this one has been reviewed.
                                    </p>
                                    <div className="mt-6 flex justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedDocModal(`/storage/${verification.nrc_front_image}`)}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 shadow-2xs transition"
                                        >
                                            <Eye className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
                                            Inspect NRC Document
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedDocModal(`/storage/${verification.utility_bill_image}`)}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 shadow-2xs transition"
                                        >
                                            <Eye className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
                                            Inspect Utility Bill
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="mt-6 space-y-6">
                                    {/* Phone Number */}
                                    <div>
                                        <InputLabel htmlFor="phone" value="Phone Number (Direct Contact)" />
                                        <TextInput
                                            id="phone"
                                            type="text"
                                            name="phone"
                                            value={data.phone}
                                            className="mt-1 block w-full rounded-xl"
                                            placeholder="e.g. 09111222333"
                                            onChange={(e) => setData('phone', e.target.value)}
                                            required
                                        />
                                        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                            This will only be unlocked to prospective seekers whose viewing requests you accept.
                                        </p>
                                        <InputError message={errors.phone} className="mt-1" />
                                    </div>

                                    {/* NRC Number */}
                                    <div>
                                        <InputLabel htmlFor="nrc_number" value="National Registration Card (NRC) Number" />
                                        <TextInput
                                            id="nrc_number"
                                            type="text"
                                            name="nrc_number"
                                            value={data.nrc_number}
                                            className="mt-1 block w-full rounded-xl font-mono"
                                            placeholder="e.g. 12/DAGAMA(N)098765"
                                            onChange={(e) => setData('nrc_number', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.nrc_number} className="mt-1" />
                                    </div>

                                    {/* File Upload Grid */}
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        {/* NRC Front Upload */}
                                        <div>
                                            <InputLabel value="NRC Card Front (Photo / Scan)" />
                                            <div className="mt-2 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 p-4 transition hover:bg-slate-100 dark:hover:bg-zinc-800">
                                                {previewNrc ? (
                                                    <div className="relative w-full">
                                                        <img
                                                            src={previewNrc}
                                                            alt="NRC Front Preview"
                                                            className="h-36 w-full rounded-xl object-cover shadow-xs"
                                                        />
                                                        <span className="mt-2 block text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                            NRC Image Selected ✓
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-center">
                                                        <UploadCloud className="h-8 w-8 text-slate-400 dark:text-zinc-500" />
                                                        <span className="mt-2 text-xs font-medium text-slate-600 dark:text-zinc-300">
                                                            Upload NRC Front Image
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 dark:text-zinc-500">PNG, JPG up to 5MB</span>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange('nrc_front_image', e.target.files[0])}
                                                    className="mt-2 block w-full text-xs text-slate-500 dark:text-zinc-400 file:mr-2 file:rounded-xl file:border-0 file:bg-slate-900 dark:file:bg-zinc-700 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800 dark:hover:file:bg-zinc-600 cursor-pointer"
                                                    required={!isApproved}
                                                />
                                            </div>
                                            <InputError message={errors.nrc_front_image} className="mt-1" />
                                        </div>

                                        {/* Utility Bill Upload */}
                                        <div>
                                            <InputLabel value="Electricity / Water Utility Bill (Prove Ownership)" />
                                            <div className="mt-2 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 p-4 transition hover:bg-slate-100 dark:hover:bg-zinc-800">
                                                {previewUtility ? (
                                                    <div className="relative w-full">
                                                        <img
                                                            src={previewUtility}
                                                            alt="Utility Bill Preview"
                                                            className="h-36 w-full rounded-xl object-cover shadow-xs"
                                                        />
                                                        <span className="mt-2 block text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                            Utility Bill Selected ✓
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-center">
                                                        <Building2 className="h-8 w-8 text-slate-400 dark:text-zinc-500" />
                                                        <span className="mt-2 text-xs font-medium text-slate-600 dark:text-zinc-300">
                                                            Upload YESC Meter / Bill
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 dark:text-zinc-500">Electricity or Water Bill</span>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange('utility_bill_image', e.target.files[0])}
                                                    className="mt-2 block w-full text-xs text-slate-500 dark:text-zinc-400 file:mr-2 file:rounded-xl file:border-0 file:bg-slate-900 dark:file:bg-zinc-700 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800 dark:hover:file:bg-zinc-600 cursor-pointer"
                                                    required={!isApproved}
                                                />
                                            </div>
                                            <InputError message={errors.utility_bill_image} className="mt-1" />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                                        <PrimaryButton
                                            className="gap-2 rounded-xl px-5 py-2.5 text-xs font-bold"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <ShieldCheck className="h-4 w-4" />
                                            )}
                                            {isRejected ? 'Re-Submit Verification' : 'Submit for Verification'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Col: Trust Guidelines & Benefits */}
                    <div className="space-y-6">
                        {/* Why Verification Card */}
                        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs">
                            <div className="flex items-center gap-2.5">
                                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/60 p-2 text-emerald-600 dark:text-emerald-400">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <h4 className="text-base font-bold text-slate-900 dark:text-white">Why PropDirect Verifies</h4>
                            </div>
                            <p className="mt-2 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                                In traditional markets, brokers inflate prices and take high commission percentages.
                                PropDirect enforces a strict <strong>Zero Broker Tolerance</strong> policy.
                            </p>

                            <div className="mt-4 space-y-3">
                                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-zinc-300">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong>Direct Landlord Authority:</strong> Only authenticated owners can publish listings.</span>
                                </div>
                                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-zinc-300">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong>Higher Seeker Trust:</strong> Verified listings receive 4x more view requests and close 3x faster.</span>
                                </div>
                                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-zinc-300">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong>Digital Lease Management:</strong> Unlocks version-tracked smart contracts and automated rent ledgers.</span>
                                </div>
                            </div>
                        </div>

                        {/* Document Requirement Rules */}
                        <div className="rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/40 p-6">
                            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                Document Verification Criteria
                            </div>
                            <ul className="mt-3 space-y-2 text-xs text-amber-900 dark:text-amber-300 list-disc list-inside">
                                <li>NRC card must be clear, unblurred, and legible.</li>
                                <li>Utility bill must display owner name or registered township address.</li>
                                <li>Brokers or sub-agents will have their accounts banned permanently.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Preview Lightbox Modal */}
            {selectedDocModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedDocModal(null)}
                >
                    <div
                        className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-2 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
                            <span className="text-sm font-bold text-slate-800 dark:text-white">Document Inspection Viewer</span>
                            <button
                                onClick={() => setSelectedDocModal(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-zinc-200 transition"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>
                        <img
                            src={selectedDocModal}
                            alt="Document Preview"
                            className="max-h-[75vh] w-full rounded-lg object-contain"
                        />
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
