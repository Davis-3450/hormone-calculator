import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropDown, UnitPicker } from "@/components/UnitPicker";
import { Gender, UnitName, HormoneName } from "@/lib/logic/units";
import { useHormonesStore } from "@/store/hormones";
import { HormoneRangeStatus } from "@/lib/logic/values";
import { factorFor } from "@/lib/logic/values";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";

function HormoneRow({ id }: { id: HormoneName }) {
  const hormone = useHormonesStore((s) => s.hormones[id]);
  const status = useHormonesStore((s) => s.statuses[id]);
  const rr = useHormonesStore((s) => s.getHormoneWithRange(id).referenceRange);
  const setVal = useHormonesStore((s) => s.setHormoneValue);
  const setUnit = useHormonesStore((s) => s.setHormoneUnit);
  const setHormone = useHormonesStore((s) => s.setHormone);

  const unitListByHormone: UnitName[] =
    id === HormoneName.Estradiol
      ? [UnitName.pmol_L, UnitName.pg_mL]
      : id === HormoneName.Testosterone
        ? [UnitName.nmol_L, UnitName.ng_dL]
        : id === HormoneName.Progesterone
          ? [UnitName.nmol_L, UnitName.ng_mL]
          : [UnitName.ng_mL, UnitName.pmol_L];

  const [toUnit, setToUnit] = useState<UnitName>(
    rr?.unit.name ?? unitListByHormone[0]
  );

  useEffect(() => {
    const ref = rr?.unit.name;
    if (ref && unitListByHormone.includes(ref)) setToUnit(ref);
    else if (!unitListByHormone.includes(toUnit))
      setToUnit(unitListByHormone[0]);
  }, [id, rr?.unit.name, unitListByHormone.join(",")]);

  let converted: number | null = null;
  const fromUnit = hormone.value.unit.name;
  const rawVal = hormone.value.value;
  if (Number.isFinite(rawVal)) {
    try {
      const f = factorFor(id, fromUnit, toUnit);
      converted = rawVal * f;
    } catch {
      converted = null;
    }
  }

  const fmt = (n: number) =>
    Math.abs(n) >= 100
      ? n.toFixed(1)
      : Math.abs(n) >= 10
        ? n.toFixed(2)
        : n.toFixed(3);

  useEffect(() => {
    if (toUnit !== fromUnit && converted != null) {
      setHormone(id, converted, toUnit);
    }
  }, [toUnit]);

  return (
    <div className="grid gap-3 md:grid-cols-7 md:items-center">
      {/* Hormone with ranges */}
      <div className="flex flex-col">
        <span className="font-medium capitalize">{id}</span>
        {rr && (
          <span className="text-xs text-muted-foreground">
            Range: {rr.min}–{rr.max} {rr.unit.name}
          </span>
        )}
      </div>

      {/* Input */}
      <Input
        type="number"
        inputMode="decimal"
        step="any"
        value={Number.isFinite(hormone.value.value) ? hormone.value.value : ""}
        onChange={(e) => setVal(id, e.currentTarget.valueAsNumber)}
        className="w-[140px] h-9"
      />

      {/* Unit picker 1 */}
        <ArrowRight className="text-muted-foreground" size={18} />
      </div>

      {/* Input 2 */}
      <Input
        readOnly
        value={converted == null ? "" : fmt(converted)}
        className="w-[140px] h-9"
      />
      <UnitPicker
        value={toUnit}
        onChange={(u) => setToUnit(u)}
        units={unitListByHormone}
        triggerClassName="w-[120px] h-9"
        contentClassName="w-[160px]"
      />

      {/* Status badge */}
      <div className="flex justify-start md:justify-center">
        <StatusBadge status={status} />
      </div>
    </div>
  );
}

export function Calculator() {
  const gender = useHormonesStore((s) => s.gender);
  const setGender = useHormonesStore((s) => s.setGender);
  const getWithRange = useHormonesStore((s) => s.getHormoneWithRange);

  function RangesList() {
    const ids: HormoneName[] = [
      HormoneName.Testosterone,
      HormoneName.Estradiol,
      HormoneName.Prolactin,
      HormoneName.Progesterone,
    ];
    return (
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">Reference Ranges</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {ids.map((id) => {
            const rr = getWithRange(id).referenceRange!;
            return (
              <div key={id} className="flex items-center justify-between gap-2">
                <span className="capitalize">{id}</span>
                <span className="text-muted-foreground">
                  {rr.min}–{rr.max} {rr.unit.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculator</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Gender:</span>
          <DropDown
            value={gender}
            items={Object.values(Gender)}
            onChange={(g) => setGender(g as Gender)}
            triggerClassName="w-[160px]"
            contentClassName="w-[200px]"
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <HormoneRow id={HormoneName.Testosterone} />
          <HormoneRow id={HormoneName.Estradiol} />
          <HormoneRow id={HormoneName.Prolactin} />
          <HormoneRow id={HormoneName.Progesterone} />
        </div>

        <Separator />
        <RangesList />
      </CardContent>
    </Card>
  );
}

export default Calculator;
