'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
    Bed,
    Bath,
    Maximize,
    MapPin,
    Calendar,
    MessageCircle,
    Phone,
    Mail,
    CheckCircle2,
    Heart,
    Share2,
    ArrowLeft,
    ChevronRight,
    Car,
    CalendarDays,
    Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPropertyById, getAgentById, getSimilarProperties } from '@/lib/properties';
import { formatPrice, formatPriceFull, buildWhatsAppUrl, propertyInquiryMessage } from '@/lib/whatsapp';
import InstallmentPlanCalculator from '@/components/site/installment-plan-calculator';
import PropertyCard from '@/components/site/property-card';
import { useAuth } from '@/lib/auth-context';

export default function PropertyDetailsPage() {
    const params = useParams();
    const id = parseInt(params.id as string);
    const property = getPropertyById(id);

    if (!property) {
        notFound();
    }

    // Single non-null binding — avoids repeating `property!` everywhere below.
    const p = property;
    const { user, savedHomes, toggleSavedHome } = useAuth();
    const isSaved = savedHomes.includes(p.id);

    const agent = getAgentById(p.agentId)!;
    const similar = getSimilarProperties(p, 3);
    const waUrl = buildWhatsAppUrl(agent.phone, propertyInquiryMessage(p, agent.name));

    const specs = [
        { icon: Bed, label: 'Beds', value: p.beds },
        { icon: Bath, label: 'Baths', value: p.baths },
        { icon: Maximize, label: p.type === 'Farmhouse' ? 'Land' : 'Area', value: `${p.sqft.toLocaleString()} ${p.areaUnit}` },
        { icon: Car, label: 'Parking', value: p.parking },
        { icon: CalendarDays, label: 'Built', value: p.yearBuilt },
    ];

    return (
        <div className="bg-slate-50 min-h-screen pt-16 sm:pt-24">
            <div className="max-w-7xl mx-auto pb-28 sm:px-6 lg:px-8 lg:pb-10 sm:py-8">
                {/* Breadcrumb — desktop/tablet only, replaced by overlay controls on mobile */}
                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <span>/</span>
                    <Link href="/listings" className="hover:text-blue-600">Listings</Link>
                    <span>/</span>
                    <span className="text-slate-900 font-medium truncate">{p.title}</span>
                </div>

                {/* Image Gallery — full-bleed on mobile with floating controls, contained on larger screens */}
                <div className="relative sm:mb-8 overflow-hidden bg-slate-200 sm:rounded-sm">
                    <div className="flex h-[52dvh] snap-x snap-mandatory overflow-x-auto overscroll-x-contain scrollbar-none sm:h-[min(70dvh,520px)]">
                        {p.images.map((image, index) => (
                            <div key={image} className="relative min-w-full snap-center">
                                <img src={image} alt={`${p.title} view ${index + 1}`} className="h-full w-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} />
                            </div>
                        ))}
                    </div>

                    {/* Image counter */}
                    <span className="absolute bottom-3 right-3 rounded-sm bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                        {p.images.length} photos
                    </span>

                    {p.instantTour && (
                        <Badge className="absolute left-3 bottom-3 sm:left-auto sm:right-3 sm:top-3 sm:bottom-auto gap-1 border-transparent bg-emerald-500 text-white">
                            <CheckCircle2 className="h-3 w-3" /> Instant Tour
                        </Badge>
                    )}

                    {/* Mobile-only floating nav: back / save / share, app-style, over the image */}
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:hidden">
                        <Link href="/listings" className="flex h-9 w-9 items-center justify-center rounded-sm bg-black/40 text-white backdrop-blur-sm">
                            <ArrowLeft className="h-4.5 w-4.5" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => user && toggleSavedHome(p.id)}
                                disabled={!user}
                                aria-label="Save property"
                                className="flex h-9 w-9 items-center justify-center rounded-sm bg-black/40 text-white backdrop-blur-sm disabled:opacity-50"
                            >
                                <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                            <button aria-label="Share property" className="flex h-9 w-9 items-center justify-center rounded-sm bg-black/40 text-white backdrop-blur-sm">
                                <Share2 className="h-4.5 w-4.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 px-4 sm:px-0 pt-4 sm:pt-0">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">{p.title}</h1>
                        <div className="flex items-center gap-1 text-slate-500 mt-1.5 sm:mt-2 text-sm sm:text-base">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span className="truncate">{p.address}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="sm:text-right">
                            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{formatPrice(p.price)}</p>
                            <p className="text-xs sm:text-sm text-slate-400">{formatPriceFull(p.price)}</p>
                        </div>
                        {/* Save / share repeated here only on tablet+ (mobile has the overlay versions) */}
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => user && toggleSavedHome(p.id)}
                                disabled={!user}
                                aria-label="Save property"
                                className="h-10 w-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition-colors"
                            >
                                <Heart className={`h-5 w-5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                            </button>
                            <button aria-label="Share property" className="h-10 w-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors">
                                <Share2 className="h-5 w-5 text-slate-400" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Compact agent strip — mobile/tablet only, replaces the full sidebar card so the page doesn't scroll twice as far */}
                <Link
                    href={`/agents/${agent.id}`}
                    className="lg:hidden mx-4 sm:mx-0 mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm active:scale-[0.99] transition-transform"
                >
                    <img src={agent.photo} alt={agent.name} className="h-11 w-11 rounded-full object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 text-sm truncate">{agent.name}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span>{agent.rating} &middot; {agent.title}</span>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 shrink-0" />
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-0">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Specs */}
                        <div className="bg-white border border-slate-200 rounded-sm p-4 sm:p-6">
                            <h2 className="font-bold text-slate-900 text-base sm:text-lg mb-3 sm:mb-4">Property Details</h2>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-4">
                                {specs.map((spec) => (
                                    <div key={spec.label} className="text-center bg-slate-50 p-2 sm:p-3 rounded-sm">
                                        <spec.icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mx-auto mb-1" />
                                        <p className="font-bold text-slate-900 text-xs sm:text-base leading-tight">{spec.value}</p>
                                        <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide mt-0.5">{spec.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-sm border border-slate-200 p-4 sm:p-6">
                            <h2 className="font-bold text-slate-900 text-base sm:text-lg mb-3">About This Property</h2>
                            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{p.description}</p>
                        </div>

                        {/* Collapsible sections keep the mobile scroll short by default */}
                        <details className="group border border-slate-200 bg-white p-4 sm:p-6 rounded-sm">
                            <summary className="cursor-pointer list-none pr-6 text-base sm:text-lg font-bold text-slate-900 marker:hidden after:float-right after:text-blue-600 after:content-['+'] group-open:after:content-['−']">
                                Amenities &amp; Features
                            </summary>
                            <div className="mt-4 sm:mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:pt-5 sm:grid-cols-2">
                                {p.amenities.map((amenity) => (
                                    <div key={amenity} className="flex items-center gap-2.5">
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                                        <span className="text-sm text-slate-700">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </details>

                        <details className="group border border-slate-200 bg-white rounded-sm overflow-hidden">
                            <summary className="cursor-pointer list-none p-4 sm:p-6 text-base sm:text-lg font-bold text-slate-900 marker:hidden after:float-right after:text-blue-600 after:content-['+'] group-open:after:content-['−'] [&::-webkit-details-marker]:hidden">
                                Installment Plan Calculator
                            </summary>
                            <div className="px-4 pb-4 sm:px-6 sm:pb-6"><InstallmentPlanCalculator price={p.price} /></div>
                        </details>

                        <details className="group border border-slate-200 bg-white p-4 sm:p-6 rounded-sm">
                            <summary className="cursor-pointer list-none pr-6 text-base sm:text-lg font-bold text-slate-900 marker:hidden after:float-right after:text-blue-600 after:content-['+'] group-open:after:content-['−']">
                                Location Map
                            </summary>
                            <div className="mt-4 sm:mt-5 overflow-hidden rounded-xl border-t border-slate-100 pt-4 sm:pt-5">
                                <iframe
                                    title={`${p.title} location map`}
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(p.address + ', Pakistan')}&output=embed`}
                                    className="h-64 sm:h-72 w-full border-0 rounded-xl"
                                    loading="lazy"
                                />
                            </div>
                        </details>
                    </div>

                    {/* Sidebar — desktop/tablet-large only; mobile relies on the compact strip + fixed bottom bar above */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* Agent Contact Box */}
                            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <img src={agent.photo} alt={agent.name} className="h-14 w-14 rounded-sm object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900">{agent.name}</h3>
                                            <p className="text-xs text-slate-500">{agent.title}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                <span className="text-xs text-slate-600">{agent.rating} rating</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 space-y-3">
                                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11">
                                        <Link href={`/agents/${agent.id}`}>
                                            <Calendar className="h-4 w-4 mr-2" /> Book Instant Tour
                                        </Link>
                                    </Button>
                                    <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-11">
                                        <a href={waUrl} target="_blank" rel="noopener noreferrer">
                                            <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp Agent
                                        </a>
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" className="flex-1 h-10">
                                            <a href={`tel:${agent.phone}`}>
                                                <Phone className="h-4 w-4 mr-1.5" /> Call
                                            </a>
                                        </Button>
                                        <Button asChild variant="outline" className="flex-1 h-10">
                                            <a href={`mailto:${agent.email}`}>
                                                <Mail className="h-4 w-4 mr-1.5" /> Email
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Facts */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5">
                                <h3 className="font-bold text-slate-900 text-sm mb-3">Quick Facts</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Type</span>
                                        <span className="font-medium text-slate-900">{p.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Location</span>
                                        <span className="font-medium text-slate-900">{p.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Price / {p.areaUnit}</span>
                                        <span className="font-medium text-slate-900">
                                            PKR {Math.round(p.price / p.sqft).toLocaleString('en-PK')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Status</span>
                                        <span className="font-medium text-emerald-600">For Sale</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Properties */}
                <section className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-200 px-4 sm:px-0">
                    <div className="flex items-end justify-between mb-6 sm:mb-8">
                        <div>
                            <span className="text-xs sm:text-sm font-semibold text-blue-600 tracking-wide uppercase">You Might Like</span>
                            <h2 className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                Similar Properties
                            </h2>
                        </div>
                        <Button asChild variant="outline" size="sm" className="shrink-0">
                            <Link href="/listings">
                                View All <ArrowLeft className="h-4 w-4 ml-1.5 sm:ml-2 rotate-180" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {similar.map((s, i) => (
                            <PropertyCard key={s.id} property={s} index={i} />
                        ))}
                    </div>
                </section>
            </div>

            {/* Fixed mobile action bar — 3 clear, equal-weight actions instead of forcing a scroll back up */}
            <div className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-3 gap-2 border-t border-slate-200 bg-white p-3 md:hidden [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))]">
                <a href={`tel:${agent.phone}`} className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 active:scale-[0.97] transition-transform">
                    <Phone className="h-4 w-4" /> Call
                </a>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-sm font-bold text-white active:scale-[0.97] transition-transform">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <Link href={`/agents/${agent.id}`} className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-blue-600 text-sm font-bold text-white active:scale-[0.97] transition-transform">
                    <Calendar className="h-4 w-4" /> Tour
                </Link>
            </div>
        </div>
    );
}