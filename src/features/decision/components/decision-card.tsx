import Link from "next/link";
import {
  FolderKanban,
  ListTodo,
  SlidersHorizontal,
  Calendar,
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
};

export function DecisionCard({
  decision,
}: DecisionCardProps) {
  return (
    <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <FolderKanban className="size-5 text-primary" />
            </div>

            <div>
              <CardTitle className="text-lg">
                {decision.title}
              </CardTitle>

              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="size-4" />

                <span>
                  {new Date(
                    decision.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ListTodo className="size-4" />

              <span className="text-sm">
                Options
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold">
              {decision.options?.length ?? 0}
            </p>
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <SlidersHorizontal className="size-4" />

              <span className="text-sm">
                Criteria
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold">
              {decision.criteria?.length ?? 0}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
  <Link
    href={`/decision/${decision.id}`}
  >
    <Button variant="outline">
      Open
    </Button>
  </Link>

  <DeleteDecisionButton
    decisionId={decision.id}
  />
</div>
      </CardContent>
    </Card>
  );
}