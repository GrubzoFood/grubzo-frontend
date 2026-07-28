import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { describe, expect, it, vi } from "vitest";

import CInput from "./CInput";

describe("CInput", () => {
  it("renders field text and sends changed values upstream", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Theme>
        <CInput
          label="Email"
          placeholder="you@example.com"
          value=""
          error="Email is required"
          onChange={handleChange}
        />
      </Theme>
    );

    await user.type(screen.getByPlaceholderText("you@example.com"), "a");

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(handleChange).toHaveBeenCalledWith("a");
  });
});
