import { ConvertionName, Gender, type Conversion } from "@/lib/logic/units";
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
