import { clsx } from "clsx";

import styles from "./PlatformItem.module.scss";

type PlatformItemProps = {
  icon: string;
  name: string;
  isActive?: boolean;
};

export const PlatformItem = ({ icon, name, isActive }: PlatformItemProps) => {
  return (
    <div className={clsx(styles.wrapper, isActive ? styles.active : undefined)}>
      <img className={styles.icon} src={`/platforms/${icon}.svg`} />
      <div className={styles.name}>{name}</div>
    </div>
  );
};
