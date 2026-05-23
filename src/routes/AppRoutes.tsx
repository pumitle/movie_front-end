import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../modules/auth/pages/LoginPage";
import SetupPasswordPage from "../modules/auth/pages/SetupPasswordPage";

import MoviesPage from "../modules/movies/pages/MoviesPage";
import UsersPage from "../modules/users/pages/UsersPage";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "./routes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SETUP_PASSWORD} element={<SetupPasswordPage />} />

        <Route
          path={ROUTES.MOVIES}
          element={
            <ProtectedRoute>
              <MoviesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.USERS}
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
