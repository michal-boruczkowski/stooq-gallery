import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { initialGroups } from "./initialGroups";

export type Ticker = {
  id: number;
  ticker: string;
  period: string;
  references?: string[];
};

export type Group = {
  id: number;
  label: string;
  tickers: Ticker[];
};

export type GroupsStore = {
  groups: Group[];
  save: (value: Group[]) => void;
};

export const useGroupsStore = create<GroupsStore>()(
  persist(
    (set, get) => ({
      groups: initialGroups,
      save: (value: Group[]) => {
        set({ groups: value });
      },
    }),
    {
      name: "food-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
