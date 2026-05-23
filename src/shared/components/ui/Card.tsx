import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className }: Props) => (
  <div
    className={`rounded-xl border border-gray-100 bg-white p-6 ${className ?? ""}`}
  >
    {children}
  </div>
);

export default Card;
