export type DecisionStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "COMPLETED";

export type Option = {
  id: string;
  name: string;
};

export type Criterion = {
  id: string;
  name: string;
  weight: number;
};

export type Decision = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;

  status: DecisionStatus;
  isCompleted: boolean;

  options: Option[];
  criteria: Criterion[];
};