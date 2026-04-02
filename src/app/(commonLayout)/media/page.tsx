import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getMediaList } from "@/services/media.services";
import { MediaType } from "@/types/media.types";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface MediaPageProps {
    searchParams: Promise<{
        type?: MediaType;
        searchTerm?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        page?: string;
        limit?: string;
        releaseYear?: string;
        includes?: string;
    }>;
}

const MediaPage = async ({ searchParams }: MediaPageProps) => {
    const params = await searchParams;
    const selectedType = params.type;
    const searchTerm = params.searchTerm || "";
    const sortBy = params.sortBy || "createdAt";
    const sortOrder = (params.sortOrder as "asc" | "desc") || "desc";
    const currentPage = parseInt(params.page || "1");
    const limit = parseInt(params.limit || "12");
    const releaseYear = params.releaseYear ? parseInt(params.releaseYear) : undefined;
    const includes = params.includes || "reviews";

    const mediaResult = await getMediaList({
        type: selectedType,
        search: searchTerm,
        limit,
        page: currentPage,
        sortBy,
        sortOrder,
        releaseYear,
        includes: includes.split(",").filter(Boolean),
    });

    const buildQueryString = (overrides: Record<string, string | number | undefined> = {}) => {
        const query: Record<string, string> = {};
        
        const values = {
            type: selectedType,
            searchTerm,
            sortBy,
            sortOrder,
            limit: limit.toString(),
            releaseYear: releaseYear?.toString(),
            ...overrides,
        };

        Object.entries(values).forEach(([key, val]) => {
            if (val) query[key] = String(val);
        });

        return new URLSearchParams(query).toString();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto w-full max-w-7xl px-6 py-10">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white">Media Library</h1>
                    <p className="mt-2 text-sm text-gray-400">Browse all movies and series.</p>
                </div>

                {/* Type Filter Buttons */}
                <div className="mb-6 flex flex-wrap items-center gap-2">
                    <Link href="/media" className={`rounded-full px-4 py-2 text-sm ${!selectedType ? "bg-red-600 text-white" : "bg-slate-800 text-gray-300 ring-1 ring-slate-700"}`}>
                        All
                    </Link>
                    <Link href={`/media?${buildQueryString({ type: "MOVIE", page: "1" })}`} className={`rounded-full px-4 py-2 text-sm ${selectedType === "MOVIE" ? "bg-red-600 text-white" : "bg-slate-800 text-gray-300 ring-1 ring-slate-700"}`}>
                        Movies
                    </Link>
                    <Link href={`/media?${buildQueryString({ type: "SERIES", page: "1" })}`} className={`rounded-full px-4 py-2 text-sm ${selectedType === "SERIES" ? "bg-red-600 text-white" : "bg-slate-800 text-gray-300 ring-1 ring-slate-700"}`}>
                        Series
                    </Link>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar Filters */}
                    <div className="w-64 flex-shrink-0">
                        <div className="sticky top-20 space-y-6 rounded-lg bg-slate-900 p-4 ring-1 ring-slate-800">
                            {/* Search */}
                            <div>
                                <form action="/media" method="GET" className="flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
                                    <input
                                        type="text"
                                        name="searchTerm"
                                        placeholder="Search media..."
                                        defaultValue={searchTerm}
                                        className="w-full bg-slate-800 text-sm text-white placeholder-gray-500 outline-none"
                                    />
                                    <button type="submit" className="ml-2 text-gray-400 hover:text-red-400">
                                        <Search className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>
                            <div className="border-b border-slate-700 pb-4">
                                <h3 className="mb-3 text-sm font-semibold text-red-400">Pagination</h3>
                                <div className="space-y-2 text-xs text-gray-400">
                                    <p>Page <span className="font-semibold text-white">{currentPage}</span> of <span className="font-semibold text-white">{Math.ceil(mediaResult.meta?.total || 0 / limit)}</span></p>
                                    <p>Total <span className="font-semibold text-white">{mediaResult.meta?.total || 0}</span> items</p>
                                </div>
                            </div>

                            {/* Sort By */}
                            <div className="border-b border-slate-700 pb-4">
                                <h3 className="mb-3 text-sm font-semibold text-red-400">Sort by</h3>
                                <div className="space-y-2">
                                    {[
                                        { label: "Newest", value: "createdAt" },
                                        { label: "Release Year", value: "releaseYear" },
                                        { label: "Rating", value: "avgRating" },
                                        { label: "Title", value: "title" },
                                    ].map((option) => (
                                        <Link
                                            key={option.value}
                                            href={`/media?${buildQueryString({ sortBy: option.value, sortOrder: "desc", page: "1" })}`}
                                            className={`block rounded px-2 py-1 text-xs transition-colors ${sortBy === option.value ? "bg-red-600 text-white font-medium" : "text-gray-400 hover:bg-slate-800 hover:text-white"}`}
                                        >
                                            {option.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Items Per Page */}
                            <div className="border-b border-slate-700 pb-4">
                                <h3 className="mb-3 text-sm font-semibold text-red-400">Items per page</h3>
                                <div className="space-y-2">
                                    {[6, 12, 24, 48].map((val) => (
                                        <Link
                                            key={val}
                                            href={`/media?${buildQueryString({ limit: val.toString(), page: "1" })}`}
                                            className={`block rounded px-2 py-1 text-xs transition-colors ${limit === val ? "bg-red-600 text-white font-medium" : "text-gray-400 hover:bg-slate-800 hover:text-white"}`}
                                        >
                                            {val}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Order */}
                            <div className="border-b border-slate-700 pb-4">
                                <h3 className="mb-3 text-sm font-semibold text-red-400">Order</h3>
                                <div className="space-y-2">
                                    {[
                                        { label: "Descending (↓)", value: "desc" },
                                        { label: "Ascending (↑)", value: "asc" },
                                    ].map((option) => (
                                        <Link
                                            key={option.value}
                                            href={`/media?${buildQueryString({ sortOrder: option.value, page: "1" })}`}
                                            className={`block rounded px-2 py-1 text-xs transition-colors ${sortOrder === option.value ? "bg-red-600 text-white font-medium" : "text-gray-400 hover:bg-slate-800 hover:text-white"}`}
                                        >
                                            {option.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {(searchTerm || selectedType || sortBy !== "createdAt" || sortOrder !== "desc" || releaseYear) && (
                                <Link href="/media" className="block w-full rounded bg-red-600 px-3 py-2 text-center text-xs font-medium text-white hover:bg-red-700">
                                    Clear filters
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {mediaResult.data.length === 0 ? (
                            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-gray-400">
                                No media found.
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {mediaResult.data.map((media) => (
                                        <Card key={media.id} className="h-full border-slate-800 bg-slate-900">
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
                                                <div className="flex h-44 w-full items-center justify-center bg-slate-800 text-xs text-gray-500">
                                                    No image available
                                                </div>
                                            )}
                                            <CardHeader>
                                                <CardTitle className="line-clamp-1 text-white">{media.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="line-clamp-3 text-xs text-gray-400">{media.description}</p>
                                                <div className="mt-3 flex flex-wrap gap-1">
                                                    {media.genres.slice(0, 2).map((genre) => (
                                                        <Badge key={genre} variant="secondary" className="bg-slate-800 text-gray-300 text-[10px]">{genre}</Badge>
                                                    ))}
                                                </div>
                                                <p className="mt-3 text-xs text-gray-400">{media.releaseYear} • {media.type}</p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    ⭐ <span className="text-red-400">{media.avgRating ?? "N/A"}</span> • {media.reviews?.length ?? 0} review(s)
                                                </p>
                                            </CardContent>
                                            <CardFooter className="justify-between border-t border-slate-800">
                                                <Badge variant="outline" className="border-slate-700 text-gray-300">{media.pricing}</Badge>
                                                <Link href={`/media/${media.id}`} className="text-xs font-medium text-red-400 hover:text-red-300">View</Link>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                <div className="mt-8 flex items-center justify-center gap-4">
                                    {currentPage > 1 && (
                                        <Link
                                            href={`/media?${buildQueryString({ page: (currentPage - 1).toString() })}`}
                                            className="flex items-center gap-1 rounded border border-slate-700 px-3 py-2 text-sm text-gray-400 hover:bg-slate-800 hover:text-red-400"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Link>
                                    )}

                                    {mediaResult.data.length === limit && (
                                        <Link
                                            href={`/media?${buildQueryString({ page: (currentPage + 1).toString() })}`}
                                            className="flex items-center gap-1 rounded border border-slate-700 px-3 py-2 text-sm text-gray-400 hover:bg-slate-800 hover:text-red-400"
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaPage;
