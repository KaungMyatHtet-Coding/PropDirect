import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Camera, CheckCircle2, AlertCircle, User, Briefcase, MapPin, Phone, CreditCard } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const { user } = usePage().props.auth;
    const { t } = useLanguage();
    const [previewAvatar, setPreviewAvatar] = useState(
        user.avatar ? `/storage/${user.avatar}` : null
    );

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            _method: 'patch',
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            nrc_number: user.nrc_number || '',
            occupation: user.occupation || '',
            current_address: user.current_address || '',
            avatar: null,
        });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('avatar', file);

        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewAvatar(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const requirements = [
        { label: 'Clear Face Photo (Avatar)', done: !!(user.avatar || data.avatar) },
        { label: 'Active Phone Number', done: !!data.phone },
        { label: 'Occupation / Profession', done: !!data.occupation },
        { label: 'Current Residential Address', done: !!data.current_address },
    ];
    const completedCount = requirements.filter((r) => r.done).length;

    return (
        <section className={className}>
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Profile Completion & Verification Details
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        PropDirect requires a verified profile with real face photo to contact owners or list properties.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            user.is_profile_complete
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                                : 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
                        }`}
                    >
                        {user.is_profile_complete ? (
                            <>
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                Profile 100% Complete
                            </>
                        ) : (
                            <>
                                <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                                Profile Incomplete ({completedCount}/4)
                            </>
                        )}
                    </span>
                </div>
            </header>

            {/* Checklist Banner */}
            {!user.is_profile_complete && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                        <span>Complete all 4 items below to unlock direct viewings and landlord privileges:</span>
                    </div>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {requirements.map((req, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                                {req.done ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                ) : (
                                    <span className="h-4 w-4 rounded-full border border-amber-400 bg-white inline-block shrink-0" />
                                )}
                                <span className={req.done ? 'text-slate-800 font-medium line-through' : 'text-amber-900 font-medium'}>
                                    {req.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Avatar Upload */}
                <div>
                    <InputLabel value="Face Photo (Clear Identity Avatar)" />
                    <div className="mt-2 flex items-center gap-5">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100 shadow-sm">
                            {previewAvatar ? (
                                <img
                                    src={previewAvatar}
                                    alt="Avatar Preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                    <User className="h-10 w-10" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
                                <Camera className="h-4 w-4 text-slate-500" />
                                <span>Upload Face Photo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                            <p className="mt-1 text-[11px] text-slate-500">
                                Clear portrait photo (PNG, JPG up to 5MB). Ensures trust with owners and seekers.
                            </p>
                        </div>
                    </div>
                    <InputError className="mt-2" message={errors.avatar} />
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <InputLabel htmlFor="name" value="Full Name" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full rounded-xl border-slate-300"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email Address" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full rounded-xl border-slate-300"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>
                </div>

                {/* Phone & NRC Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <InputLabel htmlFor="phone" value="Phone Number (Direct Contact)" />
                        <div className="relative mt-1">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <TextInput
                                id="phone"
                                className="block w-full pl-9 rounded-xl border-slate-300"
                                placeholder="09XXXXXXXXX"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                required
                            />
                        </div>
                        <InputError className="mt-2" message={errors.phone} />
                    </div>

                    <div>
                        <InputLabel htmlFor="nrc_number" value="NRC Number (National ID)" />
                        <div className="relative mt-1">
                            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <TextInput
                                id="nrc_number"
                                className="block w-full pl-9 font-mono rounded-xl border-slate-300"
                                placeholder="12/DAGAMA(N)123456"
                                value={data.nrc_number}
                                onChange={(e) => setData('nrc_number', e.target.value)}
                            />
                        </div>
                        <InputError className="mt-2" message={errors.nrc_number} />
                    </div>
                </div>

                {/* Occupation & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <InputLabel htmlFor="occupation" value="Occupation / Job Role" />
                        <div className="relative mt-1">
                            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <TextInput
                                id="occupation"
                                className="block w-full pl-9 rounded-xl border-slate-300"
                                placeholder="e.g. Software Engineer, Business Owner"
                                value={data.occupation}
                                onChange={(e) => setData('occupation', e.target.value)}
                                required
                            />
                        </div>
                        <InputError className="mt-2" message={errors.occupation} />
                    </div>

                    <div>
                        <InputLabel htmlFor="current_address" value="Current Residential Address" />
                        <div className="relative mt-1">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <TextInput
                                id="current_address"
                                className="block w-full pl-9 rounded-xl border-slate-300"
                                placeholder="e.g. No. 42, Inya Road, Kamayut, Yangon"
                                value={data.current_address}
                                onChange={(e) => setData('current_address', e.target.value)}
                                required
                            />
                        </div>
                        <InputError className="mt-2" message={errors.current_address} />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <PrimaryButton
                        className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-5 py-2.5 text-xs font-bold"
                        disabled={processing}
                    >
                        Save & Complete Profile
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Profile details saved!
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
