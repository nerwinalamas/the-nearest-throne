"use client";

import { useState } from "react";
import { useDrawerStore } from "@/hooks/useDrawerStore";
import { Restroom } from "@/hooks/useRestroomStore";
import { MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/star-rating";
import ReviewCard from "@/components/review-card";

interface Review {
  id: number;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  date: string;
  comment: string;
  likes: number;
  hasLiked?: boolean;
  photos?: string[];
}

const sampleReviews: Review[] = [
  {
    id: 1,
    user: {
      name: "Mia S.",
    },
    rating: 5,
    date: "2 days ago",
    comment:
      "Super clean! The staff maintains it well. Soap and hand dryer both working perfectly.",
    likes: 12,
    photos: [],
  },
  {
    id: 2,
    user: {
      name: "Juan D.",
    },
    rating: 5,
    date: "1 week ago",
    comment:
      "One of the cleanest CRs in the area. Worth the small fee they charge.",
    likes: 8,
  },
  {
    id: 3,
    user: {
      name: "Ana L.",
    },
    rating: 4,
    date: "2 weeks ago",
    comment:
      "Clean and accessible. The only issue was that they ran out of paper towels when I visited.",
    likes: 3,
  },
  {
    id: 4,
    user: {
      name: "Carlo M.",
    },
    rating: 5,
    date: "3 weeks ago",
    comment: "Always my go-to CR in Ayala. Never disappoints!",
    likes: 15,
    photos: [],
  },
  {
    id: 5,
    user: {
      name: "Sophia R.",
    },
    rating: 3,
    date: "1 month ago",
    comment:
      "It was okay. Clean but there was a long queue during lunch hours.",
    likes: 2,
  },
];

const ViewReviewsDrawer = () => {
  const { isOpen, onClose, type, data } = useDrawerStore();
  const isDrawerOpen = isOpen && type === "viewReviews";
  const restroomData = isDrawerOpen ? (data as Restroom) : null;

  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = () => {
    if (!reviewText.trim() || userRating === 0) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newReview: Review = {
        id: Math.max(...reviews.map((r) => r.id)) + 1,
        user: {
          name: "You", // Would be current user in real app
        },
        rating: userRating,
        date: "Just now",
        comment: reviewText,
        likes: 0,
        photos: [],
      };

      setReviews([newReview, ...reviews]);
      setReviewText("");
      setUserRating(0);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleDrawerChange = () => {
    onClose();
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={handleDrawerChange}>
      <SheetContent className="sm:max-w-lg flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="sm:text-2xl font-bold">
            {restroomData?.name}
          </SheetTitle>
          <SheetDescription className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{restroomData?.name}</span>
          </SheetDescription>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <StarRating
                rating={restroomData?.cleanliness ?? 0}
                className="mr-2"
              />
              <span className="text-lg font-medium">
                {restroomData?.cleanliness}.0
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div>
                <span className="font-medium">{reviews.length}</span> reviews
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Reviews section with flex-1 */}
        <div className="flex-1 overflow-y-auto p-4">
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No reviews match your filter criteria
            </div>
          )}
        </div>

        {/* User rating section at bottom */}
        <div className="flex-shrink-0 border-t p-4 space-y-4">
          <div>
            <h3 className="font-medium mb-2 text-sm">Rate your experience</h3>
            <StarRating
              rating={userRating}
              size="lg"
              onRatingChange={setUserRating}
              className="gap-1"
            />
          </div>

          <div>
            <h3 className="font-medium mb-2 text-sm">Share your thoughts</h3>
            <Textarea
              placeholder="How was your experience? Was it clean? Any tips for others?"
              className="min-h-[100px]"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSubmitReview}
            disabled={isSubmitting || !reviewText.trim() || userRating === 0}
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-1" />
                Submit Review
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ViewReviewsDrawer;
