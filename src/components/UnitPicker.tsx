import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UnitName } from "@/lib/logic/units";

export const ALL_UNITS = Object.values(UnitName) as UnitName[];

export interface DropDownProps {
  value?: string;
  defaultValue?: string;
  items?: string[];
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function DropDown({
  value,
  defaultValue,
  items = [],
  onChange,
  name,
  disabled,
  placeholder = "Select",
}: DropDownProps) {
  return (
    <div className="w-full">
      <Select
        name={name}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(val) => onChange?.(val)}
        disabled={disabled}
      >
        <SelectTrigger className="h-8 w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export interface UnitPickerProps {
  value?: UnitName;
  defaultValue?: UnitName;
  onChange?: (unit: UnitName) => void;
  units?: UnitName[];
  name?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function UnitPicker({
  value,
  defaultValue,
  onChange,
  units = ALL_UNITS,
  name,
  disabled,
  placeholder = "Select",
}: UnitPickerProps) {
  return (
    <DropDown
      value={value}
      defaultValue={defaultValue}
      items={units as unknown as string[]}
      onChange={(v) => onChange?.(v as UnitName)}
      name={name}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
}

export default UnitPicker;
