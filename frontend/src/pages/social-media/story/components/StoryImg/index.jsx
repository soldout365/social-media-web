import { useContext } from "react";
import { getCurrentStory } from "../StoriesHover/utils";

import { AppContext } from "../../contexts/context";
import { StoriesContext } from "../../contexts/StoriesContext";
import { handleLoad } from "./utils";

import { StoryButton } from "../StoryButton";
import { ConditionalNode } from "../ConditionalNode";

import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";

const StoryImg = ({ imgUrl, children }) => {
  const {
    dispatch,
    modal: { userId },
  } = useContext(AppContext);
  const { storiesDispatch, currentStories, followedUsers, userProfile } =
    useContext(StoriesContext);

  const { currentStoryIndex } = getCurrentStory(currentStories, imgUrl);

  const currentAuthorIndex = followedUsers.findIndex((u) => u._id === userId);

  const isFirstStory = currentStoryIndex <= 0;
  const isFirstAuthor = currentAuthorIndex <= 0;
  const isVeryFirstStory = isFirstAuthor && isFirstStory;
  const isLastStory = currentStoryIndex >= currentStories.length - 1;
  const isLastAuthor = currentAuthorIndex >= followedUsers.length - 1;
  const isVeryLastStory = isLastStory && isLastAuthor;

  const configStoryTransition = {
    userId,
    currentStoryIndex,
    currentStories,
    storiesDispatch,
    dispatch,
    userProfile,
    followedUsers,
  };

  return (
    <div className="mx-auto h-[95vh] max-w-[500px] px-2 relative mt-4 ">
      {children}

      <ConditionalNode condition={!isVeryFirstStory}>
        <StoryButton direction="left">
          <BsFillArrowLeftCircleFill className="text-xl" />
        </StoryButton>
      </ConditionalNode>

      <img
        src={imgUrl}
        alt=""
        className="h-full object-cover object-center rounded-xl"
        onLoad={handleLoad(configStoryTransition)}
      />

      <ConditionalNode condition={!isVeryLastStory}>
        <StoryButton>
          <BsFillArrowRightCircleFill className="text-xl" />
        </StoryButton>
      </ConditionalNode>
    </div>
  );
};

export { StoryImg };
