import { PlatformSlug } from "@shared/types/entites";
import { clsx } from "clsx";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { routes } from "@/shared/routes";
import { Card } from "@/shared/ui/Card";
import { Divider } from "@/shared/ui/Divider/Divider";
import {
  StatusIndicator,
  StatusIndicatorVariant,
} from "@/shared/ui/StatusIndicator";

import styles from "./PlatformCard.module.scss";

export type PlatformStatus = "active" | "soon";

export type PlatformCardProps = {
  title: string;
  status: PlatformStatus;
  sourceIcon: ReactNode;
  sourcesCount: number;
  postsCount: number;
  slug: string;
};

type Status = {
  label: string;
  indicatorVariant: StatusIndicatorVariant;
};

const STATUSES_MAP: Record<PlatformStatus, Status> = {
  active: { label: "Активна", indicatorVariant: "success" },
  soon: { label: "Скоро", indicatorVariant: "disabled" },
};

export const PlatformCard = ({
  title,
  status,
  sourceIcon,
  sourcesCount,
  postsCount,
  slug,
}: PlatformCardProps) => {
  const navigate = useNavigate();
  return (
    <Card
      className={clsx(styles.wrapper, status === "soon" && styles.disabled)}
      onClick={() => {
        navigate(routes[slug as PlatformSlug]);
      }}
    >
      <div className={clsx(styles.platformAccent, styles[slug])}></div>
      <div className={styles.title}>
        {sourceIcon}
        <div>
          {title}
          <div className={styles.status}>
            <StatusIndicator variant={STATUSES_MAP[status].indicatorVariant} />{" "}
            {STATUSES_MAP[status].label}
          </div>
        </div>
      </div>
      <Divider direction="horizontal" />
      <div className={styles.stats}>
        <div className={styles.statsBlock}>
          {sourcesCount > 0 ? sourcesCount : "-"}
          <span>источников</span>
        </div>
        <div className={styles.statsBlock}>
          {postsCount ? postsCount : "-"}
          <span>постов</span>
        </div>
      </div>
    </Card>
  );
};
