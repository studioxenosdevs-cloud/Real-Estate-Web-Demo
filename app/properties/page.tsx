'use client';

import { useMemo, useState } from 'react';
import { Map, MapPin } from 'lucide-react';
import { properties } from '@/lib/properties';
import type { Filters } from '@/lib/types';
import FilterBar from '@/components/site/filter-bar';
import PropertyCard from '@/components/site/property-card';

export default function PropertiesPage() {
    const [showMap, setShowMap] = useState(false);
    const [filters, setFilters] = useState<Filters>({ location: 'all', propertyType: 'all', priceRange: 'all', beds: 'all', baths: 'all' });

    const filtered = useMemo(() => properties.filter((property) => {
        if (filters.location !== 'all' && property.location !== filters.location) return false;
        if (filters.propertyType !== 'all' && property.type !== filters.propertyType) return false;
        if (filters.nocCleared && !property.metrics.nocCleared) return false;
        if (filters.ownerBuilt && !property.metrics.ownerBuilt) return false;
        if (filters.cornerParkFacing && !property.metrics.cornerParkFacing) return false;
        if (filters.servantQuarter && !property.metrics.servantQuarter) return false;
        if (filters.beds !== 'all' && property.beds < Number(filters.beds)) return false;
        if (filters.baths !== 'all' && property.baths < Number(filters.baths)) return false;
        if (filters.priceRange === 'under1m' && property.price >= 50000000) return false;
        if (filters.priceRange === '1m-2m' && (property.price < 50000000 || property.price > 100000000)) return false;
        if (filters.priceRange === 'over2m' && property.price <= 100000000) return false;
        return true;
    }), [filters]);

    return (
        <main className="min-h-screen bg-slate-100 pt-20">
            <div className="flex min-h-[calc(100dvh-5rem)] flex-col lg:flex-row">
                <section className={`${showMap ? 'hidden' : 'flex'} min-w-0 flex-1 flex-col lg:flex lg:w-1/2 lg:flex-none lg:border-r lg:border-slate-200`}>
                    <header className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Pakistan property intelligence</p>
                                <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-slate-900">Properties</h1>
                                <p className="mt-1 text-sm text-slate-500">{filtered.length} verified opportunities across key societies.</p>
                            </div>
                            <button type="button" onClick={() => setShowMap(true)} className="inline-flex h-10 items-center gap-2 border border-slate-300 bg-white px-3 text-xs font-black uppercase tracking-wider text-slate-800 lg:hidden">
                                <Map className="h-4 w-4" /> Map View
                            </button>
                        </div>
                        <div className="mt-5 [&>div]:rounded-sm [&>div]:shadow-none">
                            <FilterBar filters={filters} onChange={setFilters} resultCount={filtered.length} compact />
                        </div>
                    </header>
                    <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                        <div className="grid gap-4 xl:grid-cols-2">
                            {filtered.map((property) => <PropertyCard key={property.id} property={property} />)}
                        </div>
                        {filtered.length === 0 && <div className="border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No properties match these filters.</div>}
                    </div>
                </section>

                <section className={`${showMap ? 'flex' : 'hidden'} relative min-h-[calc(100dvh-5rem)] flex-1 lg:flex lg:w-1/2 lg:flex-none`}>
                    <iframe
                        title="Pakistan property map"
                        src="https://www.google.com/maps?q=DHA+Karachi+Pakistan&output=embed"
                        className="absolute inset-0 h-full w-full border-0"
                        loading="lazy"
                    />
                    <div className="absolute left-4 top-4 right-4 flex items-center justify-between lg:left-6 lg:right-6">
                        <div className="border border-slate-200 bg-white px-4 py-3 shadow-lg">
                            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900"><MapPin className="h-4 w-4 text-blue-600" /> Live market map</p>
                            <p className="mt-1 text-[11px] text-slate-500">DHA Karachi and surrounding societies</p>
                        </div>
                        <button type="button" onClick={() => setShowMap(false)} className="border border-slate-300 bg-white px-3 py-3 text-xs font-black uppercase tracking-wider text-slate-800 shadow-lg lg:hidden">List View</button>
                    </div>
                </section>
            </div>
        </main>
    );
}
