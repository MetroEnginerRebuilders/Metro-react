import { Autocomplete, TextField, CircularProgress } from "@mui/material";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onInputChange?: (value: string) => void;
  options: Option[];
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: "small" | "medium";
  placeholder?: string;
}

const SearchableSelect = ({
  label,
  value,
  onChange,
  onInputChange,
  options,
  loading = false,
  disabled = false,
  required = false,
  size = "small",
  placeholder = "",
}: SearchableSelectProps) => {
  const selectedOption = options.find((option) => option.value === value) || null;

  return (
    <Autocomplete
      value={selectedOption}
      onChange={(_, newValue) => {
        onChange(newValue ? newValue.value : "");
      }}
      onInputChange={(_, inputValue, reason) => {
        if (reason === "input" && onInputChange) {
          onInputChange(inputValue);
        }
      }}
      options={options}
      getOptionLabel={(option) => option.label}
      loading={loading}
      disabled={disabled}
      size={size}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      noOptionsText={loading ? "Loading..." : "No options available"}
      isOptionEqualToValue={(option, value) => option.value === value.value}
    />
  );
};

export default SearchableSelect;
