'use client';

import { MapPin, Home as HomeIcon, DollarSign, Bed, Bath } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Filters } from '@/lib/types';
import LocationAutocomplete from '@/components/maps/location-autocomplete';

interface FilterBarProps {
    filters: Filters;
    onChange: (filters: Filters) => void;
    resultCount?: number;
    compact?: boolean;
}

export default function FilterBar({
    filters,
    onChange,
    resultCount,
    compact = false,
}: FilterBarProps) {
    return (
        <div className={`bg-white rounded-sm shadow-sm border border-slate-200 ${compact ? 'p-4' : 'p-5 sm:p-6'}`}>
            <div className={`grid gap-${compact ? '3' : '4'} grid-cols-1 sm:grid-cols-2 ${compact ? 'lg:grid-cols-5' : 'lg:grid-cols-5'}`}>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> Location
                    </label>
                    <LocationAutocomplete value={filters.location} onChange={(location) => onChange({ ...filters, location })} />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <HomeIcon className="h-3.5 w-3.5" /> Type
                    </label>
                    <Select
                        value={filters.propertyType}
                        onValueChange={(v) => onChange({ ...filters, propertyType: v })}
                    >
                        <SelectTrigger className="bg-slate-50 h-10">
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
                        <DollarSign className="h-3.5 w-3.5" /> Price
                    </label>
                    <Select
                        value={filters.priceRange}
                        onValueChange={(v) => onChange({ ...filters, priceRange: v })}
                    >
                        <SelectTrigger className="bg-slate-50 h-10">
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

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <Bed className="h-3.5 w-3.5" /> Beds
                    </label>
                    <Select
                        value={filters.beds}
                        onValueChange={(v) => onChange({ ...filters, beds: v })}
                    >
                        <SelectTrigger className="bg-slate-50 h-10">
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                            <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <Bath className="h-3.5 w-3.5" /> Baths
                    </label>
                    <Select
                        value={filters.baths}
                        onValueChange={(v) => onChange({ ...filters, baths: v })}
                    >
                        <SelectTrigger className="bg-slate-50 h-10">
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 border-t border-slate-100 pt-4">
                {[
                    ['nocCleared', 'NOC Cleared'],
                    ['ownerBuilt', 'Owner Built'],
                    ['cornerParkFacing', 'Corner/Park Facing'],
                    ['servantQuarter', 'Servant Quarter'],
                ].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                        <input
                            type="checkbox"
                            checked={Boolean(filters[key as keyof Filters])}
                            onChange={(event) => onChange({ ...filters, [key]: event.target.checked })}
                            className="h-4 w-4 accent-blue-600"
                        />
                        {label}
                    </label>
                ))}
            </div>

            {resultCount !== undefined && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        <span className="font-semibold text-slate-900">{resultCount}</span>{' '}
                        {resultCount === 1 ? 'property' : 'properties'} found
                    </p>
                    <button
                        onClick={() =>
                            onChange({
                                location: 'all',
                                propertyType: 'all',
                                priceRange: 'all',
                                beds: 'all',
                                baths: 'all',
                                nocCleared: false,
                                ownerBuilt: false,
                                cornerParkFacing: false,
                                servantQuarter: false,
                            })
                        }
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
