import { Building2, ShieldCheck } from 'lucide-react';

export default function ApplicationLogo({ className = 'h-9 w-auto', showText = true }) {
    return (
        <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight ${className}`}>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                <Building2 className="h-5 w-5" />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 ring-2 ring-white">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                </span>
            </div>
            {showText && (
                <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tight text-slate-900">
                        Prop<span className="text-emerald-600">Direct</span>
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 -mt-1">
                        P2P Real Estate
                    </span>
                </div>
            )}
        </div>
    );
}
