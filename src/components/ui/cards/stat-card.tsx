import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: number;
  percentage?: number;
  isGain?: boolean;
};

export default function StatCard({
  title,
  value,
  percentage,
  isGain,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">
          ₹{value.toLocaleString("en-IN")}
        </div>
        {percentage !== undefined && (
          <div
            className={`mt-1 text-sm font-medium ${
              isGain ? "text-green-600" : "text-red-600"
            }`}
          >
            {isGain ? "+" : "-"}
            {Math.abs(percentage).toFixed(2)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
