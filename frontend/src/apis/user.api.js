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
};
