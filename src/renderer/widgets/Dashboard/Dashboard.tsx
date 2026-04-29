import styles from "./Dashboard.module.scss";
import { PlatformCardRow } from "./ui/PlatformsCards/PlatformCardRow";

export const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <PlatformCardRow />
    </div>
  );
};
