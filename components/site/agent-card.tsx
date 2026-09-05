'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Agent } from '@/lib/types';
import { buildWhatsAppUrl, agentContactMessage } from '@/lib/whatsapp';

interface AgentCardProps {
  agent: Agent;
  index?: number;
}

export default function AgentCard({ agent, index = 0 }: AgentCardProps) {
  const waUrl = buildWhatsAppUrl(agent.phone, agentContactMessage(agent));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={agent.photo}
          alt={agent.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/95 text-slate-900 border-transparent gap-1 shadow-sm">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {agent.rating}
          </Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-slate-900 text-lg">{agent.name}</h3>
        <p className="text-sm text-slate-500 mt-0.5">{agent.title}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {agent.specialties.slice(0, 3).map((s) => (
            <Badge key={s} variant="secondary" className="text-xs">
              {s}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">{agent.closedDeals}</p>
            <p className="text-xs text-slate-400">Closed Deals</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">{agent.activeListings}</p>
            <p className="text-xs text-slate-400">Active Listings</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button asChild size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            <Link href={`/agents/${agent.id}`}>View Profile</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          >
            <a href={waUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={`tel:${agent.phone}`}>
              <Phone className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
