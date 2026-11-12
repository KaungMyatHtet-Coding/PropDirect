import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RoleBadge from '@/Components/RoleBadge';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Scale,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Eye,
    Building2,
    FileText,
    X,
    User,
} from 'lucide-react';

export default function AdminLawyersIndex({ lawyers, filters, stats }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedImage, setSelectedImage] = useState(null);
    const [rejectingItem, setRejectingItem] = useState(null);
    const [approvingItem, setApprovingItem] = useState(null);

    // Rejection Form
    const {
        data: rejectData,
        setData: setRejectData,
        post: postReject,
        processing: rejectingProcessing,
        errors: rejectErrors,
        reset: resetReject,
    } = useForm({
        admin_remark: '',
    });

    // Approval Form
    const {
        data: approveData,
        setData: setApproveData,
        post: postApprove,
        processing: approvingProcessing,
    } = useForm({
        admin_remark: 'Bar Council license verified with authorized practice standing.',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('admin.lawyers.index'),
            {
                status: filters?.status || 'all',
                search: searchTerm,
            },
            { preserveState: true }
        );
    };

    const handleFilterStatus = (newStatus) => {
        router.get(
            route('admin.lawyers.index'),
            {
                status: newStatus,
                search: searchTerm,
            },
            { preserveState: true }
        );
    };

    const submitApproval = (e) => {
        e.preventDefault();
        postApprove(route('admin.lawyers.approve', approvingItem.id), {
            onSuccess: () => setApprovingItem(null),
        });
    };

    const submitRejection = (e) => {
        e.preventDefault();
        postReject(route('admin.lawyers.reject', rejectingItem.id), {
            onSuccess: () => {
                setRejectingItem(null);
                resetReject();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Lawyer Verifications Admin Queue
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                <Scale className="h-3 w-3" />
                                Bar Council Audit
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                            Audit Bar Council License cards, advocate practice standing, and approve verified legal profiles.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                            Pending Audit: <strong className="text-amber-600 dark:text-amber-400">{stats.pending}</strong>
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Admin Lawyer Verifications - PropDirect" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* 1. Stat Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                    <div
                        onClick={() => handleFilterStatus('all')}
                        className={`cursor-pointer rounded-2xl border p-5 transition shadow-xs ${
                            filters?.status === 'all'
                                ? 'border-slate-800 dark:border-zinc-500 bg-white dark:bg-zinc-900 ring-2 ring-slate-800 dark:ring-zinc-600'
                                : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                                Total Lawyers
                            </span>
                            <FileText className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{stats.total}</p>
                    </div>

                    <div
                        onClick={() => handleFilterStatus('pending')}
                        className={`cursor-pointer rounded-2xl border p-5 transition shadow-xs ${
                            filters?.status === 'pending'
                                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 ring-2 ring-amber-500'
                                : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-200'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                Pending Audit
                            </span>
                            <Clock className="h-4 w-4 text-amber-500 animate-pulse" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">{stats.pending}</p>
                    </div>

                    <div
                        onClick={() => handleFilterStatus('approved')}
                        className={`cursor-pointer rounded-2xl border p-5 transition shadow-xs ${
                            filters?.status === 'approved'
                                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-500'
                                : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-200'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                Approved Lawyers
                            </span>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.approved}</p>
                    </div>

                    <div
                        onClick={() => handleFilterStatus('rejected')}
                        className={`cursor-pointer rounded-2xl border p-5 transition shadow-xs ${
                            filters?.status === 'rejected'
                                ? 'border-red-500 bg-red-50/50 dark:bg-rose-950/40 ring-2 ring-red-500'
                                : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-red-200'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-rose-400">
                                Rejected
                            </span>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-red-600 dark:text-rose-400">{stats.rejected}</p>
                    </div>
                </div>

                {/* 2. Search & Filters */}
                <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 dark:bg-zinc-800 p-1">
                        {['all', 'pending', 'approved', 'rejected'].map((st) => (
                            <button
                                key={st}
                                onClick={() => handleFilterStatus(st)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
                                    (filters?.status || 'all') === st
                                        ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs'
                                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                {st} {st === 'pending' && stats.pending > 0 && `(${stats.pending})`}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <Search className="absolute left-3 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search lawyer name, license, township..."
                            className="w-full sm:w-72 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 pl-9 pr-20 text-xs focus:border-slate-500 focus:ring-slate-500 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 rounded-lg bg-slate-900 dark:bg-zinc-700 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-800 dark:hover:bg-zinc-600 cursor-pointer"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* 3. Table */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-zinc-300">
                            <thead className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                                <tr>
                                    <th className="px-6 py-4">Lawyer</th>
                                    <th className="px-6 py-4">License & Credential</th>
                                    <th className="px-6 py-4">Specialization & Office</th>
                                    <th className="px-6 py-4">Fees</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {lawyers.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-slate-500 dark:text-zinc-400 text-sm">
                                            No lawyer applications found.
                                        </td>
                                    </tr>
                                ) : (
                                    lawyers.data.map((item) => (
                                        <tr key={item.id} className="transition hover:bg-slate-50/80 dark:hover:bg-zinc-800/40">
                                            {/* Lawyer Profile */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800">
                                                        {item.user?.avatar ? (
                                                            <img
                                                                src={`/storage/${item.user.avatar}`}
                                                                alt={item.user.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center font-bold text-slate-500 dark:text-zinc-400">
                                                                {item.user?.name?.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 dark:text-white">{item.user?.name}</div>
                                                        <div className="text-xs text-slate-500 dark:text-zinc-400">{item.user?.email}</div>
                                                        <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400">📞 {item.user?.phone}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* License Info */}
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-xs font-bold text-slate-800 dark:text-zinc-200">
                                                    {item.license_number}
                                                </div>
                                                <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 capitalize">
                                                    {item.lawyer_type.replace('_', ' ')}
                                                </div>
                                                <div className="text-[11px] text-slate-400 dark:text-zinc-500">
                                                    {item.degree} • {item.experience_years} Years Exp
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedImage({
                                                            url: `/storage/${item.license_card_image}`,
                                                            title: `Bar License Card - ${item.user?.name} (${item.license_number})`,
                                                        })
                                                    }
                                                    className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 transition"
                                                >
                                                    <Eye className="h-3 w-3 text-slate-500 dark:text-zinc-400" />
                                                    Inspect Card
                                                </button>
                                            </td>

                                            {/* Specialization & Office */}
                                            <td className="px-6 py-4 max-w-xs">
                                                <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">
                                                    {item.specialization}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-zinc-400">
                                                    📍 {item.office_township}, Yangon
                                                </div>
                                                <div className="text-[11px] text-slate-400 dark:text-zinc-500 line-clamp-1 mt-0.5">
                                                    {item.bio}
                                                </div>
                                            </td>

                                            {/* Fees */}
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-slate-600 dark:text-zinc-400">
                                                    Consult: <strong className="text-slate-800 dark:text-white">{Number(item.consultation_fee).toLocaleString()} Ks</strong>
                                                </div>
                                                <div className="text-xs text-slate-600 dark:text-zinc-400">
                                                    Contract: <strong className="text-slate-800 dark:text-white">{Number(item.contract_fee).toLocaleString()} Ks</strong>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                {item.status === 'pending' && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-600/20 dark:ring-amber-500/30">
                                                        <Clock className="h-3 w-3 animate-pulse" />
                                                        Pending
                                                    </span>
                                                )}
                                                {item.status === 'approved' && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-600/20 dark:ring-emerald-500/30">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Approved
                                                    </span>
                                                )}
                                                {item.status === 'rejected' && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 text-xs font-bold text-rose-700 dark:text-rose-300 ring-1 ring-inset ring-rose-600/20 dark:ring-rose-500/30">
                                                        <XCircle className="h-3 w-3" />
                                                        Rejected
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {item.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => setApprovingItem(item)}
                                                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                                                            >
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                                Approve
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setRejectingItem(item);
                                                                    setRejectData('admin_remark', '');
                                                                }}
                                                                className="inline-flex items-center gap-1 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer"
                                                            >
                                                                <XCircle className="h-3.5 w-3.5" />
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => setApprovingItem(item)}
                                                            className="text-xs text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 underline cursor-pointer"
                                                        >
                                                            {item.status === 'approved' ? 'Re-Approve' : 'Re-Evaluate'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Document Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-3 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">{selectedImage.title}</h4>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-zinc-200 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <img
                            src={selectedImage.url}
                            alt="Audit Preview"
                            className="max-h-[75vh] w-full rounded-xl object-contain bg-slate-900"
                        />
                    </div>
                </div>
            )}

            {/* Approve Modal */}
            {approvingItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={() => setApprovingItem(null)}
                >
                    <div
                        className="relative max-w-md w-full overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/60 p-2.5">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Approve Legal Lawyer</h3>
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
                            Approve lawyer credential for <strong>{approvingItem.user?.name}</strong>?
                            Their role will be upgraded to <strong>Verified Lawyer ⚖️</strong>.
                        </p>

                        <form onSubmit={submitApproval} className="mt-4">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">Audit Notes</label>
                            <input
                                type="text"
                                value={approveData.admin_remark}
                                onChange={(e) => setApproveData('admin_remark', e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-xs focus:border-emerald-500 focus:ring-emerald-500"
                            />
                            <div className="mt-5 flex justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setApprovingItem(null)}
                                    className="rounded-xl border border-slate-200 dark:border-zinc-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={approvingProcessing}
                                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                                >
                                    {approvingProcessing ? 'Approving...' : 'Confirm Approval'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectingItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={() => setRejectingItem(null)}
                >
                    <div
                        className="relative max-w-md w-full overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/60 p-2.5">
                                <XCircle className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reject Application</h3>
                        </div>

                        <form onSubmit={submitRejection} className="mt-4 space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                    Rejection Reason <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    rows="3"
                                    value={rejectData.admin_remark}
                                    onChange={(e) => setRejectData('admin_remark', e.target.value)}
                                    placeholder="e.g. License card is unverified or expired."
                                    className="mt-1 w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 text-xs focus:border-rose-500 focus:ring-rose-500 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                                    required
                                />
                                {rejectErrors.admin_remark && (
                                    <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{rejectErrors.admin_remark}</p>
                                )}
                            </div>
                            <div className="mt-5 flex justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setRejectingItem(null)}
                                    className="rounded-xl border border-slate-200 dark:border-zinc-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={rejectingProcessing}
                                    className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition"
                                >
                                    {rejectingProcessing ? 'Rejecting...' : 'Reject Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
