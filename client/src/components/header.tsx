import { Link, useLocation } from "wouter";
import { Users, Package, User as UserIcon, LogOut, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { Notifications } from "@/components/notifications";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export default function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const typedUser = user as User | undefined;

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Clear all cached queries
        queryClient.clear();
        // Reload the page to reset the app state
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: try the GET endpoint
      window.location.href = '/api/logout';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <Logo className="h-10 w-auto text-primary cursor-pointer" />
            </Link>
          </div>
          


          <div className="flex items-center space-x-4">
            {isAuthenticated && typedUser?.role === 'homeowner' && <Notifications />}
            
            {isAuthenticated && typedUser && (
              <>
                <div className="flex items-center space-x-2">
                  <Badge variant={typedUser.role === 'homeowner' ? 'default' : 'secondary'}>
                    {typedUser.role === 'homeowner' ? 'Homeowner' : 'Contractor'}
                  </Badge>
                  <span className="text-sm text-gray-700">
                    {typedUser.firstName || typedUser.email}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
            
            {!isAuthenticated && (
              <Button 
                className="bg-primary text-white hover:bg-blue-700"
                onClick={() => window.location.href = '/signin'}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
