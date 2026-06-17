import styles from "./Dashboard.module.scss";
import { Chart } from "./ui/Chart/Chart";
import { PlatformCardRow } from "./ui/PlatformsCards/PlatformCardRow";
import { TopSources } from "./ui/TopSources/TopSources";

export const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <PlatformCardRow />
      <section className={styles.statsBlock}>
        <Chart />
        <TopSources />
      </section>
    </div>
  );
};
