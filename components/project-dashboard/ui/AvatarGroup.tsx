import { Avatar } from "./Avatar";

export function AvatarGroup({
     members,
     max = 4,
}: {
     members: { initials: string; name: string }[];
     max?: number;
}) {
     const shown = members.slice(0, max);
     const rest = members.length - shown.length;
     return (
          <div className="flex items-center -space-x-2">
               {shown.map((m) => (
                    <div key={m.name} title={m.name} className="ring-2 ring-card rounded-full">
                         <Avatar initials={m.initials} />
                    </div>
               ))}
               {rest > 0 && (
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted text-muted-foreground text-xs font-semibold ring-2 ring-card">
                         +{rest}
                    </span>
               )}
          </div>
     );
}