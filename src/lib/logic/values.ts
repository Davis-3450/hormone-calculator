import { Gender } from "@/lib/logic/units";
import { HormoneName } from "@/lib/logic/units";
import { Unit, UnitName } from "@/lib/logic/units";

export type Range = { min: number; max: number };

export type UnitRange = Range & {
  unit: UnitName;
  factor: number; // TODO - make specific type
};

// TODO: placeholder - fact check the numbers later
// TODO: make an interface for the data.
export const DATA = {
  [Gender.Male]: {
    gender: Gender.Male,
    hormones: {
      [HormoneName.Testosterone]: {
        min: 0.5,
        max: 2.4,
        unit: UnitName.nmol_L,
        factor: 1,
      },
      [HormoneName.Estradiol]: {
        min: 100,
        max: 200,
        unit: UnitName.pmol_L,
        factor: 1,
      },
      [HormoneName.Prolactin]: {
        min: 4.8,
        max: 23.3,
        unit: UnitName.ng_mL,
        factor: 1,
      },
      [HormoneName.Progesterone]: {
        min: 4,
        max: 25,
        unit: UnitName.nmol_L,
        factor: 1,
      },
    },
  },

  [Gender.Undefined]: {
    gender: Gender.Undefined,
    hormones: {
      [HormoneName.Testosterone]: {
        min: 0.5,
        max: 2.4,
        unit: UnitName.nmol_L,
        factor: 1,
      },
      [HormoneName.Estradiol]: {
        min: 100,
        max: 200,
        unit: UnitName.pmol_L,
        factor: 1,
      },
      [HormoneName.Prolactin]: {
        min: 4.8,
        max: 23.3,
        unit: UnitName.ng_mL,
        factor: 1,
      },
      [HormoneName.Progesterone]: {
        min: 4,
        max: 25,
        unit: UnitName.nmol_L,
        factor: 1,
      },
    },
  },

  [Gender.Female]: {
    gender: Gender.Female,
    hormones: {
      [HormoneName.Testosterone]: {
        min: 0.5,
        max: 2.4,
        unit: UnitName.nmol_L,
        factor: 1,
      },
      [HormoneName.Estradiol]: {
        min: 100,
        max: 200,
        unit: UnitName.pmol_L,
        factor: 1,
      },
      [HormoneName.Prolactin]: {
        min: 4.8,
        max: 23.3,
        unit: UnitName.ng_mL,
        factor: 1,
      },
      [HormoneName.Progesterone]: {
        min: 4,
        max: 25,
        unit: UnitName.nmol_L,
        factor: 1,
      },
    },
  },
};
