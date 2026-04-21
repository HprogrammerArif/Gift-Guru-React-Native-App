import { baseApi } from "../../api/baseApi";

const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new post (multipart/form-data)
    createPost: builder.mutation({
      query: (formData: FormData) => ({
        url: "social/posts/",
        method: "POST",
        body: formData,
        // Don't set Content-Type — let fetch set it automatically for FormData
        formData: true,
      }),
      invalidatesTags: ["Posts"],
    }),

    // Get all categories
    getCategories: builder.query({
      query: () => ({
        url: "social/categories/",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    // Get all occasions
    getOccasions: builder.query({
      query: () => ({
        url: "social/occasions/",
        method: "GET",
      }),
      providesTags: ["Occasions"],
    }),

    // Get posts feed
    getPosts: builder.query({
      query: (params?: { page?: number; page_size?: number }) => ({
        url: "social/posts/",
        method: "GET",
        params,
      }),
      providesTags: ["Posts"],
    }),

    // Search posts with filters
    searchPosts: builder.query({
      query: (params?: { query?: string; occasion?: string; category?: string; target?: string; page?: number; page_size?: number }) => ({
        url: "social/posts/search/",
        method: "GET",
        params,
      }),
      providesTags: ["Posts"],
    }),

    // Like post
    likePost: builder.mutation({
      query: (postId: string | number) => ({
        url: `social/posts/${postId}/likes/`,
        method: "POST",
      }),
      invalidatesTags: ["Likes"],
    }),

    // submit comment
    submitComment: builder.mutation({
      query: (data: { post: string | number; content: string }) => ({
        url: `social/posts/${data.post}/comments/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Comments"],
    }),

    // get comments
    getComments: builder.query({
      query: (postId: string | number) => ({
        url: `social/post/${postId}/comments/`,
        method: "GET",
      }),
      providesTags: ["Comments"],
    }),

    // follow user
    followUser: builder.mutation({
      query: (userId: string | number) => ({
        url: `/auth/follow/${userId}/`,
        method: "POST",
      }),
      invalidatesTags: ["Follows"],
    }),

    //savePost
    savePost: builder.mutation({
      query: (postId: string | number) => ({
        url: `/social/post/${postId}/wishlist/`,
        method: "POST",
      }),
      invalidatesTags: ["SavedPosts"],
    }),

    // Get wishlist posts
    getWishlistPosts: builder.query({
      query: () => ({
        url: "social/post/wishlist/",
        method: "GET",
      }),
      providesTags: ["SavedPosts"],
    }),

    // Get recommended posts
    getRecommendedPosts: builder.query({
      query: () => ({
        url: "social/posts/recommended/",
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),

    // Get trending posts
    getTrendingPosts: builder.query({
      query: () => ({
        url: "social/posts/trending/",
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),

    // Get user profile data
    getProfileData: builder.query({
      query: (userId: string | number) => ({
        url: "auth/profile/",
        method: "GET",
        params: { id: userId },
      }),
      providesTags: ["Posts"],
    }),

    // Get user specific posts
    getUserPosts: builder.query({
      query: (userId: string | number) => ({
        url: `social/other-user/posts/${userId}/`,
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),

    // Update post
    updatePost: builder.mutation({
      query: ({
        postId,
        formData,
      }: {
        postId: string | number;
        formData: FormData;
      }) => ({
        url: `social/post/details/${postId}/`,
        method: "PUT",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Posts"],
    }),

    // Delete post
    deletePost: builder.mutation({
      query: (postId: string | number) => ({
        url: `social/post/details/${postId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),

    // Track amazon link click
    trackLinkClick: builder.mutation({
      query: (postId: string | number) => ({
        url: `social/posts/${postId}/link-click/`,
        method: "POST",
      }),
      // optionally invalidate stats if desired
    }),

    // Get user stats (total likes and link clicks)
    getUserStats: builder.query({
      query: () => ({
        url: "social/user/stats/",
        method: "GET",
      }),
    }),

    // Get link engagement (monthly clicks for a year)
    getLinkEngagement: builder.query({
      query: (year: number) => ({
        url: "social/user/link-engagement/",
        method: "GET",
        params: { year },
      }),
    }),

    // Get top clicked posts
    getTopClickedPosts: builder.query({
      query: () => ({
        url: "social/posts/top-clicked/",
        method: "GET",
      }),
    }),

    // Get post statuses (approved, pending, rejected)
    getPostStatuses: builder.query({
      query: () => ({
        url: "social/user/post-statuses/",
        method: "GET",
      }),
    }),

    // Report a post
    reportPost: builder.mutation({
      query: (data: { post: string | number; reason: string }) => ({
        url: `social/report/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts"], // Refresh feed logic
    }),

    // Block a user
    blockUser: builder.mutation({
      query: (userId: string | number) => ({
        url: `auth/block/${userId}/`,
        method: "POST",
      }),
      invalidatesTags: ["Posts", "Follows"], // Probably invalidates posts to refresh feed without this user
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetCategoriesQuery,
  useGetOccasionsQuery,
  useGetPostsQuery,
  useSearchPostsQuery,
  useLikePostMutation,
  useSubmitCommentMutation,
  useGetCommentsQuery,
  useFollowUserMutation,
  useSavePostMutation,
  useGetRecommendedPostsQuery,
  useGetTrendingPostsQuery,
  useGetProfileDataQuery,
  useGetUserPostsQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetWishlistPostsQuery,
  useGetUserStatsQuery,
  useGetLinkEngagementQuery,
  useGetTopClickedPostsQuery,
  useGetPostStatusesQuery,
  useTrackLinkClickMutation,
  useReportPostMutation,
  useBlockUserMutation,
} = postApi;
