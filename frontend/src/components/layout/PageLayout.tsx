import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { useApp } from '@/context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  title?: string;
  showBackButton?: boolean;
}

export function PageLayout({ children, showNav = true, title, showBackButton = false }: PageLayoutProps) {
  const { userRole } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {title && (
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
            {showBackButton && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-lg font-semibold text-foreground flex-1 text-center pr-10">
              {title}
            </h1>
          </div>
        </header>
      )}
      <main className={showNav ? 'pb-20' : ''}>
        <div className="max-w-lg mx-auto">
          {children}
        </div>
      </main>
      {showNav && userRole && <BottomNav />}
    </div>
  );
}
