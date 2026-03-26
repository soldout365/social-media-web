export type User = {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
  messages: string[];
  followers: string[];
  following: string[];
  bio?: string;
  gender?: string;
  posts: string[];
  bookmarks: string[];
};
