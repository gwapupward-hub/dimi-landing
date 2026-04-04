import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { LogOut, Home, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { logout } = useAuth();
  const [location] = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* App Navigation */}
      <nav className="border-b border-gray-800 bg-black sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/app">
              <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 bg-gradient-to-b from-purple-500 via-green-500 to-blue-500 rounded-sm"></div>
                  <span className="text-lg font-bold tracking-tight">dimi</span>
                </div>
              </a>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/app">
                <a
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive("/app")
                      ? "text-green-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Home size={16} />
                  App
                </a>
              </Link>
              <Link href="/app/rooms">
                <a
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive("/app/rooms")
                      ? "text-green-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Users size={16} />
                  Rooms
                </a>
              </Link>
              <Link href="/app/profile">
                <a
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive("/app/profile")
                      ? "text-green-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <User size={16} />
                  Profile
                </a>
              </Link>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Mobile Navigation Footer */}
      <nav className="md:hidden border-t border-gray-800 bg-black sticky bottom-0">
        <div className="flex justify-around items-center h-16">
          <Link href="/app">
            <a
              className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                isActive("/app")
                  ? "text-green-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Home size={20} />
              <span>App</span>
            </a>
          </Link>
          <Link href="/app/rooms">
            <a
              className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                isActive("/app/rooms")
                  ? "text-green-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Users size={20} />
              <span>Rooms</span>
            </a>
          </Link>
          <Link href="/app/profile">
            <a
              className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                isActive("/app/profile")
                  ? "text-green-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <User size={20} />
              <span>Profile</span>
            </a>
          </Link>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
