import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMediaById } from "@/services/media.services";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

interface MediaDetailPageProps {
    params: Promise<{ id: string }>;
}

const MediaDetailPage = async ({ params }: MediaDetailPageProps) => {
    const { id } = await params;
    const media = await getMediaById(id);

    if (!media) {
        notFound();
    }

    const visibleReviews = (media.reviews || []).filter((review) => !review.isDeleted);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto w-full max-w-5xl px-6 py-10">
                <Link href="/media" className="text-sm text-primary hover:underline">← Back to media</Link>

                <Card className="mt-4">
                    <CardHeader>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge>{media.type}</Badge>
                            <Badge variant="secondary">{media.pricing}</Badge>
                            <Badge variant="outline">{media.releaseYear}</Badge>
                        </div>
                        <CardTitle className="text-3xl">{media.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {media.imageUrl ? (
                            <Image
                                src={media.imageUrl}
                                alt={media.title}
                                width={1280}
                                height={720}
                                unoptimized
                                className="h-64 w-full rounded-lg object-cover"
                            />
                        ) : null}

                        <p className="text-sm leading-7 text-muted-foreground">{media.description}</p>

                        <div className="grid gap-3 rounded-lg border bg-muted/40 p-4 md:grid-cols-4">
                            <div>
                                <p className="text-xs text-muted-foreground">Average Rating</p>
                                <p className="font-semibold">{media.avgRating ?? "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Reviews</p>
                                <p className="font-semibold">{visibleReviews.length}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Pricing</p>
                                <p className="font-semibold">{media.pricing}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Price</p>
                                <p className="font-semibold">{media.price ?? 0}</p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <h3 className="font-semibold">Director</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{media.director}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Cast</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{media.cast.join(", ")}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Genres</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{media.genres.join(", ")}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Platforms</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{media.platform.join(", ")}</p>
                            </div>
                        </div>

                        {media.youtubeLink && (
                            <div>
                                <h3 className="mb-2 font-semibold">Trailer</h3>
                                <Link href={media.youtubeLink} target="_blank" rel="noreferrer">
                                    <Button>Watch on YouTube</Button>
                                </Link>
                            </div>
                        )}

                        <div>
                            <h3 className="mb-3 font-semibold">Latest Reviews</h3>

                            {visibleReviews.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No reviews yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {visibleReviews.slice(0, 5).map((review) => (
                                        <div key={review.id} className="rounded-lg border bg-white p-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium">{review.user?.name || "Anonymous"}</p>
                                                <p className="text-xs text-muted-foreground">⭐ {review.rating}/5</p>
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">{review.content}</p>
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                👍 {review._count?.likes ?? 0} • 💬 {review._count?.comments ?? 0}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MediaDetailPage;
