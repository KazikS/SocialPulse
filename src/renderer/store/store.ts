import { create } from "zustand";

import { DashboardContextType } from "@/widgets/Dashboard/lib/types";

export const useDashboardFilters = create<DashboardContextType>((set) => ({
  period: "halfYear",
  setPeriod: (period) => set({ period }),
}));
