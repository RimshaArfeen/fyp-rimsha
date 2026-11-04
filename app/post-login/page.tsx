
// app/post-login/page.tsx
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { homeFor } from "../../lib/roles";

export const dynamic = "force-dynamic";

export default async function PostLogin() {
     const session = await auth();
     if (!session?.user) redirect("/login");
     redirect(homeFor(session.user.role));
}