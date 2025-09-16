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
    <div className="grid grid-cols-3 gap-2">
      <h3>{hormone}</h3>
      <Input />
      <DropDown
        value={unit}
        defaultValue={unit}
        items={Object.values(UnitName)}
        name="unit"
        disabled={false}
        placeholder={unit}
        triggerClassName="w-[140px]"
        contentClassName="w-[140px]"
      />
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
