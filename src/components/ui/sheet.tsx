"use client";

import { FC, ReactNode, createContext, useContext, useState } from "react";
import { X } from "lucide-react";

interface SheetProps {
  children: ReactNode;
}

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextType | null>(null);

export const Sheet: FC<SheetProps> & {
  Content: FC<{ children: ReactNode }>;
  Header: FC<{ children: ReactNode }>;
  Title: FC<{ children: ReactNode }>;
  Trigger: FC<{ children: ReactNode }>;
} = ({ children }) => {
  const [open, setOpen] = useState(false);

  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>;
};

// Trigger
Sheet.Trigger = ({ children }) => {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("Sheet.Trigger must be used inside Sheet");

  return (
    <div onClick={() => ctx.setOpen(true)} className="inline-block cursor-pointer">
      {children}
    </div>
  );
};

// Content
Sheet.Content = ({ children }) => {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("Sheet.Content must be used inside Sheet");

  if (!ctx.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="bg-black/30 w-full h-full" onClick={() => ctx.setOpen(false)}></div>
      <div className="bg-white w-64 h-full p-4 shadow-lg relative">
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
