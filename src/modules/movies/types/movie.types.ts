export interface GetMoviesParams {
  page?: number;
  limit?: number;
  search?: string;
  rating?: string;
}

export interface MovieListItem {
  id: string;
  title: string;
  rating: string;
  yearReleased: number;
  posterUrl?: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MovieStats {
  totalMovies: number;
  rating: {
    G: number;
    PG: number;
    M: number;
    MA: number;
    R: number;
  };
}

export interface CreateMoviePayload {
  title: string;
  yearReleased: number;
  rating: string;
  description?: string;
  poster?: File | null;
  currentPosterUrl?: string;
}

export interface MovieDetail {
  id: string;
  title: string;
  yearReleased: number;
  rating: string;
  description?: string | null;
  posterUrl?: string | null;
}
