import PropertyGridSkeleton from '@/components/site/property-grid-skeleton';

export default function Loading() {
    return <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 sm:px-6"><div className="mx-auto max-w-7xl"><div className="mb-8 h-10 w-64 animate-pulse bg-slate-200 rounded-sm" /><PropertyGridSkeleton /></div></main>;
}
