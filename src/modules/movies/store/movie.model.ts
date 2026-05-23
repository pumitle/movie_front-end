import { types } from "mobx-state-tree";

export const MovieModel = types.model("MovieModel", {
  id: types.string,
  title: types.string,
  rating: types.string,
  yearReleased: types.number,
  posterUrl: types.maybeNull(types.string),
});

export const RatingStatsModel = types.model("RatingStatsModel", {
  G: types.optional(types.number, 0),
  PG: types.optional(types.number, 0),
  M: types.optional(types.number, 0),
  MA: types.optional(types.number, 0),
  R: types.optional(types.number, 0),
});
