"use server";

import { fetchWithAuth } from "@/lib/fetchWithAuth";

export const createPost = async (data: FormData) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return { success: false, error: "API URL is missing" };

    const res = await fetchWithAuth(`${baseUrl}/social/posts/`, {
      method: "POST",
      body: data,
    });

    const text = await res.text();
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const json = JSON.parse(text);
      if (!res.ok) {
        return {
          success: false,
          error: json.detail || json.message || "Server error",
          ...json
        };
      }
      return json;
    }
    return { success: false, error: `Server error (${res.status})` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getFilteredPosts = async (params: { 
  category?: string | null; 
  occasion?: string | null; 
  target?: string | null;
  page?: number | null;
}) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return null;

    const query = new URLSearchParams();
    if (params.category && params.category !== "all") query.append("category", params.category);
    if (params.occasion && params.occasion !== "all") query.append("occasion", params.occasion);
    if (params.target && params.target !== "all") {
      const capitalized = params.target.charAt(0).toUpperCase() + params.target.slice(1);
      query.append("target", capitalized);
    }
    if (params.page) query.append("page", params.page.toString());

    const res = await fetchWithAuth(`${baseUrl}/social/posts/filter/?${query.toString()}`, {
      cache: "no-store"
    });

    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  } catch (error) {
    return null;
  }
};




export const submitComment = async (postId: string | number, content: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return { success: false, error: "API URL is missing" };

    const res = await fetchWithAuth(`${baseUrl}/social/posts/${postId}/comments/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post: String(postId), content })
    });

    if (res.headers.get("content-type")?.includes("application/json")) {
      const json = await res.json();
      if (!res.ok) return { success: false, error: json.detail || "Server error", ...json };
      return json;
    }
    return { success: false, error: `Server error (${res.status})` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getComments = async (postId: string | number) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return [];
    
    const res = await fetchWithAuth(`${baseUrl}/social/post/${postId}/comments/`, {
      cache: "no-store"
    });
    
    if (!res.ok) throw new Error("Failed to fetch comments");
    return res.json();
  } catch (error) {
    return [];
  }
};

export const likePost = async (postId: string | number) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return { success: false, error: "API URL is missing" };

    const res = await fetchWithAuth(`${baseUrl}/social/posts/${postId}/likes/`, {
      method: "POST"
    });

    if (res.headers.get("content-type")?.includes("application/json")) {
      const json = await res.json();
      if (!res.ok) return { success: false, error: json.detail || "Server error", ...json };
      return json;
    }
    return { success: false, error: `Server error (${res.status})` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};


export const followUser = async (userId: string | number) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return { success: false, error: "API URL is missing" };

    const res = await fetchWithAuth(`${baseUrl}/auth/follow/${userId}/`, {
      method: "POST"
    });

    if (res.headers.get("content-type")?.includes("application/json")) {
      const json = await res.json();
      if (!res.ok) return { success: false, error: json.detail || "Server error", ...json };
      return json;
    }
    return { success: false, error: `Server error (${res.status})` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};


export const savePost = async (postId: string | number) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return { success: false, error: "API URL is missing" };

    const res = await fetchWithAuth(`${baseUrl}/social/post/${postId}/wishlist/`, {
      method: "POST"
    });

    if (res.headers.get("content-type")?.includes("application/json")) {
      const json = await res.json();
      if (!res.ok) return { success: false, error: json.detail || "Server error", ...json };
      return json;
    }
    return { success: false, error: `Server error (${res.status})` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};





export const getWishlistPosts = async (params?: { 
  category?: string | null; 
  occasion?: string | null; 
  target?: string | null;
}) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return [];

    const query = new URLSearchParams();
    if (params?.category && params.category !== "all") query.append("category", params.category);
    if (params?.occasion && params.occasion !== "all") query.append("occasion", params.occasion);
    if (params?.target && params.target !== "all") {
      const capitalized = params.target.charAt(0).toUpperCase() + params.target.slice(1);
      query.append("target", capitalized);
    }

    const res = await fetchWithAuth(`${baseUrl}/social/post/wishlist/?${query.toString()}`, {
      cache: "no-store"
    });

    if (!res.ok) throw new Error("Failed to fetch wishlist");
    return res.json();
  } catch (error) {
    return [];
  }
};

export const getTrendingPosts = async (params?: { 
  category?: string | null; 
  occasion?: string | null; 
  target?: string | null;
}) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return [];

    const query = new URLSearchParams();
    if (params?.category && params.category !== "all") query.append("category", params.category);
    if (params?.occasion && params.occasion !== "all") query.append("occasion", params.occasion);
    if (params?.target && params.target !== "all") {
      const capitalized = params.target.charAt(0).toUpperCase() + params.target.slice(1);
      query.append("target", capitalized);
    }

    const res = await fetchWithAuth(`${baseUrl}/social/posts/trending/?${query.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch trending posts");
    return res.json();
  } catch (error) {
    console.error("Error in getTrendingPosts:", error);
    return [];
  }
};

export const getRecommendedPosts = async (params?: { 
  category?: string | null; 
  occasion?: string | null; 
  target?: string | null;
}) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return [];

    const query = new URLSearchParams();
    if (params?.category && params.category !== "all") query.append("category", params.category);
    if (params?.occasion && params.occasion !== "all") query.append("occasion", params.occasion);
    if (params?.target && params.target !== "all") {
      const capitalized = params.target.charAt(0).toUpperCase() + params.target.slice(1);
      query.append("target", capitalized);
    }

    const res = await fetchWithAuth(`${baseUrl}/social/posts/recommended/?${query.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch recommended posts");
    return res.json();
  } catch (error) {
    console.error("Error in getRecommendedPosts:", error);
    return [];
  }
};

export const searchPosts = async (query: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return [];

    const res = await fetchWithAuth(`${baseUrl}/social/posts/search/?query=${encodeURIComponent(query)}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to search posts");
    return res.json();
  } catch (error) {
    console.error("Error in searchPosts:", error);
    return [];
  }
};

export const getCommunityActivity = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return { gift_founds: 0, contributors: 0 };

    const res = await fetchWithAuth(`${baseUrl}/social/community-activity/`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch community activity");
    return res.json();
  } catch (error) {
    console.error("Error in getCommunityActivity:", error);
    return { gift_founds: 0, contributors: 0 };
  }
};



export const getUserPosts = async (userId: string | number, ordering?: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return [];

    let url = `${baseUrl}/social/other-user/posts/${userId}`;
    if (ordering) {
      url += `?order=${ordering}`;
    }

    const res = await fetchWithAuth(url, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch user posts");
    return res.json();
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    return [];
  }
};
// export const getUserPosts = async (userId: string | number, ordering?: string) => {
//   try {
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
//     if (!baseUrl) return [];

//     let url = `${baseUrl}/social/posts/?user=${userId}`;
//     if (ordering) {
//       url += `&ordering=${ordering}`;
//     }

//     const res = await fetchWithAuth(url, {
//       cache: "no-store",
//     });

//     if (!res.ok) throw new Error("Failed to fetch user posts");
//     return res.json();
//   } catch (error) {
//     console.error("Error in getUserPosts:", error);
//     return [];
//   }
// };

export const getUserStats = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return { total_link_clicks: 0, total_likes: 0 };

    const res = await fetchWithAuth(`${baseUrl}/social/user/stats/`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch user stats");
    return res.json();
  } catch (error) {
    console.error("Error in getUserStats:", error);
    return { total_link_clicks: 0, total_likes: 0 };
  }
};

export const getLinkEngagement = async (year: string | number) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return [];

    const res = await fetchWithAuth(`${baseUrl}/social/user/link-engagement/?year=${year}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch link engagement");
    return res.json();
  } catch (error) {
    console.error("Error in getLinkEngagement:", error);
    return [];
  }
};

export const getTopClickedPosts = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return [];

    const res = await fetchWithAuth(`${baseUrl}/social/posts/top-clicked/`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch top clicked posts");
    return res.json();
  } catch (error) {
    console.error("Error in getTopClickedPosts:", error);
    return [];
  }
};

export const getPostStatuses = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    if (!baseUrl) return { approved: 0, pending: 0, rejected: 0 };

    const res = await fetchWithAuth(`${baseUrl}/social/user/post-statuses/`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch post statuses");
    return res.json();
  } catch (error) {
    console.error("Error in getPostStatuses:", error);
    return { approved: 0, pending: 0, rejected: 0 };
  }
};
