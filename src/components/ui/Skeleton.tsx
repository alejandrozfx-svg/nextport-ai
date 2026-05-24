import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton-block", className)} aria-hidden="true" />;
}

export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("section-card p-4", className)}>
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-4 h-8 w-20" />
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-2/3" />
    </div>
  );
}
