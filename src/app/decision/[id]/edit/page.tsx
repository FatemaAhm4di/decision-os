import Link from "next/link";
import {
  ArrowLeft,
  CircleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

import { CreateDecisionForm } from "@/features/decision/components/create-decision-form";
import { getDecision } from "@/lib/decision/get-decision";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditDecisionPage({
  params,
}: Props) {
  const { id } = await params;

  let decision;

  try {
    decision = await getDecision(id);
  } catch (error) {
    console.error("Failed to load decision for editing:", error);

    return (
      <main className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-12">
        <Card>
          <CardContent className="flex flex-col items-center p-8 text-center sm:p-10">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <CircleAlert
                className="size-6 text-destructive"
                aria-hidden="true"
              />
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight">
              Unable to load decision
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Something went wrong while loading this decision.
              Please try again.
            </p>

            <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/decision"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Back to decisions
                </Button>
              </Link>

              <Link
                href={`/decision/${id}/edit`}
                className="w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto">
                  Try again
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!decision) {
    return (
      <main className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-12">
        <Card>
          <CardContent className="flex flex-col items-center p-8 text-center sm:p-10">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <CircleAlert
                className="size-6 text-destructive"
                aria-hidden="true"
              />
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight">
              Decision not found
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              The decision you are looking for does not exist
              or may have been removed.
            </p>

            <Link href="/decision" className="mt-6">
              <Button>
                <ArrowLeft className="mr-2 size-4" />
                Back to decisions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8">
        <Link
          href={`/decision/${decision.id}`}
          className="group mb-5 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="mr-2 size-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to decision
        </Link>

        <p className="text-sm font-medium text-primary">
          Decision Management
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          Edit Decision
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update the title, options, and weighted criteria for
          this decision.
        </p>
      </div>

      <CreateDecisionForm
        mode="edit"
        decisionId={decision.id}
        initialTitle={decision.title}
        initialOptions={decision.options.map(
          ({ id, name }) => ({
            id,
            name,
          })
        )}
        initialCriteria={decision.criteria.map(
          ({ id, name, weight }) => ({
            id,
            name,
            weight,
          })
        )}
      />
    </main>
  );
}
