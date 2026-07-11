"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

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
      <DialogTrigger>
        <Button>
          + New Decision
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Create Decision
          </DialogTitle>

          <DialogDescription>
            Add a new decision with
            options and weighted
            criteria.
          </DialogDescription>
        </DialogHeader>

        <CreateDecisionForm
          onCreated={() => {
            onCreated?.();
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}