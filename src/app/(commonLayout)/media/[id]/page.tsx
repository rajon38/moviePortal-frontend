"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMediaById } from "@/services/media.services";
import { getAllWatchlistItems } from "@/services/watchlist.services";
import Link from "next/link";
import Image from "next/image";
import { BookmarkPlus, BookmarkCheck, Loader2, Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { addToWatchlistAction, removeFromWatchlistAction } from "./_actions";
import { toast } from "sonner";
import { ReviewForm } from "../../../../components/reviews/ReviewForm";
import { ReviewCard } from "../../../../components/reviews/ReviewCard";

interface MediaDetailPageProps {
    params: Promise<{ id: string }>;
}

interface WatchlistItem {
    id: string;
    userId: string;
    mediaId: string;
    createdAt: string;
    media: unknown;
}

interface Review {
    id: string;
    content: string;
    rating: number;
    isDeleted: boolean;
    user?: { name: string };
    comments?: { id: string; content: string; user?: { name: string }; createdAt: string }[];
    _count?: { likes: number; comments: number };
}

const MediaDetailPage = ({ params }: MediaDetailPageProps) => {
    const [id, setId] = useState<string>("");
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        params.then((resolvedParams) => {
            setId(resolvedParams.id);
        });
    }, [params]);

    // Fetch media details
    const { data: media, isLoading: mediaLoading, error: mediaError } = useQuery({
        queryKey: ["media", id],
        queryFn: () => (id ? getMediaById(id) : null),
        enabled: !!id,
    });

    // Fetch watchlist items to check if media is in watchlist
    const { data: watchlistData = { data: [] } } = useQuery({
        queryKey: ["watchlist"],
        queryFn: () => getAllWatchlistItems(),
    });

    const watchlistItems = useMemo(
        () => (watchlistData?.data ? (watchlistData.data as WatchlistItem[]) : []),
        [watchlistData]
    );

    const isInWatchlist = useMemo(() => {
        if (!media || !watchlistItems) return false;
        return watchlistItems.some((item: WatchlistItem) => item.mediaId === media.id);
    }, [media, watchlistItems]);

    const watchlistItemId = useMemo(() => {
        if (!media || !watchlistItems) return null;
        const item = watchlistItems.find((item: WatchlistItem) => item.mediaId === media.id);
        return item?.id;
    }, [media, watchlistItems]);

    // Mutation for adding to watchlist
    const addToWatchlistMutation = useMutation({
        mutationFn: (mediaId: string) => addToWatchlistAction(mediaId),
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Added to watchlist");
                queryClient.invalidateQueries({ queryKey: ["watchlist"] });
            } else {
                toast.error(response.error || "Failed to add to watchlist");
            }
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to add to watchlist");
        },
    });

    // Mutation for removing from watchlist
    const removeFromWatchlistMutation = useMutation({
        mutationFn: (watchlistId: string) => removeFromWatchlistAction(watchlistId),
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Removed from watchlist");
                queryClient.invalidateQueries({ queryKey: ["watchlist"] });
            } else {
                toast.error(response.error || "Failed to remove from watchlist");
            }
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to remove from watchlist");
        },
    });

    if (!id) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    if (mediaLoading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    if (mediaError || !media) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="mx-auto w-full max-w-5xl px-6 py-10">
                    <Link href="/media" className="text-sm text-gray-400 hover:text-red-400 transition-colors">
                        ← Back to media
                    </Link>
                    <p className="mt-4 text-red-400">Media not found</p>
                </div>
            </div>
        );
    }

    const visibleReviews = ((media.reviews || []) as Review[]).filter((review: Review) => !review.isDeleted);

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto w-full max-w-5xl px-6 py-10">
                <Link href="/media" className="text-sm text-gray-400 hover:text-red-400 transition-colors">
                    ← Back to media
                </Link>

                <Card className="mt-4 border-slate-800 bg-slate-900">
                    <CardHeader>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className="bg-red-600 hover:bg-red-700">{media.type}</Badge>
                                <Badge variant="secondary" className="bg-slate-800 text-gray-300">
                                    {media.pricing}
                                </Badge>
                                <Badge variant="outline" className="border-slate-700 text-gray-400">
                                    {media.releaseYear}
                                </Badge>
                            </div>
                            <Button
                                onClick={() => {
                                    if (isInWatchlist && watchlistItemId) {
                                        removeFromWatchlistMutation.mutate(watchlistItemId);
                                    } else {
                                        addToWatchlistMutation.mutate(media.id);
                                    }
                                }}
                                disabled={addToWatchlistMutation.isPending || removeFromWatchlistMutation.isPending}
                                className={`gap-2 ${
                                    isInWatchlist
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-slate-700 hover:bg-slate-600"
                                }`}
                            >
                                {addToWatchlistMutation.isPending || removeFromWatchlistMutation.isPending ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : isInWatchlist ? (
                                    <BookmarkCheck size={16} />
                                ) : (
                                    <BookmarkPlus size={16} />
                                )}
                                {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                            </Button>
                        </div>
                        <CardTitle className="mt-4 text-3xl text-white">{media.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {media.imageUrl && (
                            <Image
                                src={media.imageUrl}
                                alt={media.title}
                                width={1280}
                                height={720}
                                unoptimized
                                className="h-64 w-full rounded-lg object-cover"
                            />
                        )}

                        <p className="text-sm leading-7 text-gray-400">{media.description}</p>

                        <div className="grid gap-3 rounded-lg border border-slate-800 bg-slate-800/50 p-4 md:grid-cols-4">
                            <div>
                                <p className="text-xs text-gray-400">Average Rating</p>
                                <p className="font-semibold text-red-400">⭐ {media.avgRating ?? "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Reviews</p>
                                <p className="font-semibold text-white">{visibleReviews.length}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Pricing</p>
                                <p className="font-semibold text-white">{media.pricing}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Price</p>
                                <p className="font-semibold text-red-500">${media.price ?? 0}</p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <h3 className="font-semibold text-red-400">Director</h3>
                                <p className="mt-1 text-sm text-gray-300">{media.director}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-400">Cast</h3>
                                <p className="mt-1 text-sm text-gray-300">{media.cast.join(", ")}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-400">Genres</h3>
                                <p className="mt-1 text-sm text-gray-300">{media.genres.join(", ")}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-400">Platforms</h3>
                                <p className="mt-1 text-sm text-gray-300">{media.platform.join(", ")}</p>
                            </div>
                        </div>

                        {media.youtubeLink && (
                            <div>
                                <h3 className="mb-2 font-semibold text-red-400">Trailer</h3>
                                <Link href={media.youtubeLink} target="_blank" rel="noreferrer">
                                    <Button className="bg-red-600 hover:bg-red-700 text-white">Watch on YouTube</Button>
                                </Link>
                            </div>
                        )}

                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-semibold text-red-400">Latest Reviews</h3>
                                <Button
                                    onClick={() => setShowReviewDialog(true)}
                                    className="bg-red-600 hover:bg-red-700 gap-2"
                                >
                                    <Star size={16} />
                                    Write Review
                                </Button>
                            </div>

                            {visibleReviews.length === 0 ? (
                                <p className="text-sm text-gray-400">No reviews yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {visibleReviews.slice(0, 5).map((review: Review) => (
                                        <ReviewCard key={review.id} review={review} mediaId={id} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Review Form Dialog */}
                <ReviewForm open={showReviewDialog} onOpenChange={setShowReviewDialog} mediaId={id} />
            </div>
        </div>
    );
};

export default MediaDetailPage;
