import { axiosInstance } from "../lib/axios";
import type { TLogin, TUser } from "../types/user.type";

export const userApi = {
  login: async (body: TLogin): Promise<TUser> => {
    const response = await axiosInstance.post("/auth/login", body);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post("/auth/logout");
  },
};
