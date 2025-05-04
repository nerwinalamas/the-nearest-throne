"use client";

import { useDrawerStore } from "@/hooks/useDrawerStore";
import { Restroom } from "@/hooks/useRestroomStore";
import { Clock, Filter, MapPin, Send, Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import Image from "next/image";
import { Textarea } from "../ui/textarea";

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

  //   const [filterRating, setFilterRating] = useState<string>("all");
  //   const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  //   const [userRating, setUserRating] = useState(0);

  const filterRating = "all";
  const reviews = sampleReviews;
  const userRating = 0;

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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex mr-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < (restroomData?.cleanliness ?? 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                </div>
                <span className="text-lg font-medium">
                  {restroomData?.cleanliness}.0
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div>
                  <span className="font-medium text-gray-900">{0}</span> reviews
                </div>
                <div>
                  <span className="font-medium text-gray-900">{0}</span> visits
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="font-medium">All Reviews</h3>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <Select>
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

            <div className="flex flex-col max-h-[48vh] overflow-y-auto gap-4">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={review.user.avatar || "/placeholder.svg"}
                            alt={review.user.name}
                          />
                          <AvatarFallback>
                            {review.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center">
                            {review.user.name}
                            {review.user.isVerified && (
                              <Badge
                                variant="outline"
                                className="ml-1 h-4 text-[10px] px-1 bg-blue-50 text-blue-700 border-blue-200"
                              >
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {review.date}
                      </div>
                    </div>

                    <div className="flex mb-2">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                    </div>

                    <p className="text-gray-700 text-sm mb-3">
                      {review.comment}
                    </p>

                    {review.photos && review.photos.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {review.photos.map((photo, index) => (
                          <Image
                            key={index}
                            src={photo}
                            alt={`Review photo ${index + 1}`}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-xs h-7 px-2 ${
                        review.hasLiked ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                      {review.likes > 0 && <span>{review.likes}</span>}
                      <span className="ml-1">
                        {review.likes === 1 ? "Like" : "Likes"}
                      </span>
                    </Button>
                  </div>
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
                <div className="flex gap-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            i < userRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          } hover:text-amber-400 transition-colors`}
                        />
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Share your thoughts</h3>
                <Textarea
                  placeholder="How was your experience? Was it clean? Any tips for others?"
                  className="min-h-[120px]"
                />
              </div>

              <Button className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Review
              </Button>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ViewReviewsDrawer;
