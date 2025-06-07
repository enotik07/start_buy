import {
  Alert,
  Box,
  Button,
  Collapse,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { IAuthResponse, IRegisterRequest } from "../../models/auth";
import { useAppDispatch } from "../../store";
import authAPI from "../../store/services/authAPI";
import { setTokens } from "../../store/reducers/auth";
import getError from "../../utils/getError";
import storeAPI from "../../store/services/storeAPI";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
  first_name: Yup.string().required("Required"),
  last_name: Yup.string().required("Required"),
  dob: Yup.string().required("Required"),
});

export function RegisterForm() {
  const [register, { isLoading, error }] = authAPI.useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values: IRegisterRequest) => {
    await register(values)
      .unwrap()
      .then((payload: IAuthResponse) => {
        dispatch(setTokens(payload));
        dispatch(storeAPI.util.invalidateTags(['User']));
        navigate("/");
      });
  };
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        dob: "",
        is_admin: false,
      }}
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
              Register
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="First name"
                  type="name"
                  error={Boolean(touched.first_name && errors.first_name)}
                  helperText={errors.first_name}
                  {...getFieldProps("first_name")}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Last name"
                  error={Boolean(touched.last_name && errors.last_name)}
                  type="lastName"
                  helperText={errors.last_name}
                  {...getFieldProps("last_name")}
                />
              </Grid2>
            </Grid2>
            <TextField
              fullWidth
              label="Date"
              type="date"
              lang="en"
              slotProps={{ inputLabel: { shrink: true } }}
              error={Boolean(touched.dob && errors.dob)}
              helperText={errors.dob}
              {...getFieldProps("dob")}
            />
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
                variant="contained"
                type="submit"
                fullWidth
                sx={{ my: 1 }}
              >
                Register
              </Button>
              <Typography
                to="/login"
                variant="subtitle2"
                textAlign={"center"}
                component={Link}
                sx={{ color: "primary.main" }}
              >
                Already have an account? Log in
              </Typography>
            </Box>
          </Stack>
        </form>
      )}
    </Formik>
  );
}
