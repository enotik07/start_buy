import { Stack, Typography, Box, Button, Alert, Collapse } from "@mui/material";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { IAuthResponse, ILoginRequest } from "../../models/auth";
import authAPI from "../../store/services/authAPI";
import { useAppDispatch } from "../../store";
import { setTokens } from "../../store/reducers/auth";
import getError from "../../utils/getError";
import storeAPI from "../../store/services/storeAPI";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

export function LoginForm() {
  const [login, { isLoading, error }] = authAPI.useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values: ILoginRequest) => {
    await login(values)
      .unwrap()
      .then((payload: IAuthResponse) => {
        dispatch(setTokens(payload));
        dispatch(storeAPI.util.invalidateTags(['User']));
        navigate("/");
      });
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, handleSubmit, touched, getFieldProps }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack
            p={4}
            width={"100%"}
            spacing={2}
            direction={"column"}
            maxWidth={"500px"}
          >
            <Typography variant="h4" textAlign={"center"}>
              Login
            </Typography>
            <EmailInput
              fullWidth
              error={Boolean(touched.email && errors.email)}
              helperText={errors.email}
              {...getFieldProps("email")}
            />
            <PasswordInput
              fullWidth
              error={Boolean(touched.password && errors.password)}
              helperText={errors.password}
              {...getFieldProps("password")}
            />
            <Box
              display={"flex"}
              justifyContent={"center"}
              flexDirection={"column"}
            >
              <Collapse in={error && !isLoading}>
                <Alert severity="error">{getError(error)}</Alert>
              </Collapse>
              <Button
                loading={isLoading}
                type="submit"
                variant="contained"
                fullWidth
                sx={{ my: 1 }}
              >
                Login
              </Button>
              <Typography
                to="/register"
                variant="subtitle2"
                textAlign={"center"}
                component={Link}
                sx={{ color: "primary.main" }}
              >
                Don't have an account? Register
              </Typography>
            </Box>
          </Stack>
        </form>
      )}
    </Formik>
  );
}
