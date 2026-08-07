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
      placeholder="Search decisions..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  );
}