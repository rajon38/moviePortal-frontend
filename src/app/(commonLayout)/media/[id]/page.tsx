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
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto w-full max-w-5xl px-6 py-10">
                <Link href="/media" className="text-sm text-gray-400 hover:text-red-400 transition-colors">← Back to media</Link>

                <Card className="mt-4 border-slate-800 bg-slate-900">
                    <CardHeader>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-red-600 hover:bg-red-700">{media.type}</Badge>
                            <Badge variant="secondary" className="bg-slate-800 text-gray-300">{media.pricing}</Badge>
                            <Badge variant="outline" className="border-slate-700 text-gray-400">{media.releaseYear}</Badge>
                        </div>
                        <CardTitle className="text-3xl text-white">{media.title}</CardTitle>
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
                            <h3 className="mb-3 font-semibold text-red-400">Latest Reviews</h3>

                            {visibleReviews.length === 0 ? (
                                <p className="text-sm text-gray-400">No reviews yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {visibleReviews.slice(0, 5).map((review) => (
                                        <div key={review.id} className="rounded-lg border border-slate-800 bg-slate-800 p-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-white">{review.user?.name || "Anonymous"}</p>
                                                <p className="text-xs text-red-400">⭐ {review.rating}/5</p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-300">{review.content}</p>
                                            <p className="mt-2 text-xs text-gray-400">
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
