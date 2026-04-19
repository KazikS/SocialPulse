import { clsx } from "clsx";

import { MotionBox } from "../MotionBox";
import styles from "./StatusIndicator.module.scss";

export type StatusIndicatorVariant = "success" | "disabled" | "error";

type StatusIndicatorProps = {
  variant: StatusIndicatorVariant;
};

export const StatusIndicator = ({ variant }: StatusIndicatorProps) => {
  return (
    <MotionBox
      className={clsx(styles.indicator, styles[variant])}
      animate={{ opacity: [0.2, 1, 0.2] }}
      transition={{
        duration: 3,
        ease: "easeInOut",
        times: [0, 0.5, 1],
        repeat: Infinity,
        repeatDelay: 0,
      }}
    />
  );
};
