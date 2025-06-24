import { api } from '@/app/store/apiSlice';
import type { EndpointBuilder } from '@reduxjs/toolkit/query';

// Common Types
interface BaseResponse {
  success: boolean;
  message: string;
  errors?: any;
}

// User Management
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Preferences {
  theme: string;
  language: string;
  notifications: boolean;
}

export interface NextOfKin {
  name: string;
  phone: string;
  relationship: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  applicationStatus: string;
  isVerified: boolean;
  isProfileComplete: boolean;
  role: string;
  address: Address;
  preferences: Preferences;
  nextOfKin: NextOfKin;
  accountType?: string;
  age?: number;
  dateOfBirth?: string;
  educationLevel?: string;
  employerName?: string;
  employmentType?: string;
  identityNumber?: string;
  job?: string;
  maritalStatus?: string;
  nationality?: string;
  purposeOfAccount?: string;
  residencyStatus?: string;
  salary?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UsersMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UsersResponse extends BaseResponse {
  data: User[];
  meta: UsersMeta;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
}

// Activity Log
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

// Account Management
export interface AccountUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Account {
  _id: string;
  user: AccountUser | null;
  accountNumber: string;
  accountType: string;
  branch: string;
  balance: number;
  interestRate: number;
  currency: string;
  status: string;
  dateOpened: string;
  overdraftLimit: number;
  minimumBalance: number;
  __v: number;
}

export interface AccountsResponse extends BaseResponse {
  data: Account[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AccountsQueryParams {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  status?: string;
  type?: string;
}

// Transaction Management
export interface TransactionAccount {
  _id: string;
  accountNumber: string;
}

export interface TransactionUser {
  _id: string;
  name: string;
  role: string;
}

export interface Transaction {
  _id: string;
  account: TransactionAccount;
  type: string;
  amount: number;
  description: string;
  status: string;
  performedBy: TransactionUser;
  date: string;
  __v: number;
}

export interface TransactionsResponse extends BaseResponse {
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface TransactionsQueryParams {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  status?: string;
  type?: string;
}

// Pending Applications
export interface PendingApplication {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  identityNumber?: string;
  applicationStatus: string;
  createdAt: string;
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

// Staff Management
export interface StaffMember {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'banker';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  applicationStatus: string;
  isVerified: boolean;
  isProfileComplete: boolean;
}

export interface StaffListResponse extends BaseResponse {
  data: StaffMember[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'banker';
}

export interface CreateStaffResponse extends BaseResponse {
  data: StaffMember;
}

// Application Management
export interface ApplicationActionResponse extends BaseResponse {
  data: {
    userId: string;
    status: string;
    updatedAt: string;
  };
}

// Airdrop
export interface AirdropRequest {
  accountNumber: string;
  amount: number;
  reference?: string;
}

export interface AirdropResponse extends BaseResponse {
  data: {
    transactionId: string;
    newBalance: number;
  };
}

// Query Params
export interface PendingApplicationsQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Define tag types for cache invalidation
export const adminApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    // Activity Log
    getUserActivity: builder.query<ActivityLogResponse, ActivityLogParams>({
      query: ({ userId, ...params }) => ({
        url: `/users/activity/${userId}`,
        method: 'GET',
        params,
      }),
      providesTags: (result, error, { userId }) => [{ type: 'UserActivity', id: userId }],
    }),

    // User Management
    // Pending Applications
    getPendingApplications: builder.query<PendingApplicationsResponse, PendingApplicationsQueryParams>({
      query: (params: PendingApplicationsQueryParams) => ({
        url: '/admin/pending-applications',
        method: 'GET',
        params: {
          page: params.page,
          limit: params.limit,
          sortBy: params.sortBy,
          order: params.order
        },
      }),
      providesTags: ['PendingApplications'],
    }),

    // Staff Management
    getStaffMembers: builder.query<StaffListResponse, { page: number; limit: number }>({
      query: ({ page, limit }: { page: number; limit: number }) => ({
        url: '/users/staff',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Staff'],
    }),
    createStaff: builder.mutation<CreateStaffResponse, CreateStaffRequest>({
      query: (staffData: CreateStaffRequest) => ({
        url: '/admin/create-staff',
        method: 'POST',
        body: staffData,
      }),
      invalidatesTags: ['Staff'],
    }),

    // Application Management
    approveApplication: builder.mutation<ApplicationActionResponse, { userId: string }>({
      query: ({ userId }: { userId: string }) => ({
        url: `/admin/approve-application/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['PendingApplications'],
    }),

    verifyCustomer: builder.mutation<ApplicationActionResponse, { userId: string }>({
      query: ({ userId }: { userId: string }) => ({
        url: `/admin/verify-customer/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['PendingApplications'],
    }),

    // Account Management


  }),
});

export const {
  useGetUserActivityQuery,
  useGetPendingApplicationsQuery,
  useGetStaffMembersQuery,
  useCreateStaffMutation,
  useApproveApplicationMutation,
  useVerifyCustomerMutation,




} = adminApi;
