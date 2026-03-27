import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    register: builder.mutation({
      query: (userInfo) => ({
        url: "auth/register/",
        method: "POST",
        body: userInfo,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (userInfo) => ({
        url: "auth/register/verify/",
        method: "POST",
        body: userInfo,
        
      }),
    }),

    resendOtp: builder.mutation({
      query: (userInfo) => ({
        url: "auth/register/resend-otp/",
        method: "POST",
        body: userInfo,
      }),
    }),

    login: builder.mutation({
      query: (userInfo) => ({
        url: "auth/login/",
        method: "POST",
        body: userInfo,
      }),
    }),

    googleLogin: builder.mutation({
      query: (body: { 
        idToken: string; 
        email?: string; 
        first_name?: string; 
        last_name?: string; 
      }) => ({
        url: "auth/social-auth/",
        method: "POST",
        body: { ...body, provider: "google" },
      }),
    }),

    forgetPassword: builder.mutation({
      query: (userInfo) => ({
        url: "auth/password-reset/request/",
        method: "POST",
        body: userInfo,
      }),
    }),

    otpVerify: builder.mutation({
      query: (userInfo) => ({
        url: "auth/password-reset/verify/",
        method: "POST",
        body: userInfo,
      }),
    }),

    changePassword: builder.mutation({
      query: (userInfo) => ({
        url: "auth/password-reset/confirm/",
        method: "POST",
        body: userInfo,
      }),
    }),

    // add child
      addChild: builder.mutation({
      query: (childInfo) => ({
        url: "auth/children/",
        method: "POST",
        body: childInfo,
      }),
      invalidatesTags: ["Children"],
    }),

    // update child
      updateChild: builder.mutation({
      query: ({childInfo, childId}) => ({
        url: `auth/children/${childId}/`,
        method: "PUT",
        body: childInfo,
      }),
      invalidatesTags: ["Children"],
    }),

    // delete child
      deleteChild: builder.mutation({
      query: ({childId}) => ({
        url: `auth/children/${childId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Children"],
    }),

    // get children
      getChildren: builder.query({
      query: () => ({
        url: "auth/children/",
        method: "GET",
      }),
      providesTags: ["Children"],
    }),

    // invite co parent
      inviteCoParent: builder.mutation({
      query: (inviteData) => ({
        url: "auth/invite/",
        method: "POST",
        body: inviteData,
      }),
    }),

    // GET PROFILE
    // getUserProfile: builder.query({
    //   query: () => ({
    //     url: "auth/profile/",
    //     providesTags: ["Profile"],
    //   }),
    // }),



    changePasswordFromProfile: builder.mutation({
      query: (body) => ({
        url: "auth/change-password/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    // DELETE ACCOUNT
    deleteAccount: builder.mutation({
      query: () => ({
        url: "auth/delete-account/",
        method: "DELETE",
      }),
    }),
    
    // CHANGE CURRENCY
    changeCurrency: builder.mutation({
      query: (body) => ({
        url: "auth/change-currency/",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    // END
  }),
});

export const {
  useLoginMutation,
  useGoogleLoginMutation,
  useRegisterMutation,
  useForgetPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useChangePasswordMutation,
  // useGetUserProfileQuery,

  useChangePasswordFromProfileMutation,
  useAddChildMutation,
  useInviteCoParentMutation,
  useGetChildrenQuery,
  useLazyGetChildrenQuery,
  useOtpVerifyMutation,
  useUpdateChildMutation,
  useDeleteChildMutation,
  useDeleteAccountMutation,
  useChangeCurrencyMutation,
} = authApi;
