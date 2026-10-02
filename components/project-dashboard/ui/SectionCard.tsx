
export function SectionCard({
     title,
     action,
     children,
     className = "",
}: {
     title?: string;
     action?: React.ReactNode;
     children: React.ReactNode;
     className?: string;
}) {
     return (
          <section className={`card-surface p-5 ${className}`}>
               {(title || action) && (
                    <header className="mb-4 flex items-center justify-between">
                         {title && <h3 className="text-sm font-semibold">{title}</h3>}
                         {action}
                    </header>
               )}
               {children}
          </section>
     );
}