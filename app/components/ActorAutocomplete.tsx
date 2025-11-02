"use client";

import { useQuery } from "@tanstack/react-query";
import { searchActors } from "../lib/tmdb";
import { useDebounce } from "../hooks/useDebounce";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ActorAutocompleteProps {
  value: string;
  onChange: (v: string) => void;
  onSelect: (v: string) => void;
  placeholder: string;
  apiKey: string;
}

export default function ActorAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  apiKey,
}: ActorAutocompleteProps) {
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedValue = useDebounce(value, 400);

  const { data: results, isFetching } = useQuery({
    queryKey: ["actorSearch", debouncedValue],
    queryFn: () => searchActors(debouncedValue, apiKey),
    enabled: debouncedValue.trim().length > 1,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const visible = focused && results?.length > 0;

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [debouncedValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!visible || !results) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev <= 0 ? results.length - 1 : prev - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          onSelect(results[highlightedIndex].name);
          setFocused(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setFocused(false);
        break;
    }
  };

  return (
    <div className="relative">
      <input
        className="border rounded p-2 w-full"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        onKeyDown={handleKeyDown}
      />

      {isFetching && (
        <span className="absolute right-2 top-2 text-gray-400 text-sm">⏳</span>
      )}

      {visible && (
        <ul className="absolute z-10 bg-white border w-full max-h-56 overflow-y-auto rounded shadow-md transition-all duration-150 ease-in-out">
          {results.slice(0, 8).map((actor: any, index: number) => (
            <li
              key={actor.id}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
                index === highlightedIndex ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onMouseDown={() => onSelect(actor.name)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {actor.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                  alt={actor.name}
                  width={40}
                  height={60}
                  className="rounded transition-opacity duration-200"
                />
              ) : (
                <div className="w-[40px] h-[60px] bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs font-semibold">
                  {actor.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n: string) => n[0])
                    .join("")}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-medium text-sm">{actor.name}</span>
                {actor.known_for_department && (
                  <span className="text-xs text-gray-500">
                    {actor.known_for_department}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
