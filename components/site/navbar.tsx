'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Menu, X, User as UserIcon, Heart, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const { user, signOut, savedHomes } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const navLinks = [
        { label: 'Home', href: '/' },
        { label: 'Featured', href: '/#featured' },
        { label: 'Properties', href: '/properties' },
        { label: 'Map Search', href: '/#map-search' },
        { label: 'Advisors', href: '/advisors' },
    ];

    const initials = user
        ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
        : '';

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300 ease-in-out ${scrolled ? 'shadow-sm py-3' : 'py-4'}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F172A] text-white font-black text-sm tracking-tighter group-hover:bg-[#2B68F6] transition-colors shadow-sm">
                            AE
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-wider text-[#0F172A]">
                                AETHER
                            </span>
                            <span className="text-[9px] font-bold tracking-[0.25em] text-slate-400 uppercase -mt-1">
                                Private Brokerage
                            </span>
                        </div>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const active = pathname === link.href;
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase transition-colors rounded-lg ${active
                                        ? 'text-[#2B68F6] bg-blue-50/80'
                                        : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100/70'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 rounded-sm border border-slate-200 py-1 pl-1 pr-3 hover:bg-slate-50 transition-all duration-300 ease-in-out">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">
                                            {user.name.split(' ')[0]}
                                        </span>
                                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-2 py-1.5">
                                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="gap-2 cursor-pointer">
                                        <Heart className="h-4 w-4 text-rose-500" />
                                        My Saved Homes
                                        {savedHomes.length > 0 && (
                                            <span className="ml-auto text-xs bg-rose-100 text-rose-600 rounded-full px-2 py-0.5 font-semibold">
                                                {savedHomes.length}
                                            </span>
                                        )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="gap-2 cursor-pointer text-rose-600 focus:text-rose-600"
                                        onClick={signOut}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button asChild variant="ghost" className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#2B68F6] hover:bg-slate-100/70">
                                    <Link href="/portal">
                                        <UserIcon className="h-3.5 w-3.5 mr-1.5" />
                                        Client Portal
                                    </Link>
                                </Button>
                                <Button asChild className="bg-[#2B68F6] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm px-5 h-10 shadow-md shadow-blue-500/20 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-blue-500/30">
                                    <a href="mailto:listings@eliteestates.pk?subject=Property%20Listing%20Request">List Property</a>
                                </Button>
                            </>
                        )}
                    </div>

                    <button
                        className="md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? (
                            <X className="h-6 w-6 text-slate-900" />
                        ) : (
                            <Menu className="h-6 w-6 text-slate-900" />
                        )}
                    </button>
                </div>

                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-t border-slate-200 mt-3 overflow-hidden"
                        >
                            <div className="px-4 py-4 space-y-3">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`block px-3 py-2 text-sm font-medium rounded-lg ${pathname === link.href
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="pt-2 flex flex-col gap-2">
                                    {user ? (
                                        <>
                                            <div className="flex items-center gap-2 px-3 py-2 text-sm">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                                                        {initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-slate-700">{user.name}</span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={signOut}
                                            >
                                                Sign Out
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button asChild variant="outline" className="w-full">
                                                <Link href="/portal">Client Portal</Link>
                                            </Button>
                                            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 ease-in-out">
                                                <a href="mailto:listings@eliteestates.pk?subject=Property%20Listing%20Request">List Property</a>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

        </>
    );
}
