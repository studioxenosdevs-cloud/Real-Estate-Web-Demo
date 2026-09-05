'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Star,
  Phone,
  MessageCircle,
  Mail,
  Award,
  Home as HomeIcon,
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAgentById, getAgentProperties } from '@/lib/properties';
import { buildWhatsAppUrl, agentContactMessage } from '@/lib/whatsapp';
import PropertyCard from '@/components/site/property-card';

export default function AgentProfilePage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const agent = getAgentById(id);

  if (!agent) {
    notFound();
  }

  const agentProperties = getAgentProperties(agent!.id);
  const waUrl = buildWhatsAppUrl(agent!.phone, agentContactMessage(agent!));

  return (
    <div className="bg-slate-50 min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          href="/agents"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Agents
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8"
        >
          <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-800" />
          <div className="px-6 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <img
                src={agent!.photo}
                alt={agent!.name}
                className="h-28 w-28 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              <div className="flex-1 sm:pb-2">
                <h1 className="text-2xl font-bold text-slate-900">{agent!.name}</h1>
                <p className="text-sm text-slate-500">{agent!.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-slate-700">{agent!.rating}</span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <span className="text-sm text-slate-500">{agent!.reviews.length} reviews</span>
                </div>
              </div>
              <div className="flex gap-2 sm:pb-2">
                <Button
                  asChild
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <a href={waUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={`tel:${agent!.phone}`}>
                    <Phone className="h-4 w-4 mr-2" /> Call
                  </a>
                </Button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{agent!.closedDeals}</p>
                  <p className="text-xs text-slate-400">Closed Deals</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <HomeIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{agent!.activeListings}</p>
                  <p className="text-xs text-slate-400">Active Listings</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{agent!.rating}</p>
                  <p className="text-xs text-slate-400">Avg Rating</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bio + Reviews */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-bold text-slate-900 text-lg mb-3">About {agent!.name}</h2>
              <p className="text-slate-600 leading-relaxed">{agent!.bio}</p>

              <h3 className="font-semibold text-slate-900 text-sm mt-6 mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {agent!.specialties.map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-bold text-slate-900 text-lg mb-5">Client Reviews</h2>
              <div className="space-y-5">
                {agent!.reviews.map((review) => (
                  <div key={review.id} className="pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-blue-600">
                          {review.author.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-900">{review.author}</p>
                          <span className="text-xs text-slate-400">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mt-0.5 mb-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < Math.round(review.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{review.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-4">Contact {agent!.name.split(' ')[0]}</h3>
                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-11"
                  >
                    <a href={waUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp Agent
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full h-11">
                    <a href={`tel:${agent!.phone}`}>
                      <Phone className="h-4 w-4 mr-2" /> {agent!.phone}
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full h-11">
                    <a href={`mailto:${agent!.email}`}>
                      <Mail className="h-4 w-4 mr-2" /> Send Email
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Listings */}
        {agentProperties.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
              Active Listings by {agent!.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentProperties.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
