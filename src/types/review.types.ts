export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IReviewUser {
    id: string;
    name: string;
    email: string;
    image?: string | null;
}

export interface IReviewMedia {
    id: string;
    title: string;
}

export interface IComment {
    id: string;
    content: string;
    userId: string;
    reviewId: string;
    parentId?: string | null;
    createdAt: string;
    user: IReviewUser;
    replies?: IComment[];
}

export interface IReviewCount {
    likes: number;
    comments: number;
}

export interface IReview {
    id: string;
    rating: number;
    content: string;
    tags?: string[];
    spoiler?: boolean;
    status: ReviewStatus;
    userId: string;
    mediaId: string;
    isDeleted?: boolean;
    deletedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    user?: IReviewUser;
    media?: IReviewMedia;
    comments?: IComment[];
    _count?: IReviewCount;
}

export interface ICreateReviewPayload {
    rating: number;
    content: string;
    tags?: string[];
    spoiler?: boolean;
    mediaId: string;
}

export interface IUpdateReviewPayload {
    rating?: number;
    content?: string;
    tags?: string[];
    spoiler?: boolean;
}

export interface ICreateCommentPayload {
    content: string;
    reviewId: string;
    parentId?: string;
}

export interface IUpdateCommentPayload {
    content: string;
}
