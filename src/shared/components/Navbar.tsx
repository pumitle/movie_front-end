import { observer } from "mobx-react-lite";

import { useLocation, useNavigate } from "react-router-dom";

import { useStore } from "../hooks/useStore";
import { ROUTES } from "../../routes/routes";

const Navbar = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();

  const { authStore } = useStore();
  const firstName = authStore.user?.first_name?.trim() ?? "";
  const lastName = authStore.user?.last_name?.trim() ?? "";
  const fullName = `${firstName} ${lastName}`.trim();
  const displayName = fullName || authStore.user?.name || authStore.user?.email;
  const role = authStore.user?.role?.toUpperCase() ?? "FLOORSTAFF";
  const roleStyles: Record<string, string> = {
    MANAGER: "border-red-200 bg-red-50 text-red-700",
    TEAMLEADER: "border-blue-200 bg-blue-50 text-blue-700",
    FLOORSTAFF: "border-sky-200 bg-sky-50 text-sky-700",
  };
  const roleClass = roleStyles[role] ?? "border-gray-200 bg-gray-50 text-gray-700";

  return (
    <nav
      className="
        bg-white
        border-b
        px-6
        py-4
        flex
        items-center
        justify-between
      "
    >
      <div>
        <h1
          className="
            text-xl
            font-bold
          "
        >
          Movie Dashboard
        </h1>
      </div>

      <div
        className="
          flex
          items-center
          gap-4
        "
      >
        <div className="inline-flex rounded-xl border border-gray-200 bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => navigate(ROUTES.MOVIES)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              location.pathname === ROUTES.MOVIES
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Movies
          </button>
          {role === "MANAGER" && (
            <button
              type="button"
              onClick={() => navigate(ROUTES.USERS)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                location.pathname === ROUTES.USERS
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Users
            </button>
          )}
        </div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {displayName}
            </p>
            <p className="text-xs text-gray-500">{authStore.user?.email}</p>
          </div>
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${roleClass}`}
          >
            {role}
          </span>
        </div>

        <button
          onClick={async () => {
            await authStore.logout();

            navigate("/");
          }}
          className="
            rounded-lg
            bg-black
            px-4
            py-2
            text-white
          "
        >
          Logout
        </button>
      </div>
    </nav>
  );
});

export default Navbar;
