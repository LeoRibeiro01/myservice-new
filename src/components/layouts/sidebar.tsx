"use client";

import { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sidebar-ui"; // <- importa o Sheet
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
}

export const Sidebar: FC<SidebarProps> = ({ items }) => {
  return (
    <Sheet>
      <Sheet.Trigger asChild>
        <Button variant="outline">Menu</Button>
      </Sheet.Trigger>

      <Sheet.Content className="w-64 p-4">
        <Sheet.Header>
          <Sheet.Title>Dashboard</Sheet.Title>
        </Sheet.Header>

        <ScrollArea className="mt-4 h-[calc(100%-64px)]">
          <nav className="flex flex-col space-y-2">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-gray-100"
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </ScrollArea>
      </Sheet.Content>
    </Sheet>
  );
};
