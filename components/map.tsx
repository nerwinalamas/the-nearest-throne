"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Popup, useMap } from "react-leaflet";
import dynamic from "next/dynamic";
import { useRestroomStore } from "@/hooks/useRestroomStore";
import { useDrawerStore } from "@/hooks/useDrawerStore";
import StarRating from "@/components/star-rating";
import { useEffect } from "react";
import {
  formatDistance,
  getWalkingTime,
  getDrivingTime,
} from "@/lib/distance";
import { Navigation, MapPin } from "lucide-react";

// Dynamically import the MapContainer without SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

// Custom icons
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Different icon for clean restrooms
const CleanIcon = L.icon({
  ...DefaultIcon.options,
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
});

// Different icon for dirty restrooms
const DirtyIcon = L.icon({
  ...DefaultIcon.options,
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
});

// Selected/highlighted icon
const SelectedIcon = L.icon({
  ...DefaultIcon.options,
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
});

// User location icon
const UserIcon = L.divIcon({
  html: `<div style="
    width: 20px; 
    height: 20px; 
    border-radius: 50%; 
    background-color: #3b82f6; 
    border: 3px solid white; 
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  className: "user-location-marker",
});

L.Marker.prototype.options.icon = DefaultIcon;

const getIcon = (cleanliness: number, isSelected: boolean = false) => {
  if (isSelected) return SelectedIcon;
  if (cleanliness >= 4) return CleanIcon;
  if (cleanliness <= 2) return DirtyIcon;
  return DefaultIcon;
};

// Component to handle map view changes
const MapController = () => {
  const mapCenter = useRestroomStore((state) => state.mapCenter);
  const mapZoom = useRestroomStore((state) => state.mapZoom);
  const map = useMap();

  useEffect(() => {
    if (map && mapCenter) {
      map.setView(mapCenter, mapZoom, {
        animate: true,
        duration: 1, // Animation duration in seconds
      });
    }
  }, [map, mapCenter, mapZoom]);

  return null;
};

const Map = () => {
  const filteredRestrooms = useRestroomStore(
    (state) => state.filteredRestrooms
  );
  const selectedRestroom = useRestroomStore((state) => state.selectedRestroom);
  const mapCenter = useRestroomStore((state) => state.mapCenter);
  const mapZoom = useRestroomStore((state) => state.mapZoom);
  const userLocation = useRestroomStore((state) => state.userLocation);
  const showDirections = useRestroomStore((state) => state.showDirections);
  const routeCoordinates = useRestroomStore((state) => state.routeCoordinates);
  const isRoutingLoading = useRestroomStore((state) => state.isRoutingLoading);
  const routeInfo = useRestroomStore((state) => state.routeInfo);
  const getDirections = useRestroomStore((state) => state.getDirections);
  const clearDirections = useRestroomStore((state) => state.clearDirections);
  const { onOpen } = useDrawerStore();

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      className="h-full w-full z-0"
      worldCopyJump={true}
    >
      <MapController />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={19}
      />

      {/* User location marker with accuracy circle */}
      {userLocation && (
        <>
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={UserIcon}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-blue-600">Your Location</h3>
                <p className="text-sm text-gray-600">
                  Accuracy: ±{Math.round(userLocation.accuracy || 0)}m
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Accuracy circle */}
          {userLocation.accuracy && (
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userLocation.accuracy}
              pathOptions={{
                fillColor: "#3b82f6",
                fillOpacity: 0.1,
                color: "#3b82f6",
                weight: 2,
                opacity: 0.3,
              }}
            />
          )}
        </>
      )}

      {/* Route polyline */}
      {showDirections && routeCoordinates && (
        <Polyline
          positions={routeCoordinates}
          pathOptions={{
            color: "#3b82f6",
            weight: 5,
            opacity: 0.8,
          }}
        />
      )}

      {/* Restroom markers */}
      {filteredRestrooms.map((restroom) => {
        const isSelected = selectedRestroom?.id === restroom.id;
        return (
          <Marker
            key={restroom.id}
            position={restroom.position}
            icon={getIcon(restroom.cleanliness, isSelected)}
          >
            <Popup>
              <div className="space-y-2 min-w-[200px]">
                <h3 className="font-bold">{restroom.name}</h3>

                {/* Distance info */}
                {restroom.distance && (
                  <div className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-medium">
                        {formatDistance(restroom.distance)} away
                      </div>
                      <div className="text-xs text-gray-600">
                        {getWalkingTime(restroom.distance)} •{" "}
                        {getDrivingTime(restroom.distance)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <span>Cleanliness:</span>
                  <StarRating
                    rating={restroom.cleanliness}
                    size="sm"
                    className="inline-flex"
                  />
                </div>

                <p>
                  Type: {restroom.type} ({restroom.paymentType})
                </p>
                <p>Gender: {restroom.gender.join(", ")}</p>
                <p>Features: {restroom.features.join(", ") || "None"}</p>

                <div className="flex gap-2 pt-2">
                  <button
                    className="text-blue-500 hover:underline text-sm"
                    onClick={() => onOpen("viewReviews", restroom)}
                  >
                    View reviews
                  </button>

                  {/* Directions button */}
                  {userLocation && (
                    <>
                      {showDirections &&
                      selectedRestroom?.id === restroom.id ? (
                        <div className="flex flex-col gap-1">
                          {routeInfo && (
                            <div className="text-xs text-green-600 bg-green-50 p-1 rounded">
                              📍 {routeInfo.distance} • 🕒 {routeInfo.duration}
                            </div>
                          )}
                          <button
                            className="text-red-500 hover:underline text-sm"
                            onClick={clearDirections}
                          >
                            Clear route
                          </button>
                        </div>
                      ) : (
                        <button
                          className="text-green-500 hover:underline text-sm flex items-center gap-1"
                          onClick={() => getDirections(restroom)}
                          disabled={isRoutingLoading}
                        >
                          {isRoutingLoading ? (
                            <>
                              <div className="animate-spin h-3 w-3 border border-green-500 border-t-transparent rounded-full"></div>
                              Getting route...
                            </>
                          ) : (
                            <>
                              <Navigation className="h-3 w-3" />
                              Directions
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
