import { clsx } from "clsx";

import styles from "./Divider.module.scss";

type DividerProps = {
  direction?: "horizontal" | "vertical";
};

export const Divider = ({ direction = "horizontal" }: DividerProps) => {
  return <div className={clsx(styles.divider, styles[direction])}></div>;
};
