import type { CreateUserPayload, GetUsersParams } from "../types/user.types";

export const mapGetUsersParamsToApi = (params: GetUsersParams) => ({
  page: params.page,
  limit: params.limit,
  search: params.search,
  firstName: params.search,
  first_name: params.search,
  role: params.role,
});

export const mapUsersListResponseFromApi = (payload: unknown) => {
  const root = payload as any;
  const data = Array.isArray(root?.data) ? root.data : Array.isArray(root) ? root : [];

  return {
    data: data.map((user: any) => ({
      id: String(user.id),
      firstName: user.first_name ?? null,
      lastName: user.last_name ?? null,
      name: user.name ?? null,
      email: user.email ?? "-",
      role: user.role ?? "FLOORSTAFF",
    })),
    pagination: root?.pagination,
  };
};

export const mapCreateUserPayloadToApi = (payload: CreateUserPayload) => ({
  email: payload.email.trim(),
  firstName: payload.firstName.trim(),
  lastName: payload.lastName.trim(),
  role: payload.role,
});
