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
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Lawyer Verifications Admin Queue
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                                <Scale className="h-3 w-3" />
                                Bar Council Audit
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            Audit Bar Council License cards, advocate practice standing, and approve verified legal profiles.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-500">
                            Pending Audit: <strong className="text-amber-600">{stats.pending}</strong>
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
                        className={`cursor-pointer rounded-2xl border p-5 transition shadow-sm ${
                            filters?.status === 'all'
                                ? 'border-slate-800 bg-white ring-2 ring-slate-800'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Total Lawyers
                            </span>
                            <FileText className="h-4 w-4 text-slate-400" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-slate-900">{stats.total}</p>
                    </div>

                    <div
                        onClick={() => handleFilterStatus('pending')}
                        className={`cursor-pointer rounded-2xl border p-5 transition shadow-sm ${
                            filters?.status === 'pending'
                                ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500'
                                : 'border-slate-200 bg-white hover:border-amber-200'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                                Pending Audit
                            </span>
                            <Clock className="h-4 w-4 text-amber-500 animate-pulse" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-amber-600">{stats.pending}</p>
                    </div>

                    <div
                        onClick={() => handleFilterStatus('approved')}
                        className={`cursor-pointer rounded-2xl border p-5 transition shadow-sm ${
                            filters?.status === 'approved'
                                ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500'
                                : 'border-slate-200 bg-white hover:border-emerald-200'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                                Approved Lawyers
                            </span>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-emerald-600">{stats.approved}</p>
                    </div>

                    <div
                        onClick={() => handleFilterStatus('rejected')}
                        className={`cursor-pointer rounded-2xl border p-5 transition shadow-sm ${
                            filters?.status === 'rejected'
                                ? 'border-red-500 bg-red-50/50 ring-2 ring-red-500'
                                : 'border-slate-200 bg-white hover:border-red-200'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
                                Rejected
                            </span>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-red-600">{stats.rejected}</p>
                    </div>
                </div>

                {/* 2. Search & Filters */}
                <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
                        {['all', 'pending', 'approved', 'rejected'].map((st) => (
                            <button
                                key={st}
                                onClick={() => handleFilterStatus(st)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
                                    (filters?.status || 'all') === st
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {st} {st === 'pending' && stats.pending > 0 && `(${stats.pending})`}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search lawyer name, license, township..."
                            className="w-full sm:w-72 rounded-xl border-slate-300 pl-9 pr-20 text-xs focus:border-slate-500 focus:ring-slate-500"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* 3. Table */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Lawyer</th>
                                    <th className="px-6 py-4">License & Credential</th>
                                    <th className="px-6 py-4">Specialization & Office</th>
                                    <th className="px-6 py-4">Fees</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {lawyers.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-slate-500 text-sm">
                                            No lawyer applications found.
                                        </td>
                                    </tr>
                                ) : (
                                    lawyers.data.map((item) => (
                                        <tr key={item.id} className="transition hover:bg-slate-50/80">
                                            {/* Lawyer Profile */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                                        {item.user?.avatar ? (
                                                            <img
                                                                src={`/storage/${item.user.avatar}`}
                                                                alt={item.user.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center font-bold text-slate-500">
                                                                {item.user?.name?.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{item.user?.name}</div>
                                                        <div className="text-xs text-slate-500">{item.user?.email}</div>
                                                        <div className="text-xs font-mono text-emerald-700">📞 {item.user?.phone}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* License Info */}
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-xs font-bold text-slate-800">
                                                    {item.license_number}
                                                </div>
                                                <div className="text-xs font-semibold text-amber-700 capitalize">
                                                    {item.lawyer_type.replace('_', ' ')}
                                                </div>
                                                <div className="text-[11px] text-slate-400">
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
                                                    className="mt-1.5 inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
                                                >
                                                    <Eye className="h-3 w-3 text-slate-500" />
                                                    Inspect Card
                                                </button>
                                            </td>

                                            {/* Specialization & Office */}
                                            <td className="px-6 py-4 max-w-xs">
                                                <div className="text-xs font-semibold text-slate-800 truncate">
                                                    {item.specialization}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    📍 {item.office_township}, Yangon
                                                </div>
                                                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                                    {item.bio}
                                                </div>
                                            </td>

                                            {/* Fees */}
                                            <td className="px-6 py-4">
                                                <div className="text-xs">
                                                    Consult: <strong className="text-slate-800">{Number(item.consultation_fee).toLocaleString()} Ks</strong>
                                                </div>
                                                <div className="text-xs">
                                                    Contract: <strong className="text-slate-800">{Number(item.contract_fee).toLocaleString()} Ks</strong>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                {item.status === 'pending' && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                                        <Clock className="h-3 w-3 animate-pulse" />
                                                        Pending
                                                    </span>
                                                )}
                                                {item.status === 'approved' && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Approved
                                                    </span>
                                                )}
                                                {item.status === 'rejected' && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 ring-1 ring-inset ring-red-600/20">
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
                                                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
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
                                                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100"
                                                            >
                                                                <XCircle className="h-3.5 w-3.5" />
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => setApprovingItem(item)}
                                                            className="text-xs text-slate-500 hover:text-emerald-700 underline"
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
                        className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-white p-5 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-3 flex items-center justify-between border-b pb-3">
                            <h4 className="text-sm font-bold text-slate-800">{selectedImage.title}</h4>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
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
                        className="relative max-w-md w-full overflow-hidden rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 text-emerald-600">
                            <div className="rounded-xl bg-emerald-50 p-2.5">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Approve Legal Lawyer</h3>
                        </div>

                        <p className="mt-3 text-sm text-slate-600">
                            Approve lawyer credential for <strong>{approvingItem.user?.name}</strong>?
                            Their role will be upgraded to <strong>Verified Lawyer ⚖️</strong>.
                        </p>

                        <form onSubmit={submitApproval} className="mt-4">
                            <label className="block text-xs font-semibold text-slate-700">Audit Notes</label>
                            <input
                                type="text"
                                value={approveData.admin_remark}
                                onChange={(e) => setApproveData('admin_remark', e.target.value)}
                                className="mt-1 w-full rounded-xl border-slate-300 text-xs focus:border-emerald-500 focus:ring-emerald-500"
                            />
                            <div className="mt-5 flex justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setApprovingItem(null)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={approvingProcessing}
                                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
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
                        className="relative max-w-md w-full overflow-hidden rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 text-red-600">
                            <div className="rounded-xl bg-red-50 p-2.5">
                                <XCircle className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Reject Application</h3>
                        </div>

                        <form onSubmit={submitRejection} className="mt-4 space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">
                                    Rejection Reason <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows="3"
                                    value={rejectData.admin_remark}
                                    onChange={(e) => setRejectData('admin_remark', e.target.value)}
                                    placeholder="e.g. License card is unverified or expired."
                                    className="mt-1 w-full rounded-xl border-slate-300 text-xs focus:border-red-500 focus:ring-red-500"
                                    required
                                />
                                {rejectErrors.admin_remark && (
                                    <p className="mt-1 text-xs text-red-600">{rejectErrors.admin_remark}</p>
                                )}
                            </div>
                            <div className="mt-5 flex justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setRejectingItem(null)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={rejectingProcessing}
                                    className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700"
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
