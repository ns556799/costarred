"use client";

import { useSearchStore } from "../store/useSearchStore";
import ActorAutocomplete from "../components/ActorAutocomplete";

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY!;

export default function ActorSearchForm({ onSearch }: { onSearch: () => void }) {
  const { actor1, actor2, setActor1, setActor2 } = useSearchStore();

  return (
    <div className="flex flex-col gap-3 max-w-md mx-auto">
      <ActorAutocomplete
        value={actor1}
        onChange={setActor1}
        onSelect={setActor1}
        placeholder="First actor"
        apiKey={apiKey}
      />

      <ActorAutocomplete
        value={actor2}
        onChange={setActor2}
        onSelect={setActor2}
        placeholder="Second actor"
        apiKey={apiKey}
      />

      <button
        onClick={onSearch}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Find Shared Movies
      </button>
    </div>
  );
}
