import Filters from "@/components/filters";
import MapWrapper from "@/components/map-wrapper";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="h-screen flex flex-col xl:flex-row">
      <div className="p-4 space-y-4 min-w-80">
        <h1 className="text-2xl font-bold xl:mb-4">TheNearestThrone 🚽</h1>

        <Filters />
      </div>

      <div className="flex-1">
        <Navbar />
        <MapWrapper />
      </div>
    </div>
  );
}
