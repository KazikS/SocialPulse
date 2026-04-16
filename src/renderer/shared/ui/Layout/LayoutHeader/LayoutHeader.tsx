import { ReactNode } from "react";
import styles from "./LayoutHeader.module.scss";

type LayoutHeaderProps = {
  title: string;
  subtitle?: ReactNode;
  controls?: ReactNode;
};

export const LayoutHeader = ({
  title,
  subtitle,
  controls,
}: LayoutHeaderProps) => {
  return (
    <header className={styles.wrapper}>
      <div className={styles.left}>
        <h1>{title}</h1>
        <div className={styles.subtitle}>{subtitle}</div>
      </div>
      <div className={styles.right}>{controls}</div>
    </header>
  );
};
