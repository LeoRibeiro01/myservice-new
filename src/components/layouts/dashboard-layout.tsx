"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layouts/sidebar"
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems: { label: string; href: string; icon?: ReactNode }[];
}

export const DashboardLayout = ({ children, sidebarItems }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
};
