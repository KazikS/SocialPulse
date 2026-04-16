import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./Button.module.scss";

type ButtonProps = {
  children: ReactNode;
  variant: "solid" | "ghost" | "outline";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, variant = "solid" }: ButtonProps) => {
  return (
    <button className={clsx(styles.button, styles[variant])}>{children}</button>
  );
};
