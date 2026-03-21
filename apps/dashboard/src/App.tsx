import { useState } from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import { routes } from '@/router';
import { Sidebar } from '@/components/shared/Sidebar';
import { Header } from '@/components/shared/Header';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const element = useRoutes(routes);

  const isLoginPage = location.pathname === '/login';
  const showLayout = isAuthenticated && !isLoginPage;

  if (!showLayout) {
    return <>{element}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]',
        )}
      >
        <Header onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 overflow-y-auto p-6">{element}</main>
      </div>
    </div>
  );
}
