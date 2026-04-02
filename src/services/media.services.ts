import { IMedia, IMediaListResponse, MediaType } from "@/types/media.types";

const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

const buildMediaUrl = (params?: { type?: MediaType; search?: string; limit?: number; page?: number }) => {
    const baseApiUrl = getApiBaseUrl();

    if (!baseApiUrl) {
        return null;
    }

    const url = new URL(`${baseApiUrl}/media`);

    if (params?.type) {
        url.searchParams.set("type", params.type);
    }

    if (params?.search) {
        url.searchParams.set("search", params.search);
    }

    if (params?.limit) {
        url.searchParams.set("limit", String(params.limit));
    }

    if (params?.page) {
        url.searchParams.set("page", String(params.page));
    }

    return url;
};

export const getMediaList = async (params?: { type?: MediaType; search?: string; limit?: number; page?: number }): Promise<IMediaListResponse> => {
    const url = buildMediaUrl(params);

    if (!url) {
        return { data: [] };
    }

    try {
        const response = await fetch(url.toString(), {
            method: "GET",
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            return { data: [] };
        }

        const payload = await response.json();

        return {
            data: payload?.data || [],
            meta: payload?.meta,
        };
    } catch (error) {
        console.error("Failed to fetch media list:", error);
        return { data: [] };
    }
};

export const getMediaById = async (id: string): Promise<IMedia | null> => {
    const baseApiUrl = getApiBaseUrl();

    if (!baseApiUrl) {
        return null;
    }

    try {
        const response = await fetch(`${baseApiUrl}/media/${id}`, {
            method: "GET",
            next: { revalidate: 60 },
        });

        if (response.ok) {
            const payload = await response.json();
            return payload?.data || null;
        }
    } catch (error) {
        console.error("Failed to fetch media by id:", error);
    }

    // fallback for public access when backend protects /media/:id
    const mediaList = await getMediaList({ limit: 100 });
    return mediaList.data.find((item) => item.id === id) || null;
};
