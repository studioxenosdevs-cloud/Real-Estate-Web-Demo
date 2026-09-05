'use client';

import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';

export default function PortalPage() {
    const { signIn, signUp } = useAuth();
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!email || !password || processing) return;
        setProcessing(true);
        window.setTimeout(() => {
            if (mode === 'signin') signIn(email);
            else signUp(email, email.split('@')[0]);
            setProcessing(false);
        }, 450);
    };

    return (
        <main className="min-h-screen bg-slate-50 pt-28 pb-16">
            <div className="mx-auto max-w-md px-4">
                <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Aether Client Portal</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{mode === 'signin' ? 'Sign in' : 'Create account'}</h1>
                    <p className="mt-2 text-sm text-slate-500">Access your saved Pakistani property shortlist.</p>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="h-11 pl-9" required />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="h-11 pl-9" required />
                        </div>
                        <Button type="submit" disabled={processing} className="h-11 w-full bg-blue-600 text-white transition-all duration-300 ease-in-out hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-60">
                            {processing ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-sm border-2 border-white border-t-transparent" />Processing...</span> : 'Continue'}
                        </Button>
                    </form>
                    <button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="mt-4 w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700">
                        {mode === 'signin' ? 'Create a client account' : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </main>
    );
}
