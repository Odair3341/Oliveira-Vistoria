import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Mobile Sidebar Overlay */}
      {/* Only show if explicitly open (on mobile) */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 h-screen w-64 animate-slide-in-right md:hidden">
            <Sidebar />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300",
        "ml-0 md:ml-64"
      )}>
        {/* Mobile Header with Menu Toggle */}
        <div className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background px-4 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        
        <div className="hidden md:block">
            <Header title={title} subtitle={subtitle} />
        </div>
        
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
