"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchStore } from "./store/useSearchStore";
import { getSharedMovies } from "./lib/tmdb";
import ActorSearchForm from "./components/ActorSearchForm";
import SharedMovieList from "./components/SharedMovieList";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function Home() {
  const { actor1, actor2 } = useSearchStore();
  const [trigger, setTrigger] = useState(0);

  const { data, error, isLoading } = useQuery({
    queryKey: ["sharedMovie", actor1, actor2, trigger],
    queryFn: () => getSharedMovies(actor1, actor2, TMDB_KEY),
    enabled: !!actor1 && !!actor2 && trigger > 0,
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        🎬 Actor Collaboration Finder
      </h1>

      <ActorSearchForm onSearch={() => setTrigger((n) => n + 1)} />

      {isLoading && <p className="text-center mt-6">Loading...</p>}
      {error && (
        <p className="text-center mt-6 text-red-600">Error: {error.message}</p>
      )}

      {data && <SharedMovieList movies={data} />}
    </main>
  );
}
