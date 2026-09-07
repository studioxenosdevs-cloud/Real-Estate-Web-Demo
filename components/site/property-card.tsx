'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Bed,
    Bath,
    Maximize,
    MapPin,
    ArrowRight,
    Heart,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/lib/types';
import { formatPrice } from '@/lib/whatsapp';
import { useAuth } from '@/lib/auth-context';

interface PropertyCardProps {
    property: Property;
    index?: number;
    onHover?: (id: number | undefined) => void;
    highlighted?: boolean;
}

export default function PropertyCard({ property, onHover, highlighted = false }: PropertyCardProps) {
    const { user, savedHomes, toggleSavedHome } = useAuth();
    const isSaved = savedHomes.includes(property.id);

    return (
        <div onMouseEnter={() => onHover?.(property.id)} onMouseLeave={() => onHover?.(undefined)} className={`bg-white rounded-sm border shadow-sm hover:shadow-xl hover:border-[#2B68F6]/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group ${highlighted ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200/90'}`}>
            {/* Property Image with Rounded Container & Crisp Badges */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                <Link href={`/listings/${property.id}`} className="block h-full w-full">
                    <img
                        src={property.images[0]}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 via-transparent to-transparent pointer-events-none" />

                {/* Price Tag Badge */}
                <div className="absolute top-4 left-4">
                    <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-sm border border-slate-200/60 shadow-sm">
                        <span className="text-sm font-black tracking-tight text-[#0F172A]">
                            {formatPrice(property.price)}
                        </span>
                    </div>
                </div>

                {/* Category & Save Button */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <Badge className="bg-[#0F172A]/90 backdrop-blur-md text-white border-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                        {property.type}
                    </Badge>
                    <button
                        onClick={() => toggleSavedHome(property.id)}
                        className="h-8 w-8 rounded-sm bg-white/95 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all duration-300 ease-in-out text-slate-700"
                        aria-label="Save home"
                    >
                        <Heart
                            className={`h-4 w-4 transition-colors ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-500 hover:text-rose-500'
                                }`}
                        />
                    </button>
                </div>

                {property.instantTour && (
                    <div className="absolute bottom-4 left-4">
                        <div className="inline-flex items-center gap-1.5 bg-[#2B68F6] text-white text-[11px] font-bold px-3 py-1 rounded-sm shadow-md shadow-blue-500/30">
                            <Sparkles className="h-3 w-3" /> Instant Virtual Tour
                        </div>
                    </div>
                )}
            </div>

            {/* Property Details */}
            <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        <MapPin className="h-3.5 w-3.5 text-[#2B68F6] shrink-0" />
                        <span className="truncate">{property.address}</span>
                    </div>

                    <Link href={`/listings/${property.id}`}>
                        <h3 className="text-lg font-bold text-[#0F172A] tracking-tight group-hover:text-[#2B68F6] transition-colors line-clamp-1">
                            {property.title}
                        </h3>
                    </Link>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-5">
                        <div className="flex items-center gap-1.5">
                            <Bed className="h-4 w-4 text-slate-400" />
                            <span>{property.beds} Beds</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Bath className="h-4 w-4 text-slate-400" />
                            <span>{property.baths} Baths</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Maximize className="h-4 w-4 text-slate-400" />
                            <span>{property.sqft.toLocaleString()} {property.areaUnit}</span>
                        </div>
                    </div>

                    <div className="mb-5 grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                        {property.metrics.nocCleared && <span className="border-l-2 border-emerald-500 bg-emerald-50 px-2 py-1.5">NOC Cleared</span>}
                        {property.metrics.ownerBuilt && <span className="border-l-2 border-blue-500 bg-blue-50 px-2 py-1.5">Owner Built</span>}
                        {property.metrics.cornerParkFacing && <span className="border-l-2 border-amber-500 bg-amber-50 px-2 py-1.5">Corner/Park Facing</span>}
                        {property.metrics.servantQuarter && <span className="border-l-2 border-slate-500 bg-slate-50 px-2 py-1.5">Servant Quarter</span>}
                    </div>

                    <div className="flex gap-2.5">
                        <Button
                            asChild
                            className="flex-1 bg-slate-900 hover:bg-[#2B68F6] text-white text-xs font-bold uppercase tracking-wider h-10 rounded-xl transition-all shadow-sm group/btn"
                        >
                            <Link href={`/listings/${property.id}`}>
                                View Details
                                <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
