import { BaseResponse } from '@/features/users/types';

export interface ActivityLogParams {
  userId: string;
  page?: number;
  limit?: number;
  action?: string;
  status?: string;
  severity?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ActivityLogResponse extends BaseResponse {
  data: Activity[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    filters: any;
  };
}

export interface Activity {
  _id: string;
  user: string;
  action: string;
  status: string;
  severity: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  details?: string;
  relatedEntity?: {
    _id: string;
    accountNumber?: string;
    name?: string;
    email?: string;
  };
}
