"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import {
  FolderKanban,
  ListTodo,
  SlidersHorizontal,
} from "lucide-react";

type Option = {
  id: string;
  name: string;
};

type Criterion = {
  id: string;
  name: string;
  weight: number;
};

type Props = {
  onCreated?: () => void;
  initialTitle?: string;
  initialOptions?: Option[];
  initialCriteria?: Criterion[];
  mode?: "create" | "edit";
  decisionId?: string;
};

export function CreateDecisionForm({
  onCreated,
  initialTitle = "",
  initialOptions,
  initialCriteria,
  mode = "create",
  decisionId,
}: Props) {
  const [title, setTitle] = useState(initialTitle);

  const [options, setOptions] = useState<Option[]>(
    initialOptions ?? [
      {
        id: crypto.randomUUID(),
        name: "",
      },
    ]
  );

  const [criteria, setCriteria] = useState<Criterion[]>(
    initialCriteria ?? [
      {
        id: crypto.randomUUID(),
        name: "",
        weight: 1,
      },
    ]
  );

  const [isLoading, setIsLoading] = useState(false);

  function addOption() {
    setOptions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
      },
    ]);
  }

  function removeOption(id: string) {
    setOptions((prev) =>
      prev.filter((option) => option.id !== id)
    );
  }

  function updateOption(id: string, name: string) {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === id
          ? {
              ...option,
              name,
            }
          : option
      )
    );
  }

  function addCriterion() {
    setCriteria((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        weight: 1,
      },
    ]);
  }

  function removeCriterion(id: string) {
    setCriteria((prev) =>
      prev.filter(
        (criterion) => criterion.id !== id
      )
    );
  }

  function updateCriterion(
    id: string,
    field: "name" | "weight",
    value: string | number
  ) {
    setCriteria((prev) =>
      prev.map((criterion) =>
        criterion.id === id
          ? {
              ...criterion,
              [field]: value,
            }
          : criterion
      )
    );
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }
    const totalWeight = criteria.reduce(
  (sum, criterion) => sum + criterion.weight,
  0
);

if (Math.abs(totalWeight - 1) > 0.001) {
  alert(
    `Criteria weights must equal 1.\nCurrent total: ${totalWeight}`
  );
  return;
}

    if (
      options.every(
        (option) => !option.name.trim()
      )
    ) {
      alert("Add at least one option.");
      return;
    }

    if (
      criteria.every(
        (criterion) => !criterion.name.trim()
      )
    ) {
      alert("Add at least one criterion.");
      return;
    }

    setIsLoading(true);

    try {
      const url =
        mode === "edit"
          ? `/api/decision/${decisionId}`
          : "/api/decision";

      const method =
        mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          options,
          criteria,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      await res.json();

      if (mode === "create") {
        setTitle("");

        setOptions([
          {
            id: crypto.randomUUID(),
            name: "",
          },
        ]);

        setCriteria([
          {
            id: crypto.randomUUID(),
            name: "",
            weight: 1,
          },
        ]);
      }

      onCreated?.();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
  <Card className="mt-8">
    <CardHeader className="space-y-4">
  <div className="flex items-center gap-3">
    <div className="rounded-lg bg-primary/10 p-2">
      <FolderKanban className="size-5 text-primary" />
    </div>

    <div>
      <CardTitle className="text-2xl">
        {mode === "edit"
          ? "Edit Decision"
          : "Create New Decision"}
      </CardTitle>

      <CardDescription className="mt-1">
        {mode === "edit"
          ? "Update your decision."
          : "Compare options using weighted criteria."}
      </CardDescription>
    </div>
  </div>

  <Separator />
</CardHeader>

    <CardContent>
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="space-y-2">
  <Label htmlFor="title">
    Decision Title
  </Label>

  <Input
    id="title"
    value={title}
    onChange={(e) =>
      setTitle(e.target.value)
    }
    placeholder="Enter decision title"
  />
</div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <ListTodo className="size-5 text-primary" />

    <h3 className="text-lg font-semibold">
      Options
    </h3>
  </div>

  <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={addOption}
  >
    Add Option
  </Button>
</div>


          {options.map((option) => (
            <div
              key={option.id}
              className="flex gap-2"
            >
              <Input
  value={option.name}
  onChange={(e) =>
    updateOption(
      option.id,
      e.target.value
    )
  }
  placeholder="Option name"
/>

              <Button
  type="button"
  variant="destructive"
  size="icon"
  onClick={() =>
    removeOption(option.id)
  }
>
  ×
</Button>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <SlidersHorizontal className="size-5 text-primary" />

    <h3 className="text-lg font-semibold">
      Criteria
    </h3>
  </div>

  <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={addCriterion}
  >
    Add Criterion
  </Button>
</div>

          {criteria.map((criterion) => (
            <div
              key={criterion.id}
              className="flex gap-2"
            >
              <Input
  value={criterion.name}
  onChange={(e) =>
    updateCriterion(
      criterion.id,
      "name",
      e.target.value
    )
  }
  placeholder="Criterion name"
/>

              <Input
  type="number"
  step="0.1"
  min="0"
  max="1"
  value={criterion.weight}
  onChange={(e) =>
    updateCriterion(
      criterion.id,
      "weight",
      Number(e.target.value)
    )
  }
  className="w-24"
/>

              <Button
  type="button"
  variant="destructive"
  size="icon"
  onClick={() =>
    removeCriterion(
      criterion.id
    )
  }
>
  ×
</Button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg border px-4 py-2"
        >
          {isLoading
            ? mode === "edit"
              ? "Saving..."
              : "Creating..."
            : mode === "edit"
            ? "Save Changes"
            : "Create Decision"}
        </button>
      </form>
    </CardContent>
  </Card>
  );
}