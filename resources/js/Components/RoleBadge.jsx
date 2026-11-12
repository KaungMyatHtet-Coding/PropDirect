import { ShieldCheck, ShieldAlert, User, CheckCircle2, Scale } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function RoleBadge({ role, isVerifiedOwner, className = '' }) {
    const { t } = useLanguage();

    if (role === 'admin') {
        return (
            <span
                className={`inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-600/20 ${className}`}
            >
                <ShieldAlert className="h-3.5 w-3.5 text-purple-600" />
                {t('role_admin')}
            </span>
        );
    }

    if (role === 'lawyer') {
        return (
            <span
                className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20 ${className}`}
            >
                <Scale className="h-3.5 w-3.5 text-amber-600" />
                {t('role_lawyer')}
            </span>
        );
    }

    if (role === 'owner' || isVerifiedOwner) {
        return (
            <span
                className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 ${className}`}
            >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                {t('role_owner')}
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-600/20 ${className}`}
        >
            <User className="h-3.5 w-3.5 text-slate-500" />
            {t('role_seeker')}
        </span>
    );
}
