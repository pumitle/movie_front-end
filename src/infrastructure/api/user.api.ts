import apiClient from "./apiClient";
import type { CreateUserPayload, GetUsersParams } from "../../modules/users/types/user.types";
import { mapCreateUserPayloadToApi, mapGetUsersParamsToApi, mapUsersListResponseFromApi } from "../../modules/users/mapper/user.mapper";

export const getUsersApi = async (params: GetUsersParams = {}) => {
  const response = await apiClient.get("/users", { params: mapGetUsersParamsToApi(params) });
  return mapUsersListResponseFromApi(response.data);
};

export const createUserApi = async (payload: CreateUserPayload) => {
  const response = await apiClient.post("/users/create", mapCreateUserPayloadToApi(payload));
  return response.data;
};
