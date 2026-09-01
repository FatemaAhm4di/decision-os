import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  FolderKanban,
  ListTodo,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import { Button } from "@/components/ui/Button";

import { Decision } from "@/types/decision";

import { DeleteDecisionButton } from "./delete-decision-button";

type DecisionCardProps = {
  decision: Decision;
  onDeleted: () => void;
};

export function DecisionCard({
  decision,
  onDeleted,
}: DecisionCardProps) {
  const optionCount = decision.options?.length ?? 0;
  const criterionCount =
    decision.criteria?.length ?? 0;

  const progress = Math.min(
    ((optionCount + criterionCount) / 6) * 100,
    100
  );

  const createdAt = new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(new Date(decision.createdAt));

  return (
    <Card
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        bg-background/80
        backdrop-blur
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:border-primary/40
        hover:shadow-2xl
      "
    >
      <div
        className="
          absolute
          left-0
          top-0
          h-full
          w-1
          bg-primary/20
          transition-all
          duration-300
          group-hover:bg-primary
        "
      />

      <CardHeader className="pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-primary/10
                ring-1
                ring-primary/15
                transition-all
                duration-300
                group-hover:scale-105
                group-hover:bg-primary/15
                group-hover:shadow-lg
              "
            >
              <FolderKanban
                className="
                  size-6
                  text-primary
                  transition-transform
                  duration-300
                  group-hover:rotate-6
                "
              />
            </div>

            <div className="min-w-0">
              <div
                className="
                  mb-3
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  bg-primary/5
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-primary
                "
              >
                <Sparkles className="size-3.5" />
                Decision
              </div>

              <CardTitle
                className="
                  line-clamp-1
                  text-xl
                  font-bold
                  tracking-tight
                  transition-colors
                  duration-300
                  group-hover:text-primary
                "
              >
                {decision.title}
              </CardTitle>

              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4" />
                <span>{createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div
            className="
              rounded-2xl
              border
              bg-muted/30
              p-5
              transition-all
              duration-300
              group-hover:bg-muted/50
            "
          >
            <ListTodo className="mb-4 size-5 text-primary" />

            <p className="text-3xl font-bold">
              {optionCount}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Options
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border
              bg-muted/30
              p-5
              transition-all
              duration-300
              group-hover:bg-muted/50
            "
          >
            <SlidersHorizontal className="mb-4 size-5 text-primary" />

            <p className="text-3xl font-bold">
              {criterionCount}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Criteria
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              Setup Progress
            </span>

            <span className="font-semibold text-primary">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="
                h-full
                rounded-full
                bg-primary
                transition-all
                duration-700
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/decision/${decision.id}`}
            className="flex-1"
          >
            <Button className="group w-full">
              Open Decision

              <ArrowRight
                className="
                  ml-2
                  size-4
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Button>
          </Link>

          <DeleteDecisionButton
            decisionId={decision.id}
            onDeleted={onDeleted}
          />
        </div>
      </CardContent>
    </Card>
  );
}