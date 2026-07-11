import { DecisionList } from "@/features/decision/components/decision-list";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="space-y-4">
        <span className="rounded-full border px-3 py-1 text-sm font-medium">
          Decision OS
        </span>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight">
          Make smarter decisions with confidence.
        </h1>

        <p className="max-w-2xl text-lg text-muted-foreground">
          Compare options, assign weighted criteria,
          and make better decisions using a structured
          decision matrix.
        </p>
      </section>

      <section className="mt-12">
        <DecisionList />
      </section>
    </main>
  );
}