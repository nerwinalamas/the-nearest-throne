"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRestroomStore } from "@/hooks/useRestroomStore";
import { useModalStore } from "@/hooks/useModalStore";

const Navbar = () => {
  const setSearchQuery = useRestroomStore((state) => state.setSearchQuery);
  const searchQuery = useRestroomStore((state) => state.searchQuery);
  const { onOpen } = useModalStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-4 flex items-center justify-between">
      <div className="relative w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search locations..."
          className="pl-8"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <Button onClick={() => onOpen("createRestroom")}>Add Location</Button>
    </div>
  );
};

export default Navbar;
