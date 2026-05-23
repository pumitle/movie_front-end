import { types } from "mobx-state-tree";

export const UserItemModel = types.model("UserItemModel", {
  id: types.string,
  firstName: types.maybeNull(types.string),
  lastName: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  email: types.string,
  role: types.string,
});
