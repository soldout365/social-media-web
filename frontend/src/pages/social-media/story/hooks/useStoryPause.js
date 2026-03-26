import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { STORIES_REDUCER_TYPES } from "../reducers/types.enums";
import { getCurrentStory } from "../components/StoriesHover/utils";
import { storiesReducer } from "../reducers/storiesReducer";
import { getInitialValue } from "../reducers/storiesReducer/getInitialValue";
import { AppContext } from "../contexts/context";
import {
  useGetFollowingOfUser,
  useGetUserProfile,
} from "@/hooks/users/useUser";

export const useStoryPause = () => {
  const { data: followingData } = useGetFollowingOfUser();

  const followedUsers = useMemo(() => {
    if (!followingData?.pages) return [];
    return followingData.pages.flatMap((page) => page.users);
  }, [followingData]);

  const {
    dispatch,
    modal: { userName, userId },
  } = useContext(AppContext);

  const { data: userProfile } = useGetUserProfile(userId);
  const STORIES = useMemo(() => {
    return userProfile?.posts?.map((post) => post.image) || [];
  }, [userProfile]);

  const [inPause, setInPause] = useState(false);
  const initialStories = STORIES;
  const storiesInitialValue = getInitialValue(initialStories, userId);

  const [storiesState, storiesDispatch] = useReducer(
    storiesReducer,
    storiesInitialValue,
  );
  const storiesStateInitialValue = useMemo(
    () => ({ ...storiesState, storiesDispatch }),
    [storiesState, storiesDispatch],
  );
  const { timing, currentStories, currentStory } = storiesState;
  const { currentStoryIndex } = getCurrentStory(currentStories, currentStory);

  const storyTransitionConfig = useMemo(
    () => ({
      userId,
      storiesDispatch,
      dispatch,
      currentStories,
      currentStoryIndex,
      timing,
      inPause,
      setInPause,
      userProfile,
      followedUsers,
    }),
    [
      userId,
      storiesDispatch,
      dispatch,
      currentStories,
      currentStoryIndex,
      timing,
      inPause,
      setInPause,
      userProfile,
      followedUsers,
    ],
  );

  const { profilePic: userAvatar } = followedUsers.find(
    (user) => user.fullName === userName,
  );

  useEffect(() => {
    setInPause((prev) => {
      if (prev) {
        storiesDispatch({ type: STORIES_REDUCER_TYPES.toggleLoading });
        return false;
      }
      return prev;
    });
  }, [currentStory, storiesDispatch]);

  const prevUserIdRef = React.useRef(null);
  const prevStoriesRef = React.useRef(null);

  useEffect(() => {

    if (
      userProfile?._id &&
      STORIES &&
      STORIES.length > 0 &&
      (userProfile._id !== prevUserIdRef.current ||
        STORIES !== prevStoriesRef.current)
    ) {
      storiesDispatch({
        type: STORIES_REDUCER_TYPES.setNewStoriesBatch,
        config: { currentStories: STORIES },
      });
      prevUserIdRef.current = userProfile._id;
      prevStoriesRef.current = STORIES;
    }
  }, [userProfile?._id, STORIES]);

  return {
    storiesStateInitialValue,
    storyTransitionConfig,
    inPause,
    dispatch,
    userAvatar,
    userName,
    userId,
    followedUsers,
    userProfile,
  };
};
