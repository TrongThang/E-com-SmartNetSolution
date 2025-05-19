// src/components/common/blog/BlogSkeleton.jsx
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogSkeleton({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(count)].map((_, i) => (
                <Card key={i} className="p-4">
                    <Skeleton className="h-40 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex justify-between mt-4">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                </Card>
            ))}
        </div>
    );
}