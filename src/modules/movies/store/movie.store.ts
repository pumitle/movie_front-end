import { cast, flow, types } from "mobx-state-tree";

import { createMovieApi, deleteMovieApi, getMovieStatsApi, getMoviesApi, updateMovieApi } from "../../../infrastructure/api/movie.api";
import { MovieModel, RatingStatsModel } from "./movie.model";

export const MovieStore = types

  .model("MovieStore", {
    movies: types.array(MovieModel),
    loading: types.optional(types.boolean, false),
    page: types.optional(types.number, 1),
    limit: types.optional(types.number, 10),
    total: types.optional(types.number, 0),
    totalPages: types.optional(types.number, 1),
    search: types.optional(types.string, ""),
    rating: types.optional(types.string, ""),
    totalMovies: types.optional(types.number, 0),
    ratingStats: types.optional(RatingStatsModel, {}),
  })

  .actions((self) => {
    const setSearch = (value: string) => {
      self.search = value;
      self.page = 1;
    };

    const setRating = (value: string) => {
      self.rating = value;
      self.page = 1;
    };

    const setLimit = (value: number) => {
      self.limit = value;
      self.page = 1;
    };

    const setPage = (value: number) => {
      self.page = value;
    };

    const fetchMovies = flow(function* () {
      self.loading = true;

      try {
        const response = yield getMoviesApi({
          page: self.page,
          limit: self.limit,
          search: self.search || undefined,
          rating: self.rating || undefined,
        });
        const movies = Array.isArray(response?.data) ? response.data : [];
        const pagination = response?.pagination;

        self.movies = cast(movies);
        self.page = pagination?.page ?? self.page;
        self.limit = pagination?.limit ?? self.limit;
        self.total = pagination?.total ?? movies.length;
        self.totalPages = pagination?.totalPages ?? 1;
      } finally {
        self.loading = false;
      }
    });

    const fetchMovieStats = flow(function* () {
      try {
        const stats = yield getMovieStatsApi();
        self.totalMovies = stats?.totalMovies ?? 0;
        self.ratingStats = cast({
          G: stats?.rating?.G ?? 0,
          PG: stats?.rating?.PG ?? 0,
          M: stats?.rating?.M ?? 0,
          MA: stats?.rating?.MA ?? 0,
          R: stats?.rating?.R ?? 0,
        });
      } catch {
        self.totalMovies = 0;
        self.ratingStats = cast({ G: 0, PG: 0, M: 0, MA: 0, R: 0 });
      }
    });

    const createMovie = flow(function* (payload: {
      title: string;
      yearReleased: number;
      rating: string;
      description?: string;
      poster?: File | null;
    }) {
      self.loading = true;

      try {
        yield createMovieApi(payload);
        yield fetchMovies();
        yield fetchMovieStats();
      } finally {
        self.loading = false;
      }
    });

    const updateMovie = flow(function* (id: string, payload: {
      title: string;
      yearReleased: number;
      rating: string;
      description?: string;
      poster?: File | null;
      currentPosterUrl?: string;
    }) {
      self.loading = true;

      try {
        yield updateMovieApi(id, payload);
        yield fetchMovies();
        yield fetchMovieStats();
      } finally {
        self.loading = false;
      }
    });

    const deleteMovie = flow(function* (id: string) {
      self.loading = true;

      try {
        yield deleteMovieApi(id);
        yield fetchMovies();
        yield fetchMovieStats();
      } finally {
        self.loading = false;
      }
    });

    return {
      setSearch,
      setRating,
      setLimit,
      setPage,
      fetchMovies,
      fetchMovieStats,
      createMovie,
      updateMovie,
      deleteMovie,
    };
  });
