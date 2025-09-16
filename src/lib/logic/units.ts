export enum HormoneName {
  Estradiol = "estradiol",
  Testosterone = "testosterone",
  Prolactin = "prolactin",
  Progesterone = "progesterone",
}

export enum Gender {
  // both cis and trans
  Female = "female",
  Male = "male",

  NonBinary = "non-binary",
}

export enum UnitName {
  nmol_L = "nmol/L",
  ng_dL = "ng/dL",
  ng_mL = "ng/mL",
  pg_mL = "pg/mL",
  pmol_L = "pmol/L",
}

export interface Unit {
  name: UnitName;
  symbol?: string;
}

export interface UnitValue {
  value: number;
  unit: Unit;
}

interface Range {
  min: number;
  max: number;
  unit: Unit;
}

export interface Hormone {
  id: HormoneName; // hormone name
  value: UnitValue;
  referenceRange?: Range; // this changes on multiple factors
}

export type Conversion = {
  name: ConvertionName;
  from: UnitName;
  to: UnitName;
  factor: number;
};

// A preset represents a hormonal target for an specific group, we plan to save them
export interface PresetName {}
