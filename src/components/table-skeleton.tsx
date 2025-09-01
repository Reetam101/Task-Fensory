"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Table header skeleton */}
      <div className="flex border-b">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 px-4 py-3">
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>

      {/* Table rows skeleton */}
      {Array.from({ length: 5 }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex border-b last:border-0">
          {Array.from({ length: 5 }).map((_, colIdx) => (
            <div key={colIdx} className="flex-1 px-4 py-3">
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
