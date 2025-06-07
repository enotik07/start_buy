import { Edit, Delete, Update } from "@mui/icons-material";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Tooltip,
  IconButton,
  Skeleton,
  Typography,
  TablePagination,
} from "@mui/material";
import Loading from "../common/Loading";
import { IPagination, IPaginationParams } from "../../models/pagination";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import getError from "../../utils/getError";
import { ReactNode } from "react";

interface AdminTableProps<T> {
  data?: IPagination<T>;
  columns: string[];
  filter: IPaginationParams;
  onFilterChange: (
    name: keyof IPaginationParams,
    value: IPaginationParams[typeof name]
  ) => void;
  values: (item: T) => (string | number | ReactNode)[];
  editOnClick: (item: T) => void;
  deleteOnClick: (item: T) => void;
  loading: boolean;
  error?: FetchBaseQueryError | SerializedError;
  refetch: () => void;
}

const AdminTable = <T extends Record<string, any>>({
  data,
  columns,
  filter,
  onFilterChange,
  values,
  editOnClick,
  deleteOnClick,
  loading,
  error,
  refetch,
}: AdminTableProps<T>) => {
  return (
    <Paper sx={{mt: 3}}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((key) => (
                <TableCell key={key}>{key}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <Loading
              loading={loading}
              error={error}
              skeleton={[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {columns.map((item) => (
                    <TableCell key={item}>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Skeleton variant="circular" width={34} height={34} />
                      <Skeleton variant="circular" width={34} height={34} />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              errorComponent={
                <TableRow>
                  <TableCell colSpan={columns.length + 1}>
                    <Typography variant="h5" color="error" textAlign="center">
                      {getError(error)}
                      <IconButton sx={{ marginLeft: 1 }} onClick={refetch}>
                        <Update />
                      </IconButton>
                    </Typography>
                  </TableCell>
                </TableRow>
              }
            >
              {data &&
                data.results.map((item, index) => (
                  <TableRow key={index}>
                    {values(item).map((key, index) => (
                      <TableCell key={index} sx={{textAlign: 'justify'}}>{key}</TableCell>
                    ))}
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => editOnClick(item)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => deleteOnClick(item)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </Loading>
          </TableBody>
        </Table>
      </TableContainer>
      {data && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.count}
          rowsPerPage={filter.page_size}
          page={filter.page - 1}
          onPageChange={(e, page) => onFilterChange("page", page + 1)}
          onRowsPerPageChange={(e) =>
            onFilterChange("page_size", +e.target.value)
          }
        />
      )}
    </Paper>
  );
};

export default AdminTable;
