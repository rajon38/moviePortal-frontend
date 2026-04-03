"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { PaginationMeta } from "@/types/api.types";

export interface IWatchlistMedia {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: "MOVIE" | "SERIES";
  releaseYear: number;
  director: string;
  cast: string[];
  genres: string[];
  platform: string[];
  pricing: "FREE" | "PREMIUM";
  price: number | null;
  youtubeLink: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  avgRating?: number | null;
}

export interface IWatchlistItem {
  id: string;
  userId: string;
  mediaId: string;
  createdAt: string;
  media: IWatchlistMedia;
}

export interface IWatchlistListResult {
  data: IWatchlistItem[];
  meta?: PaginationMeta;
}

const WATCHLIST_BASE_ENDPOINT = "/watch-lists";

export const getAllWatchlistItems = async (
  params?: Record<string, unknown>
): Promise<IWatchlistListResult> => {
  const response = await httpClient.get<IWatchlistItem[]>(
    WATCHLIST_BASE_ENDPOINT,
    { params }
  );
  return {
    data: response.data,
    meta: response.meta,
  };
};

export const getWatchlistItemById = async (
  id: string
): Promise<IWatchlistItem> => {
  const response = await httpClient.get<IWatchlistItem>(
    `${WATCHLIST_BASE_ENDPOINT}/${id}`
  );
  return response.data;
};

export const addToWatchlist = async (mediaId: string): Promise<IWatchlistItem> => {
  const response = await httpClient.post<IWatchlistItem>(
    WATCHLIST_BASE_ENDPOINT,
    { mediaId }
  );
  return response.data;
};

export const removeFromWatchlist = async (
  watchlistId: string
): Promise<IWatchlistItem> => {
  const response = await httpClient.delete<IWatchlistItem>(
    `${WATCHLIST_BASE_ENDPOINT}/${watchlistId}`
  );
  return response.data;
};

export const clearWatchlist = async (): Promise<{ count: number }> => {
  const response = await httpClient.delete<{ count: number }>(
    WATCHLIST_BASE_ENDPOINT
  );
  return response.data;
};