import { describe, expect, it } from "vitest";
import { z } from "zod";

import { zodToFormik } from "./zodToFormik";

describe("zodToFormik", () => {
  const validate = zodToFormik(
    z.object({
      email: z.string().email("Invalid email"),
      profile: z.object({
        name: z.string().min(1, "Name is required"),
      }),
    })
  );

  it("returns no errors for valid values", () => {
    expect(
      validate({
        email: "person@example.com",
        profile: { name: "Person" },
      })
    ).toEqual({});
  });

  it("maps zod issues into formik field errors", () => {
    expect(
      validate({
        email: "not-an-email",
        profile: { name: "" },
      })
    ).toEqual({
      email: "Invalid email",
      "profile.name": "Name is required",
    });
  });
});
