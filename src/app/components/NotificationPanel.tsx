import { Bell, Check, X, AlertCircle, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { BrandButton } from './BrandButton';
import { useNotifications } from '../contexts/NotificationContext';

export function NotificationPanel() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
  } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="size-5 text-[#10b981]" />;
      case 'warning':
        return <AlertTriangle className="size-5 text-[#f59e0b]" />;
      case 'error':
        return <AlertCircle className="size-5 text-[#ef4444]" />;
      default:
        return <Info className="size-5 text-[#3b82f6]" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="size-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 size-5 bg-[#ef4444] text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-h-[500px] overflow-hidden p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="size-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${
                    !notification.read ? 'bg-muted/30' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 rounded hover:bg-background transition-colors"
                              title="Mark as read"
                            >
                              <Check className="size-3 text-muted-foreground" />
                            </button>
                          )}
                          <button
                            onClick={() => clearNotification(notification.id)}
                            className="p-1 rounded hover:bg-background transition-colors"
                            title="Dismiss"
                          >
                            <X className="size-3 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                      {notification.action && (
                        <button
                          onClick={() => {
                            notification.action?.onClick();
                            markAsRead(notification.id);
                          }}
                          className="text-xs text-[#6366f1] hover:underline mt-2"
                        >
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
