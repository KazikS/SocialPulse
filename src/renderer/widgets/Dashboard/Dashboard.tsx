import styles from "./Dashboard.module.scss";
import { Chart } from "./ui/Chart/Chart";
import { PlatformCardRow } from "./ui/PlatformsCards/PlatformCardRow";

export const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <PlatformCardRow />
      <div className={styles.statsBlock}>
        <Chart />
        <div></div>
      </div>
    </div>
  );
};
