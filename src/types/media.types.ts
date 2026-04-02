export type MediaType = "MOVIE" | "SERIES";
export type PricingType = "FREE" | "PREMIUM";
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IMediaUser {
    id: string;
    name: string;
    email: string;
    image?: string | null;
}

export interface IReviewComment {
    id: string;
    content: string;
    userId: string;
    reviewId: string;
    parentId?: string | null;
    createdAt: string;
    user: IMediaUser;
    replies?: IReviewComment[];
}

export interface IMediaReview {
    id: string;
    rating: number;
    content: string;
    tags?: string[];
    spoiler?: boolean;
    status?: ReviewStatus;
    userId: string;
    mediaId: string;
    isDeleted?: boolean;
    deletedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    user: IMediaUser;
    comments?: IReviewComment[];
    _count?: {
        likes?: number;
        comments?: number;
    };
}

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
    isDeleted?: boolean;
    deletedAt?: string | null;
    reviews?: IMediaReview[];
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

export interface ICreateMediaPayload {
    title: string;
    imageUrl?: string;
    description: string;
    type: MediaType;
    releaseYear: number;
    director: string;
    cast: string[];
    genres: string[];
    platform: string[];
    pricing: PricingType;
    price?: number;
    youtubeLink?: string;
}

export interface IUpdateMediaPayload {
    title?: string;
    imageUrl?: string;
    description?: string;
    type?: MediaType;
    releaseYear?: number;
    director?: string;
    cast?: string[];
    genres?: string[];
    platform?: string[];
    pricing?: PricingType;
    price?: number;
    youtubeLink?: string;
}
