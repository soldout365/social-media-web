import React from "react";
import { useSelector } from "react-redux";
import Post from "./Post";
import { useGetAllPosts } from "@/hooks/posts/usePost";

const Posts = () => {
  useGetAllPosts();

  const { posts } = useSelector((store) => store.post);

  console.log(posts);

  return (
    <div className="flex-1 my-8 flex flex-col items-center px-[10%]">
      <div>
        {posts && posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p>Không có bài viết</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
