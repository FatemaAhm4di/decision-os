
"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { DecisionTemplate } from "@/data/decision-templates";

type TemplateCardProps = {
  template: DecisionTemplate;
};

const categoryIcons = {
  Career: BriefcaseBusiness,
  Education: GraduationCap,
  Lifestyle: MapPin,
  Shopping: ShoppingBag,
} as const;

export function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();

  const Icon =
    categoryIcons[template.category as keyof typeof categoryIcons] ??
    Sparkles;

  const totalWeight = Math.round(
    template.criteria.reduce(
      (total, criterion) => total + criterion.weight,
      0,
    ) * 100,
  );

  function handleUseTemplate() {
    const params = new URLSearchParams({
      template: template.id,
    });

    router.push(`/decision/new?${params.toString()}`);
  }

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-ring/60 hover:shadow-lg sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </div>

        <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {template.category}
        </span>
      </div>

      <div className="mt-5">
        <h2 className="text-lg font-semibold tracking-tight text-card-foreground">
          {template.title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {template.description}
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <section aria-label="Template options">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Options
            </h3>

            <span className="text-xs tabular-nums text-muted-foreground">
              {template.options.length} choices
            </span>
          </div>

          <ul className="mt-3 space-y-2">
            {template.options.map((option, index) => (
              <li
                key={`${template.id}-option-${index}`}
                className="flex items-center gap-3 text-sm text-card-foreground"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                  {index + 1}
                </span>

                <span className="min-w-0 break-words">{option}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="border-t border-border" />

        <section aria-label="Template criteria">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Criteria & Weights
            </h3>

            <span className="text-xs tabular-nums text-muted-foreground">
              {template.criteria.length} criteria
            </span>
          </div>

          <ul className="mt-3 space-y-3">
            {template.criteria.map((criterion, index) => {
              const percentage = Math.round(criterion.weight * 100);

              return (
                <li
                  key={`${template.id}-criterion-${index}`}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 break-words text-card-foreground">
                      {criterion.name}
                    </span>

                    <span className="shrink-0 font-medium tabular-nums text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>

                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-muted"
                    role="img"
                    aria-label={`${criterion.name}: ${percentage}% weight`}
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300 group-hover:bg-secondary"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-muted/60 px-3 py-3">
            <span className="text-xs font-medium text-muted-foreground">
              Total weight
            </span>

            <span className="text-sm font-semibold tabular-nums text-card-foreground">
              {totalWeight}%
            </span>
          </div>
        </section>
      </div>

      <button
        type="button"
        onClick={handleUseTemplate}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground outline-none transition-all duration-200 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
      >
        Use Template
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </button>
    </article>
  );
}
