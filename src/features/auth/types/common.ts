import { BaseResponse } from '@/features/users/types';

export interface ApiResponse<T> extends BaseResponse {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    pages?: number;
    [key: string]: any;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface ErrorResponse {
  status: number;
  data: {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
  };
}
