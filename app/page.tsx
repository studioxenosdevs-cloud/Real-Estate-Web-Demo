'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import {
    Search,
    MapPin,
    ArrowRight,
    ArrowUpRight,
    Star,
    ShieldCheck,
    Building2,
    CheckCircle2,
    Lock,
    ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { properties, agents } from '@/lib/properties';
import type { Filters } from '@/lib/types';
import PropertyCard from '@/components/site/property-card';
import ServicesGrid from '@/components/site/services-grid';

// Static data hoisted out of the component so it isn't re-created on every render.
const CATEGORY_TABS = [
    { id: 'all', label: 'All Residences' },
    { id: 'villa', label: 'Estates & Villas' },
    { id: 'plot', label: 'Plots' },
    { id: 'farmhouse', label: 'Farmhouses' },
] as const;

const scrollToId = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export default function Home() {
    const [filters, setFilters] = useState<Filters>({
        location: 'all',
        propertyType: 'all',
        priceRange: 'all',
        beds: 'all',
        baths: 'all',
    });

    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [valuationAddress, setValuationAddress] = useState<string>('');
    const [isValuating, setIsValuating] = useState<boolean>(false);
    const [isMapProcessing, setIsMapProcessing] = useState(false);
    const [valuationResult, setValuationResult] = useState<{
        min: string;
        max: string;
        sqftPrice: string;
        confidence: string;
    } | null>(null);

    const filteredProperties = useMemo(() => {
        return properties.filter((p) => {
            if (activeCategory !== 'all' && p.type.toLowerCase() !== activeCategory.toLowerCase()) {
                return false;
            }
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
            return true;
        });
    }, [filters, activeCategory]);

    // Only the first 6 ever render on the homepage — slice once, inside the memo,
    // rather than filtering the whole catalog on every render just to slice it after.
    const visibleProperties = useMemo(() => filteredProperties.slice(0, 6), [filteredProperties]);

    const handleValuation = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!valuationAddress.trim()) return;
        setIsValuating(true);
        setValuationResult(null);
        const timer = setTimeout(() => {
            setIsValuating(false);
            setValuationResult({
                min: 'PKR 11 Crore',
                max: 'PKR 12 Crore',
                sqftPrice: 'PKR 28,400 / Sq Yd',
                confidence: '98.4% Confidence Score',
            });
        }, 600);
        return () => clearTimeout(timer);
    }, [valuationAddress]);

    const scrollToFeatured = useCallback(() => scrollToId('featured'), []);

    const handleMapLeadCapture = useCallback(() => {
        if (isMapProcessing) return;
        setIsMapProcessing(true);
        window.setTimeout(() => setIsMapProcessing(false), 700);
    }, [isMapProcessing]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#2B68F6] selection:text-white">
            {/* Local, pure-CSS keyframes — no JS-driven animation anywhere on this page. */}
            <style jsx global>{`
                @keyframes fadeSlideUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes softPop {
                    from {
                        opacity: 0;
                        transform: scale(0.97);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .css-fade-in {
                    animation: fadeSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .card-rise {
                    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
                }
                .card-rise:hover {
                    transform: translateY(-4px);
                }
                .pill-transition {
                    transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.15s ease;
                }
                .pill-transition:active {
                    transform: scale(0.96);
                }
                .link-arrow svg {
                    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .link-arrow:hover svg {
                    transform: translateX(3px);
                }
                @media (prefers-reduced-motion: reduce) {
                    .css-fade-in,
                    .card-rise,
                    .pill-transition,
                    .link-arrow svg,
                    .animate-pulse,
                    .animate-bounce,
                    .animate-spin {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>

            {/* =========================================================================
          HERO SECTION (Pure CSS Scroll-Expanding Bento Collage into Full Background)
          ========================================================================= */}
            <section className="hero-scroll-track">
                <div className="hero-sticky-frame pt-[50px]">
                    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-16 w-full relative min-h-full flex flex-col md:flex-row items-stretch md:items-center gap-6 md:gap-10">
                        {/* LEFT COLUMN: Architectural Copy & Minimalist Search Widget */}
                        <div className="hero-content-col flex flex-col justify-center space-y-6 z-10">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-[#2B68F6] animate-pulse" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0F172A]">
                                    AETHER &bull; PRIVATE BROKERAGE
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-[4.25rem] font-black tracking-[-0.04em] leading-[1.02] text-[#0F172A] uppercase">
                                Discover the pinnacle of elite living<span className="text-[#2B68F6]">.</span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-md">
                                Exclusive access to Pakistan&apos;s most distinguished addresses, off-market architectural landmarks, and private sky penthouses.
                            </p>

                            {/* Minimalist Search Bar Widget */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/50">
                                <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_1.2fr_auto] gap-2 items-center">
                                    <div className="px-3 py-1 bg-slate-50/80 rounded-xl border border-slate-100">
                                        <label className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                                            <MapPin className="h-3 w-3 text-[#2B68F6]" /> Destination
                                        </label>
                                        <Select value={filters.location} onValueChange={(v) => setFilters((f) => ({ ...f, location: v }))}>
                                            <SelectTrigger className="h-7 border-0 bg-transparent p-0 text-xs font-bold text-[#0F172A] shadow-none focus:ring-0">
                                                <SelectValue placeholder="All Destinations" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Pakistan</SelectItem>
                                                <SelectItem value="DHA Karachi">DHA Karachi</SelectItem>
                                                <SelectItem value="Bahria Town Lahore">Bahria Town Lahore</SelectItem>
                                                <SelectItem value="Gulberg">Gulberg</SelectItem>
                                                <SelectItem value="DHA Islamabad">DHA Islamabad</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="px-3 py-1 bg-slate-50/80 rounded-xl border border-slate-100">
                                        <label className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                                            <Building2 className="h-3 w-3 text-[#2B68F6]" /> Category
                                        </label>
                                        <Select value={filters.propertyType} onValueChange={(v) => setFilters((f) => ({ ...f, propertyType: v }))}>
                                            <SelectTrigger className="h-7 border-0 bg-transparent p-0 text-xs font-bold text-[#0F172A] shadow-none focus:ring-0">
                                                <SelectValue placeholder="All Property Types" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Property Types</SelectItem>
                                                <SelectItem value="Villa">Villas</SelectItem>
                                                <SelectItem value="Plot">Plots</SelectItem>
                                                <SelectItem value="Farmhouse">Farmhouses</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        onClick={scrollToFeatured}
                                        className="h-11 bg-[#2B68F6] hover:bg-blue-700 text-white rounded-xl px-5 text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/25 transition-all active:scale-95"
                                    >
                                        <Search className="h-3.5 w-3.5 mr-1.5" /> Explore
                                    </Button>
                                </div>
                            </div>

                            {/* Scroll Trigger Hint */}
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">
                                <span className="h-px w-8 bg-slate-200" />
                                <span>Scroll to Expand Architecture</span>
                                <ChevronDown className="h-4 w-4 text-[#2B68F6] animate-bounce" />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Pure CSS Scroll-Expanding Sliced Bento Collage */}
                        <div className="hero-collage hero-collage-container z-20">
                            <div className="hero-collage-grid">
                                {/* Tile 1: Master Residence Facade */}
                                <div className="col-span-2 row-span-2 relative overflow-hidden bg-slate-900 group">
                                    <img
                                        src="https://images.pexels.com/photos/8082322/pexels-photo-8082322.jpeg?auto=compress&cs=tinysrgb&h=1400&w=2000"
                                        alt="DHA Karachi villa"
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-[#0F172A]/10 to-transparent pointer-events-none" />

                                    <div className="hero-bento-badge absolute top-4 left-4 z-10">
                                        <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-[#0F172A] shadow-sm">
                                            01 / DHA Karachi Residence
                                        </span>
                                    </div>
                                    <div className="hero-bento-badge absolute bottom-6 left-6 z-10 text-white">
                                        <p className="text-xs font-mono uppercase text-blue-300">DHA Karachi Residence</p>
                                        <h3 className="text-xl font-black uppercase tracking-tight">PKR 12 Crore</h3>
                                    </div>
                                </div>

                                {/* Tile 2: Panoramic Roof Terrace */}
                                <div className="col-span-2 row-span-1 relative overflow-hidden bg-slate-900 group">
                                    <img
                                        src="https://images.pexels.com/photos/8134745/pexels-photo-8134745.jpeg?auto=compress&cs=tinysrgb&h=1400&w=2000"
                                        alt="Cantilever Terrace"
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 via-transparent to-transparent pointer-events-none" />
                                    <div className="hero-bento-badge absolute top-4 right-4 z-10">
                                        <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-[#0F172A] shadow-sm">
                                            02 / Cantilever Terrace
                                        </span>
                                    </div>
                                </div>

                                {/* Tile 3: Sunken Infinity Pool */}
                                <div className="col-span-1 row-span-1 relative overflow-hidden bg-slate-900 group">
                                    <img
                                        src="https://images.pexels.com/photos/8143671/pexels-photo-8143671.jpeg?auto=compress&cs=tinysrgb&h=1400&w=2000"
                                        alt="Infinity Pool"
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 via-transparent to-transparent pointer-events-none" />
                                    <div className="hero-bento-badge absolute bottom-4 left-4 z-10">
                                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase">
                                            Pool Oasis
                                        </span>
                                    </div>
                                </div>

                                {/* Tile 4: Monaco Cliffside Landmark */}
                                <div className="col-span-1 row-span-1 relative overflow-hidden bg-slate-900 group">
                                    <img
                                        src="https://images.pexels.com/photos/10647324/pexels-photo-10647324.jpeg?auto=compress&cs=tinysrgb&h=1400&w=2000"
                                        alt="Landmark Entry"
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 via-transparent to-transparent pointer-events-none" />
                                    <div className="hero-bento-badge absolute bottom-4 right-4 z-10">
                                        <div className="h-8 w-8 rounded-full bg-[#2B68F6] text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* High-Contrast Glassmorphic Card (Appears as Collage Expands Fullscreen) */}
                            <div className="hero-expanded-overlay">
                                <div className="max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-12 rounded-[32px] text-white shadow-2xl">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#2B68F6] text-white text-[11px] font-black uppercase tracking-[0.2em] mb-5 shadow-md shadow-blue-500/30">
                                        Architecture Unified
                                    </span>
                                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase leading-tight mb-4 text-white drop-shadow-sm">
                                        The Curated Pakistan Collection
                                    </h2>
                                    <p className="text-slate-200 text-sm sm:text-base mb-8 max-w-lg mx-auto font-medium leading-relaxed">
                                        Explore hand-selected villas, plots, farmhouses, and premium residences across Pakistan.
                                    </p>
                                    <Button
                                        onClick={scrollToFeatured}
                                        className="bg-white text-[#0F172A] hover:bg-[#2B68F6] hover:text-white rounded-full px-8 h-12 text-xs font-black uppercase tracking-wider shadow-2xl transition-all hover:scale-105 pointer-events-auto"
                                    >
                                        Explore Featured Properties <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================================
          FEATURED PORTFOLIO SECTION (Screen-Fitted Content)
          ========================================================================= */}
            <section id="featured" className="min-h-screen flex flex-col justify-center py-16 sm:py-20 scroll-mt-16 bg-[#F8FAFC] border-t border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    {/* Section Header with Category Tabs */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#2B68F6] mb-2">
                                <span className="h-px w-6 bg-[#2B68F6]" />
                                Curated Collection
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight uppercase">
                                Featured Portfolio
                            </h2>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            {CATEGORY_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveCategory(tab.id)}
                                    className={`pill-transition px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${activeCategory === tab.id
                                        ? 'bg-[#0F172A] text-white shadow-sm'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Properties Bento Grid */}
                    <div key={activeCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 css-fade-in">
                        {visibleProperties.map((property) => (
                            <div key={property.id} className="card-rise rounded-[24px]">
                                <PropertyCard property={property} />
                            </div>
                        ))}
                    </div>

                    {/* Bottom All Listings CTA */}
                    <div className="mt-10 text-center">
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full border-slate-300 bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-xs uppercase tracking-wider px-8 h-11 shadow-sm transition-all"
                        >
                            <Link href="/listings">
                                View Entire Off-Market Catalog ({properties.length} Properties) <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* =========================================================================
          MAP SEARCH (Screen-Fitted Content)
          ========================================================================= */}
            <section id="map-search" className="relative min-h-[560px] w-full scroll-mt-16 overflow-hidden bg-slate-900">
                <iframe
                    title="DHA Lahore map search"
                    src="https://www.google.com/maps?q=DHA+Lahore+Pakistan&output=embed"
                    className="absolute inset-0 h-full w-full border-0 grayscale-[0.15]"
                    loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-slate-950/10" />
                <div className="absolute left-4 right-4 top-6 sm:left-8 sm:top-8 md:left-16 md:top-16 md:max-w-sm">
                    <div className="pointer-events-auto border border-slate-200 bg-white p-5 shadow-2xl sm:p-6 rounded-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Map Intelligence</p>
                        <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-slate-900">Draw Search Area</h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">Narrow your search by society and phase before speaking with an advisor.</p>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <select aria-label="Society" className="h-11 border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 outline-none transition-colors focus:border-blue-600">
                                <option>Society</option>
                                <option>DHA</option>
                                <option>Bahria</option>
                                <option>Emaar</option>
                            </select>
                            <select aria-label="Phase or block" className="h-11 border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 outline-none transition-colors focus:border-blue-600">
                                <option>Phase / Block</option>
                                <option>Phase 8</option>
                                <option>Phase 6</option>
                                <option>Block A</option>
                            </select>
                        </div>
                        <button type="button" disabled={isMapProcessing} onClick={handleMapLeadCapture} className="mt-3 flex h-11 w-full items-center justify-center bg-slate-900 text-xs font-black uppercase tracking-wider text-white transition-all duration-300 ease-in-out hover:bg-blue-600 disabled:pointer-events-none disabled:opacity-60">
                            {isMapProcessing ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Processing...</span> : 'Draw Search Area'}
                        </button>
                    </div>
                </div>
            </section>

            {/* =========================================================================
          EXCLUSIVE SERVICES BENTO GRID (Screen-Fitted Content)
          ========================================================================= */}
            <section id="services" className="min-h-screen flex flex-col justify-center py-16 sm:py-20 bg-white border-y border-slate-200/80 scroll-mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#2B68F6] block mb-2">
                                Bespoke Services
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight uppercase">
                                Institutional Advisory &amp; Services
                            </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                            Engineered for family offices, private trusts, and discerning collectors seeking absolute confidentiality.
                        </p>
                    </div>

                    <ServicesGrid />

                    {/* Legacy layout retained only as a visual fallback for older cached builds. */}
                    <div className="hidden grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Card 1: Large Feature */}
                        <div className="card-rise md:col-span-2 rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-7 sm:p-8 shadow-sm hover:shadow-md flex flex-col justify-between group">
                            <div>
                                <span className="text-xs font-mono font-bold text-[#2B68F6] tracking-wider uppercase block mb-2">
                                    01 / Confidential Placement
                                </span>
                                <h3 className="text-2xl font-black text-[#0F172A] tracking-tight mb-3">
                                    Off-Market Trophy Acquisitions
                                </h3>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl">
                                    Over 40% of prime luxury transactions occur entirely off-market. We provide verified direct access to unlisted architectural landmarks, coastal villas, and private farmhouses across Pakistan.
                                </p>
                            </div>

                            <div className="mt-6 flex items-center justify-between pt-5 border-t border-slate-200/60">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <Lock className="h-4 w-4 text-[#2B68F6]" /> Non-Disclosure Protected
                                </div>
                                <Link
                                    href="/valuation"
                                    className="link-arrow inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#2B68F6]"
                                >
                                    Inquire Private Network <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="card-rise rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md flex flex-col justify-between group">
                            <div>
                                <span className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase block mb-2">
                                    02 / Mobility
                                </span>
                                <h3 className="text-lg font-black text-[#0F172A] tracking-tight mb-2">
                                    Pakistan Relocation &amp; Settlement
                                </h3>
                                <p className="text-slate-600 text-xs leading-relaxed">
                                    Trusted guidance for families relocating between Karachi, Lahore, and Islamabad, with property investment counsel for every move.
                                </p>
                            </div>
                            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase">Across Pakistan</span>
                                <ArrowUpRight className="h-4 w-4 text-[#2B68F6] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="card-rise rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md flex flex-col justify-between group">
                            <div>
                                <span className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase block mb-2">
                                    03 / Asset Preservation
                                </span>
                                <h3 className="text-lg font-black text-[#0F172A] tracking-tight mb-2">
                                    Property Asset Management
                                </h3>
                                <p className="text-slate-600 text-xs leading-relaxed">
                                    White-glove tenancy management, architectural preservation, and predictive maintenance for multi-property Pakistani portfolios.
                                </p>
                            </div>
                            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase">Turnkey Oversight</span>
                                <ArrowUpRight className="h-4 w-4 text-[#2B68F6] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                        </div>

                        {/* Card 4: Double Span */}
                        <div className="card-rise md:col-span-2 rounded-[24px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 sm:p-8 shadow-sm hover:shadow-md flex flex-col justify-between group">
                            <div>
                                <span className="text-xs font-mono font-bold text-[#2B68F6] tracking-wider uppercase block mb-2">
                                    04 / Design &amp; Architecture
                                </span>
                                <h3 className="text-2xl font-black text-[#0F172A] tracking-tight mb-2">
                                    Architectural &amp; Development Counsel
                                </h3>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl">
                                    Collaborating directly with world-class Pritzker Prize architects, interior studios, and landscape masters to maximize property equity and design integrity.
                                </p>
                            </div>
                            <div className="mt-6 flex items-center justify-between pt-5 border-t border-slate-200/60">
                                <span className="text-xs font-bold text-slate-400 uppercase">Bespoke Curation</span>
                                <Link
                                    href="/agents"
                                    className="link-arrow inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#2B68F6]"
                                >
                                    Consult an Advisor <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================================
          ELITE ADVISORS SPOTLIGHT (Screen-Fitted Content)
          ========================================================================= */}
            <section id="agents" className="min-h-screen flex flex-col justify-center py-16 sm:py-20 scroll-mt-16 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#2B68F6] block mb-2">
                                Private Advisors
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight uppercase">
                                Elite Real Estate Advisors
                            </h2>
                        </div>
                        <Button asChild variant="ghost" className="text-xs font-bold uppercase tracking-wider text-[#2B68F6] hover:bg-blue-50">
                            <Link href="/agents">
                                Meet All Advisors <ArrowRight className="h-4 w-4 ml-1.5" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {agents.map((agent) => (
                            <div
                                key={agent.id}
                                className="card-rise bg-white rounded-[24px] border border-slate-200 p-4 shadow-sm hover:shadow-lg hover:border-[#2B68F6]/40 flex flex-col group"
                            >
                                {/* Advisor Photo */}
                                <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-slate-100 mb-4">
                                    <img
                                        src={agent.photo}
                                        alt={agent.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-[#0F172A] flex items-center gap-1 shadow-sm">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        <span>{agent.rating}</span>
                                    </div>
                                </div>

                                {/* Advisor Info */}
                                <div className="px-1 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-base font-black text-[#0F172A] tracking-tight">
                                            {agent.name}
                                        </h3>
                                        <p className="text-[11px] text-slate-500 font-medium mb-3">
                                            {agent.title}
                                        </p>

                                        <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-100 mb-4 text-center">
                                            <div>
                                                <span className="text-sm font-black text-[#0F172A] block">
                                                    {agent.closedDeals}
                                                </span>
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                                    Closed Deals
                                                </span>
                                            </div>
                                            <div className="border-l border-slate-100">
                                                <span className="text-sm font-black text-[#0F172A] block">
                                                    {agent.activeListings}
                                                </span>
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                                    Active Mandates
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        asChild
                                        className="w-full bg-[#0F172A] hover:bg-[#2B68F6] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl h-9 transition-colors shadow-sm"
                                    >
                                        <Link href={`/agents/${agent.id}`}>
                                            Contact Agent
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========================================================================
          HIGH-CONVERTING PROPERTY VALUATION CTA (Screen-Fitted Content)
          ========================================================================= */}
            <section id="valuation" className="min-h-screen flex flex-col justify-center py-16 bg-[#0F172A] text-white relative overflow-hidden scroll-mt-16">
                {/* Glow Accents */}
                <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-[#2B68F6]/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-blue-300 text-xs font-black uppercase tracking-[0.2em] mb-3">
                            Real-Time Market Valuation
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight uppercase">
                            Curious about your property&apos;s value?
                        </h2>
                        <p className="mt-3 text-slate-300 text-sm sm:text-base">
                            Enter your luxury property address to generate an instant algorithmic appraisal backed by verified closed sales data.
                        </p>
                    </div>

                    {/* Clean Light Bento Input Container */}
                    <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl border border-white/20 text-[#0F172A]">
                        <form onSubmit={handleValuation} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={valuationAddress}
                                    onChange={(e) => setValuationAddress(e.target.value)}
                                    placeholder="Enter property address (e.g. DHA Phase 8, Karachi)..."
                                    className="w-full h-13 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#2B68F6] focus:bg-white transition-colors"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isValuating}
                                className="h-13 px-7 bg-[#2B68F6] hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-transform active:scale-95 shrink-0"
                            >
                                {isValuating ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Calculating...
                                    </span>
                                ) : (
                                    'Get Private Valuation'
                                )}
                            </Button>
                        </form>

                        {/* Valuation Results Display */}
                        {valuationResult && (
                            <div className="mt-6 pt-6 border-t border-slate-100 css-fade-in">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                            Estimated Market Range
                                        </span>
                                        <span className="text-xl font-black text-[#0F172A] mt-0.5 block">
                                            {valuationResult.min} &ndash; {valuationResult.max}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                            Area Comps Baseline
                                        </span>
                                        <span className="text-xl font-black text-[#2B68F6] mt-0.5 block">
                                            {valuationResult.sqftPrice}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                            AI Data Confidence
                                        </span>
                                        <span className="text-sm font-black text-emerald-600 flex items-center gap-1.5 mt-1">
                                            <CheckCircle2 className="h-4 w-4" /> {valuationResult.confidence}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4 text-[#2B68F6]" />
                                <span>Strict confidentiality. No public listing or cold calls.</span>
                            </div>
                            <span>Based on PKR 180 Crore+ in verified Pakistani sales data.</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}