"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Home, User, List, Film, Clock, Bookmark, Star, MessageCircle, ShoppingCart, Settings, LayoutDashboard, PlusCircle, Users, CreditCard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavSection } from "@/types/dashboard.types";

interface DashboardSidebarProps {
  navSections: NavSection[];
  onLogout: () => Promise<void>;
  isLogoutPending: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  User,
  List,
  Film,
  Clock,
  Bookmark,
  Star,
  MessageCircle,
  ShoppingCart,
  Settings,
  LayoutDashboard,
  PlusCircle,
  Users,
  CreditCard,
  LogOut,
};

export const DashboardSidebar = ({ navSections, onLogout, isLogoutPending }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (href: string) => pathname === href;

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Home;
  };

  return (
    <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-black text-sm">
            C
          </div>
          {sidebarOpen && <span className="font-bold text-red-500">CinePlex</span>}
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navSections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            {section.title && sidebarOpen && (
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </div>
            )}
            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = getIcon(item.icon);
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active ? "bg-red-600 text-white" : "text-gray-300 hover:bg-slate-800 hover:text-red-400"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span className="text-sm font-medium">{item.title}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-800">
        <Button
          onClick={onLogout}
          disabled={isLogoutPending}
          className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
        >
          <LogOut className="h-4 w-4" />
          {sidebarOpen && (isLogoutPending ? "Logging out..." : "Logout")}
        </Button>
      </div>

      {/* Toggle Sidebar */}
      <div className="p-4 border-t border-slate-800">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="outline"
          className="w-full border-slate-700 text-red-500 hover:bg-slate-800"
          size="sm"
        >
          {sidebarOpen ? "←" : "→"}
        </Button>
      </div>
    </aside>
  );
};
