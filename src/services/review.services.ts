"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { PaginationMeta } from "@/types/api.types";
import {
    IComment,
    ICreateCommentPayload,
    ICreateReviewPayload,
    IReview,
    IUpdateCommentPayload,
    IUpdateReviewPayload,
    ReviewStatus,
} from "@/types/review.types";

const REVIEW_BASE_ENDPOINT = "/reviews";

export interface IReviewListResult {
    data: IReview[];
    meta?: PaginationMeta;
}

export const getAllReviews = async (params?: Record<string, unknown>): Promise<IReviewListResult> => {
    const response = await httpClient.get<IReview[]>(REVIEW_BASE_ENDPOINT, {
        params,
    });

    return {
        data: response.data,
        meta: response.meta,
    };
};

export const getReviewById = async (id: string): Promise<IReview> => {
    const response = await httpClient.get<IReview>(`${REVIEW_BASE_ENDPOINT}/${id}`);
    return response.data;
};

export const createReview = async (payload: ICreateReviewPayload): Promise<IReview> => {
    const response = await httpClient.post<IReview>(REVIEW_BASE_ENDPOINT, payload);
    return response.data;
};

export const toggleReviewLike = async (id: string): Promise<{ liked: boolean; message: string }> => {
    const response = await httpClient.post<{ liked: boolean; message: string }>(`${REVIEW_BASE_ENDPOINT}/${id}/like`, {});
    return response.data;
};

export const updateReviewById = async (id: string, payload: IUpdateReviewPayload): Promise<IReview> => {
    const response = await httpClient.patch<IReview>(`${REVIEW_BASE_ENDPOINT}/${id}`, payload);
    return response.data;
};

export const updateReviewStatusById = async (id: string, status: ReviewStatus): Promise<IReview> => {
    const response = await httpClient.patch<IReview>(`${REVIEW_BASE_ENDPOINT}/${id}/status`, { status });
    return response.data;
};

export const deleteReviewById = async (id: string): Promise<IReview> => {
    const response = await httpClient.delete<IReview>(`${REVIEW_BASE_ENDPOINT}/${id}`);
    return response.data;
};

export const createReviewComment = async (payload: ICreateCommentPayload): Promise<IComment> => {
    const response = await httpClient.post<IComment>(`${REVIEW_BASE_ENDPOINT}/comments`, payload);
    return response.data;
};

export const updateReviewComment = async (id: string, payload: IUpdateCommentPayload): Promise<IComment> => {
    const response = await httpClient.patch<IComment>(`${REVIEW_BASE_ENDPOINT}/comments/${id}`, payload);
    return response.data;
};

export const deleteReviewComment = async (id: string): Promise<IComment> => {
    const response = await httpClient.delete<IComment>(`${REVIEW_BASE_ENDPOINT}/comments/${id}`);
    return response.data;
};
