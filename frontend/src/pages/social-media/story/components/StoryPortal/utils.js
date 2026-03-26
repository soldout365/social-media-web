
import { Timer } from "../../../../../utils/Timer";
import { STORIES_REDUCER_TYPES } from "../../reducers/types.enums";
import { startStoryTransition } from "../../services/startStoryTransition";
import { toggleModal } from "../../services/toggleModal";

export const handleClick = (dispatch) => () => {
  clearTimeout(Timer.id);
  dispatch && toggleModal(dispatch);
};

export const handlePause = (storyTransitionConfig) => () => {
  const { storiesDispatch, timing, inPause, setInPause } =
    storyTransitionConfig;

  if (!inPause) clearTimeout(Timer.id);
  if (inPause)
    Timer.id = setTimeout(startStoryTransition(storyTransitionConfig), timing);

  storiesDispatch?.({ type: STORIES_REDUCER_TYPES.toggleLoading });
  setInPause?.((prev) => !prev);
};
