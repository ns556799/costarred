"use client";

import Image from "next/image";
import { Movie } from "../lib/tmdb";

export default function SharedMovieList({ movies }) {
  if (!movies?.length)
    return <p className="text-center mt-4">No Share Movies Yet!</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
      {movies.map((m) => {
        return (
          <div className="border rounded shadow-sm overflow-hidden" key={m.id}>
            {m.poster_path && (
              <Image src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} width={500} height={750} alt={m.title} className="w-full" />
            )}
            <div className="p-2">
            <h3 className="text-sm font-semibold">{m.title}</h3>
            <p className="text-xs text-gray-500">{m.release_date}</p>
          </div>
          </div>
        );
      })}
    </div>
  );
}
