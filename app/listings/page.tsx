'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { properties } from '@/lib/properties';
import type { Filters } from '@/lib/types';
import FilterBar from '@/components/site/filter-bar';
import PropertyCard from '@/components/site/property-card';

export default function ListingsPage() {
    const [filters, setFilters] = useState<Filters>({
        location: 'all',
        propertyType: 'all',
        priceRange: 'all',
        beds: 'all',
        baths: 'all',
    });

    const filtered = useMemo(() => {
        return properties.filter((p) => {
            if (filters.location !== 'all' && p.location !== filters.location) return false;
            if (filters.propertyType !== 'all' && p.type !== filters.propertyType) return false;
            if (filters.nocCleared && !p.metrics.nocCleared) return false;
            if (filters.ownerBuilt && !p.metrics.ownerBuilt) return false;
            if (filters.cornerParkFacing && !p.metrics.cornerParkFacing) return false;
            if (filters.servantQuarter && !p.metrics.servantQuarter) return false;
            if (filters.priceRange !== 'all') {
                if (filters.priceRange === 'under1m' && p.price >= 50000000) return false;
                if (filters.priceRange === '1m-2m' && (p.price < 50000000 || p.price > 100000000)) return false;
                if (filters.priceRange === 'over2m' && p.price <= 100000000) return false;
            }
            if (filters.beds !== 'all' && p.beds < parseInt(filters.beds)) return false;
            if (filters.baths !== 'all' && p.baths < parseInt(filters.baths)) return false;
            return true;
        });
    }, [filters]);

    return (
        <div className="bg-slate-50 min-h-screen pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                        All Properties
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Browse our complete collection of premium listings
                    </p>
                </motion.div>

                <div className="mb-8 sticky top-20 z-30">
                    <FilterBar filters={filters} onChange={setFilters} resultCount={filtered.length} />
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                            <MapPin className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700">
                            No properties match your filters
                        </h3>
                        <p className="text-slate-500 mt-2">Try adjusting your search criteria above.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((property, i) => (
                            <PropertyCard key={property.id} property={property} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
