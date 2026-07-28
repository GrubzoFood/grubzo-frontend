import { createContext } from "react";
import type { ReactElement } from "react";

export interface NotificationInjectedProps {
  visible?: boolean;
  setVisible?: (open: boolean) => void;
}

export type NotificationElement = ReactElement<
  NotificationInjectedProps & Record<string, unknown>
>;

export interface NotificationContextProps {
  showNotification: (
    Component: NotificationElement,
    props?: Record<string, unknown>
  ) => void;
  hideNotification: () => void;
}

export const NotificationContext = createContext<
  NotificationContextProps | undefined
>(undefined);
