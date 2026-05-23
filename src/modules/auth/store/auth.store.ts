import { types, flow } from "mobx-state-tree";
import { loginApi, logoutApi, myprofile } from "../../../infrastructure/api/auth.api";
import { UserModel } from "./auth.model";

export const AuthStore = types
  .model("AuthStore", {
    accessToken: types.maybeNull(types.string),
    refreshToken: types.maybeNull(types.string),
    user: types.maybeNull(UserModel),
    loading: types.optional(types.boolean, false),
    initializing: types.optional(types.boolean, true),
  })
  .actions((self) => {
    const setTokens = (accessToken: string, refreshToken: string) => {
      self.accessToken = accessToken;
      self.refreshToken = refreshToken;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    };

    const clearAuth = () => {
      self.accessToken = null;
      self.refreshToken = null;
      self.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    };

    const initialize = flow(function* () {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken) {
        self.initializing = false;
        return;
      }

      self.accessToken = accessToken;
      self.refreshToken = refreshToken;
      yield getMe();
    });

    const login = flow(function* (email: string, password: string) {
      self.loading = true;

      try {
        const response = yield loginApi({
          email,
          password,
        });

        const payload = response;
        setTokens(payload.accessToken, payload.refreshToken);

        if (payload.user) {
          self.user = payload.user;
        } else {
          yield getMe();
        }

        self.initializing = false;
      } finally {
        self.loading = false;
      }
    });

    const getMe = flow(function* () {
      try {
        const response = yield myprofile();
        self.user = response;
      } catch {
        clearAuth();
      } finally {
        self.initializing = false;
      }
    });

    const logout = flow(function* () {
      try {
        yield logoutApi();
      } finally {
        clearAuth();
      }
    });

    return {
      initialize,
      login,
      getMe,
      logout,
    };
  });
