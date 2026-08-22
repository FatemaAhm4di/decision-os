"use client";

import { useCallback, useEffect, useState } from "react";

import { Decision } from "@/types/decision";

export function useDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDecisions = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/decision");

      if (!res.ok) {
        throw new Error("Failed to fetch decisions");
      }

      const data: Decision[] = await res.json();

      setDecisions(data);
    } catch (error) {
      console.error("Failed to fetch decisions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecisions();
  }, [fetchDecisions]);

  return {
    decisions,
    isLoading,
    refetch: fetchDecisions,
  };
}