import {
  Alert,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import getError from "../../utils/getError";

export interface IConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  error?: FetchBaseQueryError | SerializedError;
  title: string;
  onCorfirm: () => void;
  loading: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  error,
  onClose,
  onCorfirm,
  loading,
}: IConfirmDialogProps) {
  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Collapse in={Boolean(error)}>
          <Alert severity="error">{getError(error)}</Alert>
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button loading={loading} onClick={onCorfirm}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
