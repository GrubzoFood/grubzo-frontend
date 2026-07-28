import React, { useEffect, useRef, useState } from "react";
import { Snackbar, IconButton, Typography } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";

interface NotificationToggleProps {
  message: string;
  color?: "success" | "danger" | "neutral";
  visible?: boolean;
  setVisible?: (open: boolean) => void;
  duration?: number;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  message,
  color = "success",
  visible = true,
  setVisible,
  duration = 3000,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (visible) {
      timerRef.current = setTimeout(() => setVisible?.(false), duration);
      return () => clearTimeout(timerRef.current!);
    } else if (hovered && timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, [visible, hovered, duration, setVisible]);

  const accentColor =
    color === "danger"
      ? "#E53935"
      : color === "success"
      ? "#43A047"
      : "#9E9E9E";

  return (
    <Snackbar
      open={visible}
      onClose={() => setVisible?.(false)}
      variant="soft"
      color={color}
      endDecorator={
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={() => setVisible?.(false)}
          sx={{
            borderRadius: "50%",
            transition: "background 0.2s",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        transform: "translateY(0)",
        transition: "all 0.3s ease",
        minWidth: 220,
        maxWidth: 340,
        py: 0.65,
        px: 1.5,
        borderRadius: 3,
        boxShadow: "sm",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: accentColor,
          borderTopLeftRadius: "lg",
          borderBottomLeftRadius: "lg",
        },
        "&:hover": {
          cursor: "pointer",
          transform: "translateY(-2px)",
          transition: "transform 0.15s ease",
        },
        zIndex: "4000",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Typography
        level="body-sm"
        sx={{
          fontWeight: 500,
          color:
            color === "danger"
              ? "danger.800"
              : color === "success"
              ? "success.800"
              : "neutral.800",
        }}
      >
        {message}
      </Typography>
    </Snackbar>
  );
};

export default NotificationToggle;
