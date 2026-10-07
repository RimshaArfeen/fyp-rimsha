
type Variant = "approved" | "pending" | "revision";

export default function Badge({
     variant,
     children,
}: {
     variant: Variant;
     children: React.ReactNode;
}) {
     const cls =
          variant === "approved"
               ? "badge-approved"
               : variant === "pending"
                    ? "badge-pending"
                    : "badge-revision";
     return <span className={cls}>{children}</span>;
}