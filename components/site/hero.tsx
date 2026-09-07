'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import {
    Search,
    MapPin,
    Home as HomeIcon,
    DollarSign,
    TrendingUp,
    Clock,
    Users,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Filters } from '@/lib/types';
import { properties } from '@/lib/properties';
import LocationAutocomplete from '@/components/maps/location-autocomplete';

interface HeroProps {
    filters: Filters;
    setFilters: (f: Filters) => void;
}

export default function Hero({ filters, setFilters }: HeroProps) {
    const stats = [
        { icon: DollarSign, label: 'Total Sold', value: 'PKR 120 Crore+', color: 'text-blue-400' },
        { icon: Clock, label: 'Response Time', value: '15 Min', color: 'text-emerald-400' },
        { icon: Users, label: 'Verified Buyers', value: '500+', color: 'text-blue-300' },
        { icon: TrendingUp, label: 'Avg. Close Rate', value: '92%', color: 'text-emerald-300' },
    ];

    const resultCount = useMemo(() => {
        return properties.filter((p) => {
            if (filters.location !== 'all' && p.location !== filters.location)
                return false;
            if (filters.propertyType !== 'all' && p.type !== filters.propertyType)
                return false;
            if (filters.priceRange !== 'all') {
                if (filters.priceRange === 'under1m' && p.price >= 50000000) return false;
                if (
                    filters.priceRange === '1m-2m' &&
                    (p.price < 50000000 || p.price > 100000000)
                )
                    return false;
                if (filters.priceRange === 'over2m' && p.price <= 100000000) return false;
            }
            return true;
        }).length;
    }, [filters]);

    const scrollToResults = () => {
        document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex items-center bg-slate-900 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950" />
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 50%, #2563EB 0%, transparent 50%), radial-gradient(circle at 80% 80%, #10B981 0%, transparent 40%)',
                    }}
                />
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="max-w-4xl"
                >
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 mb-6">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm text-slate-200 font-medium">
                            Live · 12 tours booked today
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                        Find &amp; Tour Premium
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            Properties in Seconds
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
                        Browse verified luxury listings, book instant property tours, and
                        connect with agents directly on WhatsApp. Your dream home is just a
                        click away.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                    className="mt-10 bg-white rounded-2xl shadow-2xl p-5 sm:p-6 max-w-5xl"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Search className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-slate-900 text-sm">
                            Instant Property Finder
                        </span>
                        <span className="ml-auto text-sm text-slate-500">
                            {resultCount} {resultCount === 1 ? 'match' : 'matches'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" /> Location
                            </label>
                            <LocationAutocomplete value={filters.location} onChange={(location) => setFilters({ ...filters, location })} />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                <HomeIcon className="h-3.5 w-3.5" /> Property Type
                            </label>
                            <Select
                                value={filters.propertyType}
                                onValueChange={(v) =>
                                    setFilters({ ...filters, propertyType: v })
                                }
                            >
                                <SelectTrigger className="bg-slate-50">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Villa">Villa</SelectItem>
                                    <SelectItem value="Plot">Plot</SelectItem>
                                    <SelectItem value="Farmhouse">Farmhouse</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                <DollarSign className="h-3.5 w-3.5" /> Price Range
                            </label>
                            <Select
                                value={filters.priceRange}
                                onValueChange={(v) =>
                                    setFilters({ ...filters, priceRange: v })
                                }
                            >
                                <SelectTrigger className="bg-slate-50">
                                    <SelectValue placeholder="Any Price" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Price</SelectItem>
                                    <SelectItem value="under1m">Under PKR 5 Crore</SelectItem>
                                    <SelectItem value="1m-2m">PKR 5 — 10 Crore</SelectItem>
                                    <SelectItem value="over2m">Over PKR 10 Crore</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        onClick={scrollToResults}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
                    >
                        <Search className="h-5 w-5 mr-2" />
                        Search {resultCount} Properties
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl"
                >
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition-colors"
                        >
                            <stat.icon className={`h-5 w-5 mb-2 ${stat.color}`} />
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
