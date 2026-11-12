import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const isPasswordField = type === 'password';
    const computedType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="relative w-full">
            <input
                {...props}
                type={computedType}
                className={
                    `rounded-xl border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/90 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 shadow-xs text-xs focus:border-emerald-500 focus:ring-emerald-500 transition duration-150 ${
                        isPasswordField ? 'pr-10' : ''
                    } ` + className
                }
                ref={localRef}
            />

            {isPasswordField && (
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition focus:outline-hidden"
                    title={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                        <Eye className="h-4 w-4 shrink-0" />
                    )}
                </button>
            )}
        </div>
    );
});
