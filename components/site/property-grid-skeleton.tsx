export default function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading properties">
            {Array.from({ length: count }, (_, index) => (
                <div key={index} className="overflow-hidden border border-slate-200 bg-white rounded-sm">
                    <div className="h-64 animate-pulse bg-slate-200" />
                    <div className="space-y-4 p-5">
                        <div className="h-3 w-2/3 animate-pulse bg-slate-200 rounded-sm" />
                        <div className="h-6 w-5/6 animate-pulse bg-slate-200 rounded-sm" />
                        <div className="h-4 w-full animate-pulse bg-slate-200 rounded-sm" />
                        <div className="h-10 w-full animate-pulse bg-slate-200 rounded-sm" />
                    </div>
                </div>
            ))}
        </div>
    );
}
