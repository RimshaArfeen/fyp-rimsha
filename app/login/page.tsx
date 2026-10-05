
// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full mt-1 px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="min-h-screen flex bg-background">
      {/* LEFT SIDE - Branding */}
      <div className="hidden md:flex w-1/2 bg-primary flex-col justify-between p-10 relative overflow-hidden">
        <div className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 bg-secondary rounded-md flex items-center justify-center font-bold text-primary-foreground">
            P
          </div>
          <span className="text-primary-foreground font-semibold text-lg">
            pulse.
          </span>
        </div>

        <div className="z-10">
          <span className="inline-block bg-primary-foreground/10 text-primary-foreground text-xs px-3 py-1 rounded-full mb-4">
            System Operational
          </span>

          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Manage your{" "}
            <span className="text-secondary">academic pulse.</span>
          </h1>

          <p className="text-primary-foreground/70 max-w-sm mb-8">
            The all-in-one platform for FYP tracking, submissions, and
            approvals. Built for students, supervisors &amp; panels.
          </p>

          {/* Testimonial card */}
          <div className="bg-primary-foreground/10 rounded-xl p-4 max-w-sm">
            <p className="text-primary-foreground text-sm mb-3">
              &quot;Pulse reduced our FYP review time by 60%. The cleanest
              dashboard we have used.&quot;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20"></div>
              <div>
                <p className="text-primary-foreground text-sm font-medium">
                  Dr. Sarah Ahmed
                </p>
                <p className="text-primary-foreground/60 text-xs">
                  FYP Coordinator
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-primary-foreground/50 text-xs z-10">
          © 2026 Pulse · Privacy · Terms
        </p>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 bg-background">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-foreground mb-1">
            Welcome back
          </h2>
          <p className="text-muted-foreground mb-6">
            Please enter your details to sign in.
          </p>

          <div className="flex bg-muted rounded-lg p-1 mb-6">
            <Link
              href="/login"
              className="flex-1 py-2 rounded-md text-sm font-medium text-center bg-primary text-primary-foreground"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="flex-1 py-2 rounded-md text-sm font-medium text-center text-muted-foreground"
            >
              Sign Up
            </Link>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="text-sm text-muted-foreground">
                University Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rimsha@university.edu.pk"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm text-muted-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex items-center gap-2">
              <span className="bg-success text-success-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                SSL Secured
              </span>
              <span className="text-xs text-muted-foreground">
                Your data is protected
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary-hover transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Continue to Dashboard"}
            </button>
          </form>

          <p className="text-center text-muted-foreground mt-6 text-sm">
            No account?{" "}
            <Link href="/signup" className="text-secondary font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}