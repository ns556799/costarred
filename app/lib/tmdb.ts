const API_URL = "https://api.themoviedb.org/3";

interface Movie {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  poster_path?: string;
  [key: string]: unknown;
}

export async function getActorId(name: string, apiKey: string) {
  const res = await fetch(
    `${API_URL}/search/person?api_key=${apiKey}&query=${encodeURIComponent(
      name
    )}`
  );
  const data = await res.json();
  return data.results?.[0];
}

export async function getActorMovies(id: number, apiKey: string): Promise<Movie[]> {
  const res = await fetch(
    `${API_URL}/person/${id}/movie_credits?api_key=${apiKey}`
  );
  const data = await res.json();
  return data.cast || [];
}

export async function getSharedMovies(actor1: string, actor2: string, apiKey: string) {
  const [id1, id2] = await Promise.all([getActorId(actor1, apiKey), getActorId(actor2, apiKey)]);
  if (!id1 || !id2) throw new Error("Actor not found");

  const [movies1, movies2] = await Promise.all([
    getActorMovies(id1, apiKey),
    getActorMovies(id2, apiKey),
  ]);

  const shared = movies1.filter((m1) => movies2.some((m2) => m2.id === m1.id));
  return shared.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
}
