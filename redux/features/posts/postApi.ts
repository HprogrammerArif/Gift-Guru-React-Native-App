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

  

  
    

  }),
});

export const {
  useCreatePostMutation,
  useGetCategoriesQuery,
  useGetOccasionsQuery,
  useGetPostsQuery,
  useLikePostMutation,
  useSubmitCommentMutation,
  useGetCommentsQuery,
  useFollowUserMutation,
  useSavePostMutation,
} = postApi;
