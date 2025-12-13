import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-slate-700 text-slate-100 hover:bg-slate-600 active:bg-slate-800 border border-slate-600",
        primary: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25 active:shadow-indigo-500/40",
        destructive: "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-500/25",
        outline: "border-2 border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800 hover:border-slate-500",
        secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 hover:border-slate-600",
        ghost: "text-slate-300 hover:bg-slate-800 hover:text-slate-100",
        link: "text-indigo-400 underline-offset-4 hover:underline hover:text-indigo-300",
        hero: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-xl hover:shadow-purple-500/25 font-semibold text-base",
        success: "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-emerald-500/25",
        warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25",
        info: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25",
        subtle: "bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700/50",
        glow: "bg-slate-800 text-indigo-400 border border-indigo-500/50 hover:border-indigo-400 hover:shadow-glow-indigo hover:text-indigo-300",
        neon: "bg-transparent text-pink-400 border-2 border-pink-500 hover:bg-pink-500/20 hover:shadow-glow-pink hover:text-pink-300",
        // Quiz variants
        quiz: "bg-slate-800 text-slate-200 border-2 border-slate-700 hover:border-indigo-500 hover:bg-slate-700 hover:shadow-md",
        "quiz-selected": "bg-indigo-500/20 text-indigo-300 border-2 border-indigo-500 shadow-lg shadow-indigo-500/20",
        "quiz-correct": "bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20",
        "quiz-incorrect": "bg-red-500/20 text-red-300 border-2 border-red-500 shadow-lg shadow-red-500/20",
      },
      size: {
        xs: "h-7 px-2 text-xs rounded-md",
        sm: "h-9 px-3 text-sm rounded-lg",
        default: "h-10 px-4 py-2 rounded-lg",
        lg: "h-12 px-6 text-base rounded-lg",
        xl: "h-14 px-8 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-12 w-12 rounded-lg",
      },
      animation: {
        none: "",
        pulse: "hover:animate-pulse",
        bounce: "hover:animate-bounce-gentle",
        scale: "hover:scale-105 active:scale-95",
        glow: "hover:animate-glow-pulse",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  ripple?: boolean;
}

interface MotionButtonProps extends HTMLMotionProps<"button">, ButtonProps {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    ripple = true,
    disabled,
    children,
    onClick,
    ...props 
  }, ref) => {
    const [ripples, setRipples] = React.useState<{ x: number; y: number; size: number }[]>([]);
    
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !isDisabled && variant !== "link") {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const newRipple = { x, y, size };
        setRipples([...ripples, newRipple]);
        
        setTimeout(() => {
          setRipples((prev) => prev.slice(1));
        }, 600);
      }
      
      onClick?.(e);
    };

    return (
      <Comp 
        className={cn(
          buttonVariants({ variant, size, animation }), 
          fullWidth && "w-full",
          "relative overflow-hidden",
          className
        )} 
        ref={ref} 
        disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple effect */}
        {ripples.map((ripple, index) => (
          <span
            key={index}
            className="absolute animate-ripple rounded-full bg-white/30"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
        
        {/* Shimmer effect for gradient buttons */}
        {(variant === "primary" || variant === "hero" || variant === "success" || variant === "destructive") && (
          <div className="absolute inset-0 -top-[2px] opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        )}
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {loadingText || children}
            </>
          ) : (
            <>
              {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
              {children}
              {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
            </>
          )}
        </span>
      </Comp>
    );
  },
);
Button.displayName = "Button";

// Motion Button Component
export const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(buttonVariants({ 
          variant: props.variant, 
          size: props.size,
          animation: props.animation
        }), className)}
        {...props}
      />
    );
  }
);
MotionButton.displayName = "MotionButton";

// Button Group Component
interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  attached?: boolean;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", attached = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "vertical" ? "flex-col" : "flex-row",
          attached && orientation === "horizontal" && "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:-ml-px",
          attached && orientation === "vertical" && "[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:-mt-px",
          !attached && "gap-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

// Icon Button Preset
export const IconButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'size'>>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        className={cn("rounded-full", className)}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";

export { Button, buttonVariants };