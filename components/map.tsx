"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Popup } from "react-leaflet";
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

L.Marker.prototype.options.icon = DefaultIcon;

const getIcon = (cleanliness: number) => {
  if (cleanliness >= 4) return CleanIcon;
  if (cleanliness <= 2) return DirtyIcon;
  return DefaultIcon;
};

const Map = () => {
  const filteredRestrooms = useRestroomStore(
    (state) => state.filteredRestrooms
  );
  const { onOpen } = useDrawerStore();

  return (
    <MapContainer
      center={[14.5995, 120.9842]}
      zoom={13}
      className="h-full w-full z-0"
      worldCopyJump={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={19}
      />
      {filteredRestrooms.map((restroom) => (
        <Marker
          key={restroom.id}
          position={restroom.position}
          icon={getIcon(restroom.cleanliness)}
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
      ))}
    </MapContainer>
  );
};

export default Map;
