import { BaseResponse } from '@/features/users/types';

export interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface UpdatePreferencesRequest {
  language?: string;
  timezone?: string;
  dateFormat?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
}

export interface UserPreferencesResponse extends BaseResponse {
  data: UserPreferences;
}

export interface UpdatePreferencesResponse extends BaseResponse {
  data: UserPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface UpdateNotificationPreferencesRequest {
  email?: boolean;
  push?: boolean;
  sms?: boolean;
}
