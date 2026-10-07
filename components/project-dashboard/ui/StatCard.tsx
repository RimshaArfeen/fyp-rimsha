
export function StatCard({
     label,
     value,
     hint,
     icon,
}: {
     label: string;
     value: string;
     hint?: string;
     icon?: React.ReactNode;
}) {
     return (
          <div className="card-surface p-4">
               <div className="flex items-start justify-between">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                    {icon && <span className="text-muted-foreground">{icon}</span>}
               </div>
               <p className="mt-2 text-2xl font-semibold">{value}</p>
               {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </div>
     );
}