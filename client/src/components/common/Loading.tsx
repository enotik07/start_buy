import { Update } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  BoxProps,
  TypographyProps,
} from "@mui/material";
import { ReactNode } from "react";
import getError from "../../utils/getError";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface ILoadingProps {
  loading: boolean;
  error?: FetchBaseQueryError | SerializedError;
  skeleton?: ReactNode;
  refetch?: () => void;
  children: ReactNode;
  boxProps?: BoxProps;
  labelProps?: TypographyProps;
  errorComponent?: ReactNode;
}

export default function Loading({
  loading,
  error,
  skeleton,
  refetch,
  children,
  boxProps,
  labelProps,
  errorComponent,
}: ILoadingProps) {
  return (
    <>
      {loading ? (
        <>
          {skeleton ? (
            skeleton
          ) : (
            <Box
              sx={{
                display: "flex",
                height: "100%",
                flexDirection: "column",
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              {...boxProps}
            >
              <CircularProgress />
            </Box>
          )}
        </>
      ) : error ? (
        errorComponent ? (
          errorComponent
        ) : (
          <ErrorLabel error={error} refetch={refetch} labelProps={labelProps} />
        )
      ) : (
        children
      )}
    </>
  );
}

export interface IErrorLabelProps {
  error?: FetchBaseQueryError | SerializedError;
  refetch?: () => void;
  labelProps?: TypographyProps;
}

export function ErrorLabel({ error, refetch, labelProps }: IErrorLabelProps) {
  return (
    <Typography
      width="100%"
      variant="h6"
      color="error"
      textAlign="center"
      display="flex"
      alignItems="center"
      justifyContent="center"
      {...labelProps}
    >
      {getError(error)}
      <IconButton sx={{ marginLeft: 1 }} onClick={refetch}>
        <Update />
      </IconButton>
    </Typography>
  );
}
