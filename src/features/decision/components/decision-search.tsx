
"use client";

import { Input } from "@/components/ui/Input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function DecisionSearch({
  value,
  onChange,
}: Props) {
  return (
    <Input
      type="search"
      aria-label="Search decisions"
      placeholder="Search decisions..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full"
    />
  );
}
