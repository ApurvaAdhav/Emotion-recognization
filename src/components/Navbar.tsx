import { Bell, User, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  isStreaming: boolean;
  onMenuClick?: () => void;
}

export function Navbar({ isStreaming, onMenuClick }: NavbarProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-navbar h-16 px-6 flex items-center justify-between"
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-accent/50 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">Emotion Recognition Dashboard</h2>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50">
            <div className={`status-indicator ${isStreaming ? 'active' : 'inactive'}`} />
            <span className="text-xs font-medium text-accent-foreground">
              {isStreaming ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button
          className="p-2.5 rounded-xl hover:bg-accent/50 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
        </button>
        
        <button
          className="flex items-center gap-3 p-2 pr-4 rounded-xl hover:bg-accent/50 transition-colors"
          aria-label="User profile"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="hidden sm:block text-sm font-medium text-foreground">User</span>
        </button>
      </div>
    </motion.header>
  );
}
