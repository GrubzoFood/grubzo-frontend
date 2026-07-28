import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";
import { useAuth } from "./hooks/useAuth";
import { isPlatformHost } from "./services/api";
import type { User } from "./types/auth";

vi.mock("./services/api", () => ({
  isPlatformHost: vi.fn(),
}));

vi.mock("./context/AuthProvider", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("./hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("./components/Header", () => ({
  default: () => <header>App Header</header>,
}));

vi.mock("./pages/Authentication/Login", () => ({
  default: () => <main>Login Page</main>,
}));

vi.mock("./pages/Authentication/Signup", () => ({
  default: () => <main>Signup Page</main>,
}));

vi.mock("./pages/Employee", () => ({
  default: () => <main>Employee Home</main>,
}));

vi.mock("./pages/Customer", () => ({
  default: () => <main>Customer Home</main>,
}));

vi.mock("./pages/Platform", () => ({
  default: () => <main>Platform Admin</main>,
}));

vi.mock("./pages/NotFound", () => ({
  default: () => <main>Page Not Found</main>,
}));

const mockedIsPlatformHost = vi.mocked(isPlatformHost);
const mockedUseAuth = vi.mocked(useAuth);

function renderApp(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe("App", () => {
  beforeEach(() => {
    mockedIsPlatformHost.mockResolvedValue(false);
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
      refreshUser: vi.fn(),
    });
  });

  it("shows the platform admin app for platform hosts", async () => {
    mockedIsPlatformHost.mockResolvedValue(true);

    renderApp("/");

    expect(await screen.findByText("Platform Admin")).toBeInTheDocument();
  });

  it("redirects unauthenticated tenant users to login", async () => {
    renderApp("/");

    expect(await screen.findByText("Login Page")).toBeInTheDocument();
  });

  it("renders tenant pages for authenticated users", async () => {
    const user: User = {
      ID: 1,
      Type: "user",
      Name: "Test User",
      Email: "user@example.com",
      Roles: [],
      Permisssions: [],
      Location: {
        ID: 1,
        Code: "LOC",
        Address: "Address",
        City: "City",
        State: "State",
        Country: "Country",
        ZipCode: "123456",
        IsPrimary: true,
      },
    };

    mockedUseAuth.mockReturnValue({
      user,
      loading: false,
      isAuthenticated: true,
      refreshUser: vi.fn(),
    });

    renderApp("/employee");

    expect(await screen.findByText("App Header")).toBeInTheDocument();
    expect(screen.getByText("Employee Home")).toBeInTheDocument();
  });
});
