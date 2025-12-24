import { userApi } from "@/apis/user.api";
import { setAuthUser } from "@/redux/authSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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

export const useEditProfile = (user) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [userApi.editUserProfile.name],
    mutationFn: userApi.editUserProfile,

    onSuccess: (data) => {
      if (data.success) {
        const updatedUserData = {
          ...user,
          bio: data.user?.bio,
          profilePictureFile: data.user?.profilePictureFile,
          gender: data.user?.gender,
        };

        dispatch(setAuthUser(updatedUserData));

        queryClient.invalidateQueries({
          queryKey: [userApi.getUserProfile.name, user?._id],
        });

        navigate(`/profile/${user?._id}`);
        toast.success(data.message);
      }
    },

    onError: (error) => {
      console.error("Edit profile error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    },
  });

  const handleEditProfile = (profileData) => {
    // Validate
    if (profileData.bio && profileData.bio.length > 150) {
      toast.error("Bio must be less than 150 characters");
      return;
    }

    if (profileData.profilePictureFile instanceof File) {
      if (profileData.profilePictureFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      if (!profileData.profilePictureFile.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
    }

    const formData = new FormData();

    if (profileData.bio != null) {
      formData.append("bio", profileData.bio);
    }

    if (profileData.gender != null) {
      formData.append("gender", profileData.gender);
    }
    if (profileData.profilePictureFile) {
      formData.append("profilePictureFile", profileData.profilePictureFile);
    }

    mutation.mutate(formData);
  };

  return {
    ...mutation,
    handleEditProfile,
  };
};

export const useFollowOrUnfollowUser = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: [userApi.followOrUnfollowUser.name],
    mutationFn: userApi.followOrUnfollowUser,
    onSuccess: (data, targetUserId) => {
      if (data?.success) {
        if (data.user) {
          dispatch(setAuthUser(data.user));
        }

        queryClient.invalidateQueries({
          queryKey: [userApi.getUserProfile.name, targetUserId],
        });
        queryClient.invalidateQueries({
          queryKey: ["suggestedUsers"],
        });
        toast.success(data.message);
      }
    },
    onError: (error) => {
      console.error("Follow/Unfollow error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to follow/unfollow user";
      toast.error(errorMessage);
    },
  });
};
