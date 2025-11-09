import { Link, useLocation } from "wouter";
import { Users, Package, User as UserIcon, LogOut, MessageCircle, Trophy, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { Notifications } from "@/components/notifications";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import type { User } from "@shared/schema";

// Helper function for consistent nav link styling
const getNavLinkClass = (isActive: boolean) => cn(
  "relative inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
  isActive
    ? "text-primary bg-primary/10 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
);

export default function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const typedUser = user as User | undefined;

  // Check if user is admin
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((e: string) => e.trim()).filter(Boolean);
  const isAdmin = typedUser?.email && adminEmails.includes(typedUser.email);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Clear all cached queries
        queryClient.clear();
        // Redirect to signin page
        window.location.href = '/signin';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: redirect to signin
      window.location.href = '/signin';
    }
  };

  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" aria-label="Home">
              <Logo className="h-10 w-auto text-primary cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-2" aria-label="Main navigation">
            {isAdmin && (
              <Link 
                href="/admin" 
                className={getNavLinkClass(location === '/admin')} 
                data-testid="link-admin"
                aria-current={location === '/admin' ? 'page' : undefined}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
            {typedUser?.role === 'homeowner' && (
              <>
                <Link 
                  href="/maintenance" 
                  className={getNavLinkClass(location === '/maintenance')}
                  aria-current={location === '/maintenance' ? 'page' : undefined}
                >
                  Maintenance
                </Link>
                <Link 
                  href="/contractors" 
                  className={getNavLinkClass(location === '/contractors' || location === '/find-contractors')}
                  aria-current={location === '/contractors' || location === '/find-contractors' ? 'page' : undefined}
                >
                  Contractors
                </Link>
                <Link 
                  href="/products" 
                  className={getNavLinkClass(location === '/products')}
                  aria-current={location === '/products' ? 'page' : undefined}
                >
                  Products
                </Link>
                <Link 
                  href="/messages" 
                  className={getNavLinkClass(location === '/messages')}
                  aria-current={location === '/messages' ? 'page' : undefined}
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                </Link>
                <Link 
                  href="/achievements" 
                  className={getNavLinkClass(location === '/achievements')} 
                  data-testid="link-achievements"
                  aria-current={location === '/achievements' ? 'page' : undefined}
                >
                  <Trophy className="w-4 h-4" />
                  Achievements
                </Link>
                <Link 
                  href="/account" 
                  className={getNavLinkClass(location === '/account')}
                  aria-current={location === '/account' ? 'page' : undefined}
                >
                  <UserIcon className="w-4 h-4" />
                  Account
                </Link>
              </>
            )}
            {typedUser?.role === 'contractor' && (
              <>
                <Link 
                  href="/contractor-dashboard" 
                  className={getNavLinkClass(location === '/contractor-dashboard')}
                  aria-current={location === '/contractor-dashboard' ? 'page' : undefined}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/manage-team" 
                  className={getNavLinkClass(location === '/manage-team')} 
                  data-testid="link-manage-team"
                  aria-current={location === '/manage-team' ? 'page' : undefined}
                >
                  <Users className="w-4 h-4" />
                  Manage Team
                </Link>
                <Link 
                  href="/messages" 
                  className={getNavLinkClass(location === '/messages')}
                  aria-current={location === '/messages' ? 'page' : undefined}
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                </Link>
                <Link 
                  href="/contractor-profile" 
                  className={getNavLinkClass(location === '/contractor-profile')}
                  aria-current={location === '/contractor-profile' ? 'page' : undefined}
                >
                  <UserIcon className="w-4 h-4" />
                  Profile
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && (typedUser?.role === 'homeowner' || typedUser?.role === 'contractor') && <Notifications />}
            
            {isAuthenticated && typedUser && (
              <div className="flex items-center gap-3">
                <Badge variant={typedUser.role === 'homeowner' ? 'default' : 'outline-primary'} size="default">
                  {typedUser.role === 'homeowner' ? 'Homeowner' : 'Contractor'}
                </Badge>
                <span className="text-sm font-medium text-foreground hidden lg:inline">
                  {typedUser.firstName || typedUser.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  data-testid="button-logout"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            )}
            
            {!isAuthenticated && (
              <Button 
                onClick={() => window.location.href = '/signin'}
                aria-label="Sign in"
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
