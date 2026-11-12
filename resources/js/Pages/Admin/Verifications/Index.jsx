import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RoleBadge from '@/Components/RoleBadge';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    ShieldCheck,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Eye,
    Filter,
    UserCheck,
    Building2,
    FileText,
    AlertCircle,
    ExternalLink,
    X,
} from 'lucide-react';

export default function AdminVerificationsIndex({ verifications, filters, stats }) {
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
        admin_remark: 'Verified Genuine Property Owner via NRC & Utility Audit.',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('admin.verifications.index'),
            {
                status: filters?.status || 'all',
                search: searchTerm,
            },
            { preserveState: true }
        );
    };

    const handleFilterStatus = (newStatus) => {
        router.get(
            route('admin.verifications.index'),
            {
                status: newStatus,
                search: searchTerm,
            },
            { preserveState: true }
        );
    };

    const confirmApprove = (item) => {
        setApprovingItem(item);
    };

    const submitApproval = (e) => {
        e.preventDefault();
        postApprove(route('admin.verifications.approve', approvingItem.id), {
            onSuccess: () => setApprovingItem(null),
        });
    };

    const openRejectModal = (item) => {
        setRejectingItem(item);
        setRejectData('admin_remark', '');
    };

    const submitRejection = (e) => {
        e.preventDefault();
        postReject(route('admin.verifications.reject', rejectingItem.id), {
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
                                Admin KYC Verification Panel
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-950/60 px-2.5 py-0.5 text-xs font-bold text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                <ShieldAlert className="h-3 w-3" />
                                Anti-Broker Gatekeeper
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                            Audit ownership documents, verify NRC identities, and prevent unauthorized brokers from listing.
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
            <Head title="Admin KYC Verifications - PropDirect" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* 1. Stat Summary Cards */}
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
                                All Requests
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
                                Approved Owners
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

                {/* 2. Filters & Search Bar */}
                <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    {/* Status Tabs */}
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

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <Search className="absolute left-3 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search applicant, NRC, or phone..."
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

                {/* 3. KYC Requests Table */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-zinc-300">
                            <thead className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                                <tr>
                                    <th className="px-6 py-4">Applicant Profile</th>
                                    <th className="px-6 py-4">NRC Card</th>
                                    <th className="px-6 py-4">Utility Meter Proof</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Audit Details</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {verifications.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center">
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500">
                                                <ShieldCheck className="h-6 w-6" />
                                            </div>
                                            <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-zinc-300">
                                                No verification applications found.
                                            </p>
                                            <p className="text-xs text-slate-400 dark:text-zinc-500">
                                                Try adjusting your filter or search query.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    verifications.data.map((item) => (
                                        <tr key={item.id} className="transition hover:bg-slate-50/80 dark:hover:bg-zinc-800/40">
                                            {/* User Info */}
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 dark:text-white">{item.user?.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-zinc-400">{item.user?.email}</div>
                                                <div className="mt-1 font-mono text-xs text-emerald-700 dark:text-emerald-400">
                                                    📞 {item.user?.phone || 'No phone'}
                                                </div>
                                                <div className="mt-1">
                                                    <RoleBadge role={item.user?.role} isVerifiedOwner={item.user?.is_verified_owner} />
                                                </div>
                                            </td>

                                            {/* NRC Column */}
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs font-bold text-slate-800 dark:text-zinc-200">
                                                    {item.nrc_number}
                                                </span>
                                                <div className="mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedImage({
                                                                url: `/storage/${item.nrc_front_image}`,
                                                                title: `NRC Front - ${item.user?.name} (${item.nrc_number})`,
                                                            })
                                                        }
                                                        className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition"
                                                    >
                                                        <Eye className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
                                                        <span>Inspect NRC</span>
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Utility Bill Column */}
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-slate-500 dark:text-zinc-400">YESC / Water Bill</span>
                                                <div className="mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedImage({
                                                                url: `/storage/${item.utility_bill_image}`,
                                                                title: `Utility Bill - ${item.user?.name}`,
                                                            })
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition"
                                                    >
                                                        <Building2 className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
                                                        <span>Inspect Bill</span>
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
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
                                                <div className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
                                                    Submitted: {new Date(item.created_at).toLocaleDateString()}
                                                </div>
                                            </td>

                                            {/* Audit Log / Admin Remark */}
                                            <td className="px-6 py-4 max-w-xs">
                                                {item.reviewed_by ? (
                                                    <div className="text-xs">
                                                        <div className="text-slate-700 dark:text-zinc-300">
                                                            Auditor: <strong>{item.reviewer?.name || 'Admin'}</strong>
                                                        </div>
                                                        <div className="text-slate-400 dark:text-zinc-500 text-[11px]">
                                                            {new Date(item.reviewed_at).toLocaleDateString()}
                                                        </div>
                                                        {item.admin_remark && (
                                                            <div className="mt-1 rounded-lg bg-slate-100 dark:bg-zinc-800 p-1.5 text-[11px] italic text-slate-600 dark:text-zinc-300">
                                                                "{item.admin_remark}"
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 dark:text-zinc-500 italic">Not reviewed yet</span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {item.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => confirmApprove(item)}
                                                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 cursor-pointer"
                                                            >
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                                Approve
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => openRejectModal(item)}
                                                                className="inline-flex items-center gap-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition hover:bg-rose-100 dark:hover:bg-rose-900/60 cursor-pointer"
                                                            >
                                                                <XCircle className="h-3.5 w-3.5" />
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                            <button
                                                                type="button"
                                                                onClick={() => confirmApprove(item)}
                                                                className="text-xs text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 underline cursor-pointer"
                                                            >
                                                                {item.status === 'approved' ? 'Re-Approve' : 'Re-Evaluate'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {verifications.links && verifications.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3">
                            <div className="text-xs text-slate-500 dark:text-zinc-400">
                                Showing <strong>{verifications.from || 0}</strong> to <strong>{verifications.to || 0}</strong> of{' '}
                                <strong>{verifications.total}</strong> requests
                            </div>
                            <div className="flex gap-1">
                                {verifications.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        preserveState
                                        className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                                            link.active
                                                ? 'bg-emerald-600 text-white'
                                                : link.url
                                                ? 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                                                : 'text-slate-300 dark:text-zinc-600 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Document Full Image Preview Lightbox */}
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

            {/* Approve Confirmation Modal */}
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
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Approve Property Owner</h3>
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
                            Are you sure you want to approve <strong>{approvingItem.user?.name}</strong>?
                            Their role will be upgraded to <strong>Owner</strong> with <strong>Verified Owner ✓</strong> status.
                        </p>

                        <form onSubmit={submitApproval} className="mt-4">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                Optional Approval Remark / Notes
                            </label>
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
                                    {approvingProcessing ? 'Approving...' : 'Confirm & Grant Verified Owner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rejection Modal with Remark Form */}
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
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reject KYC Application</h3>
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
                            Rejecting application for <strong>{rejectingItem.user?.name}</strong>. Please provide a clear
                            explanation of why this request could not be approved so the user can rectify and re-submit.
                        </p>

                        <form onSubmit={submitRejection} className="mt-4 space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                    Rejection Reason / Admin Remark <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    rows="3"
                                    value={rejectData.admin_remark}
                                    onChange={(e) => setRejectData('admin_remark', e.target.value)}
                                    placeholder="e.g. Utility meter name does not match NRC, or image is too blurry to read."
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
