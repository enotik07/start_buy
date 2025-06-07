import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export default function getError(
  error?: FetchBaseQueryError | SerializedError
) {
  if (!error) return "Unknown error";
  return "data" in error && error.data
    ? (error.data as { message?: string }).message || "Unknown error"
    : "Network error";
}
