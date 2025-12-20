import { userApi } from "@/apis/user.api";
import { useQuery } from "@tanstack/react-query";

export const useGetSuggestedUsers = () => {
  return useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const data = await userApi.getSuggestedUsers();
      return data?.users || [];
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    gcTime: 10 * 60 * 1000, // Garbage collection sau 10 phút
  });
};

export const useGetUserProfile = (userId) => {
  return useQuery({
    queryKey: [userApi.getUserProfile.name, userId],
    queryFn: async () => {
      const response = await userApi.getUserProfile(userId);
      return response?.user || null;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
