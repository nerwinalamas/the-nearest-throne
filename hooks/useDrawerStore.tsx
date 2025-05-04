"use client";

import { create } from "zustand";
import { Restroom } from "./useRestroomStore";

export type DrawerType = "viewReviews";

type DrawerStore = {
  type: DrawerType | null;
  isOpen: boolean;
  data?: Partial<Restroom>;
  onOpen: (type: DrawerType, data?: Restroom) => void;
  onClose: () => void;
};

export const useDrawerStore = create<DrawerStore>((set) => ({
  type: null,
  isOpen: false,
  data: undefined,
  onOpen: (type, data) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false, data: undefined }),
}));
