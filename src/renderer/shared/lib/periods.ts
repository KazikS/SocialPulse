import dayjs from "dayjs";

import { PeriodVariants } from "@/widgets/Dashboard/lib/types";

export const getPreviousPeriodRange = (period: PeriodVariants) => {
  const weekAgo = dayjs().subtract(7, "days");
  const monthAgo = dayjs().subtract(1, "month");
  const halfYearAgo = dayjs().subtract(6, "month");
  let start = "";
  let end = "";
  switch (period) {
    case "week":
      start = weekAgo.startOf("week").toISOString();
      end = weekAgo.endOf("week").toISOString();
      break;
    case "month":
      start = monthAgo.startOf("month").toISOString();
      end = monthAgo.endOf("month").toISOString();
      break;
    case "halfYear":
      start = halfYearAgo.startOf("month").toISOString();
      end = monthAgo.endOf("month").toISOString();
  }

  return { start, end };
};
