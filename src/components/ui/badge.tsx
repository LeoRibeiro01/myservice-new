import { FC, ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "destructive"; // define os tipos que vai usar
}

export const Badge: FC<BadgeProps> = ({ children, className, variant = "default" }) => {
  let baseClass = "px-2 py-1 rounded text-sm font-medium";

  if (variant === "default") baseClass += " bg-gray-100 text-gray-800";
  if (variant === "secondary") baseClass += " bg-gray-200 text-gray-600";
  if (variant === "destructive") baseClass += " bg-red-500 text-white";

  return <span className={`${baseClass} ${className ?? ""}`}>{children}</span>;
};
