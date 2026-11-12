import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { getTownshipName } from '@/utils/yangonTownships';
import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    PlusCircle,
    Eye,
    CheckCircle2,
    Clock,
    Home,
    MapPin,
    Layers,
    DollarSign,
} from 'lucide-react';

export default function OwnerPropertiesIndex({ properties }) {
    const { lang, t } = useLanguage();

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {t('nav_my_properties')}
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="h-3 w-3" />
                                Verified Landlord
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                            Manage your direct zero-broker listings, viewing inquiries, and tenancy status.
                        </p>
                    </div>

                    <Link
                        href={route('owner.properties.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Post Direct Listing</span>
                    </Link>
                </div>
            }
        >
            <Head title="My Properties - PropDirect" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {properties.data?.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center shadow-xs">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                            <Building2 className="h-7 w-7" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No properties listed yet</h3>
                        <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-zinc-400">
                            As a Verified Owner, you can publish authentic listings without broker fees or deceptive markups.
                        </p>
                        <div className="mt-6">
                            <Link
                                href={route('owner.properties.create')}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                            >
                                <PlusCircle className="h-4 w-4" />
                                <span>Create Your First Listing</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.data.map((prop) => (
                            <div
                                key={prop.id}
                                className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs transition hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                                    {prop.images && prop.images[0] ? (
                                        <img
                                            src={`/storage/${prop.images[0]}`}
                                            alt={prop.title}
                                            className="h-full w-full object-cover transition group-hover:scale-105 duration-300"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-500">
                                            <Building2 className="h-10 w-10" />
                                        </div>
                                    )}

                                    <div className="absolute top-3 left-3 flex gap-1.5">
                                        <span className="rounded-lg bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-bold text-white uppercase">
                                            {prop.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                                        </span>
                                        <span className="rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white uppercase">
                                            {prop.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-zinc-300">
                                            <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
                                            {getTownshipName(prop.township, lang)}, Yangon
                                        </span>
                                        <span className="font-mono">{prop.area_sqft} sqft</span>
                                    </div>

                                    <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white truncate">
                                        {prop.title}
                                    </h4>

                                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-600 dark:text-zinc-400">
                                        <span>{prop.bedrooms} Bed</span>
                                        <span>•</span>
                                        <span>{prop.bathrooms} Bath</span>
                                        <span>•</span>
                                        <span className="capitalize">{prop.floor_level} Floor</span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800">
                                        <div>
                                            <span className="text-xs text-slate-400 dark:text-zinc-500">Price</span>
                                            <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                                                {Number(prop.price).toLocaleString()} Ks
                                                {prop.listing_type === 'rent' && <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">/mo</span>}
                                            </div>
                                        </div>

                                        <Link
                                            href={route('properties.show', prop.slug)}
                                            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition"
                                        >
                                            <Eye className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
                                            <span>View Listing</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
