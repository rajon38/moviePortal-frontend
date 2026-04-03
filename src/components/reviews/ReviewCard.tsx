"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { LikeToggle } from "./LikeToggle";
import { CommentSection } from "./CommentSection";

interface Review {
    id: string;
    content: string;
    rating: number;
    isDeleted: boolean;
    user?: { name: string };
    comments?: { id: string; content: string; user?: { name: string }; createdAt: string }[];
    _count?: { likes: number; comments: number };
}

interface ReviewCardProps {
    review: Review;
    mediaId: string;
}

export function ReviewCard({ review, mediaId }: ReviewCardProps) {
    const [showComments, setShowComments] = useState(false);

    return (
        <div className="rounded-lg border border-slate-800 bg-slate-800 p-4">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">{review.user?.name || "Anonymous"}</p>
                <p className="text-xs text-red-400">⭐ {review.rating}/5</p>
            </div>
            <p className="mt-2 text-sm text-gray-300">{review.content}</p>

            {/* Review Actions */}
            <div className="mt-3 flex items-center gap-4 border-t border-slate-700 pt-3">
                <LikeToggle reviewId={review.id} likeCount={review._count?.likes ?? 0} mediaId={mediaId} />

                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs text-gray-400 hover:text-blue-400"
                    onClick={() => setShowComments(!showComments)}
                >
                    <MessageCircle size={14} />
                    {review._count?.comments ?? 0}
                </Button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <CommentSection 
                    reviewId={review.id} 
                    mediaId={mediaId} 
                    comments={review.comments}
                />
            )}
        </div>
    );
}
