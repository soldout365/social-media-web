import { StoryBubble } from "./StoryBubble";
import { useGetFollowingOfUser } from "@/hooks/users/useUser";
import { useMemo } from "react";

const Stories = () => {
  const {
    data: followingData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetFollowingOfUser();

  const followedUsers = useMemo(() => {
    if (!followingData?.pages) return [];
    return followingData.pages.flatMap((page) => page.users);
  }, [followingData]);

  if (!followedUsers || followedUsers.length === 0) {
    return <section className="pl-5 pb-1 text-gray-500 text-sm"></section>;
  }

  return (
    <section className="pl-5 flex space-x-3 pb-1 md:space-x-4 overflow-x-auto">
      {followedUsers.map((user) => (
        <StoryBubble
          key={user._id}
          imgUrl={user.profilePic}
          userName={user.fullName}
          userId={user._id}
        />
      ))}

      {}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="flex-shrink-0 w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full text-white text-xs transition-colors disabled:opacity-50 text-center"
        >
          {isFetchingNextPage ? "Đang tải..." : "Xem thêm"}
        </button>
      )}
    </section>
  );
};

export { Stories };
