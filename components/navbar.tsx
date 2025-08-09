"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useRestroomStore } from "@/hooks/useRestroomStore";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  const setSearchQuery = useRestroomStore((state) => state.setSearchQuery);
  const searchQuery = useRestroomStore((state) => state.searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="relative md:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search locations..."
          className="pl-8"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
