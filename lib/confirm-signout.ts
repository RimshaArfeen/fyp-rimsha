
// lib/confirm-signout.ts
"use client";

import Swal from "sweetalert2";
import { signOut } from "next-auth/react";

export async function confirmSignOut(name: string, role: "student" | "teacher") {
  const roleLabel = role === "teacher" ? "Supervisor" : "Student";

  const result = await Swal.fire({
    title: "Sign out?",
    text: `Are you sure you want to log out from "${name || "User"} - ${roleLabel}" account?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, sign out",
    cancelButtonText: "Stay signed in",
    confirmButtonColor: "#dc2626",
    reverseButtons: true,
    focusCancel: true,
  });

  if (result.isConfirmed) {
    await signOut({ callbackUrl: "/login" });
  }
}