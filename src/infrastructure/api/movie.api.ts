import apiClient from "./apiClient";
import type { CreateMoviePayload, GetMoviesParams } from "../../modules/movies/types/movie.types";
import {
  mapCreateMoviePayloadToFormData,
  mapGetMoviesParamsToApi,
  mapMovieDetailFromApi,
  mapMovieListResponseFromApi,
  mapMovieStatsFromApi,
} from "../../modules/movies/mapper/movie.mapper";

export const getMoviesApi = async (params: GetMoviesParams = {}) => {
  const response = await apiClient.get("/movies", { params: mapGetMoviesParamsToApi(params) });
  return mapMovieListResponseFromApi(response.data);
};

export const getMovieStatsApi = async () => {
  const response = await apiClient.get("/movies/stats");
  return mapMovieStatsFromApi(response.data);
};

export const createMovieApi = async (payload: CreateMoviePayload) => {
  const formData = await mapCreateMoviePayloadToFormData(payload);
  const response = await apiClient.post("/movies/create", formData);
  return response.data;
};

export const getMovieByIdApi = async (id: string) => {
  const response = await apiClient.get(`/movies/${id}`);
  return mapMovieDetailFromApi(response.data, id);
};

export const updateMovieApi = async (id: string, payload: CreateMoviePayload) => {
  const formData = await mapCreateMoviePayloadToFormData(payload);
  const response = await apiClient.put(`/movies/${id}`, formData);
  return response.data;
};

export const deleteMovieApi = async (id: string) => {
  const response = await apiClient.delete(`/movies/${id}`);
  return response.data;
};
