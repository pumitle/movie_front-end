import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useStore } from "../../../shared/hooks/useStore";
import { ROUTES } from "../../../routes/routes";

const LoginPage = observer(() => {
  const navigate = useNavigate();
  const { authStore } = useStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      await authStore.login(email, password);
      navigate(ROUTES.MOVIES);
    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 gap-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
            <line x1="7" y1="2" x2="7" y2="22" />
            <line x1="17" y1="2" x2="17" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="2" y1="7" x2="7" y2="7" />
            <line x1="2" y1="17" x2="7" y2="17" />
            <line x1="17" y1="7" x2="22" y2="7" />
            <line x1="17" y1="17" x2="22" y2="17" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-900">
          MovieCMS <span className="font-normal text-gray-400">/ Admin</span>
        </span>
      </div>

      <div className="w-full max-w-sm">
        <LoginForm loading={authStore.loading} onSubmit={handleLogin} />
      </div>

      <p className="text-xs text-gray-400">
        Restricted access — authorized personnel only
      </p>
    </div>
  );
});

export default LoginPage;
