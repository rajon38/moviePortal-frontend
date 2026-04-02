"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { PaginationMeta } from "@/types/api.types";
import {
    ICreateMediaPayload,
    IMedia,
    IUpdateMediaPayload,
    MediaType,
} from "@/types/media.types";

const MEDIA_BASE_ENDPOINT = "/media";

export interface IMediaListResult {
    data: IMedia[];
    meta?: PaginationMeta;
}

export const getMediaList = async (params?: {
    type?: MediaType;
    search?: string;
    limit?: number;
    page?: number;
}): Promise<IMediaListResult> => {
    try {
        const response = await httpClient.get<IMedia[]>(MEDIA_BASE_ENDPOINT, {
            params,
            withAuthCookie: false,
        });

        return {
            data: response.data,
            meta: response.meta,
        };
    } catch (error) {
        console.error("Failed to fetch media list:", error);
        return { data: [] };
    }
};

export const getMediaById = async (id: string): Promise<IMedia | null> => {
    try {
        const response = await httpClient.get<IMedia>(`${MEDIA_BASE_ENDPOINT}/${id}`, {
            withAuthCookie: false,
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch media by id:", error);
    }

    // fallback if direct fetch fails
    const mediaList = await getMediaList({ limit: 100 });
    return mediaList.data.find((item) => item.id === id) || null;
};

export const createMedia = async (payload: ICreateMediaPayload): Promise<IMedia> => {
    const response = await httpClient.post<IMedia>("/media", payload);
    return response.data;
};

export const createMediaWithImage = async (
    payload: Omit<ICreateMediaPayload, "imageUrl">,
    imageFile?: File,
): Promise<IMedia> => {
    const formData = new FormData();

    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("type", payload.type);
    formData.append("releaseYear", String(payload.releaseYear));
    formData.append("director", payload.director);
    formData.append("cast", JSON.stringify(payload.cast));
    formData.append("genres", JSON.stringify(payload.genres));
    formData.append("platform", JSON.stringify(payload.platform));
    formData.append("pricing", payload.pricing);

    if (typeof payload.price !== "undefined") {
        formData.append("price", String(payload.price));
    }

    if (payload.youtubeLink) {
        formData.append("youtubeLink", payload.youtubeLink);
    }

    if (imageFile) {
        formData.append("imageUrl", imageFile);
    }

    const response = await httpClient.post<IMedia>("/media", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const updateMediaById = async (id: string, payload: IUpdateMediaPayload): Promise<IMedia> => {
    const response = await httpClient.patch<IMedia>(`/media/${id}`, payload);
    return response.data;
};

export const updateMediaByIdWithImage = async (
    id: string,
    payload: IUpdateMediaPayload,
    imageFile?: File,
): Promise<IMedia> => {
    const formData = new FormData();

    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);
    if (payload.type) formData.append("type", payload.type);
    if (typeof payload.releaseYear !== "undefined") formData.append("releaseYear", String(payload.releaseYear));
    if (payload.director) formData.append("director", payload.director);
    if (payload.cast) formData.append("cast", JSON.stringify(payload.cast));
    if (payload.genres) formData.append("genres", JSON.stringify(payload.genres));
    if (payload.platform) formData.append("platform", JSON.stringify(payload.platform));
    if (payload.pricing) formData.append("pricing", payload.pricing);
    if (typeof payload.price !== "undefined") formData.append("price", String(payload.price));
    if (payload.youtubeLink) formData.append("youtubeLink", payload.youtubeLink);

    if (imageFile) {
        formData.append("imageUrl", imageFile);
    }

    const response = await httpClient.patch<IMedia>(`/media/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const deleteMediaById = async (id: string): Promise<IMedia> => {
    const response = await httpClient.delete<IMedia>(`/media/${id}`);
    return response.data;
};
