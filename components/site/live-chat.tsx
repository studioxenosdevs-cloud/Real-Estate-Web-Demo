'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatMessage {
    id: number;
    text: string;
    sender: 'bot' | 'user';
}

export default function LiveChat() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, text: 'Welcome to AETHER. How can our property desk help with your search today?', sender: 'bot' },
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, typing]);

    const handleSend = () => {
        const text = input.trim();
        if (!text) return;
        setInput('');
        setMessages((current) => [...current, { id: Date.now(), text, sender: 'user' }]);
        setTyping(true);
        window.setTimeout(() => {
            setTyping(false);
            setMessages((current) => [...current, {
                id: Date.now() + 1,
                text: 'Thank you. A senior property advisor will review your request and respond with relevant Pakistani listings.',
                sender: 'bot',
            }]);
        }, 700);
    };

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.section
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        className="fixed bottom-24 right-4 z-50 flex h-[30rem] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl"
                        aria-label="General property inquiry chat"
                    >
                        <header className="flex items-center justify-between bg-slate-950 p-4 text-white">
                            <div>
                                <p className="text-sm font-black tracking-wide">AETHER Property Desk</p>
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">General enquiries</p>
                            </div>
                            <button type="button" onClick={() => setOpen(false)} className="p-1 text-slate-300 hover:text-white" aria-label="Close chat"><X className="h-5 w-5" /></button>
                        </header>
                        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <p className={`max-w-[85%] px-3 py-2.5 text-xs leading-relaxed ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>{message.text}</p>
                                </div>
                            ))}
                            {typing && <p className="w-fit border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400">Typing...</p>}
                        </div>
                        <div className="border-t border-slate-200 bg-white p-3">
                            <div className="flex gap-2">
                                <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && handleSend()} placeholder="Ask about Pakistani properties..." className="h-10 min-w-0 flex-1 border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-600" />
                                <Button type="button" onClick={handleSend} disabled={!input.trim()} className="h-10 w-10 shrink-0 rounded-sm bg-blue-600 p-0 text-white hover:bg-blue-700"><Send className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            <a href="https://wa.me/923000000000?text=Hello,%20I%20am%20looking%20to%20invest." target="_blank" rel="noopener noreferrer" aria-label="Open WhatsApp investment enquiry" className="fixed bottom-5 left-10 z-50 flex h-12 w-36 gap-1 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition-colors hover:bg-emerald-700">
                <MessageCircle className="h-6 w-6" />
                <p>Whatsapp</p>
            </a>

            <button type="button" onClick={() => setOpen((value) => !value)} className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl transition-colors hover:bg-blue-600" aria-label="Open general property chat">
                {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </button>
        </>
    );
}
