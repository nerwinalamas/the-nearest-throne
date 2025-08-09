"use client";

import { MapPin, Loader2, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { useRestroomStore } from "@/hooks/useRestroomStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const LocationButton = () => {
  const getUserLocation = useRestroomStore((state) => state.getUserLocation);
  const userLocation = useRestroomStore((state) => state.userLocation);
  const isLocationLoading = useRestroomStore(
    (state) => state.isLocationLoading
  );
  const locationError = useRestroomStore((state) => state.locationError);
  const sortByDistance = useRestroomStore((state) => state.sortByDistance);

  const handleLocationClick = () => {
    if (userLocation) {
      // If location exists, sort by distance
      sortByDistance();
    } else {
      // Get user location
      getUserLocation();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={userLocation ? "default" : "outline"}
            size="sm"
            onClick={handleLocationClick}
            disabled={isLocationLoading}
            className="flex items-center gap-2"
          >
            {isLocationLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : userLocation ? (
              <Navigation className="h-4 w-4" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isLocationLoading
                ? "Getting location..."
                : userLocation
                ? "Sort by distance"
                : "Get location"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {locationError
              ? locationError
              : userLocation
              ? "Click to sort restrooms by distance"
              : "Click to get your current location"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LocationButton;
