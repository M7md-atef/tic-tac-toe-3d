import React from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
  is3D?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", is3D = true, children, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs font-semibold rounded-lg",
      md: "px-4 py-2 text-sm font-semibold rounded-xl",
      lg: "px-6 py-3 text-base font-bold rounded-2xl",
    };

    const variantClasses = {
      primary: is3D
        ? "bg-purple-600 hover:bg-purple-500 text-white border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 shadow-lg shadow-purple-900/40"
        : "bg-purple-600 hover:bg-purple-500 text-white shadow-md",
      secondary: is3D
        ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 shadow-md shadow-black/40"
        : "bg-slate-800 hover:bg-slate-700 text-slate-200",
      danger: is3D
        ? "bg-rose-600 hover:bg-rose-500 text-white border-b-4 border-rose-800 active:border-b-0 active:translate-y-1 shadow-lg shadow-rose-950/40"
        : "bg-rose-600 hover:bg-rose-500 text-white shadow-md",
      ghost:
        "bg-transparent hover:bg-white/10 text-slate-300 hover:text-white border border-transparent hover:border-white/10",
      glass: is3D
        ? "bg-white/10 hover:bg-white/15 text-white backdrop-blur-md border border-white/20 border-b-4 border-b-white/30 active:border-b active:translate-y-1 shadow-xl"
        : "bg-white/10 hover:bg-white/15 text-white backdrop-blur-md border border-white/20",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-40 disabled:pointer-events-none disabled:active:translate-y-0",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
