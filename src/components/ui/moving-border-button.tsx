
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
        "bg-transparent relative text-xl p-0.5 rounded-lg",
        "bg-background text-foreground",
        className
      )}
      style={{
        WebkitAppearance: "none",
        appearance: "none",
      }}
      {...props}
    >
      <span className="absolute-center h-full w-full rounded-lg bg-black" />
      <span
        className={cn(
          "relative z-10 flex items-center justify-center gap-2",
          "h-14 w-14 rounded-lg bg-background px-4 py-2",
          "transition-transform duration-100 ease-in-out",
          "active:translate-y-px active:translate-x-px"
        )}
      >
        {children}
      </span>
    </button>
  );
}
