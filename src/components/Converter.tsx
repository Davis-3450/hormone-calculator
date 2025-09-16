// src/components/AutoConverter.tsx
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropDown } from "@/components/UnitPicker";
import { Gender, UnitName, HormoneName } from "@/lib/logic/units";
import { Separator } from "@/components/ui/separator";

function HormoneRow({
  hormone,
  unit,
}: {
  hormone: HormoneName;
  unit: UnitName;
}) {
  return (
    <div className="grid grid-cols-[180px_140px_120px_20px_140px_120px_90px] items-center gap-3">
      <div className="flex flex-col text-left">
        <span className="font-medium capitalize">{id}</span>
        {rr && (
          <span className="text-xs text-muted-foreground">
            Range: {rr.min}–{rr.max} {rr.unit.name}
          </span>
        )}
      </div>
      <Input
        type="number"
        inputMode="decimal"
        step="any"
        value={Number.isFinite(hormone.value.value) ? hormone.value.value : ""}
        onChange={(e) => setVal(id, e.currentTarget.valueAsNumber)}
        className="w-[140px] h-9"
      />
      <UnitPicker
        value={hormone.value.unit.name}
        onChange={(u) => setUnit(id, u)}
        units={unitListByHormone}
        triggerClassName="w-[120px] h-9"
        contentClassName="w-[160px]"
      />
      <div className="w-[20px] flex justify-center">
        <ArrowRight className="text-muted-foreground" size={18} />
      </div>
      <Input readOnly value={converted == null ? "" : fmt(converted)} className="w-[140px] h-9" />
      <UnitPicker
        value={toUnit}
        onChange={(u) => setToUnit(u)}
        units={unitListByHormone}
        triggerClassName="w-[120px] h-9"
        contentClassName="w-[160px]"
      />
      <div className="w-[90px] flex justify-end">
        <StatusBadge status={status} />
      </div>
    </div>
  );
}

export function Calculator() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculator</CardTitle>
        <CardContent>
          {/* Gender: */}
          <DropDown
            value={Gender.Female}
            defaultValue={Gender.Female}
            items={Object.values(Gender)}
            name="gender"
            disabled={false}
            placeholder="Female"
            triggerClassName="w-[140px]"
            contentClassName="w-[140px]"
          />
        </CardContent>
        <CardContent>
          {/* Hormone list: */}
          <div className="grid grid-cols-1 gap-2">
            <HormoneRow
              hormone={HormoneName.Testosterone}
              unit={UnitName.nmol_L}
            />
            <HormoneRow
              hormone={HormoneName.Estradiol}
              unit={UnitName.pmol_L}
            />
            <HormoneRow hormone={HormoneName.Prolactin} unit={UnitName.ng_mL} />
            <HormoneRow
              hormone={HormoneName.Progesterone}
              unit={UnitName.nmol_L}
            />
          </div>
          {/* Preset list: */}
          <CardTitle>Preset</CardTitle>
          <CardContent>Preset</CardContent>
          {/* Result - ranges */}
          <CardContent>Result</CardContent>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
