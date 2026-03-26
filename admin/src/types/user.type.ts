import type { ERole } from "./role.type";

export type TLogin = {
  email: string;
  password: string;
};

export type TUser = {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
  bio: string;
  followers: string[];
  following: string[];
  posts: string[];
  role: ERole;
};
