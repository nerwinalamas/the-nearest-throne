"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      Loading map...
    </div>
  ),
});

export default function MapWrapper() {
  return <Map />;
}
