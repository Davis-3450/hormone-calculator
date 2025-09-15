import { Gender } from "@/lib/logic/units";
import { HormoneName } from "@/lib/logic/units";

// TODO: placeholder - fact check this
export const DATA = {
  [Gender.Male]: {
    gender: Gender.Male,
    ranges: {
      [HormoneName.Testosterone]: [{ min: 0.5, max: 2.4 }], // nmol/L
      [HormoneName.Estradiol]: [{ min: 100, max: 200 }], // pmol/L
      [HormoneName.Prolactin]: [{ min: 4.8, max: 23.3 }], // ng/mL
      [HormoneName.Progesterone]: [{ min: 4, max: 25 }], // nmol/L
    },
    unit: { name: "pmol/L" },
    factor: 1, // placeholder
  },
  [Gender.Undefined]: {
    ranges: {
      [HormoneName.Testosterone]: [{ min: 0.5, max: 2.4 }], // nmol/L
      [HormoneName.Estradiol]: [{ min: 100, max: 200 }], // pmol/L
      [HormoneName.Prolactin]: [{ min: 4.8, max: 23.3 }], // ng/mL
      [HormoneName.Progesterone]: [{ min: 4, max: 25 }], // nmol/L
    },
    gender: Gender.Undefined,
    unit: { name: "pmol/L" },
    factor: 1, // placeholder
  },
  [Gender.Female]: {
    ranges: {
      [HormoneName.Testosterone]: [{ min: 0.5, max: 2.4 }], // nmol/L
      [HormoneName.Estradiol]: [{ min: 100, max: 200 }], // pmol/L
      [HormoneName.Prolactin]: [{ min: 4.8, max: 23.3 }], // ng/mL
      [HormoneName.Progesterone]: [{ min: 4, max: 25 }], // nmol/L
    },
    unit: { name: "pmol/L" },
    factor: 1, // placeholder
    gender: Gender.Female,
  },
};
