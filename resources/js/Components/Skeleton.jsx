import React from 'react';

export function Skeleton({ className = '', ...props }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-slate-200 dark:bg-zinc-800 ${className}`}
            {...props}
        />
    );
}

export function StatCardSkeleton() {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <div className="mt-4 flex items-baseline justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-12" />
            </div>
            <div className="mt-3">
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs">
            <Skeleton className="h-5 w-40 mb-3" />
            <Skeleton className="h-3 w-64 mb-6" />
            <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                {Array.from({ length: rows }).map((_, rIdx) => (
                    <div key={rIdx} className="p-4 flex items-center justify-between gap-4">
                        {Array.from({ length: cols }).map((_, cIdx) => (
                            <Skeleton
                                key={cIdx}
                                className={`h-4 ${cIdx === 0 ? 'w-36' : 'w-24'}`}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Skeleton;
