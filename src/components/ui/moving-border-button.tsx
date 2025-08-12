
"use client"

import { cn } from "@/lib/utils";
import React from "react";

export function MovingBorderButton({
  children,
  className,
  ...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={cn(
        "bg-transparent relative p-0.5 rounded-lg",
        className
      )}
      style={{
        WebkitAppearance: "none",
        appearance: "none",
      }}
      {...props}
    >
      <span className="absolute-center h-full w-full rounded-lg bg-background" />
      <span
        className={cn(
          "relative z-10 flex items-center justify-center gap-2",
          "h-14 w-14 rounded-lg bg-foreground px-4 py-2 text-background",
          "transition-transform duration-100 ease-in-out",
          "active:translate-y-px"
        )}
      >
        {children}
      </span>
    </button>
  );
}
