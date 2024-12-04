import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const http = {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
};
