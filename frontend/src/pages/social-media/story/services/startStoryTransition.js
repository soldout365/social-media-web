import { REDUCER_TYPES, STORIES_REDUCER_TYPES } from "../reducers/types.enums";
import { toggleModal } from "./toggleModal";

export const startStoryTransition = (config) => () => {
  const {
    currentStoryIndex,
    currentStories,
    storiesDispatch,
    dispatch,
    userId,

    followedUsers,
  } = config;

  const storiesRemaining = currentStoryIndex < currentStories.length - 1;

  if (storiesRemaining) {
    const newIndex = currentStoryIndex + 1;

    storiesDispatch?.({
      type: STORIES_REDUCER_TYPES.setSingleStory,
      content: currentStories[newIndex],
    });
  }

  if (!storiesRemaining) {
    const currentAuthorIndex = followedUsers.findIndex((u) => u._id === userId);
    const moreUsersStories = currentAuthorIndex < followedUsers.length - 1;

    if (moreUsersStories) {
      const nextUser = followedUsers[currentAuthorIndex + 1];

      dispatch?.({
        type: REDUCER_TYPES.setModalUser,
        config: {
          userId: nextUser._id,
          userName: nextUser.fullName,
        },
      });
    }

    if (!moreUsersStories) toggleModal(dispatch);
  }
};
