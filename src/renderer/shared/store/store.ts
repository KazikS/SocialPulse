import { create } from "zustand";

import { DashboardContextType } from "@/widgets/Dashboard/lib/types";

type AddSourceDialogState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useDashboardFilters = create<DashboardContextType>((set) => ({
  period: "halfYear",
  setPeriod: (period) => set({ period }),
}));

export const useAddSourceDialog = create<AddSourceDialogState>((set) => ({
  isOpen: true,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
