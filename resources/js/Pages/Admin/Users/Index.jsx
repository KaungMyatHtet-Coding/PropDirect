import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RoleBadge from '@/Components/RoleBadge';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Users,
    Search,
    ShieldAlert,
    ShieldCheck,
    Lock,
    Unlock,
    X,
    Eye,
    MapPin,
    Briefcase,
    Phone,
    Mail,
    FileText,
    CheckCircle,
    Building2,
    Scale,
    AlertCircle,
} from 'lucide-react';

export default function UsersIndex({ users, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Selected user for Slide-over
    const [selectedUser, setSelectedUser] = useState(null);

    // Block modal state
    const [blockModalUser, setBlockModalUser] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        blocked_reason: '',
    });

    const handleFilterChange = (newRole, newStatus) => {
        router.get(
            route('admin.users.index'),
            {
                role: newRole,
                status: newStatus,
                search: search,
            },
            { preserveState: true }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(
            route('admin.users.index'),
            {
                role: roleFilter,
                status: statusFilter,
                search: search,
            },
            { preserveState: true }
        );
    };

    const handleBlockSubmit = (e) => {
        e.preventDefault();
        if (!blockModalUser) return;

        post(route('admin.users.block', blockModalUser.id), {
            onSuccess: () => {
                setBlockModalUser(null);
                reset();
                if (selectedUser?.id === blockModalUser.id) {
                    setSelectedUser(null);
                }
            },
        });
    };

    const handleUnblock = (user) => {
        if (confirm(`Are you sure you want to restore access for ${user.name}?`)) {
            router.post(route('admin.users.unblock', user.id), {}, {
                onSuccess: () => {
                    if (selectedUser?.id === user.id) {
                        setSelectedUser(null);
                    }
                },
            });
        }
    };

    return (
        <AuthenticatedLayout header="User Management & History">
            <Head title="User Management - Admin Console" />

            <div className="space-y-6">
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Users className="h-6 w-6 text-emerald-600" />
                            Platform User Directory & Governance
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                            Review registered stakeholders, inspect verified documentation, and manage platform safety sanctions.
                        </p>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xs">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, email, phone, or NRC..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400"
                            />
                        </div>

                        {/* Role filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-semibold shrink-0">Role:</span>
                            <select
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    handleFilterChange(e.target.value, statusFilter);
                                }}
                                className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 py-2"
                            >
                                <option value="all" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">All Roles</option>
                                <option value="owner" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Owners</option>
                                <option value="seeker" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Seekers</option>
                                <option value="lawyer" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Lawyers</option>
                                <option value="admin" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Admins</option>
                            </select>
                        </div>

                        {/* Status filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-semibold shrink-0">Status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    handleFilterChange(roleFilter, e.target.value);
                                }}
                                className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 py-2"
                            >
                                <option value="all" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">All Statuses</option>
                                <option value="verified" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Verified Only</option>
                                <option value="blocked" className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100">Suspended Only</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
                        >
                            Filter
                        </button>
                    </form>
                </div>

                {/* Users Table */}
                <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-zinc-300">
                            <thead className="bg-slate-50 dark:bg-zinc-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
                                <tr>
                                    <th className="px-5 py-3.5">User Details</th>
                                    <th className="px-4 py-3.5">Role & Verification</th>
                                    <th className="px-4 py-3.5">Phone / NRC</th>
                                    <th className="px-4 py-3.5">Properties / Activity</th>
                                    <th className="px-4 py-3.5">Standing</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {users.data.length > 0 ? (
                                    users.data.map((u) => (
                                        <tr
                                            key={u.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition"
                                        >
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    {u.avatar ? (
                                                        <img
                                                            src={`/storage/${u.avatar}`}
                                                            alt={u.name}
                                                            className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-zinc-700"
                                                        />
                                                    ) : (
                                                        <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                                                            {u.name?.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-slate-900 dark:text-white">
                                                            {u.name}
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 dark:text-zinc-500">
                                                            {u.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <RoleBadge role={u.role} isVerifiedOwner={u.is_verified_owner} />
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="text-slate-700 dark:text-zinc-200 font-mono">
                                                    {u.phone || 'No phone'}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-mono">
                                                    {u.nrc_number || 'NRC Not Provided'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2 text-xs">
                                                    {u.role === 'owner' && (
                                                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                                                            <Building2 className="h-3.5 w-3.5" />
                                                            {u.properties_count} listings
                                                        </span>
                                                    )}
                                                    {u.role === 'seeker' && (
                                                        <span className="text-slate-500">
                                                            {u.viewing_requests_as_seeker_count} viewing inquiries
                                                        </span>
                                                    )}
                                                    {u.role === 'lawyer' && (
                                                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                                                            <Scale className="h-3.5 w-3.5" />
                                                            Bar Certified
                                                        </span>
                                                    )}
                                                    {u.role === 'admin' && (
                                                        <span className="text-purple-600 font-bold">Platform Auditor</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {u.is_blocked ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 text-[10px] font-bold text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                                                        <ShieldAlert className="h-3 w-3" />
                                                        Suspended
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                        <CheckCircle className="h-3 w-3" />
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* View Profile Slideover */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedUser(u)}
                                                        className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                                                        title="Inspect User Details"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </button>

                                                    {/* Block / Unblock Button (Admins cannot be blocked) */}
                                                    {u.role !== 'admin' && (
                                                        u.is_blocked ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUnblock(u)}
                                                                className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                                                                title="Unblock User"
                                                            >
                                                                <Unlock className="h-3.5 w-3.5" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setBlockModalUser(u);
                                                                    reset();
                                                                }}
                                                                className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                                                                title="Suspend User Access"
                                                            >
                                                                <Lock className="h-3.5 w-3.5" />
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-xs text-slate-400">
                                            No users found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="px-5 py-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                            <span className="text-slate-400">
                                Showing {users.from} to {users.to} of {users.total} users
                            </span>
                            <div className="flex gap-1">
                                {users.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                                            link.active
                                                ? 'bg-emerald-600 text-white border-emerald-600'
                                                : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* USER DETAIL SLIDE-OVER MODAL */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs">
                    <div className="w-full max-w-md h-full bg-white dark:bg-zinc-900 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
                        <div>
                            {/* Slide-over Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Users className="h-4 w-4 text-emerald-600" />
                                    Stakeholder Record & Audit
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setSelectedUser(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* User Header Profile */}
                            <div className="mt-6 flex items-center gap-3">
                                {selectedUser.avatar ? (
                                    <img
                                        src={`/storage/${selectedUser.avatar}`}
                                        alt={selectedUser.name}
                                        className="h-16 w-16 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
                                    />
                                ) : (
                                    <div className="h-16 w-16 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center">
                                        {selectedUser.name?.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                                        {selectedUser.name}
                                    </h4>
                                    <div className="mt-1">
                                        <RoleBadge role={selectedUser.role} isVerifiedOwner={selectedUser.is_verified_owner} />
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        Joined: {new Date(selectedUser.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="mt-6 space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-800 text-xs">
                                <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                                    <span>{selectedUser.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 font-mono">
                                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                                    <span>{selectedUser.phone || 'Phone Not Registered'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 font-mono">
                                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                                    <span>NRC: {selectedUser.nrc_number || 'Not Submitted'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                                    <span>Occupation: {selectedUser.occupation || 'Not Specified'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                    <span>{selectedUser.current_address || 'Address Not Provided'}</span>
                                </div>
                            </div>

                            {/* Block Info if Suspended */}
                            {selectedUser.is_blocked && (
                                <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 space-y-1">
                                    <div className="font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                                        <AlertCircle className="h-4 w-4" /> Account Suspended
                                    </div>
                                    <p className="text-[11px]">Reason: {selectedUser.blocked_reason}</p>
                                    <p className="text-[10px] text-slate-400">
                                        Suspended at: {new Date(selectedUser.blocked_at).toLocaleString()}
                                    </p>
                                </div>
                            )}

                            {/* Owner Verification Info if present */}
                            {selectedUser.owner_verification && (
                                <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
                                    <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                                        <span>Owner KYC Record</span>
                                        <span className="capitalize text-[10px] bg-emerald-200 dark:bg-emerald-800 px-2 py-0.5 rounded-full">
                                            {selectedUser.owner_verification.status}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-zinc-400">
                                        NRC on Record: <strong>{selectedUser.owner_verification.nrc_number}</strong>
                                    </p>
                                    {selectedUser.owner_verification.admin_remark && (
                                        <p className="text-[11px] text-slate-500 italic">
                                            "{selectedUser.owner_verification.admin_remark}"
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Lawyer Profile Info if present */}
                            {selectedUser.lawyer_profile && (
                                <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-2">
                                    <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center justify-between">
                                        <span>Bar Council Credential</span>
                                        <span className="capitalize text-[10px] bg-amber-200 dark:bg-amber-800 px-2 py-0.5 rounded-full">
                                            {selectedUser.lawyer_profile.status}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-zinc-400">
                                        License: <strong>{selectedUser.lawyer_profile.license_number}</strong> ({selectedUser.lawyer_profile.lawyer_type})
                                    </p>
                                    <p className="text-[11px] text-slate-600 dark:text-zinc-400">
                                        Township: {selectedUser.lawyer_profile.office_township} • Exp: {selectedUser.lawyer_profile.experience_years} yrs
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Bottom Actions inside Slide-Over */}
                        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
                            <button
                                type="button"
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-zinc-800"
                            >
                                Close
                            </button>

                            {selectedUser.role !== 'admin' && (
                                selectedUser.is_blocked ? (
                                    <button
                                        type="button"
                                        onClick={() => handleUnblock(selectedUser)}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs"
                                    >
                                        Restore Access
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBlockModalUser(selectedUser);
                                            reset();
                                        }}
                                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs"
                                    >
                                        Suspend Account
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* BLOCK / SUSPEND MODAL */}
            {blockModalUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                            <h3 className="text-sm font-bold text-rose-600 flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Suspend User Account: {blockModalUser.name}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setBlockModalUser(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleBlockSubmit} className="mt-4 space-y-4">
                            <p className="text-xs text-slate-600 dark:text-zinc-400">
                                This user will be immediately logged out and blocked from logging in or performing any actions on PropDirect until unblocked.
                            </p>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                    Mandatory Reason for Suspension *
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.blocked_reason}
                                    onChange={(e) => setData('blocked_reason', e.target.value)}
                                    placeholder="e.g., Unofficial broker activity detected, spamming fake property listings, fraudulent NRC..."
                                    required
                                    className="w-full text-xs rounded-xl border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 placeholder-slate-400"
                                />
                                {errors.blocked_reason && (
                                    <p className="text-[11px] text-rose-500 mt-1">
                                        {errors.blocked_reason}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setBlockModalUser(null)}
                                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition disabled:opacity-50"
                                >
                                    {processing ? 'Applying...' : 'Confirm Suspension'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
