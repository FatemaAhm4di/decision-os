"use client";

import { useState } from "react";

type DecisionResponse = {
  decision: unknown;
  result: unknown;
};

type Props = {
  onCreated?: () => void;
};

export function CreateDecisionForm({ onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [response, setResponse] = useState<DecisionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          options: [],
          criteria: [],
        }),
      });

      const data: DecisionResponse = await res.json();

      setResponse(data);
      setTitle("");

      // مهم: اطلاع به لیست برای آپدیت
      onCreated?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter decision title"
          className="rounded-lg border px-4 py-2"
        />

        <button
          type="submit"
          className="rounded-lg border px-4 py-2"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Decision"}
        </button>
      </form>

      {response && (
        <pre className="mt-6 overflow-auto rounded-lg border p-4 text-sm">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}