export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  firstName?: string;
  first_name?: string;
  role?: string;
}

export interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  role: "MANAGER" | "TEAMLEADER" | "FLOORSTAFF";
}
