export enum HormoneName {
  Estradiol = "estradiol",
  Testosterone = "testosterone",
  Prolactin = "prolactin",
  Progesterone = "progesterone",
}

export enum Gender {
  Female = "female",
  Male = "male",
  Undefined = "undefined",
}

interface Unit {
  name: string;
  symbol?: string;
}

interface Range {
  min: number;
  max: number;
  unit: Unit;
}

interface Hormone {
  id: HormoneName;
  name: string;
  level: number;
  unit: Unit;
  referenceRange?: Range; // this changes on multiple factors
}
