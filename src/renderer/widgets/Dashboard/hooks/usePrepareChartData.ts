import "dayjs/locale/ru";

import { PostByPlatform } from "@shared/types/entites";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

import { api } from "@/shared/api";
import { usePlatforms } from "@/shared/store/platforms/usePlatforms";

import { PeriodVariants } from "../lib/types";
import { buildChartData } from "../lib/utils";

export const usePrepareChartData = (period: PeriodVariants = "month") => {
  const { platforms } = usePlatforms();
  const [data, setData] = useState<PostByPlatform[]>([]);

  const dateSince = useMemo(
    () => dayjs().subtract(6, "month").startOf("month").toISOString(),
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.posts.getAllByDate(dateSince);
      setData(response);
    };

    fetchData();
  }, [dateSince]);

  const formattedData = useMemo(
    () => buildChartData(data, period, platforms),
    [data, period, platforms],
  );

  return { formattedData, isLoading: data.length === 0 };
};
