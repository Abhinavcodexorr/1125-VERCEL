const BACKEND_FETCH_TIMEOUT_MS = 45_000;

export async function fetchBackend(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  return fetch(input, {
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(BACKEND_FETCH_TIMEOUT_MS),
  });
}
