import { useMutation } from "@tanstack/react-query";
import { login } from "~/api/auth";
import { loginSchema } from "~/schemas/auth";

const useAuthMutations = () => {
  const loginMutation = useMutation({
    mutationFn: login,
    onMutate: async (data) => {
      await loginSchema.parseAsync(data);
    },
  });

  return {
    loginMutation,
  };
};

export default useAuthMutations;
