import React from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-200 shadow-xs transition duration-150 ease-in-out hover:bg-slate-50 dark:hover:bg-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
