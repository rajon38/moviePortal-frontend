export type MediaType = "MOVIE" | "SERIES";
export type PricingType = "FREE" | "PREMIUM";

export interface IMedia {
    id: string;
    title: string;
    imageUrl?: string | null;
    description: string;
    type: MediaType;
    releaseYear: number;
    director: string;
    cast: string[];
    genres: string[];
    platform: string[];
    pricing: PricingType;
    price?: number | null;
    youtubeLink?: string | null;
    avgRating?: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IMediaListMeta {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
}

export interface IMediaListResponse {
    data: IMedia[];
    meta?: IMediaListMeta;
}
