import { useContext } from "react";
import { AppContext } from "../contexts/context";
import { toggleModal } from "../services/toggleModal";

const StoryBubble = ({
  imgUrl,
  userName,
  userId,
  width = "w-16",
  height = "h-16",
  isPost = false,
}) => {
  const { dispatch } = useContext(AppContext);
  const handleClick = () =>
    dispatch &&
    toggleModal(dispatch, {
      userName,
      userId,
    });

  return (
    <div
      className={`flex items-center ${
        isPost ? "flex-row space-x-3" : "flex-col cursor-pointer space-y-1.5"
      }`}
      onClick={!isPost ? handleClick : undefined}
    >
      <div
        className={`${width} ${height} ${
          !isPost && "md:w-20 md:h-20"
        } p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 flex-shrink-0`}
      >
        <div className="w-full h-full rounded-full bg-black p-[2px]">
          <img
            src={imgUrl || "/avatar.png"}
            alt={userName}
            className="w-full h-full rounded-full object-cover bg-gray-800"
          />
        </div>
      </div>

      <h3
        className={`text-white truncate ${
          isPost
            ? "text-base font-bold"
            : "text-[11px] md:text-xs font-medium w-16 md:w-20 text-center"
        }`}
      >
        {userName}
      </h3>
    </div>
  );
};

export { StoryBubble };
