import { axiosInstance } from "@/lib/axios";

export const userApi = {
  getSuggestedUsers: async () => {
    const response = await axiosInstance.get("/auth/suggested", {
      withCredentials: true,
    });
    return response.data;
  },

  getUserProfile: async (userId) => {
    const response = await axiosInstance.get(`/auth/${userId}/profile`, {
      withCredentials: true,
    });
    return response.data;
  },

  editUserProfile: async (formData) => {
    const response = await axiosInstance.post("/auth/profile/edit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  },

  followOrUnfollowUser: async (targetUserId) => {
    const response = await axiosInstance.post(
      `/auth/follow-or-unfollow/${targetUserId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  },
};
