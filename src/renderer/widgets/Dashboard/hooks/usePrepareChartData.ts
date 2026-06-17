import "dayjs/locale/ru";

import { PostByPlatform } from "@shared/types/entites";
import { useEffect, useMemo, useState } from "react";

import { api } from "@/shared/api";
import { getPreviousPeriodRange } from "@/shared/lib/periods";
import { usePlatforms } from "@/shared/store/platforms/usePlatforms";

import { PeriodVariants } from "../lib/types";
import { buildChartData } from "../lib/utils";

export const usePrepareChartData = (period: PeriodVariants = "month") => {
  const { platforms } = usePlatforms();
  const [data, setData] = useState<PostByPlatform[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { start, end } = getPreviousPeriodRange(period);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await api.posts.getInRange(start, end);
      setData(response);
      setIsLoading(false);
    };

    fetchData();
  }, [start, end]);

  const formattedData = useMemo(
    () => buildChartData(data, period, platforms),
    [data, period, platforms],
  );

  const isEmpty = data.length === 0;

  return { formattedData, isLoading, isEmpty };
};
