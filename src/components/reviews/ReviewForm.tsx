"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReviewAction } from "../../app/(commonLayout)/media/[id]/_actions";
import { toast } from "sonner";

interface ReviewFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mediaId: string;
}

export function ReviewForm({ open, onOpenChange, mediaId }: ReviewFormProps) {
    const [rating, setRating] = useState("5");
    const [content, setContent] = useState("");
    const queryClient = useQueryClient();

    const createReviewMutation = useMutation({
        mutationFn: () =>
            createReviewAction(mediaId, parseInt(rating), content),
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Review created");
                setRating("5");
                setContent("");
                onOpenChange(false);
                queryClient.invalidateQueries({ queryKey: ["media", mediaId] });
            } else {
                toast.error(response.error || "Failed to create review");
            }
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to create review");
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-slate-800 bg-slate-900 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-red-400">Write a Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                        <Select value={rating} onValueChange={setRating}>
                            <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-slate-700 bg-slate-800 text-white">
                                <SelectItem value="1">1 - Poor</SelectItem>
                                <SelectItem value="2">2 - Fair</SelectItem>
                                <SelectItem value="3">3 - Good</SelectItem>
                                <SelectItem value="4">4 - Very Good</SelectItem>
                                <SelectItem value="5">5 - Excellent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Review</label>
                        <Textarea
                            placeholder="Share your thoughts about this media..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="border-slate-700 bg-slate-800 text-white placeholder-gray-500 resize-none"
                            rows={5}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="ghost"
                            className="flex-1 text-gray-400 hover:text-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (content.trim()) {
                                    createReviewMutation.mutate();
                                } else {
                                    toast.error("Please write a review");
                                }
                            }}
                            disabled={!content.trim() || createReviewMutation.isPending}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                            {createReviewMutation.isPending ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                "Submit Review"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
