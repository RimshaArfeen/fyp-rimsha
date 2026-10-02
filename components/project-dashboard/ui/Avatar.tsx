
export function Avatar({
     initials,
     online,
     size = 32,
}: {
     initials: string;
     online?: boolean;
     size?: number;
}) {
     return (
          <span className="relative inline-flex">
               <span
                    className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold"
                    style={{ width: size, height: size }}
               >
                    {initials}
               </span>
               {online !== undefined && (
                    <span
                         className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${online ? "bg-success" : "bg-muted-foreground"
                              }`}
                         aria-hidden
                    />
               )}
          </span>
     );
}