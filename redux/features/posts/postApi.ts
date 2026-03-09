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
  }),
});

export const {
  useCreatePostMutation,
  useGetCategoriesQuery,
  useGetOccasionsQuery,
  useGetPostsQuery,
} = postApi;
