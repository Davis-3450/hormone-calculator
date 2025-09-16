import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHormonesStore } from "@/store/hormones";
import { HormoneName } from "@/lib/logic/units";
import { HormoneRangeStatus } from "@/lib/logic/values";
import { StatusBadge } from "@/components/StatusBadge";

export function Checker() {
  const statuses = useHormonesStore((s) => s.statuses);

  const entries = Object.entries(statuses) as [
    HormoneName,
    HormoneRangeStatus,
  ][];
  const low = entries.filter(([, v]) => v === HormoneRangeStatus.low).length;
  const high = entries.filter(([, v]) => v === HormoneRangeStatus.high).length;
  const invalid = entries.filter(
    ([, v]) => v === HormoneRangeStatus.invalid
  ).length;
  const normal = entries.filter(
    ([, v]) => v === HormoneRangeStatus.normal
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col text-center">
        <div>
          <div className="grid place-items-center gap-2">
            <StatusBadge status={HormoneRangeStatus.normal}>
              Normal: {normal}
            </StatusBadge>
            <StatusBadge status={HormoneRangeStatus.low}>
              Low: {low}
            </StatusBadge>
            <StatusBadge status={HormoneRangeStatus.high}>
              High: {high}
            </StatusBadge>
          </div>
          {/* useless for now
          <div className="grid grid-cols-1 gap-2">
            {entries.map(([id, st]) => (
              <div key={id} className="flex items-center gap-2">
                <span className="capitalize flex-1">{id}</span>
                <StatusBadge status={st} />
              </div>
            ))}
          </div> */}
        </div>
      </CardContent>

      <CardFooter className="justify-center">
        <p>
          Made with ❤️ by{" "}
          <a
            href="https://github.com/Davis-3450"
            className="text-purple-400 font-bold"
          >
            Davis
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
