export type PeriodVariants = "week" | "month" | "halfYear";

export type DashboardContextType = {
  period: PeriodVariants;
  setPeriod: (value: PeriodVariants) => void;
};
