export type LogLevel = "info" | "warn" | "error";

type LogPrimitive = string | number | boolean | null;
type LogContextValue = LogPrimitive | readonly LogContextValue[] | LogContextObject;

interface LogContextObject {
  readonly [key: string]: LogContextValue | undefined;
}

export type LogContext = Record<string, LogContextValue | undefined>;

interface SerializedError extends LogContextObject {
  name: string;
  message: string;
  stack?: string;
  digest?: string;
}

const SENSITIVE_CONTEXT_KEY = /(authorization|cookie|password|secret|token|api[-_]?key)/i;

function createRequestId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

function normalizeContext(context: LogContext = {}) {
  return Object.entries(context).reduce<Record<string, LogContextValue>>(
    (normalized, [key, value]) => {
      if (value === undefined) return normalized;

      normalized[key] = SENSITIVE_CONTEXT_KEY.test(key) ? "[redacted]" : value;
      return normalized;
    },
    {},
  );
}

export function serializeError(error: unknown): SerializedError {
  if (error instanceof Error) {
    const digest =
      "digest" in error && typeof error.digest === "string"
        ? error.digest
        : undefined;

    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      digest,
    };
  }

  return {
    name: "UnknownError",
    message: typeof error === "string" ? error : String(error),
  };
}

function writeLog(level: LogLevel, message: string, context?: LogContext) {
  const entry = JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...normalizeContext(context),
  });

  if (level === "error") {
    console.error(entry);
    return;
  }

  if (level === "warn") {
    console.warn(entry);
    return;
  }

  console.info(entry);
}

export function logInfo(message: string, context?: LogContext) {
  writeLog("info", message, context);
}

export function logWarn(message: string, context?: LogContext) {
  writeLog("warn", message, context);
}

export function logError(
  message: string,
  error?: unknown,
  context?: LogContext,
) {
  writeLog("error", message, {
    ...context,
    ...(error === undefined ? {} : { error: serializeError(error) }),
  });
}

export function getDurationMs(startedAt: number) {
  return Math.max(0, Date.now() - startedAt);
}

export function getRequestLogContext(request: Request, route: string): LogContext {
  return {
    route,
    method: request.method,
    requestId:
      request.headers.get("x-vercel-id") ??
      request.headers.get("x-request-id") ??
      createRequestId(),
  };
}
