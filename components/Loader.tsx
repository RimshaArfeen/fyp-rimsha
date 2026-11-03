
// app/components/Loader.tsx
"use client";

import React from "react";

interface LoaderProps {
     fullScreen?: boolean;
     message?: string;
}

export default function Loader({
     fullScreen = true,
     message = "Loading experience...",
}: LoaderProps) {
     return (
          <div
               className={`flex flex-col items-center justify-center gap-4 transition-colors duration-300 ${fullScreen
                         ? "fixed inset-0 z-50 bg-[var(--color-background)] text-[var(--color-foreground)]"
                         : "w-full min-h-[200px] p-6"
                    }`}
          >
               {/* Outer Glow & Ring Container */}
               <div className="relative flex items-center justify-center w-16 h-16">
                    {/* Soft Background Accent Glow */}
                    <div className="absolute inset-0 rounded-full bg-[var(--color-accent)] animate-ping opacity-25" />

                    {/* Static Base Track Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-[var(--color-border)]" />

                    {/* Primary Animated Rotating Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-t-[var(--color-primary)] border-r-[var(--color-secondary)] border-b-transparent border-l-transparent animate-spin" />

                    {/* Center Brand Icon / Dot */}
                    <div className="w-4 h-4 rounded-full bg-[var(--color-primary)] animate-pulse shadow-sm flex items-center justify-center">
                         <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)]" />
                    </div>
               </div>

               {/* Subtle Loading Text */}
               {message && (
                    <p className="text-xs tracking-wider uppercase font-medium text-[var(--color-muted-foreground)] animate-pulse">
                         {message}
                    </p>
               )}
          </div>
     );
}