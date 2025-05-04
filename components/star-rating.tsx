"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  onRatingChange?: (rating: number) => void;
}

const StarRating = ({
  rating,
  maxRating = 5,
  size = "md",
  className,
  onRatingChange,
}: StarRatingProps) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  };

  return (
    <div className={cn("flex items-center", className)}>
      {Array(maxRating)
        .fill(0)
        .map((_, i) => (
          <button
            key={i}
            type="button"
            className={cn(
              "focus:outline-none",
              onRatingChange && "cursor-pointer"
            )}
            onClick={() => onRatingChange?.(i + 1)}
            disabled={!onRatingChange}
          >
            <Star
              className={cn(
                sizes[size],
                i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300",
                onRatingChange && "hover:text-amber-400 transition-colors"
              )}
            />
          </button>
        ))}
    </div>
  );
};

export default StarRating;
