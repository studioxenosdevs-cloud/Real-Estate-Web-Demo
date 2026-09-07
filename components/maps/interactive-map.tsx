'use client';

import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import type { Property } from '@/lib/types';
import { formatPrice } from '@/lib/whatsapp';

interface InteractiveMapProps {
    properties: Property[];
    activeId?: number;
    onSelect?: (id: number) => void;
}

const coordinates: Record<string, { left: number; top: number }> = {
    'DHA Karachi': { left: 77, top: 73 }, 'Rawalpindi': { left: 51, top: 24 }, 'Bedian Road Lahore': { left: 46, top: 37 }, 'DHA Islamabad': { left: 52, top: 20 }, 'Gulberg': { left: 48, top: 39 },
};

export default function InteractiveMap({ properties, activeId, onSelect }: InteractiveMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        if (!apiKey || !mapRef.current || typeof window === 'undefined') return;
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.onload = () => {
            const googleMaps = (window as typeof window & { google?: any }).google;
            if (!googleMaps || !mapRef.current) return;
            const map = new googleMaps.maps.Map(mapRef.current, { center: { lat: 30.3753, lng: 69.3451 }, zoom: 5, disableDefaultUI: true, zoomControl: true });
            properties.forEach((property) => new googleMaps.maps.Marker({ map, position: { lat: 30.3753 + (property.id * 0.25), lng: 69.3451 + (property.id * 0.35) }, title: property.title }));
        };
        document.head.appendChild(script);
        return () => { script.remove(); };
    }, [apiKey, properties]);

    return <div ref={mapRef} className="relative min-h-[25rem] overflow-hidden bg-[#dfe9e8]" style={{ backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,.5), transparent 45%), repeating-linear-gradient(20deg, transparent 0 42px, rgba(255,255,255,.5) 43px 45px)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_0%,rgba(15,23,42,.08)_100%)]" />
        {!apiKey && <div className="absolute left-4 top-4 z-10 border border-white/80 bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 shadow-sm">Preview map · Google key optional</div>}
        {!apiKey && properties.map((property) => { const point = coordinates[property.location] || { left: 50, top: 50 }; return <button key={property.id} type="button" onClick={() => onSelect?.(property.id)} className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform ${activeId === property.id ? 'scale-125' : 'hover:scale-110'}`} style={{ left: `${point.left}%`, top: `${point.top}%` }}><span className={`block whitespace-nowrap border-2 border-white px-2 py-1 text-[10px] font-bold shadow-md ${activeId === property.id ? 'bg-blue-600 text-white' : 'bg-slate-950 text-white'}`}>{formatPrice(property.price)}</span><MapPin className={`mx-auto h-5 w-5 ${activeId === property.id ? 'fill-blue-600 text-blue-600' : 'fill-slate-950 text-slate-950'}`} /></button>; })}
    </div>;
}