import { baseApi } from "../../api/baseApi";

export interface Notification {
  id: number;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationResponse,
      { page?: number } | void
    >({
      query: (params) => ({
        url: "notification/",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["NotificationHistory"],
    }),
    markAsRead: builder.mutation<{ success: boolean }, { ids: number[] }>({
      query: (body) => ({
        url: "notification/mark-read/",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["NotificationHistory", "NotificationCount"],
    }),
    getUnreadCount: builder.query<{ unread_count: number }, void>({
      query: () => ({
        url: "notification/unread-count/",
        method: "GET",
      }),
      providesTags: ["NotificationCount"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useGetUnreadCountQuery,
} = notificationApi;
