import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setSelectedPost } from "@/redux/postSlice";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth.store";
import {
  useAddComment,
  useBookmarkPost,
  useDeletePost,
  useLikeOrDislikePost,
} from "@/hooks/posts/usePost";
import { formatTimeAgo } from "@/lib/dayjs";
import CommentDialog from "../comment/CommentDialog";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { authUser } = useAuthStore();

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  //hook
  const { deletePost, isLoading: isDeleting } = useDeletePost();
  const { mutate: likeOrDislikePost } = useLikeOrDislikePost();
  const { bookmarkPost } = useBookmarkPost();
  const { addComment, isLoading: isAddingComment } = useAddComment();

  // Tính toán trạng thái từ post data
  const isLiked =
    (Array.isArray(post?.likes) && post.likes.includes(authUser?._id)) || false;
  const isBookmarked =
    Array.isArray(authUser?.bookmarks) &&
    authUser.bookmarks.includes(post?._id);
  const likeCount = Array.isArray(post?.likes) ? post.likes.length : 0;
  const commentCount = Array.isArray(post?.comments) ? post.comments.length : 0;

  const likeOrDislikeHandler = () => {
    likeOrDislikePost(post._id);
  };

  const bookmarkHandler = () => {
    bookmarkPost(post._id);
  };

  const deletePostHandler = () => {
    deletePost(post._id);
  };

  const commentHandler = () => {
    if (text.trim()) {
      addComment({ postId: post._id, text });
      setText("");
    }
  };

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const openCommentDialog = () => {
    dispatch(setSelectedPost(post));
    setOpen(true);
  };
  //
  return (
    <div className="mb-8 border-b border-gray-800 pb-4">
      {/* Header bài viết */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={post?.author?.profilePic || "/avatar.png"}
              alt="avatar"
            />
            <AvatarFallback>
              {post?.author?.fullName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                {post?.author?.fullName}
              </span>
              {authUser?._id === post?.author?._id && (
                <span className="text-gray-400 text-xs">• Tác giả</span>
              )}
            </div>
            <span className="text-gray-500 text-xs block">
              {formatTimeAgo(post?.createdAt)}
            </span>
          </div>
        </div>

        {/* Menu 3 chấm */}
        <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
          <DialogTrigger asChild>
            <button className="hover:text-gray-400">⋯</button>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {post?.author?._id !== authUser?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Bỏ theo dõi
              </Button>
            )}
            <Button variant="ghost" className="cursor-pointer w-fit">
              Thêm vào mục yêu thích
            </Button>
            {authUser?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                disabled={isDeleting}
                variant="ghost"
                className="cursor-pointer w-fit"
              >
                {isDeleting ? "Đang xóa..." : "Xóa bài viết"}
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Hình ảnh/ */}
      <img
        className="w-full aspect-[4/5]  object-cover mb-3 bg-gray-900 border-2 border-[#2A2A2A] rounded-[8.5px]"
        src={post?.image}
        alt="post_img"
      />

      {/* Action buttons (Like, Comment, Share, Save) */}
      <div className="flex items-center gap-4 mb-2">
        {isLiked ? (
          <FaHeart
            onClick={likeOrDislikeHandler}
            size={24}
            className="cursor-pointer text-red-600 hover:text-red-500"
          />
        ) : (
          <FaRegHeart
            onClick={likeOrDislikeHandler}
            size={24}
            className="cursor-pointer hover:text-gray-400"
          />
        )}

        <MessageCircle
          onClick={openCommentDialog}
          size={24}
          className="cursor-pointer hover:text-gray-400"
        />
        <Send
          size={24}
          className="cursor-pointer hover:text-gray-400"
          onClick={openCommentDialog}
        />

        <div className="ml-auto">
          <Bookmark
            onClick={bookmarkHandler}
            size={24}
            className={`cursor-pointer transition-all duration-200 ${
              isBookmarked
                ? " drop-shadow-sm fill-current text-gray-400 hover:text-gray-500 scale-110"
                : "hover:text-gray-400 hover:scale-105"
            }`}
          />
        </div>
      </div>

      {/* Số lượt thích */}
      <div className="font-semibold mb-2">{likeCount} lượt thích</div>

      {/* Caption */}
      <div className="text-sm">
        <span className="font-semibold mr-2">{post?.author?.fullName}</span>
        <span className="text-gray-300">{post?.caption}</span>
      </div>

      {/* Xem bình luận */}
      {commentCount > 0 && (
        <button
          onClick={openCommentDialog}
          className="text-gray-400 text-sm mt-1 hover:text-gray-300"
        >
          Xem tất cả {commentCount} bình luận
        </button>
      )}

      <CommentDialog
        open={open}
        setOpen={setOpen}
        addCommentAtDialog={addComment}
        currentUser={authUser}
      />

      <div className="flex items-center gap-2 mt-3 text-sm">
        <input
          type="text"
          placeholder="Bình luận…"
          value={text}
          onChange={changeEventHandler}
          onKeyDown={(e) => e.key === "Enter" && commentHandler()}
          className="flex-1 bg-transparent border-none outline-none text-gray-300 placeholder-gray-500"
          disabled={isAddingComment}
        />
        {text && (
          <span
            onClick={commentHandler}
            className={`text-[#3BADF8] cursor-pointer hover:text-[#258bcf] ${
              isAddingComment ? "opacity-50" : ""
            }`}
          >
            {isAddingComment ? "..." : "Đăng"}
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
