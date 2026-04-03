"use server";

import { addToWatchlist, removeFromWatchlist } from "@/services/watchlist.services";
import { createReviewComment, toggleReviewLike, createReview } from "@/services/review.services";

export async function addToWatchlistAction(mediaId: string) {
  try {
    console.log("Server action: Adding to watchlist", { mediaId });
    const result = await addToWatchlist(mediaId);
    console.log("Server action: Added successfully", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Server action: Failed to add", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to add to watchlist" };
  }
}

export async function removeFromWatchlistAction(watchlistId: string) {
  try {
    console.log("Server action: Removing from watchlist", { watchlistId });
    const result = await removeFromWatchlist(watchlistId);
    console.log("Server action: Removed successfully", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Server action: Failed to remove", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to remove from watchlist" };
  }
}

export async function toggleReviewLikeAction(reviewId: string) {
  try {
    console.log("Server action: Toggling review like", { reviewId });
    const result = await toggleReviewLike(reviewId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Server action: Failed to toggle review like", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to toggle review like" };
  }
}

export async function addReviewCommentAction(content: string, reviewId: string, parentId?: string) {
  try {
    console.log("Server action: Adding comment", { content, reviewId, parentId });
    const result = await createReviewComment({
      content,
      reviewId,
      parentId,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Server action: Failed to add comment", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to add comment" };
  }
}

export async function createReviewAction(mediaId: string, rating: number, content: string) {
  try {
    console.log("Server action: Creating review", { mediaId, rating, content });
    const result = await createReview({
      mediaId,
      rating,
      content,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Server action: Failed to create review", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create review" };
  }
}
