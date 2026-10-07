
export type Member = {
  id: string;
  name: string;
  role: "Lead" | "Member";
  initials: string;
  online: boolean;
};

export type Milestone = {
  id: string;
  title: string;
  due: string;
  status: "approved" | "pending" | "revision";
  assignees: string[];
};

export type Submission = {
  id: string;
  milestone: string;
  submittedBy: string;
  date: string;
  status: "approved" | "pending" | "revision";
};

export type FeedbackThread = {
  id: string;
  author: string;
  date: string;
  snippet: string;
  body: string;
  resolved: boolean;
};

export type ChatMessage = {
  id: string;
  author: string;
  initials: string;
  body: string;
  time: string;
  self?: boolean;
};

export const project = {
  title: "AI-Based Attendance System",
  team: "Team Alpha",
  supervisor: "Dr. Ayesha Khan",
  supervisorDept: "Computer Science",
  type: "FYP-II",
  status: "approved" as const,
  progress: 62,
  startDate: "Sep 12, 2024",
  endDate: "May 30, 2025",
  daysLeft: 41,
  members: [
    { id: "1", name: "Hassan Ali", role: "Lead", initials: "HA", online: true },
    { id: "2", name: "Fatima Noor", role: "Member", initials: "FN", online: true },
    { id: "3", name: "Bilal Khan", role: "Member", initials: "BK", online: false },
    { id: "4", name: "Zainab Raza", role: "Member", initials: "ZR", online: true },
    { id: "5", name: "Usman Tariq", role: "Member", initials: "UT", online: false },
  ] as Member[],
  milestones: [
    { id: "m1", title: "Proposal Document", due: "Oct 02, 2024", status: "approved", assignees: ["HA", "FN"] },
    { id: "m2", title: "Requirements & SRS", due: "Nov 15, 2024", status: "approved", assignees: ["BK"] },
    { id: "m3", title: "System Design", due: "Jan 10, 2025", status: "approved", assignees: ["ZR"] },
    { id: "m4", title: "Frontend Prototype", due: "Mar 01, 2025", status: "pending", assignees: ["HA", "ZR"] },
    { id: "m5", title: "Backend Integration", due: "Apr 12, 2025", status: "revision", assignees: ["BK", "UT"] },
    { id: "m6", title: "Final Report", due: "May 20, 2025", status: "pending", assignees: ["FN", "UT"] },
  ] as Milestone[],
  submissions: [
    { id: "s1", milestone: "Proposal Document", submittedBy: "Hassan Ali", date: "Oct 01, 2024", status: "approved" },
    { id: "s2", milestone: "Requirements & SRS", submittedBy: "Bilal Khan", date: "Nov 13, 2024", status: "approved" },
    { id: "s3", milestone: "System Design", submittedBy: "Zainab Raza", date: "Jan 08, 2025", status: "approved" },
    { id: "s4", milestone: "Backend Integration", submittedBy: "Usman Tariq", date: "Apr 10, 2025", status: "revision" },
  ] as Submission[],
  feedback: [
    {
      id: "f1",
      author: "Dr. Ayesha Khan",
      date: "Apr 11, 2025",
      snippet: "The backend auth flow needs rework...",
      body: "The backend auth flow needs rework. Please switch to refresh-token rotation and add rate limiting on the login route. Attach updated sequence diagrams with the next submission.",
      resolved: false,
    },
    {
      id: "f2",
      author: "Dr. Ayesha Khan",
      date: "Mar 20, 2025",
      snippet: "Frontend prototype looks solid...",
      body: "Frontend prototype looks solid. Consider tightening spacing on the dashboard and confirming mobile breakpoints at 375px.",
      resolved: true,
    },
    {
      id: "f3",
      author: "Dr. Ayesha Khan",
      date: "Feb 02, 2025",
      snippet: "Please expand the SRS scope...",
      body: "Please expand the SRS scope to include edge cases for offline attendance sync.",
      resolved: true,
    },
  ] as FeedbackThread[],
  messages: [
    { id: "c1", author: "Hassan Ali", initials: "HA", body: "Pushed the new branch — check `feat/auth-refresh`.", time: "09:12" },
    { id: "c2", author: "Fatima Noor", initials: "FN", body: "Reviewing it now, will leave comments before noon.", time: "09:18" },
    { id: "c3", author: "You", initials: "ME", body: "Great. I'll update the sequence diagrams tonight.", time: "09:22", self: true },
    { id: "c4", author: "Zainab Raza", initials: "ZR", body: "Supervisor asked for the revised report by Friday.", time: "10:04" },
    { id: "c5", author: "You", initials: "ME", body: "Noted — I'll split the work across milestones tab.", time: "10:07", self: true },
  ] as ChatMessage[],
  activity: [
    { id: "a1", who: "Zainab Raza", what: "uploaded System Design v2", when: "2h ago" },
    { id: "a2", who: "Dr. Ayesha Khan", what: "left feedback on Backend Integration", when: "5h ago" },
    { id: "a3", who: "Bilal Khan", what: "marked Requirements & SRS as complete", when: "1d ago" },
    { id: "a4", who: "Hassan Ali", what: "invited Usman Tariq to the team", when: "2d ago" },
  ],
  upcoming: [
    { id: "u1", label: "Backend Integration (revision)", due: "Apr 14, 2025", days: 3 },
    { id: "u2", label: "Mid-project demo", due: "Apr 22, 2025", days: 11 },
    { id: "u3", label: "Final Report draft", due: "May 05, 2025", days: 24 },
  ],
  resources: [
    { id: "r1", name: "Proposal.pdf", type: "PDF", size: "1.2 MB" },
    { id: "r2", name: "SRS.docx", type: "DOC", size: "820 KB" },
    { id: "r3", name: "Figma – UI Kit", type: "FIG", size: "—" },
    { id: "r4", name: "GitHub Repo", type: "GIT", size: "—" },
  ],
};