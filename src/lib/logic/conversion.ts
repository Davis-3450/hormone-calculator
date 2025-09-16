// TODO - Implement UnitValue conversion

import { type Hormone, type Unit } from "@/lib/logic/units";
import { DATA } from "@/lib/logic/values";

export class HormoneInterface {
  private hormone: Hormone;

  constructor(hormone: Hormone) {
    this.hormone = hormone;
  }

  _convert(from: Unit, to: Unit) {}
  _compareToReferenceRange(value: number) {}
}
