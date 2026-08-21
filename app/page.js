import Link from "next/link";
import {
  FolderKanban,
  Users,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Search,
  FileCheck2,
  TrendingUp,
  MessageSquare
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col font-sans selection:bg-[var(--color-primary)] selection:text-[var(--color-primary-foreground)]">

      {/* Top Banner Notice */}
      <div className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-4 py-2 text-xs font-medium text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-[var(--color-secondary)]" />
        <span>ProjectPulse Platform Live for FYP Registration & Collaboration</span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-card)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="h-9 w-9 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary-foreground)] shadow-sm">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none text-[var(--color-foreground)]">
                ProjectPulse
              </span>
              <span className="text-[10px] text-[var(--color-muted-foreground)] font-medium tracking-wide uppercase">
                Academic Ecosystem
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-muted-foreground)]">
            <a href="#overview" className="hover:text-[var(--color-foreground)] transition-colors">
              Overview
            </a>
            <a href="#roles" className="hover:text-[var(--color-foreground)] transition-colors">
              User Roles
            </a>
            <a href="#workflow" className="hover:text-[var(--color-foreground)] transition-colors">
              Workflow
            </a>
            <a href="#features" className="hover:text-[var(--color-foreground)] transition-colors">
              Platform Features
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-[var(--radius-custom)] text-[var(--color-foreground)] hover:bg-[var(--color-accent)] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium rounded-[var(--radius-custom)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm flex items-center gap-1.5"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero Section */}
        <section id="overview" className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 text-center md:pt-28 md:pb-24">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-foreground)] text-xs font-semibold mb-8 border border-[var(--color-border)] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-ping" />
            Unified Academic Project Management Framework
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Centralized Collaboration for University Final Year Projects
          </h1>

          <p className="mt-6 text-lg md:text-xl text-[var(--color-muted-foreground)] max-w-2xl mx-auto leading-relaxed font-normal">
            Connect students, supervisors, and administrators in a single structured ecosystem. Eliminate communication gaps, manage proposal submissions, and track milestones transparently.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-[var(--radius-custom)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-semibold hover:bg-[var(--color-primary-hover)] transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Join Your Department</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#workflow"
              className="w-full sm:w-auto px-7 py-3.5 rounded-[var(--radius-custom)] bg-[var(--color-card)] text-[var(--color-card-foreground)] border border-[var(--color-border)] font-semibold hover:bg-[var(--color-accent)] transition-all flex items-center justify-center"
            >
              Explore Project Flow
            </Link>
          </div>

          {/* Interactive Component Preview Mockup */}
          <div className="mt-16 max-w-4xl mx-auto card-surface p-6 text-left shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[var(--color-border)] gap-2">
              <div>
                <div className="text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  Live Status Monitor
                </div>
                <h2 className="text-base font-semibold text-[var(--color-card-foreground)]">
                  Project: AI-Based Academic Platform
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge-approved inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Supervisor Assigned
                </span>
              </div>
            </div>

            {/* Submissions Queue */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-md bg-[var(--color-muted)] text-sm border border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <FileCheck2 className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                  <span className="font-medium text-[var(--color-foreground)]">Milestone 1: SRS & Proposal Scope</span>
                </div>
                <span className="badge-approved">Approved</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-md bg-[var(--color-muted)] text-sm border border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                  <span className="font-medium text-[var(--color-foreground)]">Milestone 2: System Architecture Design</span>
                </div>
                <span className="badge-pending">Under Review</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-md bg-[var(--color-muted)] text-sm border border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                  <span className="font-medium text-[var(--color-foreground)]">Milestone 3: Database & API Integration</span>
                </div>
                <span className="badge-revision">Revision Required</span>
              </div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section id="roles" className="border-t border-[var(--color-border)] bg-[var(--color-muted)]/40 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted-foreground)]">
                Built for Universities
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-1">
                Structured Workflows by Role
              </h2>
              <p className="text-[var(--color-muted-foreground)] mt-2 max-w-xl mx-auto text-sm">
                Dedicated interfaces engineered to meet the operational demands of students, teachers, and coordinators.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

              {/* Student Role */}
              <div className="card-surface p-6 flex flex-col justify-between hover:border-[var(--color-ring)] transition-all">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)] text-[var(--color-foreground)] flex items-center justify-center mb-5 border border-[var(--color-border)]">
                    <Users className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Students & Team Leads</h3>
                  <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed mb-6">
                    Assemble project teams based on complement skill sets, discover supervisors by research domain, upload milestone submissions, and receive actionable feedback logs.
                  </p>
                </div>
                <ul className="space-y-2 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-muted-foreground)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span>Skill-based teammate discovery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span>Proposal creation & supervisor pitch</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span>Version-controlled document uploads</span>
                  </li>
                </ul>
              </div>

              {/* Teacher Role */}
              <div className="card-surface p-6 flex flex-col justify-between hover:border-[var(--color-ring)] transition-all">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)] text-[var(--color-foreground)] flex items-center justify-center mb-5 border border-[var(--color-border)]">
                    <GraduationCap className="w-6 h-6 text-[var(--color-secondary)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Supervisors & Faculty</h3>
                  <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed mb-6">
                    Manage project quotas, review incoming group proposals, track progress analytics across multiple supervised groups, and approve or request milestone revisions.
                  </p>
                </div>
                <ul className="space-y-2 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-muted-foreground)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                    <span>Domain capacity configuration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                    <span>Proposal acceptance/rejection flow</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                    <span>Contextual milestone feedback</span>
                  </li>
                </ul>
              </div>

              {/* Admin Role */}
              <div className="card-surface p-6 flex flex-col justify-between hover:border-[var(--color-ring)] transition-all">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)] text-[var(--color-foreground)] flex items-center justify-center mb-5 border border-[var(--color-border)]">
                    <ShieldCheck className="w-6 h-6 text-[var(--color-foreground)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">System Administrators</h3>
                  <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed mb-6">
                    Maintain complete system oversight. Manage user verification, assign department roles, oversee project distributions, and generate evaluation reports.
                  </p>
                </div>
                <ul className="space-y-2 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-muted-foreground)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-foreground)]" />
                    <span>Batch user administration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-foreground)]" />
                    <span>Departmental analytics logs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-foreground)]" />
                    <span>Escalation management</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Workflow Lifecycle Section */}
        <section id="workflow" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted-foreground)]">
              Execution Lifecycle
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1">
              How ProjectPulse Operates
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">

            <div className="card-surface p-5 relative">
              <div className="text-3xl font-black text-[var(--color-muted-foreground)]/30 mb-2">01</div>
              <h4 className="font-bold text-base mb-1">Profile & Team Setup</h4>
              <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                Students construct professional skill profiles and assemble teams with defined roles.
              </p>
            </div>

            <div className="card-surface p-5 relative">
              <div className="text-3xl font-black text-[var(--color-muted-foreground)]/30 mb-2">02</div>
              <h4 className="font-bold text-base mb-1">Supervisor Match</h4>
              <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                Teams search faculty by research interest and submit formal project proposals for review.
              </p>
            </div>

            <div className="card-surface p-5 relative">
              <div className="text-3xl font-black text-[var(--color-muted-foreground)]/30 mb-2">03</div>
              <h4 className="font-bold text-base mb-1">Milestone Submissions</h4>
              <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                Workspaces unlock upon approval. Submissions are uploaded against fixed milestone schedules.
              </p>
            </div>

            <div className="card-surface p-5 relative">
              <div className="text-3xl font-black text-[var(--color-muted-foreground)]/30 mb-2">04</div>
              <h4 className="font-bold text-base mb-1">Review & Defense</h4>
              <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                Supervisors evaluate milestones, record feedback trails, and clear projects for final defense.
              </p>
            </div>

          </div>
        </section>

        {/* Features Highlights Grid */}
        <section id="features" className="border-t border-[var(--color-border)] bg-[var(--color-card)] py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold tracking-tight">Essential Platform Capabilities</h2>
              <p className="text-[var(--color-muted-foreground)] text-sm mt-2">
                Designed to eliminate fragmentation across spreadsheets, emails, and isolated messaging apps.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="p-5 rounded-[var(--radius-custom)] bg-[var(--color-muted)] border border-[var(--color-border)]">
                <Search className="w-5 h-5 text-[var(--color-primary)] mb-3" />
                <h4 className="font-bold text-sm mb-1">Supervision Discovery</h4>
                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                  Filter supervisors by specific research domains, available capacities, and department tags.
                </p>
              </div>

              <div className="p-5 rounded-[var(--radius-custom)] bg-[var(--color-muted)] border border-[var(--color-border)]">
                <FileCheck2 className="w-5 h-5 text-[var(--color-primary)] mb-3" />
                <h4 className="font-bold text-sm mb-1">Version-Controlled History</h4>
                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                  Keep document revisions clear and accountable with automated submission logs.
                </p>
              </div>

              <div className="p-5 rounded-[var(--radius-custom)] bg-[var(--color-muted)] border border-[var(--color-border)]">
                <TrendingUp className="w-5 h-5 text-[var(--color-primary)] mb-3" />
                <h4 className="font-bold text-sm mb-1">Progress Analytics</h4>
                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                  Real-time status tracking for faculty supervising multiple project cohorts simultaneously.
                </p>
              </div>

              <div className="p-5 rounded-[var(--radius-custom)] bg-[var(--color-muted)] border border-[var(--color-border)]">
                <MessageSquare className="w-5 h-5 text-[var(--color-primary)] mb-3" />
                <h4 className="font-bold text-sm mb-1">Structured Feedback Loop</h4>
                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                  Centralized thread logs ensuring supervisor feedback is recorded directly next to deliverables.
                </p>
              </div>

              <div className="p-5 rounded-[var(--radius-custom)] bg-[var(--color-muted)] border border-[var(--color-border)]">
                <Users className="w-5 h-5 text-[var(--color-primary)] mb-3" />
                <h4 className="font-bold text-sm mb-1">Team Formation Directory</h4>
                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                  Allows students seeking teammates to showcase expertise and broadcast open team invites.
                </p>
              </div>

              <div className="p-5 rounded-[var(--radius-custom)] bg-[var(--color-muted)] border border-[var(--color-border)]">
                <ShieldCheck className="w-5 h-5 text-[var(--color-primary)] mb-3" />
                <h4 className="font-bold text-sm mb-1">Role-Based Access Control</h4>
                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                  Strict security permissions tailored specifically to Students, Team Leads, Faculty, and Admin.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Bottom Banner */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="card-surface p-8 md:p-12 text-center bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-none relative overflow-hidden">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight relative z-10">
              Ready to Upgrade Your Academic FYP Workflow?
            </h2>
            <p className="mt-3 text-sm md:text-base opacity-90 max-w-xl mx-auto relative z-10">
              Sign up with your university email address to access your department workspace.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
              <Link
                href="/register"
                className="w-full sm:w-auto px-6 py-3 rounded-[var(--radius-custom)] bg-[var(--color-card)] text-[var(--color-card-foreground)] font-semibold hover:bg-[var(--color-accent)] transition-colors text-sm shadow-sm"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-[var(--radius-custom)] border border-[var(--color-primary-foreground)]/30 text-[var(--color-primary-foreground)] font-semibold hover:bg-[var(--color-primary-hover)] transition-colors text-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-card)] py-10 text-xs text-[var(--color-muted-foreground)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary-foreground)] font-bold text-xs">
              P
            </div>
            <span className="font-bold text-sm text-[var(--color-foreground)]">ProjectPulse</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-muted)] border border-[var(--color-border)]">v1.0</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#overview" className="hover:text-[var(--color-foreground)] transition-colors">Overview</a>
            <a href="#roles" className="hover:text-[var(--color-foreground)] transition-colors">Roles</a>
            <a href="#workflow" className="hover:text-[var(--color-foreground)] transition-colors">Workflow</a>
            <a href="#features" className="hover:text-[var(--color-foreground)] transition-colors">Features</a>
          </div>

          <p>
            &copy; {new Date().getFullYear()} ProjectPulse Management System. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}