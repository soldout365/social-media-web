export const initTransition = (spanId) => {
  const spanTransition = document.getElementById(spanId);
  spanTransition?.classList.add("story-hover-transition");
};

export const getCurrentStory = (stories, current) => {
  const currentStoryIndex = stories.findIndex((story) => story === current);
  return {
    currentStoryIndex,
    currentStory: stories[currentStoryIndex],
  };
};
