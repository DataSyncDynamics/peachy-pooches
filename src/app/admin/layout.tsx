'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dog, LayoutDashboard, Calendar, Users, Settings, Menu, X, LogOut, MessageSquare, Scissors, ClipboardCheck, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { UnreadBadge } from '@/components/messaging/unread-badge';
import { getConversationsWithDetails, getClientsNeedingReview } from '@/lib/mock-data';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/review', label: 'Review', icon: ClipboardCheck, showReviewBadge: true },
  { href: '/admin/services', label: 'Services', icon: Scissors },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare, showBadge: true },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

// Bottom dock items for mobile - 4 primary items
const dockItems = [
  { href: '/admin', label: 'Home', icon: LayoutDashboard },
  { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare, showBadge: true },
];

// More menu items for mobile dock
const moreItems = [
  { href: '/admin/review', label: 'Review', icon: ClipboardCheck, showReviewBadge: true },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/services', label: 'Services', icon: Scissors },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get unread message count
  const unreadCount = useMemo(() => {
    const conversations = getConversationsWithDetails();
    return conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
  }, []);

  // Get clients needing review count
  const reviewCount = useMemo(() => {
    return getClientsNeedingReview().length;
  }, []);

  // Bottom Dock for mobile navigation
  const BottomDock = () => {
    // Check if any "More" item is active
    const isMoreActive = moreItems.some(
      (item) => pathname === item.href || pathname.startsWith(item.href + '/')
    );

    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Floating dock with blur backdrop */}
        <div className="bg-card/95 backdrop-blur-lg border-t shadow-lg">
          <div className="flex items-center justify-evenly px-1 py-2">
            {/* Primary dock items */}
            {dockItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));
              const showBadge: boolean = 'showBadge' in item && !!item.showBadge && unreadCount > 0;
              const showReviewBadge: boolean = 'showReviewBadge' in item && !!item.showReviewBadge && reviewCount > 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex flex-1 flex-col items-center justify-center min-w-0 py-2 px-0.5 transition-all duration-200',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground active:scale-95'
                  )}
                >
                  <div className="relative">
                    <Icon className="h-5 w-5" />
                    {showBadge && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                    {showReviewBadge && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-medium text-white">
                        {reviewCount > 9 ? '9+' : reviewCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* More menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'relative flex flex-1 flex-col items-center justify-center min-w-0 py-2 px-0.5 transition-all duration-200',
                    isMoreActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground active:scale-95'
                  )}
                >
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="text-[10px] font-medium">More</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="w-48 mb-2">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                    <LogOut className="h-4 w-4" />
                    <span>Exit Admin</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    );
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-6 border-b">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
          <Dog className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-none">Peachy Pooches</span>
          <span className="text-xs text-muted-foreground">Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));
          const showBadge: boolean = 'showBadge' in item && !!item.showBadge && unreadCount > 0;
          const showReviewBadge: boolean = 'showReviewBadge' in item && !!item.showReviewBadge && reviewCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <UnreadBadge
                  count={unreadCount}
                  size="sm"
                  className={isActive ? 'bg-primary-foreground text-primary' : ''}
                />
              )}
              {showReviewBadge && (
                <UnreadBadge
                  count={reviewCount}
                  size="sm"
                  className={isActive ? 'bg-primary-foreground text-primary' : 'bg-yellow-500 text-white'}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Exit Admin
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r bg-card md:flex md:flex-col">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Dog className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">Admin</span>
        </div>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 overflow-x-hidden">
        <div className="min-h-screen pt-16 pb-24 md:pt-0 md:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Dock */}
      <BottomDock />
    </div>
  );
}
