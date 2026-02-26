import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export const MONTH_OPTIONS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

interface CommonMonthSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  size?: "small" | "medium";
  minWidth?: number;
  labelId?: string;
}

function CommonMonthSelect({
  value,
  onChange,
  label = "Month",
  size = "small",
  minWidth = 180,
  labelId = "common-month-label",
}: CommonMonthSelectProps) {
  return (
    <FormControl size={size} sx={{ minWidth }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
      >
        {MONTH_OPTIONS.map((month) => (
          <MenuItem key={month.value} value={month.value}>
            {month.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CommonMonthSelect;
