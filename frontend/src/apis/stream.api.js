import { axiosInstance } from "../lib/axios";

export const streamApi = {
  getStreamToken: async () => {
    const response = await axiosInstance.get("/stream/token");
    return response.data;
  },
};
