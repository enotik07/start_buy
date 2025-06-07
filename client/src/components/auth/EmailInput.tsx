import { AlternateEmail } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { useRef } from "react";

export function EmailInput(props: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  };
  return (
    <TextField
      label="Email"
      type="email"
      autoComplete="email"
      inputRef={inputRef}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" onClick={handleFocus}>
                <AlternateEmail />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...props}
    />
  );
}
