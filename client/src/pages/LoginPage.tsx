import { Grid2, useTheme } from "@mui/material";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store";

export function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isLogged } = useAppSelector((state) => state.authReducer);

  useEffect(() => {
    if (isLogged) navigate("/");
  }, []);

  return (
    <Grid2
      container
      py={5}
      sx={{
        height: "calc(100vh - 65px )",
      }}
    >
      <Grid2
        size={{ xs: 0, md: 6 }}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        px={2}
        sx={{
          filter: `drop-shadow(1px 3px 15px ${theme.palette.background.paper})`,
        }}
      >
        <svg
          className="svg"
          style={{ position: "absolute", width: 0, height: 0 }}
        >
          <clipPath id="my-clip-path" clipPathUnits="objectBoundingBox">
            <path d="m0.385,0.909 c0,0.05,-0.035,0.091,-0.077,0.091 s-0.077,-0.041,-0.077,-0.091 s0.035,-0.091,0.077,-0.091 s0.077,0.041,0.077,0.091 m0.538,0 c0,0.05,-0.035,0.091,-0.077,0.091 s-0.077,-0.041,-0.077,-0.091 s0.035,-0.091,0.077,-0.091 s0.077,0.041,0.077,0.091 m0.077,-0.773 l0,0.364 c0,0.023,-0.015,0.043,-0.034,0.045 l-0.627,0.087 c0.003,0.016,0.008,0.033,0.008,0.05 c0,0.016,-0.008,0.031,-0.014,0.045 l0.553,0 c0.021,0,0.038,0.021,0.038,0.045 s-0.017,0.045,-0.038,0.045 l-0.615,0 c-0.021,0,-0.038,-0.021,-0.038,-0.045 c0,-0.022,0.027,-0.075,0.037,-0.097 l-0.106,-0.585 l-0.123,0 c-0.021,0,-0.038,-0.021,-0.038,-0.045 s0.017,-0.045,0.038,-0.045 l0.154,0 c0.04,0,0.041,0.057,0.047,0.091 l0.722,0 c0.021,0,0.038,0.021,0.038,0.045"></path>
          </clipPath>
        </svg>
        <img
          // src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          src="https://images.unsplash.com/photo-1522273400909-fd1a8f77637e?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Login Image"
          style={{
            width: "100%",
            objectFit: "cover",
            WebkitClipPath: "url(#my-clip-path)",
            clipPath: "url(#my-clip-path)",
          }}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <Outlet />
      </Grid2>
    </Grid2>
  );
}
