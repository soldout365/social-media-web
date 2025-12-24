import { postApi } from "@/apis/post.api";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import { userApi } from "@/apis/user.api";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [postApi.deletePost.name],
    mutationFn: (postId) => postApi.deletePost(postId),
    onSuccess: (data, postId) => {
      // Update React Query cache
      queryClient.setQueryData(["posts"], (old) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((p) => p._id !== postId),
          })),
        };
      });

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

  const mutation = useMutation({
    mutationKey: [postApi.createPost.name],
    mutationFn: (formData) => postApi.createPost(formData),
    onSuccess: (data) => {
      // Thêm post mới vào đầu page đầu tiên
      queryClient.setQueryData(["posts"], (old) => {
        if (!old?.pages || !old.pages[0]) return old;

        const newPages = [...old.pages];
        newPages[0] = {
          ...newPages[0],
          posts: [data.post, ...newPages[0].posts],
        };

        return {
          ...old,
          pages: newPages,
        };
      });

      toast.success("Đã đăng bài viết thành công");
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast.error("Không thể đăng bài viết");
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
  const query = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam }) => {
      const data = await postApi.getAllPosts({
        cursor: pageParam,
        limit: 10, // Load 10 bài mỗi lần
      });
      return data;
    },
    initialPageParam: null, // Lần đầu không có cursor
    getNextPageParam: (lastPage) => {
      // Trả về cursor tiếp theo nếu còn data
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });

  return query;
};

export const useLikeOrDislikePost = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthStore();

  return useMutation({
    mutationKey: [postApi.likeOrDislikePost.name],
    mutationFn: async (postId) => await postApi.likeOrDislikePost(postId),

    onMutate: async (postId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(["posts"]);

      // Optimistically update React Query cache
      queryClient.setQueryData(["posts"], (old) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((p) => {
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
            }),
          })),
        };
      });

      return { previousData };
    },

    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(["posts"], context.previousData);
      toast.error("Không thể cập nhật");
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [postApi.addComment.name],
    mutationFn: ({ postId, text }) => postApi.addComment(postId, text),
    onSuccess: (data, variables) => {
      // Update React Query cache
      queryClient.setQueryData(["posts"], (old) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((p) =>
              p._id === variables.postId
                ? { ...p, comments: [...p.comments, data.comment] }
                : p
            ),
          })),
        };
      });

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
