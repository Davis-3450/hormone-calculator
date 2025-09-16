import { Gender, type Conversion } from "@/lib/logic/units";
import { HormoneName } from "@/lib/logic/units";
import { UnitName } from "@/lib/logic/units";

export type UnitNormalRange = {
  min: number;
  max: number;
  unit: UnitName;
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
        normalRange: { min: 10, max: 35, unit: UnitName.nmol_L },
      },
      [HormoneName.Estradiol]: {
        normalRange: { min: 36.7, max: 183.6, unit: UnitName.pmol_L },
      },
      [HormoneName.Prolactin]: {
        normalRange: { min: 2, max: 18, unit: UnitName.ng_mL },
      },
      [HormoneName.Progesterone]: {
        normalRange: { min: 0, max: 0.6, unit: UnitName.nmol_L },
      },
    },
  },

  [Gender.Female]: {
    gender: Gender.Female,
    hormones: {
      [HormoneName.Testosterone]: {
        normalRange: { min: 0.5, max: 2.4, unit: UnitName.nmol_L },
      },
      [HormoneName.Estradiol]: {
        normalRange: { min: 72, max: 1309, unit: UnitName.pmol_L },
      },
      [HormoneName.Prolactin]: {
        normalRange: { min: 3, max: 30, unit: UnitName.ng_mL },
      },
      [HormoneName.Progesterone]: {
        normalRange: { min: 3.8, max: 50.6, unit: UnitName.nmol_L },
      },
    },
  },

  [Gender.NonBinary]: {
    gender: Gender.NonBinary,
    hormones: {
      [HormoneName.Testosterone]: {
        normalRange: { min: 5, max: 20, unit: UnitName.nmol_L },
      },
      [HormoneName.Estradiol]: {
        normalRange: { min: 150, max: 400, unit: UnitName.pmol_L },
      },
      [HormoneName.Prolactin]: {
        normalRange: { min: 2, max: 25, unit: UnitName.ng_mL },
      },
      [HormoneName.Progesterone]: {
        normalRange: { min: 0, max: 0, unit: UnitName.nmol_L },
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

function factorFor(hormone: HormoneName, from: UnitName, to: UnitName): number {
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
