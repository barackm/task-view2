import { z } from "zod";
import { LoginResponse } from "~/interfaces/auth";
import { http } from "~/lib/http";
import { loginSchema } from "~/schemas/auth";

export const login = async (
  data: z.infer<typeof loginSchema>
): Promise<LoginResponse> => {
  const response = await http.post("/auth/login", data);
  return response.data;
};
