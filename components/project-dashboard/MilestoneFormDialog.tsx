
"use client";

import { useState } from "react";
import Modal from "./ui/Modal";
import { useProjectStore, type Milestone, type ProjectInfo } from "../../lib/project-store";

const input =
     "w-full rounded-[var(--radius-custom)] border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function MilestoneFormDialog({
     project, milestone, onClose, onSaved,
}: { project: ProjectInfo; milestone?: Milestone; onClose: () => void; onSaved: (m: string) => void }) {
     const { createMilestone, updateMilestone, deleteMilestone } = useProjectStore();
     const editing = !!milestone;

     const [title, setTitle] = useState(milestone?.title ?? "");
     const [description, setDescription] = useState(milestone?.description ?? "");
     const [deadline, setDeadline] = useState(milestone?.dueDay ?? "");
     const [assignees, setAssignees] = useState<string[]>(milestone?.assigneeIds ?? []);
     const [busy, setBusy] = useState(false);
     const [confirmDelete, setConfirmDelete] = useState(false);
     const [error, setError] = useState("");

     const toggle = (id: string) =>
          setAssignees((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

     const run = async (fn: () => Promise<void>, ok: string) => {
          if (busy) return;
          setBusy(true);
          setError("");
          try {
               await fn();
               onSaved(ok);
               onClose();
          } catch (e) {
               setError(e instanceof Error ? e.message : "Something went wrong");
               setBusy(false);
          }
     };

     const save = () => {
          if (title.trim().length < 3) return setError("Title must be at least 3 characters");
          if (!deadline) return setError("Pick a deadline");
          const body = { title: title.trim(), description: description.trim(), deadline, assigneeIds: assignees };
          run(
               () => (editing ? updateMilestone(milestone!.id, body) : createMilestone(body)),
               editing ? "Milestone updated" : "Milestone created"
          );
     };

     return (
          <Modal
               title={editing ? "Edit milestone" : "New milestone"}
               subtitle={editing ? undefined : "It starts as pending, and your team can submit work for it."}
               onClose={onClose}
          >
               <div className="space-y-3">
                    <label className="block text-xs font-medium text-muted-foreground">
                         Title
                         <input className={`${input} mt-1`} value={title} maxLength={120} placeholder="e.g. SRS document" onChange={(e) => setTitle(e.target.value)} />
                    </label>
                    <label className="block text-xs font-medium text-muted-foreground">
                         Description (optional)
                         <textarea className={`${input} mt-1`} rows={3} value={description} maxLength={1000} placeholder="What must be delivered?" onChange={(e) => setDescription(e.target.value)} />
                    </label>
                    <label className="block text-xs font-medium text-muted-foreground">
                         Deadline
                         <input type="date" className={`${input} mt-1`} value={deadline} min={project.startISO || undefined} max={project.endISO || undefined} onChange={(e) => setDeadline(e.target.value)} />
                    </label>

                    <fieldset>
                         <legend className="text-xs font-medium text-muted-foreground">Assignees</legend>
                         <ul className="mt-1 grid gap-1.5 sm:grid-cols-2">
                              {project.members.map((m) => (
                                   <li key={m.id}>
                                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent">
                                             <input type="checkbox" checked={assignees.includes(m.id)} onChange={() => toggle(m.id)} />
                                             <span className="truncate">{m.name}</span>
                                             {m.isLead && <span className="text-[10px] uppercase text-muted-foreground">Lead</span>}
                                        </label>
                                   </li>
                              ))}
                         </ul>
                    </fieldset>
               </div>

               {error && <p className="text-sm text-destructive">{error}</p>}

               <div className="flex items-center justify-between gap-2">
                    {editing ? (
                         <button
                              type="button"
                              disabled={busy}
                              onClick={() => (confirmDelete ? run(() => deleteMilestone(milestone!.id), "Milestone deleted") : setConfirmDelete(true))}
                              onBlur={() => setConfirmDelete(false)}
                              className={`rounded-[var(--radius-custom)] border px-3 py-2 text-sm disabled:opacity-50 ${confirmDelete ? "border-destructive bg-destructive text-white" : "border-border text-destructive hover:bg-accent"}`}
                         >
                              {confirmDelete ? "Click again to delete" : "Delete"}
                         </button>
                    ) : <span />}
                    <div className="flex gap-2">
                         <button type="button" onClick={onClose} className="rounded-[var(--radius-custom)] border border-border px-3 py-2 text-sm hover:bg-accent">Cancel</button>
                         <button type="button" onClick={save} disabled={busy} className="rounded-[var(--radius-custom)] bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50">
                              {busy ? "Saving…" : editing ? "Save changes" : "Create milestone"}
                         </button>
                    </div>
               </div>
          </Modal>
     );
}