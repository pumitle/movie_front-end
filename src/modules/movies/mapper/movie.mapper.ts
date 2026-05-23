import type {
  CreateMoviePayload,
  GetMoviesParams,
  MovieDetail,
  MovieListItem,
  MovieStats,
  Pagination,
} from "../types/movie.types";

const pickData = (payload: any) => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }
  return payload;
};

export const mapGetMoviesParamsToApi = (params: GetMoviesParams) => ({
  page: params.page,
  limit: params.limit,
  search: params.search,
  rating: params.rating,
});

export const mapCreateMoviePayloadToFormData = async (payload: CreateMoviePayload) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("yearReleased", String(payload.yearReleased));
  formData.append("rating", payload.rating);

  if (payload.description) {
    formData.append("description", payload.description);
  }

  if (payload.poster) {
    formData.append("poster", payload.poster);
  } else if (payload.currentPosterUrl) {
    const posterUrl = payload.currentPosterUrl.startsWith("http")
      ? payload.currentPosterUrl
      : `${import.meta.env.VITE_IMAGE_URL}${payload.currentPosterUrl}`;
    const posterResponse = await fetch(posterUrl);
    if (posterResponse.ok) {
      const blob = await posterResponse.blob();
      const fallbackFile = new File([blob], "existing-poster.jpg", { type: blob.type || "image/jpeg" });
      formData.append("poster", fallbackFile);
    }
  }

  return formData;
};

export const mapMovieListResponseFromApi = (payload: unknown): { data: MovieListItem[]; pagination?: Partial<Pagination> } => {
  const root = payload as any;
  const data = Array.isArray(root?.data) ? root.data : Array.isArray(root) ? root : [];

  return {
    data: data.map((movie: any) => ({
      id: String(movie.id),
      title: movie.title ?? "-",
      rating: movie.rating ?? "-",
      yearReleased: Number(movie.year_released ?? movie.yearReleased ?? 0),
      posterUrl: movie.poster_url ?? movie.posterUrl ?? null,
    })),
    pagination: root?.pagination,
  };
};

export const mapMovieStatsFromApi = (payload: unknown): MovieStats => {
  const stats = pickData(payload as any);
  return {
    totalMovies: stats?.totalMovies ?? 0,
    rating: {
      G: stats?.rating?.G ?? 0,
      PG: stats?.rating?.PG ?? 0,
      M: stats?.rating?.M ?? 0,
      MA: stats?.rating?.MA ?? 0,
      R: stats?.rating?.R ?? 0,
    },
  };
};

export const mapMovieDetailFromApi = (payload: unknown, fallbackId = ""): MovieDetail => {
  const data = pickData(payload as any);
  return {
    id: String(data?.id ?? fallbackId),
    title: data?.title ?? "-",
    rating: data?.rating ?? "-",
    yearReleased: Number(data?.year_released ?? data?.yearReleased ?? 0),
    description: data?.description ?? null,
    posterUrl: data?.poster_url ?? data?.posterUrl ?? null,
  };
};
