import { types } from "mobx-state-tree";

import { AuthStore } from "../modules/auth/store/auth.store";
import { MovieStore } from "../modules/movies/store/movie.store";
import { UserStore } from "../modules/users/store/user.store";

export const RootStore = types.model({
  authStore: AuthStore,
  movieStore: MovieStore,
  userStore: UserStore,
});

export const rootStore = RootStore.create({
  authStore: {},
  movieStore: {
    movies: [],
  },
  userStore: {
    users: [],
  },
});
