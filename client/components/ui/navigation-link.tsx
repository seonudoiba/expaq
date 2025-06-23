"use client";


import React, { useState, useTransition } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type NavigationLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  showLoadingIcon?: boolean;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  locale?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function NavigationLink({
  href,
  children,
  className,
  showLoadingIcon = true,
  prefetch,
  replace,
  scroll,
  locale,
  onClick,
  ...props
}: NavigationLinkProps) {
  const [, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // First call the provided onClick if it exists
    if (onClick) onClick(e);

    // If it's an external link, don't do anything special
    if (href.startsWith("http") || href.startsWith("mailto:")) {
      return;
    }

    // For internal links, show loading and use transitions
    if (!e.defaultPrevented) {
      e.preventDefault();
      setIsLoading(true);
      // Dispatch a custom event to notify that navigation is starting
      window.dispatchEvent(new CustomEvent('navigationStart', { 
        detail: { href } 
      }));

      startTransition(() => {
        router.push(href, { scroll });
      });
    }
  };
  return (
    <NextLink
      href={href}
      className={cn(className, isLoading && "opacity-70")}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      locale={locale}
      onClick={handleClick}
      data-enhanced-navigation="true"
      {...props}
    >
      {children}
      {showLoadingIcon && isLoading && (
        <Loader2 className="ml-2 h-4 w-4 inline animate-spin" />
      )}
    </NextLink>
  );
}

type NavigationButtonProps = ButtonProps & {
  href: string;
  showLoadingIcon?: boolean;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

export function NavigationButton({
  href,
  children,
  className,
  showLoadingIcon = true,
  scroll,
  ...props
}: NavigationButtonProps) {
  const [, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsLoading(true);
    startTransition(() => {
      router.push(href, { scroll });
    });
  };

  return (
    <button
      className={cn(className, isLoading && "opacity-70")}
      onClick={handleClick}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {children}
      {showLoadingIcon && isLoading && (
        <Loader2 className="ml-2 h-4 w-4 inline animate-spin" />
      )}
    </button>
  );
}
