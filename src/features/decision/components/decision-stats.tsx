import { Card, CardContent } from "@/components/ui/Card";

type Props = {
  decisions: number;
  options: number;
  criteria: number;
};

export function DecisionStats({
  decisions,
  options,
  criteria,
}: Props) {
  const stats = [
    {
      title: "Decisions",
      value: decisions,
    },
    {
      title: "Options",
      value: options,
    },
    {
      title: "Criteria",
      value: criteria,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              {stat.title}
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {stat.value}
            </h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}