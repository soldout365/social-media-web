import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
// import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "@/components/ui/badge";
// import CommentDialog from "../comment/CommentDialog";

const Post = () => {
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              //  src={post.author?.profilePicture}
              alt="post_image"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            {/* <h1>{post.author?.username}</h1>
            {user?._id === post.author._id && (
              <Badge variant="secondary">Author</Badge>
            )} */}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {/* {post?.author?._id !== user?._id &&
             (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )} */}

            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favorites
            </Button>
            {/* {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit"
              >
                Delete
              </Button>
            )} */}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        // src={post.image}
        alt="post_img"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {/* {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={"24"}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
            />
          )} */}

          <MessageCircle
            onClick={() => {
              // dispatch(setSelectedPost(post));
              // setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark
          // onClick={bookmarkHandler}
          className="cursor-pointer hover:text-gray-600"
        />
      </div>
      {/* <span className="font-medium block mb-2">{postLike} likes</span> */}
      {/* <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p> */}
      {/* {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {comment.length} comments
        </span>
      )} */}
      {/* <CommentDialog
       open={open} setOpen={setOpen}
      /> */}
      <div className="flex items-center justify-between">
        {/* <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            // onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )} */}
      </div>
    </div>
  );
};

export default Post;
