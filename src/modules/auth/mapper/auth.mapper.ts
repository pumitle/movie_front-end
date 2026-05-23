type ApiEnvelope<T> = T | { data: T };

export const unwrapAuthResponse = <T>(payload: ApiEnvelope<T>): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
};
