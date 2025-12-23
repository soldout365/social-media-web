import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { readFileAsDataURL } from "@/utils/readFileAsDataUrl";
import { useCreatePost } from "@/hooks/posts/usePost";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();

  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const { authUser } = useAuthStore();

  const { createPost, loading } = useCreatePost();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    try {
      await createPost(caption, file);
      setOpen(false);
      setCaption("");
      setFile("");
      setImagePreview("");
      toast.success("Tạo bài viết thành công");
    } catch (error) {
      console.error("Error creating post:", error);
      setOpen(false);
      toast.error("Có lỗi xảy ra vui lòng thử lại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-lg"
      >
        <DialogHeader className="text-center font-bold text-xl border-b pb-4">
          Tạo bài viết mới
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex gap-3 items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={
                  authUser?.profilePicture ||
                  authUser?.profilePic ||
                  "/avatar.png"
                }
                alt="img"
                className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px] object-cover "
              />
              <AvatarFallback className="text-sm font-semibold">
                {authUser?.fullName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-sm">{authUser?.fullName}</h1>
              <span className="text-gray-500 text-xs">{authUser?.bio}</span>
            </div>
          </div>

          {/* Caption Input */}
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="focus-visible:ring-transparent border-none resize-none bg-gray-50 text-base placeholder:text-gray-400 min-h-24"
            placeholder="Bạn đang nghĩ gì?"
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="w-full rounded-lg overflow-hidden bg-gray-100">
              <img
                src={imagePreview}
                alt="preview_img"
                className="object-cover h-72 w-full"
              />
            </div>
          )}

          {/* Hidden Input */}
          <input
            ref={imageRef}
            type="file"
            className="hidden"
            onChange={fileChangeHandler}
          />

          {/* Action Buttons */}
          <div className="space-y-3 pt-2 border-t">
            <Button
              onClick={() => imageRef.current.click()}
              variant="outline"
              className="w-full gap-2 border-gray-300 hover:bg-gray-50"
            >
              <ImageIcon className="h-4 w-4" />
              Chọn ảnh
            </Button>

            {imagePreview && (
              <Button
                onClick={createPostHandler}
                disabled={loading || !caption.trim()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold h-10"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng...
                  </>
                ) : (
                  "Đăng bài"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
