import {
  TextField,
  InputAdornment,
  IconButton,
  TextFieldProps,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
export interface IQuantityFieldProps {
  value: number;
  onChange: (value: number) => void;
  textFieldProps?: TextFieldProps;
}

export default function QuantityField({
  value,
  onChange,
  textFieldProps,
}: IQuantityFieldProps) {
  return (
    <TextField
      label="Quantity"
      value={value}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                onClick={() => onChange(value - 1)}
                disabled={value <= 1}
              >
                <RemoveIcon />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => onChange(value + 1)}
                disabled={value >= 100}
              >
                <AddIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...textFieldProps}
      sx={{ "& input": { textAlign: "center" }, ...textFieldProps?.sx }}

    />
  );
}
