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

export function CreateDecisionDialog({
  onCreated,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base">
        + New Decision
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-3xl mx-auto p-4 sm:p-6 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5 sm:space-y-2">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            Create Decision
          </DialogTitle>

          <DialogDescription className="text-sm sm:text-base">
            Add a new decision with options and weighted criteria.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 sm:mt-6">
          <CreateDecisionForm
            onCreated={() => {
              onCreated?.();
              setOpen(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}