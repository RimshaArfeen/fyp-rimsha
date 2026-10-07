
export function EmptyState({
     title,
     description,
     action,
}: {
     title: string;
     description: string;
     action?: React.ReactNode;
}) {
     return (
          <div className="flex flex-col items-center justify-center text-center py-14 px-6">
               <div className="h-14 w-14 rounded-full bg-muted grid place-items-center mb-4">
                    <span className="text-muted-foreground text-xl">◌</span>
               </div>
               <h4 className="font-semibold">{title}</h4>
               <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
               {action && <div className="mt-5">{action}</div>}
          </div>
     );
}