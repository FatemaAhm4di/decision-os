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

  options: Option[];
  criteria: Criterion[];
};