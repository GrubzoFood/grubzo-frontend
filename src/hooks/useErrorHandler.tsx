import { useNotification } from "./useNotification";
import type { ErrorResponse } from "../types/common";
import { useCallback } from "react";
import NotificationToggle from "../components/common/NotificationToggle";

function isErrorResponse(error: unknown): error is ErrorResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    "Error" in error &&
    typeof (error as { Error?: unknown }).Error === "string"
  );
}

export const useErrorHandler = () => {
  const { showNotification } = useNotification();

  const showError = useCallback((error: unknown) => {
    let message = "Something went wrong";
    if (typeof error === "string") message = error;
    if (isErrorResponse(error)) message = error.Error;
    if (message) {
      message = message.charAt(0).toLocaleUpperCase() + message.slice(1);
    }
    showNotification(<NotificationToggle message={message} color="danger" />);
  }, [showNotification]);

  const showSuccess = useCallback((message: string) => {
    showNotification(
      <NotificationToggle message={message} color="success" />
    );
  }, [showNotification]);

  return { showError, showSuccess };
};
