'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Lock } from 'lucide-react';
import services from '@/data/services.json';

export default function ServicesGrid() {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {services.map((service, index) => (
                <article key={service.id} className={`${index === 0 || index === 3 ? 'md:col-span-2' : ''} border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md sm:p-8 rounded-sm`}>
                    <span className="mb-2 block text-xs font-mono font-bold uppercase tracking-wider text-blue-600">{service.eyebrow}</span>
                    <h3 className="mb-3 text-xl font-black tracking-tight text-slate-900">{service.title}</h3>
                    <p className="max-w-xl text-sm leading-relaxed text-slate-600">{service.description}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">{index === 0 && <Lock className="h-4 w-4 text-blue-600" />}{service.footer}</span>
                        {index === 0 ? <Link href="/valuation" className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 transition-all duration-300 ease-in-out hover:translate-x-1">Inquire <ArrowRight className="h-4 w-4" /></Link> : <ArrowUpRight className="h-4 w-4 text-blue-600" />}
                    </div>
                </article>
            ))}
        </div>
    );
}
