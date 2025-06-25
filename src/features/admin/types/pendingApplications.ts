import { BaseResponse } from '@/features/users/types';

export interface PendingApplication {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  identityNumber?: string;
  applicationStatus: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PendingApplicationsMeta {
  page: number;
  limit: number;
  pages: number;
  total: number;
}

export interface PendingApplicationsResponse extends BaseResponse {
  data: PendingApplication[];
  meta: PendingApplicationsMeta;
}

export interface PendingApplicationsQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  status?: string;
}
