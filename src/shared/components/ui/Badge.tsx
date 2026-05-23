interface Props {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

import type { ReactNode } from "react";

const Badge = ({ children, variant = "default" }: Props) => {
  const variants = {
    default: "bg-gray-100 text-gray-600",
    success: "bg-green-50 text-green-700",
    warning: "bg-yellow-50 text-yellow-700",
    danger: "bg-red-50 text-red-600",
    info: "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

export default Badge;