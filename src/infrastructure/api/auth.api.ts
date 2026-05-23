import apiClient from "./apiClient";
import type { LoginPayload, LoginResponse, SetupPasswordPayload } from "../../modules/auth/types/auth.types";
import type { Instance } from "mobx-state-tree";
import { UserModel } from "../../modules/auth/store/auth.model";
import { unwrapAuthResponse } from "../../modules/auth/mapper/auth.mapper";

type User = Instance<typeof UserModel>;
type ApiEnvelope<T> = T | { data: T };

export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiEnvelope<LoginResponse>>("/auth/login", payload);
  return unwrapAuthResponse(response.data);
};

export const myprofile = async (): Promise<User> => {
  const response = await apiClient.get<ApiEnvelope<User>>("/users/me");
  return unwrapAuthResponse(response.data);
};

export const logoutApi = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};

export const setupPasswordApi = async (payload: SetupPasswordPayload) => {
  const response = await apiClient.post("/auth/setup-pass", payload);
  return response.data;
};
