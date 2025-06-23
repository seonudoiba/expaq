"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button as BaseButton, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedButtonProps extends ButtonProps {
  href?: string;
  isLoading?: boolean;
  loadingText?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      className,
      variant,
      size,
      href,
      isLoading,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = React.useState(false);
    
    // Combined loading state
    const showLoading = isLoading || isNavigating;
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Execute original onClick if provided
      if (props.onClick) {
        props.onClick(e);
      }
        // If href is provided, handle navigation
      if (href && !e.defaultPrevented) {
        setIsNavigating(true);
        // Dispatch a custom event to notify that navigation is starting
        window.dispatchEvent(new CustomEvent('navigationStart', { 
          detail: { href } 
        }));
        router.push(href);
      }
    };
    
    return (
      <BaseButton
        className={cn(className)}
        variant={variant}
        size={size}
        ref={ref}
        disabled={disabled || showLoading}
        onClick={handleClick}
        {...props}
      >
        {showLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </BaseButton>
    );
  }
);

Button.displayName = "Button";
