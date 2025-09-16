import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HormoneRangeStatus } from "@/lib/logic/values";

export interface StatusBadgeProps {
  status: HormoneRangeStatus;
  className?: string;
  children?: React.ReactNode;
}

const LABEL: Record<HormoneRangeStatus, string> = {
  [HormoneRangeStatus.normal]: "Normal",
  [HormoneRangeStatus.low]: "Low",
  [HormoneRangeStatus.high]: "High",
  [HormoneRangeStatus.invalid]: "Invalid",
};

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
  let colorClass = "";

  switch (status) {
    case HormoneRangeStatus.normal:
      colorClass = "bg-emerald-50 text-emerald-800 border-emerald-300";
      break;
    case HormoneRangeStatus.high:
      colorClass = "bg-red-100 text-red-800 border-red-300";
      break;
    case HormoneRangeStatus.low:
      colorClass = "bg-gray-50 text-gray-800 border-gray-300";
      break;
    default:
      colorClass = "bg-gray-50 text-gray-800 border-gray-300";
      break;
  }
  return (
    <Badge variant="outline" className={cn(colorClass, className)}>
      {children ?? LABEL[status]}
    </Badge>
  );
}

export default StatusBadge;
