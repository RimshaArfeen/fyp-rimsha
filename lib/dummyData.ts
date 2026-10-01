export type TaskStatus = "done" | "pending" | "revision";

export const student = {
  name: "Ayesha Khan",
  role: "Student",
  rollNo: "CS-2022-014",
};

export const team = {
  name: "Team Alpha",
  lead: "Ayesha Khan",
  members: [
    { id: 1, name: "Ayesha Khan", role: "Team Lead" },
    { id: 2, name: "Hamza Ali", role: "Member" },
    { id: 3, name: "Sara Noor", role: "Member" },
  ],
};

export const project = {
  title: "Smart Campus Attendance System",
  supervisor: "Dr. Sarah Ahmed",
  status: "approved" as TaskStatus,
  progress: 45,
};

export const tasks: { id: number; title: string; due: string; status: TaskStatus }[] = [
  { id: 1, title: "Write project proposal", due: "05 Oct", status: "done" },
  { id: 2, title: "Design database schema", due: "12 Oct", status: "pending" },
  { id: 3, title: "Build login and signup UI", due: "15 Oct", status: "done" },
  { id: 4, title: "Prepare milestone 1 report", due: "20 Oct", status: "revision" },
];

export const deadlines = [
  { id: 1, title: "Milestone 1 Submission", date: "20 Oct 2026" },
  { id: 2, title: "Mid Evaluation", date: "05 Nov 2026" },
  { id: 3, title: "Milestone 2 Submission", date: "25 Nov 2026" },
];

export const feedback = [
  {
    id: 1,
    from: "Dr. Sarah Ahmed",
    date: "28 Sep",
    message: "Proposal approved. Please add a clearer scope section in the next report.",
  },
  {
    id: 2,
    from: "Dr. Sarah Ahmed",
    date: "01 Oct",
    message: "Good progress on the UI. Keep the naming consistent across pages.",
  },
];
