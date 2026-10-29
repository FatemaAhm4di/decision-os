
import Link from "next/link";
import { ArrowRight, Layers3, Sparkles } from "lucide-react";

import { decisionTemplates } from "@/data/decision-templates";
import { TemplateCard } from "@/features/decision/components/template-card";

export default function TemplatesPage() {
  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card px-5 py-8 shadow-sm sm:px-8 sm:py-10 lg:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-accent/50 blur-3xl"
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Start with a proven structure
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Decision Templates
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              Make complex choices easier with ready-to-use decision
              frameworks. Choose a template, customize your criteria, and
              compare your options with a clear scoring system.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-background/80 px-4 py-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Layers3 className="size-5" aria-hidden="true" />
            </div>

            <div>
              <p className="text-2xl font-semibold tabular-nums text-foreground">
                {decisionTemplates.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Ready-to-use templates
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="template-list-heading" className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="template-list-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Explore templates
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Each template includes sample options and weighted criteria you
              can customize.
            </p>
          </div>

          <span className="text-sm text-muted-foreground">
            {decisionTemplates.length} templates available
          </span>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
          {decisionTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-muted/50 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Prefer to start from scratch?
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Create a custom decision with your own options, criteria, and
              weights instead of starting from a template.
            </p>
          </div>

          <Link
            href="/decision/new"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Create a decision
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
