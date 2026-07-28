import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, Outlet, Navigate, useLocation } from "react-router";

import Header from "./components/Header";
import Login from "./pages/Authentication/Login";
import Signup from "./pages/Authentication/Signup";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./pages/NotFound";
import EmployeeHome from "./pages/Employee";
import UserHome from "./pages/Customer";
import PlatformPage from "./pages/Platform";
import { isPlatformHost } from "./services/api";

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    const isEmployeeRoute = location.pathname.includes("employee");
    return (
      <Navigate
        to={isEmployeeRoute ? "/login?t=emp" : "/login"}
        replace
        state={{ from: location }}
      />
    );
  }
  return <Outlet />;
}

function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (isAuthenticated) {
    const redirectTo =
      (location.state as { from?: Location })?.from?.pathname || "/";
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function TenantApp() {
  const { loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<UserHome />} />
          <Route path="/employee" element={<EmployeeHome />} />
        </Route>
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const [checkingHost, setCheckingHost] = useState(true);
  const [platformHost, setPlatformHost] = useState(false);

  useEffect(() => {
    let mounted = true;
    isPlatformHost().then((isPlatform) => {
      if (!mounted) return;
      setPlatformHost(isPlatform);
      setCheckingHost(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (checkingHost) return null;

  if (platformHost) {
    return <PlatformPage />;
  }

  return (
    <AuthProvider>
      <TenantApp />
    </AuthProvider>
  );
}

export default App;
