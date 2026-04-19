import { clsx } from "clsx";
import { ReactNode } from "react";

import styles from "./Card.module.scss";

type CardProps = {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
};

export const Card = ({ children, className, onClick }: CardProps) => {
  return (
    <div className={clsx(styles.wrapper, className)} onClick={onClick}>
      {children}
    </div>
  );
};
