import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMediaById } from "@/services/media.services";
import Link from "next/link";
import { notFound } from "next/navigation";

interface MediaDetailPageProps {
    params: Promise<{ id: string }>;
}

const MediaDetailPage = async ({ params }: MediaDetailPageProps) => {
    const { id } = await params;
    const media = await getMediaById(id);

    if (!media) {
        notFound();
    }

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
                        <p className="text-sm leading-7 text-muted-foreground">{media.description}</p>

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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MediaDetailPage;
