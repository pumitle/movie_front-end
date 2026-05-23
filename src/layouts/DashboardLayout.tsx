import type { ReactNode } from "react";

import Navbar from "../shared/components/Navbar";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <div
      className="
        min-h-screen
        bg-gray-100
      "
    >
      <Navbar />

      <main
        className="
          p-6
          max-w-7xl
          mx-auto
        "
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
