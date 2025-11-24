"use client";

import { FC, ReactNode, createContext, useContext, useState } from "react";
import { X } from "lucide-react";

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextType | null>(null);

interface SheetProps {
  children: ReactNode;
}

export const Sheet: FC<SheetProps> & {
  Trigger: FC<{ children: ReactNode; asChild?: boolean }>;
  Content: FC<{ children: ReactNode; className?: string }>;
  Header: FC<{ children: ReactNode }>;
  Title: FC<{ children: ReactNode }>;
} = ({ children }) => {
  const [open, setOpen] = useState(false);

  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>;
};

// Trigger
Sheet.Trigger = ({ children, asChild = false }) => {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("Sheet.Trigger must be used inside Sheet");

  if (asChild && typeof children === "object") {
    return (
      <div onClick={() => ctx.setOpen(true)} className="inline-block cursor-pointer">
        {children}
      </div>
    );
  }

  return (
    <button
      onClick={() => ctx.setOpen(true)}
      className="px-3 py-2 rounded-md border hover:bg-gray-100"
    >
      {children}
    </button>
  );
};

// Content
Sheet.Content = ({ children, className }) => {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("Sheet.Content must be used inside Sheet");

  if (!ctx.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30">
      <div className={`bg-white h-full p-4 shadow-lg relative ${className ?? ""}`}>
        {children}
        <button
          onClick={() => ctx.setOpen(false)}
          className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-full"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

// Header
Sheet.Header = ({ children }) => {
  return <div className="mb-4 border-b pb-2">{children}</div>;
};

// Title
Sheet.Title = ({ children }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
};
