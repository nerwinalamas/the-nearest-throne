import Image from "next/image";
import { Clock, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "@/components/star-rating";

interface User {
  name: string;
  avatar?: string;
  isVerified: boolean;
}

interface ReviewCardProps {
  review: {
    user: User;
    rating: number;
    date: string;
    comment: string;
    likes: number;
    hasLiked?: boolean;
    photos?: string[];
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const handleLike = () => {
    console.log("Liked review");
  };

  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage
              src={review.user.avatar || "/placeholder.svg"}
              alt={review.user.name}
            />
            <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
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

      <StarRating rating={review.rating} size="sm" className="mb-2" />

      <p className="text-gray-700 text-sm mb-3">{review.comment}</p>

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
        onClick={handleLike}
      >
        <ThumbsUp className="h-3.5 w-3.5 mr-1" />
        {review.likes > 0 && <span>{review.likes}</span>}
        <span className="ml-1">{review.likes === 1 ? "Like" : "Likes"}</span>
      </Button>
    </div>
  );
};

export default ReviewCard;
