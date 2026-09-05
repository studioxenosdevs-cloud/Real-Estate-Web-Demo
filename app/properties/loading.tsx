import PropertyGridSkeleton from '@/components/site/property-grid-skeleton';

export default function Loading() {
    return <main className="min-h-screen bg-slate-100 px-4 pb-16 pt-24 sm:px-6"><div className="mx-auto max-w-7xl"><div className="mb-6 h-9 w-56 animate-pulse bg-slate-200 rounded-sm" /><PropertyGridSkeleton count={4} /></div></main>;
}
