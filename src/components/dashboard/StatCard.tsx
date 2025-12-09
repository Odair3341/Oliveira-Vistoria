import { LucideIcon, Loader2, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  subtitle?: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
  className?: string;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

const variantStyles = {
  default: "bg-card text-card-foreground border-border",
  success: "bg-success/15 text-success-foreground border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/20",
  info: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
};

const iconVariantStyles = {
  default: "bg-secondary text-secondary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  info: "bg-blue-500 text-white",
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  subtitle, 
  variant = 'default',
  className,
  loading,
  error,
  onRetry
}: StatCardProps) {
  
  if (loading) {
    return (
      <div 
        className={cn(
          "relative overflow-hidden rounded-xl p-3 sm:p-5 shadow-card transition-all duration-300 h-full flex flex-col justify-center",
          variantStyles[variant],
          className
        )}
      >
        <div className="flex items-center gap-3">
            <div className={cn("h-10 w-10 sm:h-12 sm:w-12 rounded-lg animate-pulse bg-muted/50")} />
            <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-muted/50 rounded animate-pulse" />
                <div className="h-6 w-16 bg-muted/50 rounded animate-pulse" />
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    // Se houver erro, renderizar o card normalmente (com dados de mock/cache)
    // mas adicionar um indicador visual sutil
    return (
      <div 
        className={cn(
          "relative overflow-hidden rounded-xl p-3 sm:p-5 shadow-card transition-all duration-300 card-hover",
          variantStyles[variant],
          className,
          "border-warning/50" // Indicador sutil de aviso
        )}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={cn(
              "text-xs sm:text-sm font-medium",
              variant === 'default' ? 'text-muted-foreground' : 'opacity-80'
            )}>
              {title}
            </p>
            <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className={cn(
                "text-[11px] sm:text-xs",
                variant === 'default' ? 'text-muted-foreground' : 'opacity-70'
              )}>
                {subtitle}
              </p>
            )}
          </div>
          <div className={cn(
            "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg",
            iconVariantStyles[variant]
          )}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl p-3 sm:p-5 shadow-card transition-all duration-300 card-hover",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn(
            "text-xs sm:text-sm font-medium",
            variant === 'default' ? 'text-muted-foreground' : 'opacity-80'
          )}>
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className={cn(
              "text-[11px] sm:text-xs",
              variant === 'default' ? 'text-muted-foreground' : 'opacity-70'
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium",
              trend.positive ? 'text-success' : 'text-destructive',
              variant !== 'default' && 'opacity-90'
            )}>
              <span>{trend.positive ? '↑' : '↓'}</span>
              <span>{trend.value}% vs. mês anterior</span>
            </div>
          )}
        </div>
        <div className={cn(
          "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg",
          iconVariantStyles[variant]
        )}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  );
}
