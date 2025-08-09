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
  distance?: number;
}

interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface RestroomState {
  restrooms: Restroom[];
  filteredRestrooms: Restroom[];
  searchQuery: string;
  selectedRestroom: Restroom | null;
  mapCenter: [number, number];
  mapZoom: number;
  userLocation: UserLocation | null;
  isLocationLoading: boolean;
  locationError: string | null;
  showDirections: boolean;
  routeCoordinates: [number, number][] | null;
  isRoutingLoading: boolean; // Add loading state for routing
  routeInfo: {
    // Add route information
    distance?: string;
    duration?: string;
  } | null;
  filters: {
    cleanliness: [number, number];
    features: string[];
    paymentTypes: ("Free" | "Paid")[];
    types: ("Public" | "Private")[];
    genders: string[];
    maxDistance?: number;
  };
  // Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<RestroomState["filters"]>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  addRestroom: (restroom: Omit<Restroom, "id">) => void;
  setSelectedRestroom: (restroom: Restroom | null) => void;
  setMapCenter: (center: [number, number], zoom?: number) => void;
  getUserLocation: () => Promise<void>;
  setUserLocation: (location: UserLocation | null) => void;
  calculateDistances: () => void;
  getDirections: (destination: Restroom) => Promise<void>;
  clearDirections: () => void;
  sortByDistance: () => void;
}

// Haversine formula to calculate distance between two points
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

// OSRM Routing Service (FREE!)
async function getOSRMRoute(
  userLocation: { lat: number; lng: number },
  destination: { position: [number, number] }
): Promise<{
  coordinates: [number, number][];
  distance: string;
  duration: string;
}> {
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${destination.position[1]},${destination.position[0]}?overview=full&geometries=geojson&steps=true`,
    {
      method: "GET",
      headers: {
        "User-Agent": "TheNearestThrone/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`OSRM API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.routes || data.routes.length === 0) {
    throw new Error("No route found");
  }

  const route = data.routes[0];

  const coordinates = route.geometry.coordinates.map(
    (coord: number[]) => [coord[1], coord[0]] as [number, number]
  );

  // Format distance and duration
  const distanceKm = (route.distance / 1000).toFixed(1);
  const durationMin = Math.round(route.duration / 60);

  return {
    coordinates,
    distance: `${distanceKm} km`,
    duration: `${durationMin} min`,
  };
}

export const useRestroomStore = create<RestroomState>((set, get) => ({
  restrooms: restrooms,
  filteredRestrooms: restrooms, // Initially show all restrooms
  searchQuery: "",
  selectedRestroom: null, // Initialize selected restroom
  mapCenter: [14.5995, 120.9842], // Default center (Quezon City)
  mapZoom: 13, // Default zoom
  userLocation: null,
  isLocationLoading: false,
  locationError: null,
  showDirections: false,
  routeCoordinates: null,
  isRoutingLoading: false,
  routeInfo: null,
  filters: {
    cleanliness: [1, 5], // Min and max cleanliness
    features: [],
    paymentTypes: [],
    types: [],
    genders: [],
    maxDistance: undefined,
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
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().applyFilters();
  },
  resetFilters: () => {
    set({
      filters: {
        cleanliness: [1, 5],
        features: [],
        paymentTypes: [],
        types: [],
        genders: [],
        maxDistance: undefined,
      },
      filteredRestrooms: restrooms,
    });
  },
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

      // Distance filter
      if (filters.maxDistance && restroom.distance) {
        if (restroom.distance > filters.maxDistance) {
          return false;
        }
      }

      return true;
    });

    set({ filteredRestrooms: filtered });
  },

  addRestroom: (restroom) => {
    const newRestroom = {
      ...restroom,
      id: Date.now().toString(),
      position: restroom.position,
    };
    
    set((state) => ({
      restrooms: [...state.restrooms, newRestroom],
      filteredRestrooms: [...state.filteredRestrooms, newRestroom],
    }));

    get().calculateDistances();
  },
  setSelectedRestroom: (restroom) => set({ selectedRestroom: restroom }),
  setMapCenter: (center, zoom = 16) =>
    set({
      mapCenter: center,
      mapZoom: zoom,
    }),
  getUserLocation: async () => {
    set({ isLocationLoading: true, locationError: null });

    if (!navigator.geolocation) {
      set({
        isLocationLoading: false,
        locationError: "Geolocation is not supported by this browser.",
      });
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          });
        }
      );

      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      set({
        userLocation,
        isLocationLoading: false,
        locationError: null,
        mapCenter: [userLocation.lat, userLocation.lng],
        mapZoom: 15,
      });

      get().calculateDistances();
    } catch (error) {
      let errorMessage = "Unable to retrieve your location.";

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
      }

      set({
        isLocationLoading: false,
        locationError: errorMessage,
      });
    }
  },
  setUserLocation: (location) => {
    set({ userLocation: location });
    if (location) {
      get().calculateDistances();
    }
  },
  calculateDistances: () => {
    const { userLocation, restrooms } = get();

    if (!userLocation) return;

    const restroomsWithDistance = restrooms.map((restroom) => ({
      ...restroom,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        restroom.position[0],
        restroom.position[1]
      ),
    }));

    set({
      restrooms: restroomsWithDistance,
    });

    get().applyFilters();
  },
  getDirections: async (destination) => {
    const { userLocation } = get();

    if (!userLocation) {
      set({ locationError: "User location not available for directions." });
      return;
    }

    set({ isRoutingLoading: true, locationError: null });

    try {
      console.log("Getting route from OSRM...");

      const routeData = await getOSRMRoute(userLocation, destination);

      set({
        routeCoordinates: routeData.coordinates,
        routeInfo: {
          distance: routeData.distance,
          duration: routeData.duration,
        },
        showDirections: true,
        selectedRestroom: destination,
        isRoutingLoading: false,
      });

      console.log("Route received successfully:", routeData);
    } catch (error) {
      console.error("Error getting directions:", error);

      // Fallback: Create a simple multi-point route
      const fallbackRoute: [number, number][] = [
        [userLocation.lat, userLocation.lng],
        destination.position,
      ];

      set({
        routeCoordinates: fallbackRoute,
        routeInfo: {
          distance: destination.distance
            ? `${destination.distance.toFixed(1)} km`
            : "Unknown",
          duration: "Estimated",
        },
        showDirections: true,
        selectedRestroom: destination,
        isRoutingLoading: false,
        locationError:
          "Using approximate route. Road details may not be accurate.",
      });
    }
  },
  clearDirections: () => {
    set({
      showDirections: false,
      routeCoordinates: null,
      routeInfo: null,
    });
  },
  sortByDistance: () => {
    const { filteredRestrooms } = get();
    const sorted = [...filteredRestrooms].sort((a, b) => {
      if (!a.distance && !b.distance) return 0;
      if (!a.distance) return 1;
      if (!b.distance) return -1;
      return a.distance - b.distance;
    });

    set({ filteredRestrooms: sorted });
  },
}));
