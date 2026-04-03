"use client";

import {
  getAllWatchlistItems,
  removeFromWatchlist,
  clearWatchlist,
} from "@/services/watchlist.services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { userNavItems } from "@/lib/navitems";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { logoutAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_action";
import { WatchlistCard } from "@/components/features/WatchlistCard";
import Link from "next/link";

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

  const { mutateAsync: logoutMutate, isPending: isLogoutPending } = useMutation({
        mutationFn: () => logoutAction(),
 });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
                    {/* Sidebar */}
            <DashboardSidebar 
                navSections={userNavItems} 
                onLogout={logoutMutate}
                isLogoutPending={isLogoutPending}
            />
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
                <WatchlistCard
                  key={item.id}
                  media={item.media}
                  onRemove={() => removeItem(item.id)}
                  isRemoving={isRemoving}
                />
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