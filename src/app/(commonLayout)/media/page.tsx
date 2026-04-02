import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getMediaList } from "@/services/media.services";
import { MediaType } from "@/types/media.types";
import Link from "next/link";
import Image from "next/image";

interface MediaPageProps {
    searchParams: Promise<{ type?: MediaType; search?: string }>;
}

const MediaPage = async ({ searchParams }: MediaPageProps) => {
    const params = await searchParams;
    const selectedType = params.type;

    const mediaResult = await getMediaList({
        type: selectedType,
        search: params.search,
        limit: 24,
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto w-full max-w-7xl px-6 py-10">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Media Library</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Browse all movies and series.</p>
                </div>

                <div className="mb-6 flex flex-wrap items-center gap-2">
                    <Link href="/media" className={`rounded-full px-4 py-2 text-sm ${!selectedType ? "bg-primary text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}>
                        All
                    </Link>
                    <Link href="/media?type=MOVIE" className={`rounded-full px-4 py-2 text-sm ${selectedType === "MOVIE" ? "bg-primary text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}>
                        Movies
                    </Link>
                    <Link href="/media?type=SERIES" className={`rounded-full px-4 py-2 text-sm ${selectedType === "SERIES" ? "bg-primary text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}>
                        Series
                    </Link>
                </div>

                {mediaResult.data.length === 0 ? (
                    <div className="rounded-xl border bg-white p-8 text-center text-muted-foreground">
                        No media found.
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {mediaResult.data.map((media) => (
                            <Card key={media.id} className="h-full">
                                {media.imageUrl ? (
                                    <Image
                                        src={media.imageUrl}
                                        alt={media.title}
                                        width={640}
                                        height={360}
                                        unoptimized
                                        className="h-44 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-44 w-full items-center justify-center bg-slate-200 text-xs text-slate-600">
                                        No image available
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{media.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="line-clamp-3 text-xs text-muted-foreground">{media.description}</p>
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {media.genres.slice(0, 2).map((genre) => (
                                            <Badge key={genre} variant="secondary" className="text-[10px]">{genre}</Badge>
                                        ))}
                                    </div>
                                    <p className="mt-3 text-xs text-muted-foreground">{media.releaseYear} • {media.type}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        ⭐ {media.avgRating ?? "N/A"} • {media.reviews?.length ?? 0} review(s)
                                    </p>
                                </CardContent>
                                <CardFooter className="justify-between">
                                    <Badge variant="outline">{media.pricing}</Badge>
                                    <Link href={`/media/${media.id}`} className="text-xs font-medium text-primary hover:underline">View</Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaPage;
