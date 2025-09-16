import { Gender } from "@/lib/logic/units";
import { HormoneName } from "@/lib/logic/units";
import { UnitName } from "@/lib/logic/units";
import { type Hormone } from "@/lib/logic/units";
import { type Unit } from "@/lib/logic/units";

export type UnitNormalRange = {
  min: number;
  max: number;
  unit: Unit;
};

export type UnitInfo = {
  // unit: UnitName;
  // conversionList?: Record<ConvertionName, Conversion>; // might use later
  normalRange: UnitNormalRange;
};

export interface Data {
  gender: Gender;
  hormones: {
    [HormoneName.Testosterone]: UnitInfo;
    [HormoneName.Estradiol]: UnitInfo;
    [HormoneName.Prolactin]: UnitInfo;
    [HormoneName.Progesterone]: UnitInfo;
  };
}

// TODO: placeholder - fact check the numbers later
// TODO: make an interface for the data.

// TODO: move to a json
// idea, we can make a preset system too

export const DATA: Record<Gender, Data> = {
  [Gender.Male]: {
    gender: Gender.Male,
    hormones: {
      [HormoneName.Testosterone]: {
        normalRange: { min: 10, max: 35, unit: { name: UnitName.nmol_L } },
      },
      [HormoneName.Estradiol]: {
        normalRange: { min: 36.7, max: 183.6, unit: { name: UnitName.pmol_L } },
      },
      [HormoneName.Prolactin]: {
        normalRange: { min: 2, max: 18, unit: { name: UnitName.ng_mL } },
      },
      [HormoneName.Progesterone]: {
        normalRange: { min: 0, max: 0.6, unit: { name: UnitName.nmol_L } },
      },
    },
  },

  [Gender.Female]: {
    gender: Gender.Female,
    hormones: {
      [HormoneName.Testosterone]: {
        normalRange: { min: 0.5, max: 2.4, unit: { name: UnitName.nmol_L } },
      },
      [HormoneName.Estradiol]: {
        normalRange: { min: 72, max: 1309, unit: { name: UnitName.pmol_L } },
      },
      [HormoneName.Prolactin]: {
        normalRange: { min: 3, max: 30, unit: { name: UnitName.ng_mL } },
      },
      [HormoneName.Progesterone]: {
        normalRange: { min: 3.8, max: 50.6, unit: { name: UnitName.nmol_L } },
      },
    },
  },

  [Gender.NonBinary]: {
    gender: Gender.NonBinary,
    hormones: {
      [HormoneName.Testosterone]: {
        normalRange: { min: 5, max: 20, unit: { name: UnitName.nmol_L } },
      },
      [HormoneName.Estradiol]: {
        normalRange: { min: 150, max: 400, unit: { name: UnitName.pmol_L } },
      },
      [HormoneName.Prolactin]: {
        normalRange: { min: 2, max: 25, unit: { name: UnitName.ng_mL } },
      },
      [HormoneName.Progesterone]: {
        normalRange: { min: 0, max: 0, unit: { name: UnitName.nmol_L } },
      },
    },
  },
};

// TODO: refactor this, or move somewhere else, looks like a mess
// universal - hormone agnostic
export const FACTORS: Record<UnitName, Partial<Record<UnitName, number>>> = {
  [UnitName.nmol_L]: { [UnitName.pmol_L]: 1000 },
  [UnitName.pmol_L]: { [UnitName.nmol_L]: 0.001 },
  [UnitName.ng_mL]: { [UnitName.ng_dL]: 100, [UnitName.pg_mL]: 1000 },
  [UnitName.ng_dL]: { [UnitName.ng_mL]: 0.01 },
  [UnitName.pg_mL]: { [UnitName.ng_mL]: 0.001 },
};

// hormone specific
export const HORMONE_FACTORS: Record<
  HormoneName,
  Partial<Record<UnitName, Partial<Record<UnitName, number>>>>
> = {
  [HormoneName.Estradiol]: {
    [UnitName.pg_mL]: { [UnitName.pmol_L]: 3.671 },
    [UnitName.pmol_L]: { [UnitName.pg_mL]: 1 / 3.671 },
  },
  [HormoneName.Testosterone]: {
    [UnitName.ng_dL]: { [UnitName.nmol_L]: 0.0347 },
    [UnitName.nmol_L]: { [UnitName.ng_dL]: 1 / 0.0347 }, // ≈ 28.8
  },
  [HormoneName.Progesterone]: {
    [UnitName.ng_mL]: { [UnitName.nmol_L]: 3.18 },
    [UnitName.nmol_L]: { [UnitName.ng_mL]: 1 / 3.18 }, // ≈ 0.314
  },
  [HormoneName.Prolactin]: {
    [UnitName.ng_mL]: { [UnitName.pmol_L]: 43.5 },
    [UnitName.pmol_L]: { [UnitName.ng_mL]: 1 / 43.5 },
  },
};

type Edge = [UnitName, number];

export function factorFor(
  hormone: HormoneName,
  from: UnitName,
  to: UnitName
): number {
  if (from === to) return 1;

  const nexts = (u: UnitName): Edge[] => [
    ...(Object.entries(FACTORS[u] ?? {}) as Edge[]),
    ...(Object.entries(HORMONE_FACTORS[hormone]?.[u] ?? {}) as Edge[]),
  ];

  const queue: [UnitName, number][] = [[from, 1]];
  const seen = new Set<UnitName>([from]);

  while (queue.length) {
    const [u, acc] = queue.shift()!;
    for (const [v, f] of nexts(u)) {
      if (seen.has(v)) continue;
      const prod = acc * f;
      if (v === to) return prod;
      seen.add(v);
      queue.push([v, prod]);
    }
  }
  throw new Error(`No conversion path for ${hormone}: ${from} -> ${to}`);
}

export enum HormoneRangeStatus {
  high = "high",
  low = "low",
  normal = "normal",
  invalid = "invalid",
}

type UnitLike = UnitName | { name: UnitName };
const unitName = (u?: UnitLike): UnitName | undefined =>
  u == null ? undefined : typeof u === "object" ? u.name : u;

// Accept either {min,max,unit} or [min,max] (optionally with .unit)
type RefRangeLike = UnitNormalRange | ([number, number] & { unit?: UnitLike });

function parseReferenceRange(
  rr: unknown
): { min: number; max: number; unit?: UnitName } | null {
  const r: any = rr;
  if (!r) return null;

  // Case A: object with {min,max,unit}
  if (typeof r === "object" && "min" in r && "max" in r) {
    const min = Number((r as UnitNormalRange).min);
    const max = Number((r as UnitNormalRange).max);
    const u = unitName((r as UnitNormalRange).unit as any);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min > max)
      return null;
    return { min, max, unit: u };
  }

  // Case B: tuple-like [min,max] possibly with a .unit field
  if (Array.isArray(r) && r.length >= 2) {
    const min = Number(r[0]);
    const max = Number(r[1]);
    const u = unitName((r as any).unit);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min > max)
      return null;
    return { min, max, unit: u };
  }

  return null;
}

export function validateWithReferenceRange(
  hormone: Hormone
): HormoneRangeStatus {
  // Parse reference range in either supported shape
  const parsed = parseReferenceRange(
    (hormone as any).referenceRange as RefRangeLike
  );
  if (!parsed) return HormoneRangeStatus.invalid;

  const { min, max, unit: refUnit } = parsed;
  if (!refUnit) return HormoneRangeStatus.invalid;

  const fromUnit =
    unitName(hormone.value?.unit as any) ??
    unitName((hormone.value as any)?.name);
  if (!fromUnit || typeof hormone.value?.value !== "number") {
    return HormoneRangeStatus.invalid;
  }

  // Convert measured value → reference unit
  let factor: number;
  try {
    factor = factorFor(hormone.id, fromUnit, refUnit);
  } catch {
    return HormoneRangeStatus.invalid; // no path
  }

  const vInRef = hormone.value.value * factor;
  if (!Number.isFinite(vInRef)) return HormoneRangeStatus.invalid;

  // Optional tiny tolerance to avoid flapping on rounding (0.1% of span)
  const span = max - min;
  const tol = span > 0 ? Math.max(1e-9, 0.001 * span) : 0;

  if (vInRef < min - tol) return HormoneRangeStatus.low;
  if (vInRef > max + tol) return HormoneRangeStatus.high;
  return HormoneRangeStatus.normal;
}
