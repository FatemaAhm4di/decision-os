export type Criterion = {
  id: string;
  name: string;
  weight: number;
};

export type Option = {
  id: string;
  name: string;
  scores: Record<string, number>;
};

export type Decision = {
  id: string;
  title: string;
  options: Option[];
  criteria: Criterion[];
};