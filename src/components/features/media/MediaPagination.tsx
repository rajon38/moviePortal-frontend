"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaType } from "@/types/media.types";

interface MediaPaginationProps {
    currentPage: number;
    limit: number;
    hasMore: boolean;
    selectedType?: MediaType;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    releaseYear?: number;
}

export const MediaPagination = ({
    currentPage,
    limit,
    hasMore,
    selectedType,
    searchTerm,
    sortBy,
    sortOrder,
    releaseYear,
}: MediaPaginationProps) => {
    const buildParams = (page: number) => {
        const params = new URLSearchParams();
        if (selectedType) params.set("type", selectedType);
        if (searchTerm) params.set("searchTerm", searchTerm);
        if (sortBy && sortBy !== "createdAt") params.set("sortBy", sortBy);
        if (sortOrder && sortOrder !== "desc") params.set("sortOrder", sortOrder);
        if (limit !== 12) params.set("limit", limit.toString());
        if (releaseYear) params.set("releaseYear", releaseYear.toString());
        params.set("page", page.toString());
        return params.toString();
    };

    return (
        <div className="mt-8 flex items-center justify-center gap-4">
            {currentPage > 1 && (
                <Link
                    href={`/media?${buildParams(currentPage - 1)}`}
                    className="flex items-center gap-1 rounded border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Link>
            )}

            <div className="text-sm text-slate-600">
                Page <span className="font-semibold">{currentPage}</span>
            </div>

            {hasMore && (
                <Link
                    href={`/media?${buildParams(currentPage + 1)}`}
                    className="flex items-center gap-1 rounded border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Link>
            )}
        </div>
    );
};
