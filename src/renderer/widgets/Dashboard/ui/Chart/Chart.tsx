import { PlatformSlug } from "@shared/types/entites";
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { usePlatforms } from "@/shared/store/platforms/usePlatforms";
import { Card } from "@/shared/ui/Card";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { useDashboardFilters } from "@/shared/store/store";

import { platformColorsBySlug } from "../../config";
import { usePrepareChartData } from "../../hooks/usePrepareChartData";
import styles from "./Chart.module.scss";
import { PeriodSwitcher } from "./PeriodSwitcher";

export const Chart = () => {
  const { period, setPeriod } = useDashboardFilters();
  const { formattedData, isLoading, isEmpty } = usePrepareChartData(period);
  const { platforms } = usePlatforms();

  const slugs = platforms.map((platform) => platform.slug);

  const getNamesBySlug = (slug: PlatformSlug) => {
    const platform = platforms.find((p) => p.slug === slug);
    const name = platform ? platform.name : "Неизвестная платформа";
    return name;
  };

  if (isLoading || !formattedData) return <SkeletonCard />;

  const monthTicks =
    period === "month" ? ["1", "5", "10", "15", "20", "25", "30"] : undefined;

  if (!isLoading && isEmpty) {
    return (
      <div className={styles.blockWrapper}>
        <Card className={styles.wrapper}>
          <div className={styles.cardHeader}>
            <div className={styles.title}>
              <h3>Динамика публикаций</h3>
              <p>По платформам</p>
            </div>
            <PeriodSwitcher
              value={period}
              onChange={setPeriod}
              options={[
                { value: "week", label: "Неделя" },
                { value: "month", label: "Месяц" },
                { value: "halfYear", label: "Полгода" },
              ]}
            />
          </div>
          <div>
            <p>за данный промежуток времени активности не было</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.blockWrapper}>
      <Card className={styles.wrapper}>
        <div className={styles.cardHeader}>
          <div className={styles.title}>
            <h3>Динамика публикаций</h3>
            <p>По платформам</p>
          </div>
          <PeriodSwitcher
            value={period}
            onChange={setPeriod}
            options={[
              { value: "week", label: "Неделя" },
              { value: "month", label: "Месяц" },
              { value: "halfYear", label: "Полгода" },
            ]}
          />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={formattedData}
            margin={{
              top: 5,
              bottom: 5,
              left: 0,
              right: 15,
            }}
          >
            <XAxis dataKey="x" ticks={monthTicks} interval={0} />
            <YAxis />
            <Tooltip contentStyle={{ background: "#1f2a42" }} />
            {slugs.map((slug, index) => (
              <Area
                type="monotone"
                dataKey={slug}
                key={slug}
                stackId={index}
                fill={platformColorsBySlug[slug]}
                fillOpacity={0.7}
                stroke={platformColorsBySlug[slug]}
              />
            ))}
            <Legend formatter={getNamesBySlug} iconSize={0} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
