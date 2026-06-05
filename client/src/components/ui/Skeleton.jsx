export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-shimmer rounded bg-gradient-to-r from-luffy-surface2 via-luffy-offset to-luffy-surface2 bg-[length:200%_100%] ${className}`}
    />
  );
}

export function AnimeCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="w-full aspect-[2/3] rounded" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-3 w-1/2 rounded" />
    </div>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div className="w-full h-[100dvh] flex items-end p-8 md:p-16">
      <div className="space-y-4 w-full max-w-xl">
        <Skeleton className="h-16 w-3/4 rounded" />
        <Skeleton className="h-6 w-1/3 rounded" />
        <Skeleton className="h-12 w-48 rounded" />
      </div>
    </div>
  );
}

export function FeaturedCarouselSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-20">
      <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="w-full h-[50dvh] rounded" />
      <div className="space-y-4 px-4 md:px-16">
        <Skeleton className="h-12 w-1/2 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
