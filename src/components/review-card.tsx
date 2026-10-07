import * as React from "react";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    title?: string;
    content?: string;
    createdAt: string;
    user: {
      name: string;
      avatar?: string;
    };
  };
  canEdit?: boolean;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
}

export const ReviewCard = ({
  review,
  canEdit,
  onEdit,
  onDelete,
}: ReviewCardProps) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    React.useState(false);

  const [editedRating, setEditedRating] = React.useState(
    review.rating
  );

  const [editedContent, setEditedContent] = React.useState(
    review.content || ""
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();

    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
  };

  const starIcons = Array.from(
    { length: 5 },
    (_, i) => i + 1
  );

  return (
    <div className="border rounded-md p-4 mb-4 bg-secondary/20">
      <div className="flex items-start gap-3">
        {/* User avatar */}
        <div className="flex-shrink-0">
          {review.user.avatar ? (
            <img
              src={review.user.avatar}
              alt={review.user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm initial">
                {review.user.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Review content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium">{review.user.name}</p>

          <p className="text-xs text-muted-foreground">
            {formatDate(review.createdAt)}
          </p>

          <div className="flex items-center gap-1">
            {starIcons.map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= review.rating
                    ? "fill-primary"
                    : "fill-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Review content text */}
      {review.content && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
          {review.content}
        </p>
      )}

      {/* Review actions */}
      {canEdit && (
        <div className="mt-3 flex gap-2 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => onEdit?.(review.id)}
            className="underline text-primary hover:text-primary/80"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              setShowDeleteConfirmation(true)
            }
            className="underline text-destructive hover:text-destructive/80"
          >
            Delete
          </button>
        </div>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirmation && (
        <div className="mt-3">
          <p className="text-sm text-danger">
            Are you sure you want to delete this review?
          </p>

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                onDelete?.(review.id);
                setShowDeleteConfirmation(false);
              }}
              className="flex-1 rounded-md bg-destructive px-3 py-1 text-white text-xs hover:bg-destructive/90 transition-colors"
            >
              Delete
            </button>

            <button
              type="button"
              onClick={() =>
                setShowDeleteConfirmation(false)
              }
              className="flex-1 rounded-md border border-border px-3 py-1 text-xs hover:bg-secondary/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ReviewCard.displayName = "ReviewCard";