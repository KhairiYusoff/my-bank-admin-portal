import { BaseResponse } from '@/features/users/types';

export interface ApplicationActionResponse extends BaseResponse {
  data: {
    userId: string;
    status: string;
    updatedAt: string;
  };
}

export interface ApplicationStatusUpdate {
  userId: string;
  status: 'approved' | 'rejected' | 'pending';
  reason?: string;
}
