import { StreamVideoContext } from "@/contexts/StreamVideoContext";
import { useContext } from "react";

export const useStreamVideo = () => {
  const context = useContext(StreamVideoContext);
  if (!context) {
    throw new Error("useStreamVideo must be used within StreamVideoProvider");
  }
  return context;
};
