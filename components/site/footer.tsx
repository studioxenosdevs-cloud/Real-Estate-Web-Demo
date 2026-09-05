'use client';

import Link from 'next/link';
import { Mail, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
    return (
        <footer className="bg-white text-slate-600 border-t border-slate-200/80 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F172A] text-white font-black text-sm tracking-tighter shadow-sm">
                                AE
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-wider text-[#0F172A]">
                                    AETHER
                                </span>
                                <span className="text-[9px] font-bold tracking-[0.25em] text-slate-400 uppercase -mt-1">
                                    Private Brokerage
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                            Representing Pakistan&apos;s most distinguished addresses and off-market architectural landmarks with discretion, bespoke advisory, and local market intelligence.
                        </p>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <Globe className="h-4 w-4 text-[#2B68F6]" />
                            <span>Karachi &bull; Lahore &bull; Islamabad &bull; Rawalpindi</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0F172A] mb-5">
                            Portfolio
                        </h4>
                        <ul className="space-y-3 text-sm font-medium">
                            {[
                                { label: 'All Estates', href: '/listings' },
                                { label: 'Off-Market Mansions', href: '/listings' },
                                { label: 'Penthouses & Sky-Villas', href: '/listings' },
                                { label: 'Waterfront Properties', href: '/listings' },
                                { label: 'Architectural Landmarks', href: '/listings' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-slate-600 hover:text-[#2B68F6] transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Advisory */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0F172A] mb-5">
                            Advisory
                        </h4>
                        <ul className="space-y-3 text-sm font-medium">
                            {[
                                { label: 'Private Wealth Counsel', href: '/#services' },
                                { label: 'Pakistan Relocation', href: '/#services' },
                                { label: 'Instant Home Valuation', href: '/valuation' },
                                { label: 'Senior Advisors', href: '/agents' },
                                { label: 'Client Confidentiality', href: '/#services' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-slate-600 hover:text-[#2B68F6] transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / Private Briefing */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0F172A] mb-5">
                            Private Briefing
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                            Receive confidential quarterly market intelligence and exclusive off-market releases.
                        </p>
                        <div className="space-y-2">
                            <div className="flex rounded-sm border border-slate-200 bg-slate-50 p-1 focus-within:border-[#2B68F6] transition-all duration-300 ease-in-out">
                                <input
                                    type="email"
                                    placeholder="name@familyoffice.com"
                                    className="w-full bg-transparent px-3 text-xs text-[#0F172A] outline-none placeholder:text-slate-400"
                                />
                                <Button size="sm" className="rounded-sm bg-[#2B68F6] hover:bg-blue-700 text-white h-8 px-3 text-xs transition-all duration-300 ease-in-out">
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                    <p>&copy; {new Date().getFullYear()} AETHER Private Brokerage LLC. All rights reserved.</p>
                    <div className="flex gap-6 font-medium">
                        <span>Privacy Policy</span>
                        <span>Terms of Representation</span>
                        <span>Discretion Protocol</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
