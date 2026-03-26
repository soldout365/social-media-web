import React, { useContext, useEffect, useMemo } from "react";
import { MdOutlineClear } from "react-icons/md";
import { FaPause, FaPlay } from "react-icons/fa";
import { PostIcon } from "../PostIcon";
import { StoryBubble } from "../StoryBubble";
import { StoriesHover } from "../StoriesHover/StoriesHover";

import { StoriesContext } from "../../contexts/StoriesContext";
import { AppContext } from "../../contexts/context";

import { handlePause, handleClick } from "./utils";
import { useStoryPause } from "../../hooks/useStoryPause";

import { Timer } from "../../../../../utils/Timer";

const StoryPortalContent = () => {
  const {
    storiesStateInitialValue,
    storyTransitionConfig,
    inPause,
    dispatch,
    userName,
    userAvatar,
    userId,
    followedUsers,
    userProfile,
  } = useStoryPause();

  const {
    storiesDispatch,
    currentStories,
    currentStory,
    timing,
    loading,
    startTiming,
  } = storiesStateInitialValue;

  useEffect(() => {
    return () => {
      clearTimeout(Timer.id);
    };
  }, [userId]);

  const storiesContextValue = useMemo(
    () => ({
      storiesDispatch,
      currentStories,
      currentStory,
      timing,
      loading,
      startTiming,
      followedUsers,
      userProfile,
    }),
    [
      storiesDispatch,
      currentStories,
      currentStory,
      timing,
      loading,
      startTiming,
      followedUsers,
      userProfile,
    ],
  );

  return (
    <StoriesContext.Provider value={storiesContextValue}>
      <section className="fixed top-0 left-[15.5%] w-[84.5%] h-screen bg-black z-50 flex items-center justify-center">
        <StoriesHover>
          <div className="p-3 flex justify-between items-center">
            <StoryBubble
              imgUrl={userAvatar}
              userName={userName}
              userId={userId}
              isPost={true}
              width="w-10"
              height="h-10"
            />

            <div className="flex items-center space-x-2">
              <button onClick={handlePause(storyTransitionConfig)}>
                <PostIcon
                  iconFn={() => (inPause ? FaPlay : FaPause)}
                  iconSize="text-sm"
                  iconSizeMd="text-xl"
                />
              </button>

              <button onClick={handleClick(dispatch)}>
                <PostIcon iconFn={() => MdOutlineClear} />
              </button>
            </div>
          </div>
        </StoriesHover>
      </section>
    </StoriesContext.Provider>
  );
};

const StoryPortal = () => {
  const { modal } = useContext(AppContext);
  if (!modal.isOpen) return null;
  return <StoryPortalContent />;
};

export { StoryPortal };
