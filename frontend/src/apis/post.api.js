import { axiosInstance } from "@/lib/axios";

export const postApi = {
  createPost: async (formData) => {
    const response = await axiosInstance.post(`/post/addpost`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return response.data;
  },

  getAllPosts: async ({ cursor, limit = 10 } = {}) => {
    const params = new URLSearchParams();
    params.append("limit", limit);
    if (cursor) params.append("cursor", cursor);

    const response = await axiosInstance.get(
      `/post/allposts?${params.toString()}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  likeOrDislikePost: async (postId) => {
    const response = await axiosInstance.put(
      `/post/${postId}/toggle-like`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await axiosInstance.delete(`/post/delete/${postId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  addComment: async (postId, text) => {
    const response = await axiosInstance.post(
      `/post/${postId}/comment`,
      { text },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  },

  getAllCommentsOfPost: async (postId) => {
    const response = await axiosInstance.get(`/post/${postId}/comment/all`, {
      withCredentials: true,
    });
    return response.data;
  },

  bookmarkPost: async (postId) => {
    const response = await axiosInstance.post(
      `/post/${postId}/bookmark`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  },
};
