"use client";

import { useState } from "react";
import { useDrawerStore } from "@/hooks/useDrawerStore";
import { Restroom } from "@/hooks/useRestroomStore";
import { Filter, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/star-rating";
import ReviewCard from "@/components/review-card";

interface Review {
  id: number;
  user: {
    name: string;
    avatar?: string;
    isVerified: boolean;
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
      isVerified: true,
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
      isVerified: true,
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
      isVerified: false,
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
      isVerified: true,
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
      isVerified: false,
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

  const [filterRating, setFilterRating] = useState<string>("all");
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
          isVerified: true,
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

  const filteredReviews =
    filterRating === "all"
      ? reviews
      : reviews.filter(
          (review) => review.rating === Number.parseInt(filterRating)
        );

  return (
    <Sheet open={isDrawerOpen} onOpenChange={handleDrawerChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="sm:text-2xl font-bold">
            {restroomData?.name}
          </SheetTitle>
          <SheetDescription className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{restroomData?.name}</span>
          </SheetDescription>

          <div className="flex flex-col gap-4">
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
                <div>
                  <span className="font-medium">{0}</span> visits
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h3 className="font-medium">All Reviews</h3>
              <div className="flex items-center justify-end">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger className="w-[130px] h-8 text-sm">
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col h-28 sm:min-h-[48vh] lg:min-h-[60vh] xl:min-h-[48vh] overflow-y-auto gap-4">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No reviews match your filter criteria
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Rate your experience</h3>
                <StarRating
                  rating={userRating}
                  size="lg"
                  onRatingChange={setUserRating}
                  className="gap-1"
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">Share your thoughts</h3>
                <Textarea
                  placeholder="How was your experience? Was it clean? Any tips for others?"
                  className="min-h-[120px]"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleSubmitReview}
                disabled={
                  isSubmitting || !reviewText.trim() || userRating === 0
                }
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
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ViewReviewsDrawer;
