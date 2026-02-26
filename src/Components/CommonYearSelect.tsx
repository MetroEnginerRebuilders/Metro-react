import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const START_YEAR = 2025;
const END_YEAR = 2040;

export const YEAR_OPTIONS = Array.from(
  { length: END_YEAR - START_YEAR + 1 },
  (_, index) => String(START_YEAR + index)
);

interface CommonYearSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  size?: "small" | "medium";
  minWidth?: number;
  labelId?: string;
}

function CommonYearSelect({
  value,
  onChange,
  label = "Year",
  size = "small",
  minWidth = 120,
  labelId = "common-year-label",
}: CommonYearSelectProps) {
  return (
    <FormControl size={size} sx={{ minWidth }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
      >
        {YEAR_OPTIONS.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CommonYearSelect;