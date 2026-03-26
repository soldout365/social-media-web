import React, { useEffect, useRef } from "react";
import Post from "./Post";
import AdPost from "./AdPost";
import { useGetAllPosts } from "@/hooks/posts/usePost";

const Posts = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetAllPosts();

  const loadMoreRef = useRef(null);

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "500px", 
      },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex-1 my-8 flex flex-col items-center px-[10%]">
        <div className="text-gray-400">Đang tải bài viết...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 my-8 flex flex-col items-center px-[10%]">
        <div className="text-red-400">Lỗi khi tải bài viết</div>
      </div>
    );
  }

  return (
    <div className="flex-1 my-8 flex flex-col items-center px-[10%]">
      <div className="w-full max-w-[500px]">
        {allPosts.length > 0 ? (
          <>
            {allPosts.map((post, index) => (
              <React.Fragment key={post._id}>
                <Post post={post} />

                {}
                {(index + 1) % 3 === 0 && <AdPost />}

                {}
                {hasNextPage &&
                  !isFetchingNextPage &&
                  index === allPosts.length - 4 && (
                    <div
                      ref={loadMoreRef}
                      className="h-1"
                      style={{ visibility: "hidden" }}
                    />
                  )}
              </React.Fragment>
            ))}

            {}
            {isFetchingNextPage && (
              <div className="py-4 text-center text-gray-400">
                Đang tải thêm...
              </div>
            )}

            {}
            {!hasNextPage && allPosts.length > 0 && (
              <div className="py-4 text-center text-gray-500 text-sm">
                Bạn đã xem hết các bài viết
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-400">Không có bài viết nào</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
