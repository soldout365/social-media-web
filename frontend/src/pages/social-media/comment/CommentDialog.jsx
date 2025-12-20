import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetAllCommentsOfPost } from "@/hooks/posts/usePost";
import Comment from "./Comment";

const CommentDialog = ({ open, setOpen, addCommentAtDialog, currentUser }) => {
  const [text, setText] = useState("");
  const { selectedPost } = useSelector((store) => store.post);

  // Fetch comments mới nhất khi dialog mở
  const { data: commentsData, isLoading: isLoadingComments } =
    useGetAllCommentsOfPost(selectedPost?._id, {
      enabled: open && !!selectedPost?._id,
    });

  // Sử dụng comments từ API hoặc fallback về selectedPost.comments
  const comments = commentsData?.comments || selectedPost?.comments || [];

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText);
  };

  const handleCommentSubmit = () => {
    if (text.trim()) {
      addCommentAtDialog({ postId: selectedPost._id, text });
      setText("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-4xl p-0 flex flex-col h-[600px] bg-black border-gray-700  "
      >
        <div className="flex flex-1 overflow-hidden">
          {/* ===== PHẦN HÌNH ẢNH (LEFT) ===== */}
          <div className="w-1/2 flex items-center justify-center bg-black">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-full object-cover"
            />
          </div>

          {/* ===== PHẦN BÌNH LUẬN (RIGHT) ===== */}
          <div className="w-1/2 flex flex-col bg-black text-white border-l border-gray-700">
            {/* HEADER: Thông tin tác giả */}
            {selectedPost?.caption && (
              <div className="px-4 py-3 border-b border-gray-700">
                <div className="flex gap-2">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage
                      src={selectedPost?.author?.profilePic || "/avatar.png"}
                      alt="author"
                    />
                    <AvatarFallback>
                      {selectedPost?.author?.fullName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-semibold">
                        {selectedPost?.author?.fullName}
                      </span>
                      <span className="text-gray-300 ml-2">
                        {selectedPost?.caption}
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      1 giờ trước
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-white">⋯</button>
                </div>
              </div>
            )}

            {/* COMMENTS SECTION: Danh sách bình luận */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {isLoadingComments ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : comments && comments.length > 0 ? (
                comments.map((cmt) => (
                  <div key={cmt._id} className="flex gap-2">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage
                        src={cmt?.author?.profilePic || "/avatar.png"}
                        alt="commenter"
                      />
                      <AvatarFallback>
                        {cmt?.author?.fullName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-900 rounded-2xl px-3 py-2">
                        <div className="font-semibold text-sm">
                          {cmt?.author?.fullName}
                        </div>
                        <div className="text-sm text-gray-300">{cmt?.text}</div>
                      </div>
                      <div className="text-gray-500 text-xs mt-1 px-3">
                        {/* NEW: Có thể thêm timestamp */}
                      </div>
                    </div>
                    {/* NEW: Like button cho comment */}
                    <Heart
                      size={16}
                      className="text-gray-500 cursor-pointer hover:text-red-600 mt-2"
                    />
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 text-sm py-4">
                  Chưa có bình luận nào
                </div>
              )}
            </div>

            {/* ACTION BAR: Like, Comment, Share */}
            <div className="px-4 py-3 border-t border-b border-gray-700 flex gap-4">
              <Heart size={20} className="cursor-pointer hover:text-gray-400" />
              <MessageCircle
                size={20}
                className="cursor-pointer hover:text-gray-400"
              />
              <Share2
                size={20}
                className="cursor-pointer hover:text-gray-400"
              />
            </div>

            {/* LIKES COUNT */}
            <div className="px-4 py-2 text-sm font-semibold">
              {selectedPost?.likes?.length || 0} lượt thích
            </div>

            {/* INPUT COMMENT: Nhập bình luận */}
            <div className="px-4 py-3 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={currentUser?.profilePic || "/avatar.png"}
                    alt="user"
                  />
                </Avatar>
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                  placeholder="Bình luận…"
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
                />
                {text.trim() && (
                  <button
                    onClick={handleCommentSubmit}
                    className="text-blue-400 hover:text-blue-300 font-semibold text-sm"
                  >
                    Đăng
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
