import { AUTH_TOKEN } from "~/lib/constants";
import { storage } from "~/lib/storage";

export const updateAuthToken = (token: string) => {
  storage.set(AUTH_TOKEN, token);
};
