'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    TrendingUp,
    ArrowRight,
    CheckCircle2,
    Loader2,
    Mail,
    Phone,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ValuationPage() {
    const [step, setStep] = useState(1);
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

    const handleSubmitAddress = (e: React.FormEvent) => {
        e.preventDefault();
        if (!address || !email) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setEstimatedValue(Math.floor(Math.random() * 1500000) + 500000);
            setStep(2);
        }, 2000);
    };

    const reset = () => {
        setStep(1);
        setAddress('');
        setEmail('');
        setPhone('');
        setEstimatedValue(null);
    };

    return (
        <div className="bg-slate-50 min-h-screen pt-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">
                        Free Home Valuation
                    </span>
                    <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                        Instant Home Valuation
                    </h1>
                    <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
                        Enter your property address and get an estimated market value in seconds.
                        No commitment, no obligation.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-5 gap-8 items-start">
                    {/* Benefits sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-2 space-y-4"
                    >
                        {[
                            { icon: TrendingUp, title: 'AI-Powered Analysis', desc: 'Our algorithm analyzes recent sales, market trends, and property features.' },
                            { icon: Home, title: 'Compare Local Sales', desc: 'See how your home compares to recently sold properties in your area.' },
                            { icon: CheckCircle2, title: '100% Free', desc: 'No sign-up required. Get your estimate instantly.' },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4"
                            >
                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <item.icon className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}

                        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
                            <p className="text-sm text-blue-700">
                                <span className="font-semibold">Did you know?</span> Homes listed
                                with a professional valuation sell 30% faster on average.
                            </p>
                        </div>
                    </motion.div>

                    {/* Form card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                <Home className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Get Your Estimate</h3>
                                <p className="text-xs text-slate-500">Step {step} of 2</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.form
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleSubmitAddress}
                                    className="space-y-4"
                                >
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Home Address</label>
                                        <Input
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="e.g. DHA Phase 8, Karachi"
                                            className="h-12"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="pl-9 h-12"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Phone (optional)</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+1 (555) 123-4567"
                                                className="pl-9 h-12"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                Analyzing market data...
                                            </>
                                        ) : (
                                            <>
                                                Get Instant Estimated Value
                                                <ArrowRight className="h-5 w-5 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </motion.form>
                            )}

                            {step === 2 && estimatedValue !== null && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                        className="mx-auto h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
                                    >
                                        <TrendingUp className="h-8 w-8 text-emerald-600" />
                                    </motion.div>
                                    <p className="text-sm text-slate-500">Estimated Market Value for</p>
                                    <p className="text-sm font-semibold text-slate-700 mb-3">{address}</p>
                                    <p className="text-4xl font-bold text-slate-900">
                                        PKR {(estimatedValue * 20).toLocaleString('en-PK')}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        Confidence range based on comparable Pakistani sales
                                    </p>

                                    <div className="mt-6 p-4 bg-slate-50 rounded-xl text-left">
                                        <p className="text-sm text-slate-600">
                                            <span className="font-semibold">Next steps:</span> One of our
                                            expert agents will reach out to you at <span className="font-medium text-blue-600">{email}</span> with
                                            a detailed comparative market analysis.
                                        </p>
                                    </div>

                                    <div className="flex gap-2 mt-6">
                                        <Button onClick={reset} variant="outline" className="flex-1">
                                            New Search
                                        </Button>
                                        <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                                            Talk to an Agent
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
