import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useStore } from "./shared/hooks/useStore";

function App() {
  const { authStore } = useStore();

  useEffect(() => {
    authStore.initialize();
  }, [authStore]);

  return <AppRoutes />;
}

export default App;
