import { createContext, useReducer, useMemo } from "react";
import { REDUCER_TYPES } from "../reducers/types.enums";

export const AppContext = createContext(null);

const initialState = {
  modal: {
    isOpen: false,
    userName: "",
    userId: null,
  },
};

const appReducer = (state, action) => {
  const { type, config } = action;

  switch (type) {
    case REDUCER_TYPES.toggleModal:
      return {
        ...state,
        modal: {
          ...state.modal,
          isOpen: !state.modal.isOpen,
          userName: config?.userName || state.modal.userName,
          userId: config?.userId || state.modal.userId,
        },
      };
    case REDUCER_TYPES.setModalUser:
      return {
        ...state,
        modal: {
          ...state.modal,
          userName: config?.userName,
          userId: config?.userId,
        },
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const { isOpen, userName, userId } = state.modal;

  const contextValue = useMemo(
    () => ({
      modal: { isOpen, userName, userId },
      dispatch,
    }),
    [isOpen, userName, userId],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
