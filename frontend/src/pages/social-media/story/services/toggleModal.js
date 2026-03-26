import { toggleOverflowHidden } from "./toggleOverflowHidden";
import { REDUCER_TYPES } from "../reducers/types.enums";

export const toggleModal = (dispatch, config) => {
  toggleOverflowHidden("body");
  if (dispatch) dispatch({ type: REDUCER_TYPES.toggleModal, config });
};
