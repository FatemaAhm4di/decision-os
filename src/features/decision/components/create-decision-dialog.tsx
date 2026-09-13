"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CreateDecisionForm } from "./create-decision-form";

type Props = {
  onCreated?: () => void;
};

export function CreateDecisionDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false);

  const handleCreated = () => {
    onCreated?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto sm:px-6 sm:py-2.5 sm:text-base"
      >
        + New Decision
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-[95vw] max-w-3xl overflow-y-auto p-4 sm:max-h-[85vh] sm:p-6">
        <DialogHeader className="space-y-1.5 sm:space-y-2">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            Create Decision
          </DialogTitle>

          <DialogDescription className="text-sm sm:text-base">
            Add a new decision with options and weighted criteria.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 sm:mt-6">
          <CreateDecisionForm onCreated={handleCreated} />
        </div>
      </DialogContent>
    </Dialog>
  );
}