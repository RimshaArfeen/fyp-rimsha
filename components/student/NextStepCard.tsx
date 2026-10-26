import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = { title: string; text: string; href: string; button: string };

export default function NextStepCard({ title, text, href, button }: Props) {
  return (
    <section className="fade-up card-surface p-5 flex items-center justify-between gap-4 flex-wrap border-l-4 border-l-secondary">
      <div>
        <p className="text-xs text-muted-foreground mb-1">Your next step</p>
        <h2 className="font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:scale-105 transition"
      >
        {button} <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}