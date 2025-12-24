import { StreamVideoProvider } from "@/contexts/StreamVideoContext";

const StreamVideoLayout = ({ children }) => {
  return <StreamVideoProvider>{children}</StreamVideoProvider>;
};

export default StreamVideoLayout;
