// app/signup/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Signup failed");
        return;
      }

      // Auto sign-in after successful signup
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login"); // account created, but auto-login failed
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
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
            Create your account
          </h2>
          <p className="text-muted-foreground mb-6">
            Join Pulse and start managing your FYP.
          </p>

          <div className="flex bg-muted rounded-lg p-1 mb-6">
            <Link
              href="/login"
              className="flex-1 py-2 rounded-md text-sm font-medium text-center text-muted-foreground"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="flex-1 py-2 rounded-md text-sm font-medium text-center bg-primary text-primary-foreground"
            >
              Sign Up
            </Link>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="text-sm text-muted-foreground">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm text-muted-foreground">
                University Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
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
                name="password"
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="role" className="text-sm text-muted-foreground">
                I am a:
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-muted-foreground mt-6 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-secondary font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}