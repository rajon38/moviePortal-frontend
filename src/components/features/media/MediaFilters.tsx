"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface MediaFiltersProps {
    limit: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
    selectedType?: string;
    searchTerm?: string;
    releaseYear?: number;
}

export const MediaFilters = ({
    limit,
    sortBy,
    sortOrder,
    selectedType,
    searchTerm,
    releaseYear,
}: MediaFiltersProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set(key, value);
        params.set("page", "1");
        router.push(`/media?${params.toString()}`);
    };

    const hasFilters = searchTerm || selectedType || sortBy !== "createdAt" || sortOrder !== "desc" || releaseYear;

    return (
        <div className="mb-6 flex flex-col gap-4 rounded-lg bg-white p-4 ring-1 ring-slate-200">
            <div className="flex flex-wrap items-center gap-4">
                {/* Limit */}
                <div>
                    <label className="text-xs font-medium text-slate-600">Items per page:</label>
                    <select
                        value={limit}
                        onChange={(e) => updateParams("limit", e.target.value)}
                        className="mt-1 rounded border border-slate-200 px-2 py-1 text-xs"
                    >
                        <option value="6">6</option>
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="48">48</option>
                    </select>
                </div>

                {/* Sort By */}
                <div>
                    <label className="text-xs font-medium text-slate-600">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => updateParams("sortBy", e.target.value)}
                        className="mt-1 rounded border border-slate-200 px-2 py-1 text-xs"
                    >
                        <option value="createdAt">Newest</option>
                        <option value="releaseYear">Release Year</option>
                        <option value="avgRating">Rating</option>
                        <option value="title">Title</option>
                    </select>
                </div>

                {/* Sort Order */}
                <div>
                    <label className="text-xs font-medium text-slate-600">Order:</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => updateParams("sortOrder", e.target.value)}
                        className="mt-1 rounded border border-slate-200 px-2 py-1 text-xs"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>

                {/* Clear Filters */}
                {hasFilters && (
                    <Link href="/media" className="text-xs font-medium text-primary hover:underline">
                        Clear filters
                    </Link>
                )}
            </div>
        </div>
    );
};
