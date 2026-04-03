"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, X } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReviewCommentAction } from "../../app/(commonLayout)/media/[id]/_actions";
import { toast } from "sonner";

interface Comment {
    id: string;
    content: string;
    user?: { name: string };
    createdAt: string;
}

interface CommentSectionProps {
    reviewId: string;
    mediaId: string;
    comments?: Comment[];
}

export function CommentSection({ reviewId, mediaId, comments = [] }: CommentSectionProps) {
    const [commentText, setCommentText] = useState("");
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const addCommentMutation = useMutation({
        mutationFn: (content: string) =>
            addReviewCommentAction(content, reviewId, replyingToId || undefined),
        onSuccess: () => {
            toast.success("Comment added");
            setCommentText("");
            setReplyingToId(null);
            queryClient.invalidateQueries({ queryKey: ["media", mediaId] });
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to add comment");
        },
    });

    return (
        <div className="space-y-3">
            {/* Comment Input */}
            <div className="mt-3 flex gap-2">
                <Input
                    id={`comment-${reviewId}`}
                    placeholder={replyingToId ? "Write a reply..." : "Add a comment..."}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="border-slate-700 bg-slate-900 text-white placeholder-gray-500"
                    disabled={addCommentMutation.isPending}
                />
                <Button
                    size="sm"
                    onClick={() => {
                        if (commentText.trim()) {
                            addCommentMutation.mutate(commentText);
                        }
                    }}
                    disabled={!commentText.trim() || addCommentMutation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                >
                    {addCommentMutation.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Send size={14} />
                    )}
                </Button>
                {replyingToId && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setReplyingToId(null);
                            setCommentText("");
                        }}
                        className="text-gray-400 hover:text-gray-300"
                    >
                        <X size={14} />
                    </Button>
                )}
            </div>

            {/* Display Comments/Replies */}
            {comments.length > 0 && (
                <div className="mt-4 space-y-3 border-l-2 border-slate-700 pl-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-slate-800/50 rounded p-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-gray-300">{comment.user?.name || "Anonymous"}</p>
                                <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                            </div>
                            <p className="mt-1 text-xs text-gray-300">{comment.content}</p>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setReplyingToId(comment.id);
                                    document.getElementById(`comment-${reviewId}`)?.focus();
                                }}
                                className="mt-2 text-xs text-gray-400 hover:text-blue-400"
                            >
                                Reply
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
