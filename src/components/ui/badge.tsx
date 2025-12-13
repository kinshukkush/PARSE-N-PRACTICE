import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { X, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-slate-900",
  {
    variants: {
      variant: {
        default: "bg-slate-700 text-slate-100 hover:bg-slate-600 border-slate-600",
        primary: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent hover:from-indigo-600 hover:to-purple-600",
        secondary: "bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700",
        destructive: "bg-gradient-to-r from-red-500 to-rose-500 text-white border-transparent hover:from-red-600 hover:to-rose-600",
        success: "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-transparent hover:from-emerald-600 hover:to-green-600",
        warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent hover:from-amber-600 hover:to-orange-600",
        info: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent hover:from-blue-600 hover:to-cyan-600",
        outline: "text-slate-300 border-slate-600 hover:bg-slate-800/50",
        ghost: "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300",
        subtle: "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700/50 hover:text-slate-300",
      },
      size: {
        xs: "text-xs px-2 py-0.5 rounded-md",
        sm: "text-xs px-2.5 py-0.5 rounded-lg",
        default: "text-sm px-3 py-1 rounded-full",
        lg: "text-base px-4 py-1.5 rounded-full",
        xl: "text-lg px-5 py-2 rounded-full",
      },
      shape: {
        rounded: "rounded-full",
        square: "rounded-md",
        pill: "rounded-full",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce-gentle",
        glow: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "rounded",
      animation: "none",
    },
  },
);

export interface BadgeProps 
  extends React.HTMLAttributes<HTMLDivElement>, 
  VariantProps<typeof badgeVariants> {
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  dot?: boolean;
  dotColor?: string;
  animate?: boolean;
  gradient?: boolean;
}

function Badge({ 
  className, 
  variant, 
  size, 
  shape, 
  animation,
  dismissible = false,
  onDismiss,
  icon,
  dot = false,
  dotColor,
  animate = true,
  gradient = false,
  children,
  ...props 
}: BadgeProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };

  const badgeContent = (
    <div 
      className={cn(
        badgeVariants({ variant, size, shape, animation }), 
        "relative overflow-hidden border",
        animation === "glow" && variant === "primary" && "shadow-lg shadow-indigo-500/25",
        animation === "glow" && variant === "destructive" && "shadow-lg shadow-red-500/25",
        animation === "glow" && variant === "success" && "shadow-lg shadow-emerald-500/25",
        animation === "glow" && variant === "warning" && "shadow-lg shadow-amber-500/25",
        animation === "glow" && variant === "info" && "shadow-lg shadow-blue-500/25",
        gradient && "bg-gradient-to-r",
        className
      )} 
      {...props}
    >
      {/* Shimmer effect for gradient variants */}
      {(variant === "primary" || variant === "destructive" || variant === "success" || variant === "warning" || variant === "info") && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}

      {/* Dot indicator */}
      {dot && (
        <Circle 
          className={cn(
            "w-2 h-2 mr-1.5 fill-current",
            dotColor || "text-current"
          )}
        />
      )}

      {/* Icon */}
      {icon && (
        <span className="mr-1.5 flex items-center">
          {icon}
        </span>
      )}

      {/* Content */}
      <span className="relative z-10">{children}</span>

      {/* Dismiss button */}
      {dismissible && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDismiss}
          className="ml-1.5 -mr-1 flex items-center justify-center hover:opacity-80 focus:outline-none"
        >
          <X className={cn(
            "h-3 w-3",
            size === "xs" && "h-2.5 w-2.5",
            size === "lg" && "h-4 w-4",
            size === "xl" && "h-5 w-5"
          )} />
          <span className="sr-only">Remove</span>
        </motion.button>
      )}
    </div>
  );

  if (!animate) {
    return isVisible ? badgeContent : null;
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          {badgeContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Badge Group Component
interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "tight" | "normal" | "loose";
}

export const BadgeGroup = React.forwardRef<HTMLDivElement, BadgeGroupProps>(
  ({ className, gap = "normal", children, ...props }, ref) => {
    const gapClasses = {
      tight: "gap-1",
      normal: "gap-2",
      loose: "gap-3",
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap items-center", gapClasses[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BadgeGroup.displayName = "BadgeGroup";

// Preset Badge Components
export const StatusBadge = ({ 
  status, 
  ...props 
}: { 
  status: 'active' | 'inactive' | 'pending' | 'error';
} & Omit<BadgeProps, 'variant' | 'dot'>) => {
  const statusConfig = {
    active: { variant: 'success' as const, label: 'Active', dotColor: 'text-emerald-400' },
    inactive: { variant: 'secondary' as const, label: 'Inactive', dotColor: 'text-slate-400' },
    pending: { variant: 'warning' as const, label: 'Pending', dotColor: 'text-amber-400' },
    error: { variant: 'destructive' as const, label: 'Error', dotColor: 'text-red-400' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} dot dotColor={config.dotColor} {...props}>
      {config.label}
    </Badge>
  );
};

export const CountBadge = ({ 
  count, 
  max = 99,
  ...props 
}: { 
  count: number;
  max?: number;
} & Omit<BadgeProps, 'children'>) => {
  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge 
      size="xs" 
      shape="rounded"
      className="min-w-[1.5rem] justify-center"
      {...props}
    >
      {displayCount}
    </Badge>
  );
};

export const TagBadge = ({ 
  tag,
  onRemove,
  ...props 
}: { 
  tag: string;
  onRemove?: () => void;
} & Omit<BadgeProps, 'children' | 'dismissible'>) => {
  return (
    <Badge 
      variant="subtle"
      dismissible={!!onRemove}
      onDismiss={onRemove}
      {...props}
    >
      {tag}
    </Badge>
  );
};

// Example animated badges
export const LiveBadge = (props: Omit<BadgeProps, 'children' | 'dot' | 'animation'>) => (
  <Badge variant="destructive" dot animation="pulse" {...props}>
    <motion.span
      animate={{ opacity: [1, 0.5, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      LIVE
    </motion.span>
  </Badge>
);

export const NewBadge = (props: Omit<BadgeProps, 'children' | 'animation'>) => (
  <Badge variant="success" animation="glow" {...props}>
    NEW
  </Badge>
);

export { Badge, badgeVariants };