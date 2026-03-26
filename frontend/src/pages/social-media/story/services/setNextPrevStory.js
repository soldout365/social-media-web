// eslint-disable-next-line import/namespace
import { Timer } from "../../../../utils/Timer";
import { getCurrentStory } from "../components/StoriesHover/utils";
import { REDUCER_TYPES, STORIES_REDUCER_TYPES } from "../reducers/types.enums";

export const setNextPrevStory = (config) => {
  const {
    currentStories,
    currentStory,
    direction,
    storiesDispatch,
    dispatch,
    userId,
    followedUsers,
  } = config;

  const { currentStoryIndex } = getCurrentStory(currentStories, currentStory);
  const endBannerTransition = () => {
    const spanEl = document.getElementById(currentStory);
    spanEl?.classList.remove("animation-pause");
    spanEl?.classList.remove("story-hover-transition");

    if (direction === "right") {
      spanEl?.classList.add("transition-finished");
    } else {
      const prevSpanEl = document.getElementById(
        currentStories[currentStoryIndex - 1],
      );
      prevSpanEl?.classList.remove("story-hover-transition");
    }
  };

  if (direction === "left") {
    const storiesInLeft = currentStoryIndex > 0;
    const currentAuthorIndex = followedUsers.findIndex((u) => u._id === userId);
    const authorsInLeft = currentAuthorIndex > 0;
    const goingLeft = storiesInLeft || authorsInLeft;

    if (goingLeft) {
      if (storiesInLeft) {
        endBannerTransition();
        storiesDispatch?.({
          type: STORIES_REDUCER_TYPES.setSingleStory,
          content: currentStories[currentStoryIndex - 1],
        });
      } else if (authorsInLeft) {
        const prevUser = followedUsers[currentAuthorIndex - 1];

        dispatch?.({
          type: REDUCER_TYPES.setModalUser,
          config: {
            userId: prevUser._id,
            userName: prevUser.fullName,
          },
        });
      }
      clearTimeout(Timer.id);
    }
  } else {
    const storiesInRight = currentStoryIndex < currentStories.length - 1;
    const currentAuthorIndex = followedUsers.findIndex((u) => u._id === userId);
    const authorsInRight = currentAuthorIndex < followedUsers.length - 1;
    const goingRight = storiesInRight || authorsInRight;

    if (goingRight) {
      if (storiesInRight) {
        endBannerTransition();
        storiesDispatch?.({
          type: STORIES_REDUCER_TYPES.setSingleStory,
          content: currentStories[currentStoryIndex + 1],
        });
      } else if (authorsInRight) {
        const nextUser = followedUsers[currentAuthorIndex + 1];

        dispatch?.({
          type: REDUCER_TYPES.setModalUser,
          config: {
            userId: nextUser._id,
            userName: nextUser.fullName,
          },
        });
      }
      clearTimeout(Timer.id);
    }
  }
};
