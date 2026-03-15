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
  }),
});

export const { useGetSubscriptionPlansQuery, useGetMySubscriptionQuery } =
  subscriptionApi;
