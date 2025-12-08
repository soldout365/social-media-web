import { axiosInstance } from "@/lib/axios";

export const postApi = {
  deletePost: async (postId) => {
    const response = await axiosInstance.delete(`/post/delete/${postId}`);
    return response.data;
  },
};
