const BACKEND_FETCH_TIMEOUT_MS = 60_000;
const CONNECT_TIMEOUT_MS = 45_000;
const MAX_ATTEMPTS = 3;

type FetchWithDispatcher = RequestInit & { dispatcher?: unknown };

let backendDispatcher: unknown | undefined;

function getBackendDispatcher(): unknown | undefined {
  if (typeof window !== "undefined") {
    return undefined;
  }

  if (backendDispatcher !== undefined) {
    return backendDispatcher || undefined;
  }

  try {
    // Node's built-in undici. Default connect timeout is 10s, which is too
    // short for a sleeping Render instance to wake up.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Agent } = require("node:undici") as {
      Agent: new (options: Record<string, number>) => unknown;
    };
    backendDispatcher = new Agent({
      connectTimeout: CONNECT_TIMEOUT_MS,
      headersTimeout: BACKEND_FETCH_TIMEOUT_MS,
      bodyTimeout: BACKEND_FETCH_TIMEOUT_MS,
    });
  } catch {
    backendDispatcher = null;
  }

  return backendDispatcher || undefined;
}

function isRetryableNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const cause = (error as { cause?: Error }).cause;
  const text = `${error.name} ${error.message} ${cause?.name ?? ""} ${cause?.message ?? ""}`;

  return (
    error.name === "TimeoutError" ||
    error.name === "AbortError" ||
    text.includes("ConnectTimeout") ||
    text.includes("UND_ERR") ||
    text.includes("fetch failed") ||
    text.includes("ECONNRESET") ||
    text.includes("ETIMEDOUT")
  );
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchBackend(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const dispatcher = getBackendDispatcher();
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const options: FetchWithDispatcher = {
        ...init,
        signal: init?.signal ?? AbortSignal.timeout(BACKEND_FETCH_TIMEOUT_MS),
      };
      if (dispatcher) {
        options.dispatcher = dispatcher;
      }
      return await fetch(input, options);
    } catch (error) {
      lastError = error;
      const canRetry = attempt < MAX_ATTEMPTS && !init?.signal && isRetryableNetworkError(error);
      if (!canRetry) {
        throw error;
      }
      await wait(attempt * 1500);
    }
  }

  throw lastError;
}
