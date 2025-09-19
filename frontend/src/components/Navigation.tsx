"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Home, History } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Calculator",
    href: "/calculator",
    icon: Calculator,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Calculator className="h-6 w-6" />
              <span className="font-bold text-xl">Calculator App</span>
            </Link>

            <div className="flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="http://localhost:8000/export-file"
              target="_blank"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Export Data
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}