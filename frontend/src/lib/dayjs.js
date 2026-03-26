import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export const formatTimeAgo = (timestamp) => {
  return dayjs(timestamp).fromNow();
};

export const formatTimeAgoEn = (timestamp) => {
  dayjs.locale("en");
  return dayjs(timestamp).fromNow();
};
