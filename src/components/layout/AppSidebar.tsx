import { Link, useLocation } from 'react-router-dom';
import { 
  Plug, 
  MessageSquare, 
  Users, 
  Globe, 
  Move, 
  Settings,
  Terminal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSocketContext } from '@/contexts/SocketContext';

const navItems = [
  { path: '/', label: 'Connect', icon: Plug },
  { path: '/chat', label: 'Chat', icon: MessageSquare },
  { path: '/accounts', label: 'Accounts', icon: Users },
  { path: '/proxies', label: 'Proxies', icon: Globe },
  { path: '/movement', label: 'Movement', icon: Move },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { isConnected } = useSocketContext();

  return (
    <aside className="w-56 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">AFK Console</h1>
            <p className="text-xs text-muted-foreground">Bot Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Connection Status */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-primary animate-pulse" : "bg-destructive"
          )} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </aside>
  );
}
