"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Restroom, useRestroomStore } from "@/hooks/useRestroomStore";
import { ModeToggle } from "./mode-toggle";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const setSearchQuery = useRestroomStore((state) => state.setSearchQuery);
  const searchQuery = useRestroomStore((state) => state.searchQuery);
  const filteredRestrooms = useRestroomStore(
    (state) => state.filteredRestrooms
  );
  const setSelectedRestroom = useRestroomStore(
    (state) => state.setSelectedRestroom
  );
  const setMapCenter = useRestroomStore((state) => state.setMapCenter);
  const restrooms = useRestroomStore((state) => state.restrooms);

  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(value.trim() !== "");
    setHighlightedIndex(-1);
  };

  const handleResultClick = (restroom: Restroom) => {
    setSearchQuery(restroom.name);
    setSelectedRestroom(restroom);
    setMapCenter(restroom.position, 16);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || filteredRestrooms.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredRestrooms.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredRestrooms.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleResultClick(filteredRestrooms[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Show search results only when there's a query and results don't match all restrooms
  const shouldShowResults =
    showDropdown &&
    searchQuery.trim() !== "" &&
    filteredRestrooms.length > 0 &&
    filteredRestrooms.length < restrooms.length;

  return (
    <div className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="relative md:w-80" ref={dropdownRef}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search locations..."
          className="pl-8"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchQuery.trim() !== "" && filteredRestrooms.length > 0) {
              setShowDropdown(true);
            }
          }}
        />

        {/* Search Results Dropdown */}
        {shouldShowResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {filteredRestrooms.slice(0, 5).map((restroom, index) => (
              <div
                key={restroom.id}
                className={`px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                  index === highlightedIndex
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
                onClick={() => handleResultClick(restroom)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="font-medium">{restroom.name}</div>
                <div className="text-sm text-muted-foreground">
                  {restroom.type} • {restroom.paymentType} • ⭐{" "}
                  {restroom.cleanliness}/5
                </div>
              </div>
            ))}

            {filteredRestrooms.length > 5 && (
              <div className="px-3 py-2 text-sm text-muted-foreground border-t">
                +{filteredRestrooms.length - 5} more results
              </div>
            )}
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-2">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
