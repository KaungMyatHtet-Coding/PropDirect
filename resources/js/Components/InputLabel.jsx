import React from 'react';

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-xs font-semibold text-slate-700 dark:text-zinc-200 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
