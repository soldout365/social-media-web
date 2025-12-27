import { initTransition } from "../StoriesHover/utils";
// eslint-disable-next-line import/namespace
import { Timer } from "../../../../../utils/Timer";
import { startStoryTransition } from "../../services/startStoryTransition";
import { STORY_TIMING } from "../../../../../utils/timing";
import { STORIES_REDUCER_TYPES } from "../../reducers/types.enums";

export const handleLoad = (configStoryTransition) => () => {
  const { currentStories, currentStoryIndex, storiesDispatch } =
    configStoryTransition;

  initTransition(currentStories[currentStoryIndex]);
  Timer.id = setTimeout(startStoryTransition(configStoryTransition), STORY_TIMING);
  storiesDispatch?.({ type: STORIES_REDUCER_TYPES.startTiming });
};
