'use client';

import { useMemo, useState } from 'react';
import { Calculator, CheckCircle2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { formatPriceFull } from '@/lib/whatsapp';

interface InstallmentPlanCalculatorProps {
    price: number;
}

const DURATIONS = [
    { years: 1, months: 12 },
    { years: 2, months: 24 },
    { years: 3, months: 36 },
    { years: 4, months: 48 },
] as const;

export default function InstallmentPlanCalculator({ price }: InstallmentPlanCalculatorProps) {
    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [durationMonths, setDurationMonths] = useState(24);

    const plan = useMemo(() => {
        const downPayment = Math.round(price * (downPaymentPercent / 100));
        const balance = price - downPayment;
        return {
            downPayment,
            balance,
            monthlyInstallment: Math.round(balance / durationMonths),
        };
    }, [price, downPaymentPercent, durationMonths]);

    return (
        <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-7 rounded-sm">
            {/* Local, pure-CSS feedback animation — no JS animation loop. */}
            <style jsx>{`
                @keyframes valuePop {
                    0% {
                        opacity: 0.55;
                        transform: scale(0.97);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .value-pop {
                    animation: valuePop 0.22s ease-out;
                }
                @media (prefers-reduced-motion: reduce) {
                    .value-pop {
                        animation: none;
                    }
                }
            `}</style>

            <div className="mb-4 sm:mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 sm:pb-4">
                <Calculator className="h-5 w-5 text-blue-600 shrink-0" />
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">Installment Plan (0% Interest)</h2>
            </div>

            <div className="mb-4 sm:mb-5 border border-blue-100 bg-blue-50 p-4 sm:p-5 text-center rounded-sm">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Installment</p>
                <p
                    key={plan.monthlyInstallment}
                    className="value-pop mt-1 text-2xl sm:text-4xl font-black text-blue-600 tabular-nums"
                >
                    {formatPriceFull(plan.monthlyInstallment)}
                </p>
                <p className="mt-1 text-xs text-slate-500">for {durationMonths} months</p>
            </div>

            <div className="space-y-5 sm:space-y-6">
                <div>
                    <div className="mb-2 flex items-center justify-between gap-4">
                        <label htmlFor="down-payment" className="text-sm font-medium text-slate-700">Down Payment</label>
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                            {downPaymentPercent}% &middot; {formatPriceFull(plan.downPayment)}
                        </span>
                    </div>
                    {/* Extra vertical padding widens the touch target on mobile without changing the visual track size */}
                    <div className="py-2">
                        <Slider
                            id="down-payment"
                            value={[downPaymentPercent]}
                            onValueChange={(value) => setDownPaymentPercent(value[0])}
                            min={10}
                            max={50}
                            step={5}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span>10%</span>
                        <span>50%</span>
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-sm font-medium text-slate-700">Duration</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {DURATIONS.map((duration) => (
                            <button
                                key={duration.months}
                                type="button"
                                onClick={() => setDurationMonths(duration.months)}
                                className={`min-h-[44px] border px-2 py-2.5 text-xs font-bold rounded-sm transition-all duration-300 ease-in-out active:scale-[0.97] ${durationMonths === duration.months
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                                    }`}
                            >
                                {duration.years} Year{duration.years > 1 ? 's' : ''}
                                <span className="block pt-0.5 text-[10px] font-medium opacity-80">({duration.months} mos)</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-5 sm:mt-6 space-y-2 border-t border-slate-100 pt-4 sm:pt-5 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-500">Property Price</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{formatPriceFull(price)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Remaining Balance</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{formatPriceFull(plan.balance)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Total Payable</span>
                    <span className="font-bold text-blue-600 tabular-nums">{formatPriceFull(price)}</span>
                </div>
            </div>

            <p className="mt-4 sm:mt-5 flex items-start gap-2 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                100% Shariah-compliant. Zero interest and no hidden charges.
            </p>
        </section>
    );
}