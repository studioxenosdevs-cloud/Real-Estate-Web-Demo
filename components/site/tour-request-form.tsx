'use client';

import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMarketplace } from '@/lib/marketplace-context';
import type { Property } from '@/lib/types';

export default function TourRequestForm({ property }: { property: Property }) {
    const { addLead, addAppointment } = useMarketplace();
    const [form, setForm] = useState({ name: '', email: '', phone: '', budget: '', date: '', time: '11:00' });
    const [submitted, setSubmitted] = useState(false);
    const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
    const submit = () => {
        if (!form.name || !form.email || !form.phone || !form.date) return;
        const leadId = addLead({ name: form.name, email: form.email, phone: form.phone, budget: form.budget, source: 'Website', propertyId: property.id });
        addAppointment({ name: form.name, email: form.email, phone: form.phone, leadId, propertyId: property.id, propertyName: property.title, date: form.date, time: form.time, status: 'Pending', source: 'Website' });
        setSubmitted(true);
    };
    return <div className="border border-blue-100 bg-blue-50 p-4 sm:p-5"><div className="mb-3 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-600" /><h2 className="text-sm font-bold text-slate-900">Request a private tour</h2></div>{submitted ? <p className="text-sm text-emerald-700">Your request is with the property desk. An advisor will confirm the appointment shortly.</p> : <><div className="grid gap-2 sm:grid-cols-2"><Input placeholder="Name" value={form.name} onChange={(event) => update('name', event.target.value)} className="h-9 bg-white text-xs" /><Input placeholder="Email" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="h-9 bg-white text-xs" /><Input placeholder="Phone" type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} className="h-9 bg-white text-xs" /><Input placeholder="Budget (optional)" value={form.budget} onChange={(event) => update('budget', event.target.value)} className="h-9 bg-white text-xs" /><Input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} className="h-9 bg-white text-xs" /><Input type="time" value={form.time} onChange={(event) => update('time', event.target.value)} className="h-9 bg-white text-xs" /></div><Button onClick={submit} className="mt-3 h-9 bg-blue-600 text-xs">Send tour request</Button></>}</div>;
}