'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { Bot, CalendarDays, MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMarketplace } from '@/lib/marketplace-context';
import { formatPrice } from '@/lib/whatsapp';

type Message = { role: 'user' | 'assistant'; text: string; createdAt: string };

const initialMessage: Message = {
    role: 'assistant',
    text: 'Welcome to AETHER. Ask me about prices, bedrooms, availability, or book a private tour.',
    createdAt: new Date().toISOString(),
};

export default function Chatbot() {
    const { properties, addLead, addAppointment, addChatMessage } = useMarketplace();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([initialMessage]);
    const [lead, setLead] = useState({ name: '', email: '', phone: '', budget: '' });
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const [booking, setBooking] = useState({ propertyId: '', date: '', time: '11:00' });
    const scrollRef = useRef<HTMLDivElement>(null);
    const logId = useRef(`chat-${Date.now()}`);

    useEffect(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), [messages]);

    const reply = useMemo(() => (question: string) => {
        const lower = question.toLowerCase();
        const matched = properties.find((property) => lower.includes(property.location.toLowerCase()) || lower.includes(property.type.toLowerCase()));
        if (lower.includes('book') || lower.includes('tour') || lower.includes('visit')) {
            setShowBooking(true);
            return 'I can arrange that. Choose a property and preferred time below, and I will send the request to the property desk.';
        }
        if (lower.includes('price') || lower.includes('budget') || lower.includes('cost')) {
            const prices = properties.map((property) => property.price);
            return matched ? `${matched.title} is listed at ${formatPrice(matched.price)}.` : `Our current collection ranges from ${formatPrice(Math.min(...prices))} to ${formatPrice(Math.max(...prices))}. Tell me a city, type, or budget and I will narrow it down.`;
        }
        if (matched) return `${matched.title} has ${matched.beds} bedrooms, ${matched.baths} baths, and is currently ${matched.status || 'Active'}. It is listed at ${formatPrice(matched.price)}.`;
        return 'I can help compare our listings by city, type, bedrooms, budget, or tour availability. What are you looking for?';
    }, [properties]);

    const sendMessage = () => {
        const text = input.trim();
        if (!text) return;
        const now = new Date().toISOString();
        const userMessage = { role: 'user' as const, text, createdAt: now };
        const assistantMessage = { role: 'assistant' as const, text: reply(text), createdAt: new Date().toISOString() };
        setMessages((current) => [...current, userMessage, assistantMessage]);
        addChatMessage(logId.current, userMessage);
        addChatMessage(logId.current, assistantMessage);
        setInput('');
    };

    const captureLead = () => {
        if (!lead.name || !lead.email || !lead.phone) return;
        const leadId = addLead({ ...lead, source: 'Chatbot' });
        addChatMessage(logId.current, { role: 'assistant', text: `Thanks ${lead.name}. Your details are with our property desk.`, createdAt: new Date().toISOString() }, leadId);
        setShowLeadForm(false);
    };

    const bookTour = () => {
        if (!lead.name || !lead.email || !lead.phone || !booking.date || !booking.propertyId) {
            setShowLeadForm(true);
            return;
        }
        const property = properties.find((item) => item.id === Number(booking.propertyId));
        const leadId = addLead({ ...lead, source: 'Chatbot', propertyId: property?.id });
        addAppointment({ ...lead, leadId, propertyId: property?.id, propertyName: property?.title || 'Property tour', date: booking.date, time: booking.time, status: 'Pending', source: 'Chatbot' });
        setShowBooking(false);
        setMessages((current) => [...current, { role: 'assistant', text: `Tour request received for ${property?.title} on ${booking.date} at ${booking.time}. An advisor will confirm shortly.`, createdAt: new Date().toISOString() }]);
    };

    return <>
        {open && <section className="fixed bottom-24 right-4 z-[60] flex h-[min(42rem,calc(100vh-7rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl" aria-label="AETHER AI property assistant">
            <header className="flex items-center justify-between bg-slate-950 p-4 text-white">
                <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600"><Bot className="h-5 w-5" /></span><div><p className="text-sm font-bold">AETHER Property Assistant</p><p className="text-[10px] uppercase tracking-widest text-slate-400">Listings, leads & tours</p></div></div>
                <button onClick={() => setOpen(false)} aria-label="Close assistant"><X className="h-5 w-5" /></button>
            </header>
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
                {messages.map((message, index) => <div key={`${message.createdAt}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[86%] px-3 py-2.5 text-xs leading-relaxed ${message.role === 'user' ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>{message.text}</p></div>)}
                {showLeadForm && <div className="space-y-2 border border-slate-200 bg-white p-3"><p className="text-xs font-bold text-slate-900">Share your details</p>{(['name', 'email', 'phone', 'budget'] as const).map((field) => <Input key={field} value={lead[field]} onChange={(event) => setLead({ ...lead, [field]: event.target.value })} placeholder={field[0].toUpperCase() + field.slice(1)} type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} className="h-9 text-xs" />)}<Button onClick={captureLead} className="h-9 w-full bg-slate-900 text-xs">Send details</Button></div>}
                {showBooking && <div className="space-y-2 border border-blue-100 bg-white p-3"><p className="text-xs font-bold text-slate-900">Request a private tour</p><select value={booking.propertyId} onChange={(event) => setBooking({ ...booking, propertyId: event.target.value })} className="h-9 w-full border border-slate-200 bg-slate-50 px-2 text-xs"><option value="">Select a property</option>{properties.map((property) => <option key={property.id} value={property.id}>{property.title}</option>)}</select><Input type="date" value={booking.date} onChange={(event) => setBooking({ ...booking, date: event.target.value })} className="h-9 text-xs" /><Input type="time" value={booking.time} onChange={(event) => setBooking({ ...booking, time: event.target.value })} className="h-9 text-xs" /><Button onClick={bookTour} className="h-9 w-full bg-blue-600 text-xs"><CalendarDays className="mr-2 h-3.5 w-3.5" />Request tour</Button></div>}
            </div>
            <div className="flex gap-2 border-t border-slate-200 bg-white p-3"><button onClick={() => setShowLeadForm(true)} className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-500">Capture lead</button><Input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendMessage()} placeholder="Ask about properties..." className="h-10 min-w-0 bg-slate-50 text-xs" /><Button onClick={sendMessage} disabled={!input.trim()} className="h-10 w-10 shrink-0 bg-blue-600 p-0"><Send className="h-4 w-4" /></Button></div>
        </section>}
        <button onClick={() => setOpen((value) => !value)} className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl hover:bg-blue-600" aria-label="Open AI property assistant">{open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}</button>
    </>;
}