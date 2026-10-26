"use client";
import { Check } from "lucide-react";
import { useStage } from "../../lib/stage";

const steps = ["Join a team", "Create project", "Milestones", "Feedback"];

export default function FlowStepper() {
  const { stage } = useStage();
  const current = stage - 1;

  return (
    <section className="fade-up card-surface p-5 flex items-center">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs whitespace-nowrap ${active ? "font-medium" : "text-muted-foreground"}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 ${done ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </section>
  );
}