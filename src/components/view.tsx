import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "@/components/Converter";
import { Checker } from "@/components/Checker";

export function View() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>View</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Calculator />
        <Checker />
      </CardContent>
    </Card>
  );
}
