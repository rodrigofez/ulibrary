import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const BooksSkeleton = () => {
  return (
    <div className="flex gap-4 flex-wrap">
      {Array.from(Array(10).keys()).map((_, index) => (
        <Skeleton key={index} className="h-60 w-44" />
      ))}
    </div>
  );
};
export default BooksSkeleton;
