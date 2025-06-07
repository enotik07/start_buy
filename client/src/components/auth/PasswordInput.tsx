import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { useState } from "react";

export function PasswordInput(props: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClick = () => setShowPassword((value) => !value);

  return (
    <TextField
      label="Password"
      type={showPassword ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClick} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...props}
    />
  );
}
