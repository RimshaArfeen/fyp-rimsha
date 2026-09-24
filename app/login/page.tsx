"use client";

import { useState } from "react";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

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

          {/* Tab Toggle */}
          <div className="flex bg-muted rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                activeTab === "login"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                activeTab === "signup"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Google / University ID buttons */}
          <div className="flex gap-3 mb-4">
            <button className="flex-1 border border-border py-2 rounded-lg text-sm text-foreground hover:bg-accent transition">
              Google
            </button>
            <button className="flex-1 border border-border py-2 rounded-lg text-sm text-foreground hover:bg-accent transition">
              University ID
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <form className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-muted-foreground">
                University Email
              </label>
              <input
                type="email"
                placeholder="rimsha@university.edu.pk"
                className="w-full mt-1 px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="text-sm text-muted-foreground">
                  Password
                </label>
                <a href="#" className="text-xs text-secondary">
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* SSL Secured Badge */}
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
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary-hover transition"
            >
              Continue to Dashboard
            </button>
          </form>

          <p className="text-center text-muted-foreground mt-6 text-sm">
            No account?{" "}
            <a href="/signup" className="text-secondary font-medium">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}