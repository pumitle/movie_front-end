import { cast, flow, types } from "mobx-state-tree";
import { createUserApi, getUsersApi } from "../../../infrastructure/api/user.api";
import { UserItemModel } from "./user.model";

export const UserStore = types
  .model("UserStore", {
    users: types.array(UserItemModel),
    loading: types.optional(types.boolean, false),
    page: types.optional(types.number, 1),
    limit: types.optional(types.number, 10),
    total: types.optional(types.number, 0),
    totalPages: types.optional(types.number, 1),
    search: types.optional(types.string, ""),
    role: types.optional(types.string, ""),
  })
  .actions((self) => {
    const setSearch = (value: string) => {
      self.search = value;
      self.page = 1;
    };

    const setRole = (value: string) => {
      self.role = value;
      self.page = 1;
    };

    const setLimit = (value: number) => {
      self.limit = value;
      self.page = 1;
    };

    const setPage = (value: number) => {
      self.page = value;
    };

    const fetchUsers = flow(function* () {
      self.loading = true;
      try {
        const response = yield getUsersApi({
          page: self.page,
          limit: self.limit,
          search: self.search || undefined,
          role: self.role || undefined,
        });

        const users = Array.isArray(response?.data) ? response.data : [];
        const pagination = response?.pagination;

        self.users = cast(users);

        self.page = pagination?.page ?? self.page;
        self.limit = pagination?.limit ?? self.limit;
        self.total = pagination?.total ?? users.length;
        self.totalPages = pagination?.totalPages ?? 1;
      } finally {
        self.loading = false;
      }
    });

    const createUser = flow(function* (payload: {
      email: string;
      firstName: string;
      lastName: string;
      role: "MANAGER" | "TEAMLEADER" | "FLOORSTAFF";
    }) {
      self.loading = true;
      try {
        yield createUserApi(payload);
        yield fetchUsers();
      } finally {
        self.loading = false;
      }
    });

    return {
      setSearch,
      setRole,
      setLimit,
      setPage,
      fetchUsers,
      createUser,
    };
  });
