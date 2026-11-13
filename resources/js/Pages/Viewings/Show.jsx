import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { normalizeToUnicode, isZawgyi } from '@/utils/myanmarFontTools';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    MessageSquare,
    Send,
    Building2,
    Calendar,
    Clock,
    Phone,
    Unlock,
    ShieldCheck,
    ArrowLeft,
    CheckCheck,
    User,
    Lock,
} from 'lucide-react';

export default function ViewingShow({ viewing }) {
    const { lang, t } = useLanguage();
    const { auth } = usePage().props;
    const currentUser = auth?.user;

    const messagesEndRef = useRef(null);

    const isSeeker = currentUser?.id === viewing.seeker_id;
    const isOwner = currentUser?.id === viewing.owner_id;
    const isAdmin = currentUser?.role === 'admin';

    const otherParty = isSeeker ? viewing.owner : viewing.seeker;

    const messageForm = useForm({
        message: '',
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [viewing.messages]);

    const handleMessageBlur = () => {
        if (messageForm.data.message && isZawgyi(messageForm.data.message)) {
            messageForm.setData('message', normalizeToUnicode(messageForm.data.message));
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageForm.data.message.trim()) return;

        messageForm.post(route('viewing.messages.store', viewing.id), {
            preserveScroll: true,
            onSuccess: () => {
                messageForm.reset('message');
                scrollToBottom();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link
                            href={isOwner ? route('owner.viewings.index') : route('my-viewings.index')}
                            className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 text-slate-500 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                Direct In-App Chat • Viewing #{viewing.id}
                            </span>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate max-w-xl">
                                {otherParty?.name}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {viewing.contact_unlocked ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <Unlock className="h-3.5 w-3.5" />
                                Contact Unlocked
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                <Lock className="h-3.5 w-3.5" />
                                Contact Protected
                            </span>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`Chat: ${otherParty?.name} - PropDirect`} />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Sidebar: Viewing & Participant Summary (Col 1) */}
                    <div className="lg:col-span-1 space-y-5">
                        {/* Property Card */}
                        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Property Context
                            </span>
                            <div className="mt-2 flex items-start gap-3">
                                <div className="h-12 w-12 rounded-xl bg-slate-900 overflow-hidden shrink-0">
                                    {viewing.property?.images && viewing.property.images.length > 0 ? (
                                        <img
                                            src={`/storage/${viewing.property.images[0]}`}
                                            alt={viewing.property.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-500">
                                            <Building2 className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        <Link
                                            href={route('properties.show', viewing.property?.slug)}
                                            className="hover:underline hover:text-emerald-600"
                                        >
                                            {viewing.property?.title}
                                        </Link>
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                                        📍 {viewing.property?.township}
                                    </p>
                                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                                        {Number(viewing.property?.price).toLocaleString()} Ks
                                    </p>
                                </div>
                            </div>

                            {/* Appointment Info */}
                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-1.5 text-xs">
                                <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                                    <span>Status:</span>
                                    <span className="font-bold capitalize text-slate-800 dark:text-zinc-200">
                                        {viewing.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                                    <span>Date:</span>
                                    <strong className="text-slate-800 dark:text-zinc-200">
                                        {viewing.rescheduled_date || viewing.preferred_date}
                                    </strong>
                                </div>
                                <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                                    <span>Time:</span>
                                    <strong className="text-slate-800 dark:text-zinc-200">
                                        {viewing.rescheduled_time || viewing.preferred_time}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Other Party Profile Card */}
                        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {isSeeker ? 'Landlord Profile' : 'Seeker Profile'}
                            </span>
                            <div className="mt-3 flex items-center gap-3">
                                {otherParty?.avatar ? (
                                    <img
                                        src={`/storage/${otherParty.avatar}`}
                                        alt={otherParty.name}
                                        className="h-10 w-10 rounded-xl object-cover ring-2 ring-emerald-500/20"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                                        {otherParty?.name?.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                                        {otherParty?.name}
                                    </div>
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold capitalize">
                                        {otherParty?.role === 'owner' ? 'Verified Landlord' : otherParty?.occupation || 'Seeker'}
                                    </span>
                                </div>
                            </div>

                            {/* Unlocked phone call */}
                            {viewing.contact_unlocked && otherParty?.phone ? (
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800">
                                    <a
                                        href={`tel:${otherParty.phone}`}
                                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-bold text-white shadow-xs transition"
                                    >
                                        <Phone className="h-3.5 w-3.5" />
                                        <span>Call {otherParty.phone}</span>
                                    </a>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Right: Message Stream & Input Box (Col 3) */}
                    <div className="lg:col-span-3 flex flex-col h-[650px] rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
                        {/* Chat Header */}
                        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/40 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                    Direct Discussion Thread
                                </span>
                            </div>
                            <span className="text-[11px] text-slate-400">
                                {viewing.messages?.length || 0} messages
                            </span>
                        </div>

                        {/* Scrollable Message Bubbles */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800">
                            {viewing.messages && viewing.messages.length > 0 ? (
                                viewing.messages.map((msg) => {
                                    const isMe = msg.sender_id === currentUser?.id;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {!isMe && (
                                                <div className="h-7 w-7 rounded-lg bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-zinc-300 shrink-0">
                                                    {msg.sender?.name?.charAt(0) || 'U'}
                                                </div>
                                            )}

                                            <div
                                                className={`max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                                                    isMe
                                                        ? 'bg-emerald-600 text-white rounded-br-xs'
                                                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 rounded-bl-xs'
                                                }`}
                                            >
                                                <div className="whitespace-pre-wrap">{msg.message}</div>
                                                <div
                                                    className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                                                        isMe ? 'text-emerald-100/80' : 'text-slate-400 dark:text-zinc-500'
                                                    }`}
                                                >
                                                    <span>
                                                        {new Date(msg.created_at).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                    {isMe && msg.read_at && (
                                                        <CheckCheck className="h-3 w-3 text-emerald-200" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                                    <MessageSquare className="h-10 w-10 text-slate-300 dark:text-zinc-700" />
                                    <p className="mt-2 text-xs font-medium">No messages yet. Start the conversation below!</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Footer */}
                        <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 shrink-0">
                            {isAdmin ? (
                                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-3 text-center text-xs font-bold text-indigo-700 dark:text-indigo-300">
                                    🛡️ Administrator Auditor Mode — Read-Only Access
                                </div>
                            ) : (
                                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={messageForm.data.message}
                                        onChange={(e) => messageForm.setData('message', e.target.value)}
                                        onBlur={handleMessageBlur}
                                        placeholder={lang === 'mm' ? 'စာတို ပေးပို့ရန် (Zawgyi သို့မဟုတ် Unicode)...' : 'Type your message (Zawgyi or Unicode)...'}
                                        className="flex-1 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-slate-900 dark:text-zinc-100 px-4 py-2.5 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                                        disabled={messageForm.processing}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={messageForm.processing || !messageForm.data.message.trim()}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition disabled:opacity-50"
                                    >
                                        <Send className="h-3.5 w-3.5" />
                                        <span>Send</span>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
