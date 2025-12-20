import React, { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AtSign, Heart, MessageCircle, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useGetUserProfile } from "@/hooks/users/useUser";
import { useAuthStore } from "@/store/auth.store";
import { useAddComment } from "@/hooks/posts/usePost";
import { setSelectedPost } from "@/redux/postSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import CommentDialog from "../comment/CommentDialog";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const dispatch = useDispatch();

  const { data: userProfile, isLoading, error } = useGetUserProfile(userId);
  const { authUser } = useAuthStore();
  const { addComment } = useAddComment();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "posts";

  const [commentDialogOpen, setCommentDialogOpen] = useState(false);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  // Computed values với useMemo
  // Kiểm tra xem người dùng hiện tại có phải là chủ sở hữu profile không
  const isLoggedInUserProfile = useMemo(
    () => authUser?._id === userProfile?._id, // So sánh ID của người dùng đăng nhập với ID profile đang xem
    [authUser?._id, userProfile?._id] // Tính toán lại khi ID thay đổi
  );

  // Kiểm tra xem người dùng hiện tại có đang follow profile này không
  const isFollowing = useMemo(
    () =>
      userProfile?.followers?.some(
        (follower) => follower._id === authUser?._id // Tìm xem ID người dùng có trong danh sách followers không
      ) || false, // Trả về false nếu không có followers
    [userProfile?.followers, authUser?._id] // Tính toán lại khi followers hoặc ID người dùng thay đổi
  );

  // Xác định bài viết cần hiển thị dựa trên tab và quyền hạn
  const displayedPost = useMemo(() => {
    if (!isLoggedInUserProfile) {
      return userProfile?.posts; // Nếu không phải chủ sở hữu, chỉ hiển thị posts công khai
    }
    // Nếu là chủ sở hữu, hiển thị posts hoặc bookmarks tùy thuộc vào tab được chọn
    return activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;
  }, [
    activeTab, // Tính toán lại khi tab thay đổi
    userProfile?.posts, // Tính toán lại khi posts thay đổi
    userProfile?.bookmarks, // Tính toán lại khi bookmarks thay đổi
    isLoggedInUserProfile, // Tính toán lại khi quyền hạn thay đổi
  ]);

  const openPostDialog = (post) => {
    dispatch(setSelectedPost(post));
    setCommentDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <p className="text-red-500">
          {error?.message ? `Failed to load profile: ${error.message}` : "Failed to load profile"}
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-400">User not found</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center mx-auto w-full py-8 px-20 xl:px-4">
      <div className="flex flex-col gap-20 w-full max-w-4xl">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center ">
            <Avatar className="h-32 w-32 ">
              <AvatarImage
                src={userProfile?.profilePic || "/avatar.png"}
                alt="profilephoto"
                className="object-cover rounded-full "
              />
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.fullName}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary" className="h-8">
                      Unfollow
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button className="bg-[#0095F6] hover:bg-[#3192d2] h-8">
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts?.length || 0}{" "}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers?.length || 0}{" "}
                  </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following?.length || 0}{" "}
                  </span>
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                {userProfile?.bio && (
                  <span className="font-semibold">{userProfile.bio}</span>
                )}
                <Badge className="w-fit" variant="secondary">
                  <AtSign />{" "}
                  <span className="pl-1">{userProfile?.fullName}</span>{" "}
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div
            className="flex items-center justify-center gap-10 text-sm"
            role="tablist"
          >
            <button
              role="tab"
              aria-selected={activeTab === "posts"}
              className={`py-3 cursor-pointer transition-colors hover:text-gray-600 ${
                activeTab === "posts" ? "font-bold border-t-2 border-black" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </button>
            {isLoggedInUserProfile && (
              <button
                role="tab"
                aria-selected={activeTab === "saved"}
                className={`py-3 cursor-pointer transition-colors hover:text-gray-600 ${
                  activeTab === "saved"
                    ? "font-bold border-t-2 border-black"
                    : ""
                }`}
                onClick={() => handleTabChange("saved")}
              >
                SAVED
              </button>
            )}
            <button
              className="py-3 cursor-pointer hover:text-gray-600"
              disabled
            >
              REELS
            </button>
            <button
              className="py-3 cursor-pointer hover:text-gray-600"
              disabled
            >
              TAGS
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 ">
            {displayedPost && displayedPost.length > 0 ? (
              displayedPost.map((post) => (
                <div
                  key={post?._id}
                  className="relative group cursor-pointer"
                  onClick={() => openPostDialog(post)}
                >
                  <img
                    src={post.image}
                    alt={post?.caption || "Post image"}
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button
                        className="flex items-center gap-2 hover:text-gray-300"
                        aria-label={`${post?.likes?.length || 0} likes`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart />
                        <span>{post?.likes?.length || 0}</span>
                      </button>
                      <button
                        className="flex items-center gap-2 hover:text-gray-300"
                        aria-label={`${post?.comments?.length || 0} comments`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageCircle />
                        <span>{post?.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-lg font-semibold">No {activeTab} yet</p>
                <p className="text-sm text-center mt-2">
                  {activeTab === "posts"
                    ? "Share your first photo or video"
                    : "Save posts to see them here"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comment Dialog */}
      <CommentDialog
        open={commentDialogOpen}
        setOpen={setCommentDialogOpen}
        addCommentAtDialog={addComment}
        currentUser={authUser}
      />
    </div>
  );
};

export default Profile;
