'use client';

import { MapPin, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { properties } from '@/lib/properties';

interface LocationAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
}

export default function LocationAutocomplete({ value, onChange }: LocationAutocompleteProps) {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const suggestions = properties.filter((property) => `${property.address} ${property.location}`.toLowerCase().includes(value.toLowerCase())).slice(0, 5);
    useEffect(() => {
        if (!apiKey || !inputRef.current || typeof window === 'undefined') return;
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.onload = () => {
            const googleMaps = (window as typeof window & { google?: any }).google;
            if (!googleMaps || !inputRef.current) return;
            const autocomplete = new googleMaps.maps.places.Autocomplete(inputRef.current, { fields: ['formatted_address', 'geometry'] });
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.formatted_address) onChange(place.formatted_address);
            });
        };
        document.head.appendChild(script);
        return () => script.remove();
    }, [apiKey, onChange]);
    return <div className="relative">
        <div className="flex h-10 items-center gap-2 border border-slate-200 bg-slate-50 px-3 focus-within:border-blue-600">
            <Search className="h-4 w-4 text-slate-400" />
            <input ref={inputRef} value={value === 'all' ? '' : value} onChange={(event) => onChange(event.target.value || 'all')} onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 150)} placeholder="Search address or area" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
        </div>
        {focused && value && value !== 'all' && suggestions.length > 0 && <div className="absolute left-0 right-0 top-11 z-40 border border-slate-200 bg-white shadow-lg">{suggestions.map((property) => <button type="button" key={property.id} onClick={() => onChange(property.location)} className="flex w-full items-start gap-2 px-3 py-2 text-left text-xs hover:bg-slate-50"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" /><span><strong className="block text-slate-900">{property.location}</strong><span className="text-slate-500">{property.address}</span></span></button>)}</div>}
    </div>;
}