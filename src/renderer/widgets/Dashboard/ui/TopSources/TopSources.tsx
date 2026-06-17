import { Card } from "@/shared/ui/Card";

import { useFilteredSources } from "../../hooks/useFilteredSources";
import { SourceCard } from "./SourceCard";
import styles from "./TopSources.module.scss";

export const TopSources = () => {
  const sources = useFilteredSources();
  const topSources = sources?.slice(0, 6);
  return (
    <Card className={styles.wrapper}>
      <div className={styles.header}>
        <p>Топ источников</p>
        <a className={styles.linkToAll}>Все →</a>
      </div>
      {topSources?.map((source) => (
        <SourceCard
          key={source.source.id}
          name={source.source.name}
          count={source.postsCount}
        />
      ))}
    </Card>
  );
};
