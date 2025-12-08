import { postApi } from "@/apis/post.api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeletePost = () => {
  return useMutation({
    mutationKey: [postApi.deletePost.name],
    mutationFn: async (postId) => await postApi.deletePost(postId),
    onSuccess: (data) => {
      // Handle success
      console.log("Post deleted successfully", data);
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      // Handle error
      console.error("Failed to delete post", error);
      toast.error("Failed to delete post");
    },
  });
};
//chua hoan thien
