import { toast } from "sonner";

export const getErrorMessage = (error: any) => {
  if (error.response) {
    if (error.response.data.detail) {
      toast.error(error.response.data.detail);
      return;
    }
    if (error.response.data.message) {
      toast.error(error.response.data.message);
      return;
    }

    toast.error(JSON.stringify(error.response.data));
  }

  return error.message;
};
