import { BaseResponse } from "@/features/users/types";

export interface AuditLogParams {
  page?: number;
  limit?: number;
  action?: string;
  status?: string;
  severity?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  userId?: string;
}

export interface Audit {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  action: string;
  status: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
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

export interface AuditLogResponse extends BaseResponse {
  data: Audit[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    filters: any;
  };
}
