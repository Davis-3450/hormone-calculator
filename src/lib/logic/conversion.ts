// TODO - Implement UnitValue conversion

import { type Hormone, type Unit } from "@/lib/logic/units";

export class HormoneConverter {
  private hormone: Hormone;

  constructor(hormone: Hormone) {
    this.hormone = hormone;
  }

  _convert(from: Unit, to: Unit) {}
}
