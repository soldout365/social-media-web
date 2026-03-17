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

  // Ref cho element trigger load more
  const loadMoreRef = useRef(null);

  // Flatten all posts from all pages
  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  // Intersection Observer để detect khi scroll gần hết
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
        rootMargin: "500px", // Load trước 500px để smooth hơn
      }
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

                {/* Inject AdPost every 3 regular posts */}
                {(index + 1) % 3 === 0 && <AdPost />}

                {/* Trigger load more khi còn 4 bài viết nữa là hết danh sách hiện tại (index === allPosts.length - 4) */}
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

            {/* Loading indicator */}
            {isFetchingNextPage && (
              <div className="py-4 text-center text-gray-400">
                Đang tải thêm...
              </div>
            )}

            {/* Thông báo đã hết posts */}
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
