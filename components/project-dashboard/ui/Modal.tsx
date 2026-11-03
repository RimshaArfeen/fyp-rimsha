
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export default function Modal({
     title, subtitle, onClose, children,
}: { title: string; subtitle?: string; onClose: () => void; children: ReactNode }) {
     const [mounted, setMounted] = useState(false);
     useEffect(() => setMounted(true), []);

     useEffect(() => {
          const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
          document.addEventListener("keydown", onKey);
          return () => document.removeEventListener("keydown", onKey);
     }, [onClose]);

     if (!mounted) return null;
     return createPortal(
          <div className="fixed inset-0 z-[100] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={title}>
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
               <div className="relative z-10 max-h-[92vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl">
                    <div>
                         <h3 className="text-lg font-semibold">{title}</h3>
                         {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                    </div>
                    {children}
               </div>
          </div>,
          document.body
     );
}