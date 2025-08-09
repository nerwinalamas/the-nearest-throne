import { create } from "zustand";
import { restrooms } from "@/lib/data";

export interface Restroom {
  id: string;
  name: string;
  position: [number, number];
  cleanliness: number;
  features: string[];
  paymentType: "Free" | "Paid";
  type: "Public" | "Private";
  gender: string[];
}

interface RestroomState {
  restrooms: Restroom[];
  filteredRestrooms: Restroom[];
  searchQuery: string;
  selectedRestroom: Restroom | null;
  mapCenter: [number, number];
  mapZoom: number;
  filters: {
    cleanliness: [number, number];
    features: string[];
    paymentTypes: ("Free" | "Paid")[];
    types: ("Public" | "Private")[];
    genders: string[];
  };
  // Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<RestroomState["filters"]>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  addRestroom: (restroom: Omit<Restroom, "id">) => void;
  setSelectedRestroom: (restroom: Restroom | null) => void;
  setMapCenter: (center: [number, number], zoom?: number) => void;
}

export const useRestroomStore = create<RestroomState>((set, get) => ({
  restrooms: restrooms,
  filteredRestrooms: restrooms, // Initially show all restrooms
  searchQuery: "",
  selectedRestroom: null, // Initialize selected restroom
  mapCenter: [14.5995, 120.9842], // Default center (Quezon City)
  mapZoom: 13, // Default zoom
  filters: {
    cleanliness: [1, 5], // Min and max cleanliness
    features: [],
    paymentTypes: [],
    types: [],
    genders: [],
  },
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters(); // Re-apply filters when search changes

    // If there's a search query and filtered results, navigate to first result
    if (query.trim() !== "") {
      const filtered = get().filteredRestrooms;
      if (filtered.length > 0) {
        const firstResult = filtered[0];
        set({
          selectedRestroom: firstResult,
          mapCenter: firstResult.position,
          mapZoom: 16, // Zoom closer when searching
        });
      }
    } else {
      // Reset to default view when search is cleared
      set({
        selectedRestroom: null,
        mapCenter: [14.5995, 120.9842],
        mapZoom: 13,
      });
    }
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () =>
    set({
      filters: {
        cleanliness: [1, 5],
        features: [],
        paymentTypes: [],
        types: [],
        genders: [],
      },
      filteredRestrooms: restrooms,
    }),
  applyFilters: () => {
    const { restrooms, filters, searchQuery } = get();

    const filtered = restrooms.filter((restroom) => {
      // Search filter - check if name includes search query (case insensitive)
      if (
        searchQuery &&
        !restroom.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Cleanliness filter
      if (
        restroom.cleanliness < filters.cleanliness[0] ||
        restroom.cleanliness > filters.cleanliness[1]
      ) {
        return false;
      }

      // Features filter
      if (
        filters.features.length > 0 &&
        !filters.features.every((f) => restroom.features.includes(f))
      ) {
        return false;
      }

      // Payment type filter
      if (
        filters.paymentTypes.length > 0 &&
        !filters.paymentTypes.includes(restroom.paymentType)
      ) {
        return false;
      }

      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(restroom.type)) {
        return false;
      }

      // Gender filter
      if (
        filters.genders.length > 0 &&
        !filters.genders.some((g) => restroom.gender.includes(g))
      ) {
        return false;
      }

      return true;
    });

    set({ filteredRestrooms: filtered });
  },

  addRestroom: (restroom) => {
    const newRestroom = {
      ...restroom,
      id: "asdasdasd", // Generate unique ID here
      position: restroom.position,
    };
    
    set((state) => ({
      restrooms: [...state.restrooms, newRestroom],
      filteredRestrooms: [...state.filteredRestrooms, newRestroom],
    }));
  },
  setSelectedRestroom: (restroom) => set({ selectedRestroom: restroom }),
  setMapCenter: (center, zoom = 16) =>
    set({
      mapCenter: center,
      mapZoom: zoom,
    }),
}));
