import { toast } from "@shared/ui/components/sonner";

export const toastErrorMessage = (msg: string | Array<string>) => {
  if (Array.isArray(msg)) {
    toast.error(msg.join(", "));
  } else {
    toast.error(msg);
  }
};
