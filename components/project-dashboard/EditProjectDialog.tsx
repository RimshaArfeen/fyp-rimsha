
"use client";

import { useState } from "react";
import Modal from "./ui/Modal";
import { useProjectStore } from "../../lib/project-store";

const input =
     "w-full rounded-[var(--radius-custom)] border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function EditProjectDialog({ onClose, onSaved }: { onClose: () => void; onSaved: (m: string) => void }) {
     const { project, updateProject } = useProjectStore();
     const [title, setTitle] = useState(project?.title ?? "");
     const [description, setDescription] = useState(project?.description ?? "");
     const [start, setStart] = useState(project?.startISO ?? "");
     const [end, setEnd] = useState(project?.endISO ?? "");
     const [busy, setBusy] = useState(false);
     const [error, setError] = useState("");

     const save = async () => {
          if (busy) return;
          if (title.trim().length < 3) return setError("Title must be at least 3 characters");
          if (description.trim().length < 10) return setError("Description must be at least 10 characters");
          if (start && end && end < start) return setError("End date must be after the start date");
          setBusy(true);
          setError("");
          try {
               await updateProject({
                    title: title.trim(),
                    description: description.trim(),
                    timelineStart: start || null,
                    timelineEnd: end || null,
               });
               onSaved("Project updated");
               onClose();
          } catch (e) {
               setError(e instanceof Error ? e.message : "Could not save");
               setBusy(false);
          }
     };

     return (
          <Modal title="Edit project" subtitle="Only the team lead can change these details." onClose={onClose}>
               <div className="space-y-3">
                    <label className="block text-xs font-medium text-muted-foreground">
                         Title
                         <input className={`${input} mt-1`} value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} />
                    </label>
                    <label className="block text-xs font-medium text-muted-foreground">
                         Description
                         <textarea className={`${input} mt-1`} rows={5} value={description} maxLength={2000} onChange={(e) => setDescription(e.target.value)} />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                         <label className="block text-xs font-medium text-muted-foreground">
                              Start date
                              <input type="date" className={`${input} mt-1`} value={start} onChange={(e) => setStart(e.target.value)} />
                         </label>
                         <label className="block text-xs font-medium text-muted-foreground">
                              End date
                              <input type="date" className={`${input} mt-1`} value={end} min={start || undefined} onChange={(e) => setEnd(e.target.value)} />
                         </label>
                    </div>
               </div>
               {error && <p className="text-sm text-destructive">{error}</p>}
               <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="rounded-[var(--radius-custom)] border border-border px-3 py-2 text-sm hover:bg-accent">Cancel</button>
                    <button type="button" onClick={save} disabled={busy} className="rounded-[var(--radius-custom)] bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50">
                         {busy ? "Saving…" : "Save changes"}
                    </button>
               </div>
          </Modal>
     );
}