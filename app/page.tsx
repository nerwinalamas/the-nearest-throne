import Filters from "@/components/filters";
import MapWrapper from "@/components/map-wrapper";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="h-screen mx-auto grid lg:grid-cols-[300px_1fr]">
      <div className="p-4 rounded-lg space-y-4">
        <h1 className="text-2xl font-bold mb-4">TheNearestThrone 🚽</h1>

        <Filters />
      </div>

      <div className="flex-1">
        <Navbar />
        <MapWrapper />
      </div>
    </div>
  );
}
