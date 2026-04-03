"use client";

import {
  getAllWatchlistItems,
  removeFromWatchlist,
  clearWatchlist,
} from "@/services/watchlist.services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const MyListPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit] = useState(12);
  const queryClient = useQueryClient();

  // Fetch watchlist
  const { data, isLoading, error } = useQuery({
    queryKey: ["watchlist", page, searchTerm],
    queryFn: () =>
      getAllWatchlistItems({
        page,
        limit,
        ...(searchTerm && { searchTerm }),
      }),
  });

  // Remove from watchlist mutation
  const { mutate: removeItem, isPending: isRemoving } = useMutation({
    mutationFn: (watchlistId: string) => removeFromWatchlist(watchlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  // Clear all mutation
  const { mutate: clearAll, isPending: isClearing } = useMutation({
    mutationFn: () => clearWatchlist(),
    onSuccess: () => {
      setPage(1);
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  const watchlist = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white">My List</h1>
            <p className="mt-2 text-gray-400">
              {meta?.total || 0} item{(meta?.total || 0) !== 1 ? "s" : ""} in your watchlist
            </p>
          </div>

          {watchlist.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("Are you sure you want to clear your entire watchlist?")) {
                  clearAll();
                }
              }}
              disabled={isClearing}
              className="bg-red-600 text-white hover:bg-red-700 hover:text-white w-fit"
            >
              {isClearing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Clearing...
                </>
              ) : (
                "Clear All"
              )}
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search your watchlist..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-10 bg-slate-900 border-slate-800 text-white placeholder-gray-500"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/20 p-4 text-red-400">
            <p className="font-semibold mb-2">Failed to load watchlist. Please try again.</p>
            <p className="text-sm text-red-300">
              {error instanceof Error ? error.message : "Unknown error occurred"}
            </p>
            <p className="text-xs text-red-300 mt-2">Check browser console for more details</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && watchlist.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-slate-800 bg-slate-900/50">
            <h3 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h3>
            <p className="text-gray-400 mb-6">Add movies and series to keep track of what you want to watch</p>
            <Link href="/media">
              <Button className="bg-red-600 hover:bg-red-700">
                Browse Content
              </Button>
            </Link>
          </div>
        )}

        {/* Watchlist Grid */}
        {!isLoading && !error && watchlist.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {watchlist.map((item) => (
                <Card key={item.id} className="h-full border-slate-800 bg-slate-900 overflow-hidden hover:border-red-500 transition-colors group">
                  {/* Image Container */}
                  <div className="relative h-48 bg-slate-800 overflow-hidden">
                    {item.media.imageUrl ? (
                      <Image
                        src={item.media.imageUrl}
                        alt={item.media.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-slate-800 text-xs text-gray-500">
                        No image available
                      </div>
                    )}

                    {/* Rating Badge */}
                    {item.media.avgRating && (
                      <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1">
                        <p className="text-xs font-semibold text-red-400">
                          ⭐ {item.media.avgRating}
                        </p>
                      </div>
                    )}

                    {/* Remove Button on Hover */}
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isRemoving}
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white p-2 rounded-full"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-white line-clamp-2 group-hover:text-red-400 transition-colors">
                        {item.media.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.media.releaseYear} • {item.media.type}
                      </p>
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-2">
                      {item.media.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      <Badge className={`text-[10px] ${
                        item.media.pricing === "FREE"
                          ? "bg-green-900 text-green-300"
                          : "bg-red-900 text-red-300"
                      }`}>
                        {item.media.pricing}
                      </Badge>
                      {item.media.price && (
                        <Badge variant="outline" className="border-slate-700 text-gray-300 text-[10px]">
                          ${item.media.price}
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  {/* Footer */}
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Link href={`/media/${item.media.id}`} className="flex-1">
                      <Button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                      >
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="border-slate-700 text-gray-300 hover:bg-slate-800"
                >
                  ← Previous
                </Button>

                <span className="text-gray-400 text-sm">
                  Page {page} of {meta.totalPages}
                </span>

                <Button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                  variant="outline"
                  className="border-slate-700 text-gray-300 hover:bg-slate-800"
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyListPage;