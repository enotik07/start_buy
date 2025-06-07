import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#ff0052" }, //#DB4444
    secondary: { main: "#7D8184" },
    background: { default: "#ffffff", paper: "#F5F5F5" },
    error: { main: "#FF3D00" },
    warning: { main: "#FFA726" },
    info: { main: "#00FF66" },
    success: { main: "#66BB6A" },
    text: { primary: "#000000", secondary: "#9b9b9b" },
  },
});
