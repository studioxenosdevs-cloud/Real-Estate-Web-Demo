export type PropertyType = 'Villa' | 'Plot' | 'Farmhouse';
export type Location = 'DHA Karachi' | 'Bahria Town Lahore' | 'Rawalpindi' | 'Gulberg' | 'DHA Islamabad' | 'Bedian Road Lahore';

export interface PropertyMetrics {
    nocCleared: boolean;
    ownerBuilt: boolean;
    cornerParkFacing: boolean;
    servantQuarter: boolean;
    solarInstalled: boolean;
}

export interface Property {
    id: number;
    title: string;
    type: PropertyType;
    location: Location;
    address: string;
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    areaUnit: 'Marla' | 'Kanal' | 'Sq Yd';
    metrics: PropertyMetrics;
    images: string[];
    instantTour: boolean;
    agentId: number;
    featured: boolean;
    description: string;
    amenities: string[];
    yearBuilt: number;
    parking: number;
}

export interface Agent {
    id: number;
    name: string;
    title: string;
    email: string;
    phone: string;
    photo: string;
    bio: string;
    closedDeals: number;
    activeListings: number;
    rating: number;
    reviews: Review[];
    specialties: string[];
}

export interface Review {
    id: number;
    author: string;
    rating: number;
    text: string;
    date: string;
}

export interface Filters {
    location: string;
    propertyType: string;
    priceRange: string;
    beds: string;
    baths: string;
    nocCleared?: boolean;
    ownerBuilt?: boolean;
    cornerParkFacing?: boolean;
    servantQuarter?: boolean;
}

export const defaultFilters: Filters = {
    location: 'all',
    propertyType: 'all',
    priceRange: 'all',
    beds: 'all',
    baths: 'all',
};

export interface User {
    email: string;
    name: string;
}
