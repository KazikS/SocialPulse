import { PlatformOverview, PlatformSlug } from "@shared/types/entites";
import { ReactNode, useEffect, useState } from "react";

import { api } from "@/shared/api";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";

import { platformPresentation } from "../../config";
import { PlatformCard, PlatformStatus } from "./PlatformCard";
import styles from "./PlatformCard.module.scss";

type PlatformCardData = PlatformOverview & {
  icon: ReactNode;
  status: PlatformStatus;
};

export const PlatformCardRow = () => {
  const [platforms, setPlatforms] = useState<PlatformCardData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.platforms.getOverview();
        const platformsWithIcon = response.map((p) => ({
          ...p,
          ...platformPresentation[p.slug as PlatformSlug],
        }));
        setPlatforms(platformsWithIcon);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const content = loading
    ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
    : platforms.map((p) => (
        <PlatformCard
          key={p.slug}
          title={p.name}
          status={p.status}
          sourceIcon={p.icon}
          sourcesCount={p.sourcesCount}
          postsCount={p.postsCount}
          slug={p.slug}
        />
      ));
  return (
    <>
      <div className={styles.blockTitle}>
        <div className={styles.title}>Платформы</div>
        <div className={styles.hint}>Нажми чтобы перейти к источнику</div>
      </div>
      <div className={styles.platformsList}>{content}</div>
    </>
  );
};
