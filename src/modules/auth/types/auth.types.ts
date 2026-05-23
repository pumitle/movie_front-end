export interface LoginPayload {
    email: string;
    password: string;
}

export interface SetupPasswordPayload {
  token: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;

  user: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    name?: string | null;
    email: string;
    role: string;
  };
}
