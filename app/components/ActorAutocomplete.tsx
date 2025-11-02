"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchActors } from "../lib/tmdb";
import { useDebounce } from "../hooks/useDebounce";

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
  const deboucedValue = useDebounce(value, 400);

  const { data: results, isFetching } = useQuery({
    queryKey: ["actorSearch", deboucedValue],
    queryFn: () => searchActors(deboucedValue, apiKey),
    enabled: deboucedValue.length > 1,
  });

  const visible = focused && results?.length > 0;
  return (
    <div className="relative">
      <input
        className="border rounded p-2 w-full"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)} // delay to allow click
      />

      {isFetching && (
        <span className="absolute right-2 top-2 text-gray-400 text-sm">⏳</span>
      )}

      {visible && (
        <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-y-auto rounded shadow-md">
          {results.slice(0, 6).map((actor: any) => (
            <li
              key={actor.id}
              className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(actor.name)}
            >
              {actor.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
