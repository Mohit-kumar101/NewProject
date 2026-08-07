export type StoredReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  createdAt: string;
};

export type ReviewsByTool = Record<string, StoredReview[]>;

export const MIN_PUBLIC_RATING = 3;

export function isPublicRating(rating: number) {
  return Number.isFinite(rating) && rating >= MIN_PUBLIC_RATING && rating <= 5;
}
