import React from 'react';

export default function ApplicationLogo({ className = '', showText = true, iconSize = 'h-10 w-10' }) {
    return (
        <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight ${className}`}>
            {/* Custom Modern Architectural SVG Badge */}
            <div className={`relative flex ${iconSize} shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 p-2 text-white shadow-md shadow-emerald-500/25 border border-emerald-400/30`}>
                <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full"
                >
                    {/* Modern Architectural Skyline / Roofline */}
                    <path
                        d="M3 13.5L16 3L29 13.5V27C29 27.5523 28.5523 28 28 28H4C3.44772 28 3 27.5523 3 27V13.5Z"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-90"
                    />
                    {/* Interior High-Rise Architectural Pillar Lines */}
                    <path
                        d="M8 28V17M24 28V17"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        className="opacity-50"
                    />
                    {/* Direct Key & Network Hub Connection (Center Node) */}
                    <circle
                        cx="16"
                        cy="15"
                        r="3.5"
                        fill="currentColor"
                        className="text-white"
                    />
                    <path
                        d="M16 18.5V24M16 22H19M16 24H18.5"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {showText && (
                <div className="flex flex-col select-none">
                    <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                        Prop<span className="text-emerald-600 dark:text-emerald-400">Direct</span>
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 -mt-0.5">
                        P2P No-Broker Marketplace
                    </span>
                </div>
            )}
        </div>
    );
}
