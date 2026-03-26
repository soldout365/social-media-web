import { STORY_TIMING } from "../../../../../utils/timing";
import { STORIES_REDUCER_TYPES } from "../types.enums";

export const storiesReducer = (state, payload) => {
  const { type, content } = payload;
  const config = payload.config;

  switch (type) {
    case STORIES_REDUCER_TYPES.startTiming:
      return {
        ...state,
        startTiming: Date.now(),
        timing: STORY_TIMING,
      };
    case STORIES_REDUCER_TYPES.setStories:
      return {
        ...state,
        currentStories: content,
      };
    case STORIES_REDUCER_TYPES.toggleLoading: {
      const { loading, timing, startTiming } = state;

      return {
        ...state,
        loading: !loading,
        timing: !loading ? timing - (Date.now() - startTiming) : timing,
        startTiming: Date.now(),
      };
    }
    case STORIES_REDUCER_TYPES.setSingleStory:
      return {
        ...state,
        currentStory: content,
      };
    case STORIES_REDUCER_TYPES.setNewStoriesBatch:
      return {
        ...state,
        currentStory: config.currentStories?.[0],
        currentStories: config.currentStories,
      };
    default:
      return state;
  }
};
