"use client";

import { Button } from "@/components/ui/button";
import { Loader2, ThumbsUp } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleReviewLikeAction } from "../../app/(commonLayout)/media/[id]/_actions";
import { toast } from "sonner";

interface LikeToggleProps {
    reviewId: string;
    likeCount: number;
    mediaId: string;
}

export function LikeToggle({ reviewId, likeCount, mediaId }: LikeToggleProps) {
    const queryClient = useQueryClient();

    const toggleLikeMutation = useMutation({
        mutationFn: () => toggleReviewLikeAction(reviewId),
        onSuccess: (response) => {
            console.log("Like toggle response:", response);
            if (response.success) {
                console.log("Like toggle successful, invalidating query");
                queryClient.invalidateQueries({ queryKey: ["media", mediaId] });
                toast.success("Toggled like");
            } else {
                console.error("Like toggle failed:", response.error);
                toast.error(response.error || "Failed to toggle like");
            }
        },
        onError: (error) => {
            console.error("Like toggle mutation error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to toggle like");
        },
    });

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => {
                console.log("Like button clicked for review:", reviewId);
                toast.loading("Toggling like...");
                toggleLikeMutation.mutate();
            }}
            disabled={toggleLikeMutation.isPending}
            className="gap-1 text-xs text-gray-400 hover:text-red-400"
        >
            {toggleLikeMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
            ) : (
                <ThumbsUp size={14} />
            )}
            {likeCount}
        </Button>
    );
}
