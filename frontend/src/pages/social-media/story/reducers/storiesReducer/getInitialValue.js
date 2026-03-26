import { STORY_TIMING } from "../../../../../utils/timing";

export const getInitialValue = (currentStories, userId) => {
  return {
    userId,
    currentStories,
    currentStory: currentStories[0],
    storiesDispatch: null,
    loading: false,
    timing: STORY_TIMING,
    startTiming: 0,
  };
};
