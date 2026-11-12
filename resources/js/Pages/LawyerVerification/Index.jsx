import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RoleBadge from '@/Components/RoleBadge';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useLanguage } from '@/Contexts/LanguageContext';
import { YANGON_TOWNSHIPS } from '@/utils/yangonTownships';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Scale,
    ShieldCheck,
    Clock,
    CheckCircle2,
    XCircle,
    UploadCloud,
    Building2,
    Eye,
    AlertTriangle,
    CreditCard,
    FileCheck2,
    RefreshCw,
} from 'lucide-react';

export default function LawyerVerificationIndex({ lawyerProfile, user }) {
    const { lang, t } = useLanguage();
    const [previewCard, setPreviewCard] = useState(null);
    const [selectedDocModal, setSelectedDocModal] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        license_number: lawyerProfile?.license_number || '',
        lawyer_type: lawyerProfile?.lawyer_type || 'advocate',
        degree: lawyerProfile?.degree || 'LL.B',
        experience_years: lawyerProfile?.experience_years || 5,
        specialization:
            lawyerProfile?.specialization ||
            'Grant Verification, Sale & Lease Contracts, Newspaper Notice',
        consultation_fee: lawyerProfile?.consultation_fee || 50000,
        contract_fee: lawyerProfile?.contract_fee || 100000,
        office_township: lawyerProfile?.office_township || 'sanchaung',
        bio: lawyerProfile?.bio || '',
        license_card_image: null,
    });

    const handleFileChange = (file) => {
        if (!file) return;
        setData('license_card_image', file);

        const reader = new FileReader();
        reader.onload = (e) => setPreviewCard(e.target.result);
        reader.readAsDataURL(file);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('lawyer.verification.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset('license_card_image');
                setPreviewCard(null);
            },
        });
    };

    const isPending = lawyerProfile?.status === 'pending';
    const isApproved = lawyerProfile?.status === 'approved';
    const isRejected = lawyerProfile?.status === 'rejected';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Legal Lawyer Verification
                            </h2>
                            <RoleBadge role={user?.role} isVerifiedOwner={user?.is_verified_owner} />
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                            Bar Council Certified Advocate & Higher Grade Pleader Verification
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 shadow-2xs">
                        <Scale className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span>Trusted Legal Property Advisory</span>
                    </div>
                </div>
            }
        >
            <Head title="Lawyer Verification - PropDirect" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* 1. Status Banners */}
                {isApproved && (
                    <div className="mb-8 overflow-hidden rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-6 shadow-xs">
                        <div className="flex items-start gap-4">
                            <div className="rounded-xl bg-emerald-600 p-3 text-white shadow-md shadow-emerald-500/20">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                    Approved & Certified
                                </span>
                                <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                    You are a Certified PropDirect Legal Lawyer!
                                </h3>
                                <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">
                                    Your Bar Council credentials and practicing license have been confirmed. Your profile
                                    is now highlighted in our Verified Lawyers Directory for property contracts and title verifications.
                                </p>
                                <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium text-slate-600 dark:text-zinc-400">
                                    <span>• Bar License: <strong className="text-slate-800 dark:text-white">{lawyerProfile.license_number}</strong></span>
                                    <span>• Type: <strong className="text-slate-800 dark:text-white capitalize">{lawyerProfile.lawyer_type.replace('_', ' ')}</strong></span>
                                    <span>• Experience: <strong className="text-slate-800 dark:text-white">{lawyerProfile.experience_years} Years</strong></span>
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
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 text-xs font-bold text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                    Under Bar License Review
                                </span>
                                <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                    Lawyer Application Pending Audit
                                </h3>
                                <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">
                                    We are auditing your Bar License No. (<strong>{lawyerProfile.license_number}</strong>)
                                    and official license card against Bar Council registry. Review typically takes 24-48 hours.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSelectedDocModal(`/storage/${lawyerProfile.license_card_image}`)}
                                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-amber-50 dark:hover:bg-zinc-700 shadow-2xs transition"
                                >
                                    <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                    View Submitted License Card
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isRejected && (
                    <div className="mb-8 overflow-hidden rounded-2xl border border-red-200 dark:border-rose-800 bg-gradient-to-r from-red-50 to-rose-50 dark:from-rose-950/30 dark:to-red-950/30 p-6 shadow-xs">
                        <div className="flex items-start gap-4">
                            <div className="rounded-xl bg-rose-600 p-3 text-white">
                                <XCircle className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                    Verification Rejected
                                </span>
                                <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                    Application Rejected
                                </h3>
                                <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">
                                    {lawyerProfile.admin_remark || 'License information could not be verified. Please rectify and re-apply.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left 2 Cols: Form */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs sm:p-8">
                            <div className="border-b border-slate-100 dark:border-zinc-800 pb-5">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {isPending ? 'Your Application Details' : 'Apply as a Verified Legal Lawyer'}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                                    Provide your Bar Council license details to join our legal network for contract drafting and title verification.
                                </p>
                            </div>

                            {!isPending && (
                                <form onSubmit={submit} className="mt-6 space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {/* License Number */}
                                        <div>
                                            <InputLabel htmlFor="license_number" value="Bar Council License Number" />
                                            <TextInput
                                                id="license_number"
                                                className="mt-1 block w-full rounded-xl font-mono"
                                                placeholder="e.g. ADV-10294 / HGP-29401"
                                                value={data.license_number}
                                                onChange={(e) => setData('license_number', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.license_number} className="mt-1" />
                                        </div>

                                        {/* Lawyer Type */}
                                        <div>
                                            <InputLabel htmlFor="lawyer_type" value="Lawyer Designation" />
                                            <select
                                                id="lawyer_type"
                                                className="mt-1 block w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                                value={data.lawyer_type}
                                                onChange={(e) => setData('lawyer_type', e.target.value)}
                                            >
                                                <option value="advocate" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Advocate [တရားလွှတ်တော်ရှေ့နေ]</option>
                                                <option value="higher_grade_pleader" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Higher Grade Pleader [အထက်တန်းရှေ့နေ]</option>
                                            </select>
                                            <InputError message={errors.lawyer_type} className="mt-1" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                        {/* Degree */}
                                        <div>
                                            <InputLabel htmlFor="degree" value="Degree / Education" />
                                            <TextInput
                                                id="degree"
                                                className="mt-1 block w-full rounded-xl"
                                                placeholder="e.g. LL.B, LL.M"
                                                value={data.degree}
                                                onChange={(e) => setData('degree', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.degree} className="mt-1" />
                                        </div>

                                        {/* Experience */}
                                        <div>
                                            <InputLabel htmlFor="experience_years" value="Years of Experience" />
                                            <TextInput
                                                id="experience_years"
                                                type="number"
                                                min="0"
                                                className="mt-1 block w-full rounded-xl"
                                                value={data.experience_years}
                                                onChange={(e) => setData('experience_years', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.experience_years} className="mt-1" />
                                        </div>

                                        {/* Office Township */}
                                        <div>
                                            <InputLabel htmlFor="office_township" value="Office Township (Yangon)" />
                                            <select
                                                id="office_township"
                                                className="mt-1 block w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                                value={data.office_township}
                                                onChange={(e) => setData('office_township', e.target.value)}
                                            >
                                                {YANGON_TOWNSHIPS.map((t) => (
                                                    <option key={t.id} value={t.en} className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">
                                                        {lang === 'mm' ? `${t.mm} (${t.en})` : `${t.en} [${t.mm}]`}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.office_township} className="mt-1" />
                                        </div>
                                    </div>

                                    {/* Fees Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <InputLabel htmlFor="consultation_fee" value="Consultation Fee (MMK)" />
                                            <TextInput
                                                id="consultation_fee"
                                                type="number"
                                                step="1000"
                                                className="mt-1 block w-full rounded-xl"
                                                placeholder="50000"
                                                value={data.consultation_fee}
                                                onChange={(e) => setData('consultation_fee', e.target.value)}
                                                required
                                            />
                                            <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">Per title/contract advisory session</p>
                                            <InputError message={errors.consultation_fee} className="mt-1" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="contract_fee" value="Contract Drafting Fee (MMK)" />
                                            <TextInput
                                                id="contract_fee"
                                                type="number"
                                                step="1000"
                                                className="mt-1 block w-full rounded-xl"
                                                placeholder="100000"
                                                value={data.contract_fee}
                                                onChange={(e) => setData('contract_fee', e.target.value)}
                                                required
                                            />
                                            <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">Standard sale/lease contract preparation</p>
                                            <InputError message={errors.contract_fee} className="mt-1" />
                                        </div>
                                    </div>

                                    {/* Specialization */}
                                    <div>
                                        <InputLabel htmlFor="specialization" value="Legal Specializations" />
                                        <TextInput
                                            id="specialization"
                                            className="mt-1 block w-full rounded-xl"
                                            placeholder="e.g. Grant Verification, Sale Contracts, Newspaper Objections"
                                            value={data.specialization}
                                            onChange={(e) => setData('specialization', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.specialization} className="mt-1" />
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <InputLabel htmlFor="bio" value="Professional Bio / Experience Summary" />
                                        <textarea
                                            id="bio"
                                            rows="3"
                                            className="mt-1 block w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-sm focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                                            placeholder="Describe your background in property law, notable transactions, or legal practice experience..."
                                            value={data.bio}
                                            onChange={(e) => setData('bio', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.bio} className="mt-1" />
                                    </div>

                                    {/* License Card Upload */}
                                    <div>
                                        <InputLabel value="Bar Council License Card (Photo/Scan)" />
                                        <div className="mt-2 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 p-4 transition hover:bg-slate-100 dark:hover:bg-zinc-800">
                                            {previewCard ? (
                                                <div className="relative w-full">
                                                    <img
                                                        src={previewCard}
                                                        alt="License Card Preview"
                                                        className="h-40 w-full rounded-xl object-contain bg-slate-900"
                                                    />
                                                    <span className="mt-2 block text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                        Card Selected ✓
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-center">
                                                    <UploadCloud className="h-8 w-8 text-slate-400 dark:text-zinc-500" />
                                                    <span className="mt-2 text-xs font-medium text-slate-600 dark:text-zinc-300">
                                                        Upload Bar Council License Card
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">PNG, JPG up to 5MB</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e.target.files[0])}
                                                className="mt-3 block w-full text-xs text-slate-500 dark:text-zinc-400 file:mr-2 file:rounded-xl file:border-0 file:bg-slate-900 dark:file:bg-zinc-700 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800 dark:hover:file:bg-zinc-600 cursor-pointer"
                                                required={!isApproved}
                                            />
                                        </div>
                                        <InputError message={errors.license_card_image} className="mt-1" />
                                    </div>

                                    <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-zinc-800">
                                        <PrimaryButton
                                            className="rounded-xl px-5 py-2.5 text-xs font-bold gap-2"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Scale className="h-4 w-4" />
                                            )}
                                            Submit Lawyer Application
                                        </PrimaryButton>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Col: Guidelines */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs">
                            <div className="flex items-center gap-2.5">
                                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/60 p-2 text-amber-600 dark:text-amber-400">
                                    <Scale className="h-5 w-5" />
                                </div>
                                <h4 className="text-base font-bold text-slate-900 dark:text-white">Why Join as a Lawyer?</h4>
                            </div>
                            <p className="mt-2 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                                Yangon property transactions require authentic title deed verification, newspaper notices,
                                and legally sound lease/sale contracts.
                            </p>
                            <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-zinc-300">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <span>Direct client referrals from property seekers and landlords.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <span>Verified Lawyer Badge and listing in public legal directory.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <span>Transparent consultation & contract drafting fees.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Lightbox */}
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
                            <span className="text-sm font-bold text-slate-800 dark:text-white">License Card Inspection</span>
                            <button
                                onClick={() => setSelectedDocModal(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-zinc-200 transition"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>
                        <img
                            src={selectedDocModal}
                            alt="License Card"
                            className="max-h-[75vh] w-full rounded-lg object-contain bg-slate-900"
                        />
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
