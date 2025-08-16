import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import MapWrapper from "@/components/map-wrapper";

export default function Home() {
  return (
    <div className="h-screen flex flex-col xl:flex-row">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-hidden">
          <MapWrapper />
        </div>
      </div>
    </div>
  );
}
