import type { Property, Agent } from './types';

export function buildWhatsAppUrl(phone: string, message: string): string {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function propertyInquiryMessage(property: Property, agentName?: string): string {
    const greeting = agentName ? `Hi ${agentName}, ` : 'Hi, ';
    return `${greeting}I am interested in viewing "${property.title}" (${formatPrice(property.price)}) at ${property.address}. I'd like to schedule a tour. Could you please share more details?`;
}

export function agentContactMessage(agent: Agent): string {
    return `Hi ${agent.name}, I found your profile on EstateElite and would like to connect regarding a property inquiry. Are you available to chat?`;
}

export function formatPrice(price: number): string {
    if (price >= 10000000) {
        return `PKR ${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 1)} Crore`;
    }
    return `PKR ${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)} Lakh`;
}

export function formatPriceFull(price: number): string {
    return `PKR ${price.toLocaleString('en-PK')}`;
}

