import { afterEach, describe, expect, it, vi } from "vitest";

import { apiFetch, apiUrl, isPlatformHost } from "./api";

describe("api helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("leaves relative API paths unchanged when no base URL is configured", () => {
    expect(apiUrl("/api/orders")).toBe("/api/orders");
    expect(apiUrl("auth/v1/login")).toBe("auth/v1/login");
  });

  it("adds credentials to fetch requests by default", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok"));
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/api/orders", { headers: { Accept: "application/json" } });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/orders",
      expect.objectContaining({
        credentials: "include",
        headers: { Accept: "application/json" },
      })
    );
  });

  it("matches platform hosts against the configured instance name", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        tenants: ["tenant"],
        instance: "tenant",
        environment: "dev",
        version: "test",
        revision: "test",
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(isPlatformHost("tenant.grubzo.food")).resolves.toBe(true);
    await expect(isPlatformHost("other.grubzo.food")).resolves.toBe(false);
    await expect(isPlatformHost("localhost")).resolves.toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/meta/info",
      expect.objectContaining({
        credentials: "include",
        headers: { Accept: "application/json" },
      })
    );
  });
});
