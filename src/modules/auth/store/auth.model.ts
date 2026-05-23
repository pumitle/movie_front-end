import { types } from "mobx-state-tree";

export const UserModel = types.model({
  id: types.string,

  first_name: types.maybe(types.string),

  last_name: types.maybe(types.string),

  name: types.maybe(types.string),

  email: types.string,

  role: types.string,
});
