"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, } from "react";
import { Popup, useMap } from "react-leaflet";
import dynamic from "next/dynamic";
import { useRestroomStore } from "@/hooks/useRestroomStore";
import { useDrawerStore } from "@/hooks/useDrawerStore";
import StarRating from "@/components/star-rating";

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

// Fix default marker icons (for Next.js)
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
      {filteredRestrooms.map((restroom) => {
        const isSelected = selectedRestroom?.id === restroom.id;
        return (
          <Marker
            key={restroom.id}
            position={restroom.position}
            icon={getIcon(restroom.cleanliness, isSelected)}
          >
            <Popup>
              <div className="space-y-1">
                <h3 className="font-bold">{restroom.name}</h3>
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
                <button
                  className="text-blue-500 hover:underline hover:cursor-pointer"
                  onClick={() => onOpen("viewReviews", restroom)}
                >
                  View reviews
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
