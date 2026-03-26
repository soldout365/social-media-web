import toast from "react-hot-toast";

export const showError = (message: string) => {
  toast.error(message, {
    id: "error-toast",
  });
};

export const showSuccess = (message: string) => {
  toast.success(message, {
    id: "success-toast",
  });
};

export const showLoading = (message: string) => {
  return toast.loading(message, {
    id: "loading-toast",
  });
};

export const dismissToast = (id?: string) => {
  if (id) {
    toast.dismiss(id);
  } else {
    toast.dismiss();
  }
};
