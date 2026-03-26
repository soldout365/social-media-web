import { getInitialClassName } from "./utils";
import { useContext, useMemo } from "react";
import { StoriesContext } from "../../contexts/StoriesContext";
import { AppContext } from "../../contexts/context";
import { useGetSuggestedUsers } from "@/hooks/users/useUser";
import { setNextPrevStory } from "../../services/setNextPrevStory";
import { useAuthStore } from "@/store/auth.store";

const StoryButton = ({ children, direction = "right" }) => {
  const { userId, currentStories, currentStory, storiesDispatch, userProfile } =
    useContext(StoriesContext);
  const { dispatch } = useContext(AppContext);

  const { authUser } = useAuthStore();
  const { data: suggestedUsers = [] } = useGetSuggestedUsers();
  const followedUsers = useMemo(() => {
    if (!authUser?.following || !suggestedUsers) return suggestedUsers;

    return suggestedUsers.filter((user) =>
      authUser.following.includes(user._id),
    );
  }, [suggestedUsers, authUser?.following]);

  const nextPrevStoryConfig = {
    direction,
    userId,
    currentStories,
    currentStory,
    storiesDispatch,
    dispatch,
    userProfile,
    followedUsers,
  };

  const handleChangeStory = (triggerEl) => {
    if (window.screen.width >= 640 && triggerEl === "container") return;
    setNextPrevStory(nextPrevStoryConfig);
  };

  return (
    <div
      className={getInitialClassName(direction)}
      onClick={() => handleChangeStory("container")}
    >
      <button
        className="bg-black rounded-full hidden sm:block"
        onClick={() => handleChangeStory("wrapper")}
      >
        {children}
      </button>
    </div>
  );
};

export { StoryButton };
