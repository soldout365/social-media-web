import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";

const Comment = ({ comment }) => {
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage src={comment?.author?.profilePic || "/avatar.png"} />
        </Avatar>
        <h1 className="font-bold text-sm">
          {comment?.author?.fullName}{" "}
          <span className="font-normal pl-1">{comment?.text}</span>
        </h1>
      </div>
    </div>
  );
};

export default Comment;
