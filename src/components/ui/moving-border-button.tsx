
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
        "bg-transparent relative p-0.5 rounded-full",
        className
      )}
      style={{
        WebkitAppearance: "none",
        appearance: "none",
      }}
      {...props}
    >
      <span className="absolute-center h-full w-full rounded-full bg-background" />
      <span
        className={cn(
          "relative z-10 flex items-center justify-center gap-2",
          "h-12 w-12 rounded-full bg-foreground px-4 py-2 text-background",
          "transition-transform duration-100 ease-in-out",
          "active:translate-y-px"
        )}
      >
        {children}
      </span>
    </button>
  );
}
