"use client";

import L from "leaflet";

import dynamic from "next/dynamic";

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
  iconUrl: "/images/marker-icon.png",
  iconRetinaUrl: "/images/marker-icon-2x.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = () => {
  return (
    <MapContainer
      center={[14.5995, 120.9842]}
      zoom={13}
      className="h-full w-full"
      worldCopyJump={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        noWrap={true}
      />
      <Marker position={[14.5995, 120.9842]} />
    </MapContainer>
  );
};

export default Map;
