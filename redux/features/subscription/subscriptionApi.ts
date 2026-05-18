import { baseApi } from "../../api/baseApi";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all subscription plans
    getSubscriptionPlans: builder.query({
      query: () => ({
        url: "subscription/plans/",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),

    // Get my current subscription
    getMySubscription: builder.query({
      query: () => ({
        url: "subscription/my-subscription/",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),

    // Notify backend of checkout/subscription upgrade
    createCheckoutSession: builder.mutation({
      query: (body: { plan_slug: string }) => ({
        url: "subscription/create-checkout-session/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscription"],
    }),

    // Notify backend of cancellation intent
    cancelSubscription: builder.mutation({
      query: () => ({
        url: "subscription/cancel/",
        method: "POST",
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useGetMySubscriptionQuery,
  useCreateCheckoutSessionMutation,
  useCancelSubscriptionMutation,
} = subscriptionApi;
