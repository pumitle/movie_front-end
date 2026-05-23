import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../shared/hooks/useStore";
import { ROUTES } from "./routes";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = observer(({ children }: Props) => {
  const { authStore } = useStore();

  if (authStore.initializing) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!authStore.user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
});

export default ProtectedRoute;
