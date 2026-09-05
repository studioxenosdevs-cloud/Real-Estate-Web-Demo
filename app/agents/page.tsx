'use client';

import { motion } from 'framer-motion';
import { agents } from '@/lib/properties';
import AgentCard from '@/components/site/agent-card';

export default function AgentsPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Our Agents
          </h1>
          <p className="text-slate-500 mt-2">
            Meet our team of experienced real estate professionals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
