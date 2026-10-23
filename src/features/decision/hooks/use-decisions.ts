"use client";

import { useCallback, useEffect, useState } from "react";

import { Decision } from "@/types/decision";

type UseDecisionsResult = {
  decisions: Decision[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useDecisions(): UseDecisionsResult {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDecisions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/decision", {
        cache: "no-store",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ?? "Failed to fetch decisions"
        );
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid decisions response");
      }

      setDecisions(data);
    } catch (error) {
      console.error("Failed to fetch decisions:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load decisions. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDecisions() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/decision", {
          cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message ?? "Failed to fetch decisions"
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid decisions response");
        }

        if (!cancelled) {
          setDecisions(data);
        }
      } catch (error) {
        console.error("Failed to fetch decisions:", error);

        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load decisions. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDecisions();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    decisions,
    isLoading,
    error,
    refetch: fetchDecisions,
  };
}