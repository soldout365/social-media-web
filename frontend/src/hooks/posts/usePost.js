import { postApi } from "@/apis/post.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import { useAuthStore } from "@/store/auth.store";
import { userApi } from "@/apis/user.api";

export const useDeletePost = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);

  const mutation = useMutation({
    mutationKey: [postApi.deletePost.name],
    mutationFn: (postId) => postApi.deletePost(postId),
    onSuccess: (data, postId) => {
      const updatedPosts = posts.filter((p) => p._id !== postId);
      dispatch(setPosts(updatedPosts));
      toast.success("Đã xóa bài viết thành công");
    },
    onError: (error) => {
      toast.error("Không thể xóa bài viết");
      console.log("Error deleting post:", error);
    },
  });
  return {
    deletePost: mutation.mutate,
    isLoading: mutation.isPending,
  };
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationKey: [postApi.createPost.name],
    mutationFn: (formData) => postApi.createPost(formData),
    onSuccess: (data) => {
      dispatch(setPosts([data.post, ...posts]));
      queryClient.invalidateQueries({ queryKey: [postApi.getAllPosts.name] });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
  });
  const createPost = async (caption, file) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (file) formData.append("image", file);
    return mutation.mutateAsync(formData);
  };
  return {
    createPost,
    loading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export const useGetAllPosts = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: [postApi.getAllPosts.name],
    queryFn: async () => {
      const data = await postApi.getAllPosts();
      dispatch(setPosts(data.posts));
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });

  return query;
};

export const useLikeOrDislikePost = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const { authUser } = useAuthStore();

  return useMutation({
    mutationKey: [postApi.likeOrDislikePost.name],
    mutationFn: async (postId) => await postApi.likeOrDislikePost(postId),

    onMutate: async (postId) => {
      // Update UI ngay lập tức (trước khi server phản hồi ,nên ko bỏ vào onSuccess)
      const updatedPosts = posts.map((p) => {
        if (p._id === postId) {
          const isLiked = p.likes.includes(authUser._id);
          return {
            ...p,
            likes: isLiked
              ? p.likes.filter((id) => id !== authUser._id)
              : [...p.likes, authUser._id],
          };
        }
        return p;
      });
      dispatch(setPosts(updatedPosts));
    },
    onSuccess: () => {
      toast.success("Đã cập nhật cảm xúc với bài viết");
    },
    onError: (error) => {
      console.error("Failed to toggle like status", error);
    },
  });
};

export const useAddComment = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [postApi.addComment.name],
    mutationFn: ({ postId, text }) => postApi.addComment(postId, text),
    onSuccess: (data, variables) => {
      const updatedPosts = posts.map((p) =>
        p._id === variables.postId
          ? { ...p, comments: [...p.comments, data.comment] }
          : p
      );
      dispatch(setPosts(updatedPosts));
      toast.success("Đã thêm bình luận thành công");
      queryClient.invalidateQueries({
        queryKey: [postApi.getAllCommentsOfPost.name, variables.postId],
      });
    },
    onError: (error) => {
      toast.error("Không thể thêm comment");
      console.error("Error adding comment:", error);
    },
  });
  return {
    addComment: mutation.mutate,
    isLoading: mutation.isPending,
  };
};

export const useBookmarkPost = () => {
  const { authUser } = useAuthStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [postApi.bookmarkPost.name],
    mutationFn: (postId) => postApi.bookmarkPost(postId),

    onMutate: async () => {
      return { previousBookmarks: authUser?.bookmarks };
    },
    onSuccess: (data) => {
      if (data.type === "saved") {
        toast.success("Đã lưu bài viết");
      } else if (data.type === "unsaved") {
        toast.success("Bỏ lưu bài viết thành công");
      }
      queryClient.invalidateQueries({
        queryKey: [userApi.getUserProfile.name],
      });
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra");
      console.error("Error bookmarking post:", error);
    },
  });
  return {
    bookmarkPost: mutation.mutate,
    isLoading: mutation.isPending,
  };
};

export const useGetAllCommentsOfPost = (postId, options = {}) => {
  return useQuery({
    queryKey: [postApi.getAllCommentsOfPost.name, postId],
    queryFn: async () => await postApi.getAllCommentsOfPost(postId),
    enabled: options.enabled !== undefined ? options.enabled : !!postId,
    staleTime: 30 * 1000, // Cache 30s
    onError: (error) => {
      console.log(error);
    },
  });
};
