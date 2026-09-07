'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { properties as seedProperties } from '@/lib/properties';
import type { Property } from '@/lib/types';

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    budget: string;
    source: 'Website' | 'Chatbot';
    propertyId?: number;
    createdAt: string;
}

export interface Appointment {
    id: string;
    leadId: string;
    name: string;
    email: string;
    phone: string;
    propertyId?: number;
    propertyName: string;
    date: string;
    time: string;
    status: AppointmentStatus;
    source: 'Website' | 'Chatbot';
}

export interface ChatLog {
    id: string;
    leadId?: string;
    messages: { role: 'user' | 'assistant'; text: string; createdAt: string }[];
    updatedAt: string;
}

interface MarketplaceContextValue {
    properties: Property[];
    leads: Lead[];
    appointments: Appointment[];
    chatLogs: ChatLog[];
    addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => string;
    addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
    updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
    addChatMessage: (logId: string, message: ChatLog['messages'][number], leadId?: string) => void;
    updatePropertyStatus: (id: number, status: Property['status']) => void;
    addProperty: (property: Omit<Property, 'id'>) => void;
}

const MarketplaceContext = createContext<MarketplaceContextValue | undefined>(undefined);
const storageKey = 'aether-marketplace-state';

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
    const [properties, setProperties] = useState<Property[]>(seedProperties);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);

    useEffect(() => {
        const saved = window.localStorage.getItem(storageKey);
        if (!saved) return;
        try {
            const state = JSON.parse(saved);
            if (state.properties) setProperties(state.properties);
            if (state.leads) setLeads(state.leads);
            if (state.appointments) setAppointments(state.appointments);
            if (state.chatLogs) setChatLogs(state.chatLogs);
        } catch {
            window.localStorage.removeItem(storageKey);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem(storageKey, JSON.stringify({ properties, leads, appointments, chatLogs }));
    }, [properties, leads, appointments, chatLogs]);

    const value = useMemo<MarketplaceContextValue>(() => ({
        properties,
        leads,
        appointments,
        chatLogs,
        addLead: (lead) => {
            const id = `lead-${Date.now()}`;
            setLeads((current) => [{ ...lead, id, createdAt: new Date().toISOString() }, ...current]);
            return id;
        },
        addAppointment: (appointment) => setAppointments((current) => [{ ...appointment, id: `tour-${Date.now()}` }, ...current]),
        updateAppointmentStatus: (id, status) => setAppointments((current) => current.map((item) => item.id === id ? { ...item, status } : item)),
        addChatMessage: (logId, message, leadId) => setChatLogs((current) => {
            const existing = current.find((log) => log.id === logId);
            if (existing) return current.map((log) => log.id === logId ? { ...log, leadId: leadId || log.leadId, messages: [...log.messages, message], updatedAt: message.createdAt } : log);
            return [{ id: logId, leadId, messages: [message], updatedAt: message.createdAt }, ...current];
        }),
        updatePropertyStatus: (id, status) => setProperties((current) => current.map((property) => property.id === id ? { ...property, status } : property)),
        addProperty: (property) => setProperties((current) => [...current, { ...property, id: Math.max(0, ...current.map((item) => item.id)) + 1 }]),
    }), [properties, leads, appointments, chatLogs]);

    return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
    const context = useContext(MarketplaceContext);
    if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
    return context;
}