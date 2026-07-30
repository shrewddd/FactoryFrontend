import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { routes } from "@/routes/index";
import { useAuth } from "@/AuthProvider";
import { Layout } from "@/components/sidebar/layout";
import { NotFoundPage } from "@/pages/not-found";
import { useMemo } from "react";

export function AppRoutes() {
  const { user } = useAuth();

  const authRoute = useMemo(() => routes.find(r => r.path === "/auth"), []);
  const layoutRoutes = useMemo(() => routes.filter(r => r.path !== "/auth" && r.layout), []);
  const plainRoutes = useMemo(() => routes.filter(r => r.path !== "/auth" && !r.layout), []);

  if (!authRoute) throw new Error('Missing /auth route in routes config');

  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : authRoute.element}
      />
      <Route element={<ProtectedRoute roles={["*"]} />}>
        <Route element={<Layout/>}>
          {layoutRoutes.map(route => (
            <Route key={route.path} path={route.path} element={route.element}/>
          ))}
        </Route>
        {plainRoutes.map(route => (
          <Route key={route.path} path={route.path} element={route.element}/>
        ))}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
