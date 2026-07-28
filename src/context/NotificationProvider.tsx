import React, { useState, useCallback } from "react";
import type { ReactNode } from "react";
import {
  NotificationContext,
  type NotificationElement,
} from "./notificationContext";

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [Component, setComponent] = useState<NotificationElement | null>(null);
  const [componentProps, setComponentProps] = useState<Record<string, unknown>>(
    {}
  );

  const showNotification = useCallback(
    (Comp: NotificationElement, props: Record<string, unknown> = {}) => {
      setComponent(Comp);
      setComponentProps(props);
      setVisible(true);
    },
    []
  );

  const hideNotification = useCallback(() => {
    setVisible(false);
    setComponent(null);
    setComponentProps({});
  }, []);

  const notificationWrapper = Component
    ? React.cloneElement(Component, {
        ...componentProps,
        visible,
        setVisible,
      })
    : null;

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {children}
      {notificationWrapper}
    </NotificationContext.Provider>
  );
};
