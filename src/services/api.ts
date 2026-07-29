import axios, { AxiosError } from "axios";
import type { ErrorResponse } from "../types/common";

const ENV_MIDDLE_SEGMENTS: Record<string, string> = {
  dev: "dev",
  qa: "qa",
  stage: "stage",
};

const DEFAULT_APP_DOMAIN = "grubzo.food";

function trimDots(value: string): string {
  return value.trim().replace(/^\.+|\.+$/g, "").toLowerCase();
}

function isIpAddress(hostname: string): boolean {
  return (
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) ||
    hostname.includes(":")
  );
}

function labelFromHost(
  hostname: string,
  appDomain: string
): { label: string; env?: string } | null {
  const normalizedHost = trimDots(hostname);

  if (
    !normalizedHost ||
    normalizedHost === "localhost" ||
    isIpAddress(normalizedHost) ||
    normalizedHost === appDomain ||
    !normalizedHost.endsWith(`.${appDomain}`)
  ) {
    return null;
  }

  let label = normalizedHost.slice(0, -appDomain.length - 1);
  if (!label) {
    return null;
  }

  for (const [env, segment] of Object.entries(ENV_MIDDLE_SEGMENTS)) {
    if (label.endsWith(`.${segment}`)) {
      label = label.slice(0, -segment.length - 1);
      return label && !label.includes(".") ? { label, env } : null;
    }
  }

  return label && !label.includes(".") ? { label } : null;
}

interface MetaInfo {
  tenants: string[];
  instance: string;
  environment: string;
  version: string;
  revision: string;
}

async function fetchInstanceName(): Promise<string> {
  try {
    const response = await apiFetch("/api/meta/info", {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return "";
    }

    const data: MetaInfo = await response.json();
    return trimDots(data.instance);
  } catch {
    return "";
  }
}

export async function isPlatformHost(
  hostname = window.location.hostname
): Promise<boolean> {
  const appDomain = trimDots(
    import.meta.env.VITE_APP_DOMAIN || DEFAULT_APP_DOMAIN
  );
  const parsed = labelFromHost(hostname, appDomain);
  if (!parsed) {
    return false;
  }
  const instance = await fetchInstanceName();
  return instance !== "" && parsed.label === instance;
}

export function resolveApiBaseUrl(): string {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, "");
  }

  if (typeof window === "undefined") {
    return "";
  }

  return "";
}

export const apiBaseUrl = resolveApiBaseUrl();

export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path) || !apiBaseUrl) {
    return path;
  }
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function apiFetch(
  input: string | URL | Request,
  init: RequestInit = {}
): Promise<Response> {
  const url = typeof input === "string" ? apiUrl(input) : input;
  return fetch(url, {
    ...init,
    credentials: init.credentials ?? "include",
  });
}

axios.defaults.baseURL = apiBaseUrl || undefined;
axios.defaults.withCredentials = true;

export function handleApiError(error: unknown): Promise<never>;
export function handleApiError<T extends ErrorResponse>(
  error: unknown,
  rejectWithValue: (value: T) => unknown
): never;
export function handleApiError<T extends ErrorResponse>(
  error: unknown,
  rejectWithValue?: (value: T) => unknown
): unknown {
  if (rejectWithValue == undefined) {
    rejectWithValue = ((value) => {
      return Promise.reject(value);
    }) as (value: T) => unknown;
  }

  const errorResponse: ErrorResponse = { Error: "Something went wrong" };
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string }>;
    if (axiosError.response?.data?.error) {
      errorResponse.Error = axiosError.response.data.error;
    }
  }
  return rejectWithValue(errorResponse as T);
}
