import { ShieldCheck, ShieldAlert, User, CheckCircle2 } from 'lucide-react';

export default function RoleBadge({ role, isVerifiedOwner, className = '' }) {
    if (role === 'admin') {
        return (
            <span
                className={`inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-600/20 ${className}`}
            >
                <ShieldAlert className="h-3.5 w-3.5 text-purple-600" />
                Admin
            </span>
        );
    }

    if (role === 'owner' || isVerifiedOwner) {
        return (
            <span
                className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 ${className}`}
            >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Verified Owner ✓
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-600/20 ${className}`}
        >
            <User className="h-3.5 w-3.5 text-slate-500" />
            Property Seeker
        </span>
    );
}
