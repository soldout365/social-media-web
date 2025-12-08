import React from "react";
import { useSelector } from "react-redux";

const Posts = () => {
  //   const { posts } = useSelector((store) => store.post);

  return (
    <div className="flex-1 my-8 flex flex-col items-center pl-[20%]">
      <div>
        {/* {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))} */}
      </div>
    </div>
  );
};

export default Posts;
