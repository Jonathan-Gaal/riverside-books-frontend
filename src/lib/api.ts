import type { PaginationMeta } from "@/types";

export class ApiError extends Error {
  status: number;
  code: string | null;
  constructor(message: string, status: number, code: string | null) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type Envelope<T> = { data: T; error: null; meta?: PaginationMeta };

async function requestEnvelope<T>(path: string, init?: RequestInit): Promise<Envelope<T>> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = await response.json();
  if (!response.ok || body.error) {
    throw new ApiError(
      body.error?.message ?? "Request failed",
      response.status,
      body.error?.code ?? null,
    );
  }
  return body as Envelope<T>;
}

export const api = {
  get: <T>(path: string) => requestEnvelope<T>(path).then((envelope) => envelope.data),
  // `meta` is only present once the backend has deployed pagination support for
  // that route -- absent means the endpoint returned every match, uncut. T is
  // the item type (matching api.get<T[]>'s convention) -- items comes back T[].
  getPaginated: <T>(path: string) =>
    requestEnvelope<T[]>(path).then((envelope) => ({ items: envelope.data, meta: envelope.meta })),
  post: <T>(path: string, body: unknown) =>
    requestEnvelope<T>(path, { method: "POST", body: JSON.stringify(body) }).then(
      (envelope) => envelope.data,
    ),
  patch: <T>(path: string, body: unknown) =>
    requestEnvelope<T>(path, { method: "PATCH", body: JSON.stringify(body) }).then(
      (envelope) => envelope.data,
    ),
};
