import { useRef } from "react";

export const useClickSound = () => {
  const clickSound = useRef(new Audio("/sounds/mouse-click.mp3"));

  const playClick = () => {
    const audio = clickSound.current;
    audio.currentTime = 0;
    audio.play().catch((error) => console.error("failed change sound", error));
  };

  return playClick;
};
