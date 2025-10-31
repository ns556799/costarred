import { create } from "zustand";

interface SearchState {
  actor1: string;
  actor2: string;
  setActor1: (v: string) => void;
  setActor2: (v: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  actor1: "",
  actor2: "",
  setActor1: (actor1) => set({ actor1 }),
  setActor2: (actor2) => set({ actor2 }),
}));
