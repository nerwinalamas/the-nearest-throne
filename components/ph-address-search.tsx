"use client";

import { useState, useEffect, useRef } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { Input } from "@/components/ui/input";

interface Suggestions {
  label: string;
  x: number;
  y: number;
}

interface PHAddressSearchProps {
  onSelect: (result: Suggestions) => void;
}

const PHAddressSearch = ({ onSelect }: PHAddressSearchProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestions[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const provider = new OpenStreetMapProvider({
      params: { countrycodes: "ph" },
    });

    provider
      .search({ query })
      .then((results) => setSuggestions(results))
      .catch(console.error);
  }, [query]);

  return (
    <div className="relative w-full" ref={ref}>
      <Input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        placeholder="Search address in Philippines..."
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((item, i) => (
            <div
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                onSelect(item);
                setQuery(item.label);
                setShowSuggestions(false);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PHAddressSearch;
