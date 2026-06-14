"use client";

import { useEffect, useState } from "react";
import { Decision } from "@/types/decision";

export function useDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchDecisions() {
    try {
      setIsLoading(true);

      const res = await fetch("/api/decision");
      const data: Decision[] = await res.json();

      setDecisions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

useEffect(() => {
  let ignore = false;

  async function load() {
    setIsLoading(true);

    try {
      const res = await fetch("/api/decision");
      const data = await res.json();

      if (!ignore) {
        setDecisions(data);
      }
    } finally {
      if (!ignore) {
        setIsLoading(false);
      }
    }
  }

  load();

  return () => {
    ignore = true;
  };
}, []);

  return {
    decisions,
    isLoading,
    refetch: fetchDecisions,
  };
}