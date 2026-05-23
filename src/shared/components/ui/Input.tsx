import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, className, ...props }: Props) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-xs font-medium text-gray-500">{label}</label>
    )}
    <input
      {...props}
      className={`
        h-9 w-full rounded-lg border px-3 text-sm outline-none transition
        ${error ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-gray-400"}
        bg-white text-gray-900 placeholder:text-gray-300
        ${className ?? ""}
      `}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default Input;
