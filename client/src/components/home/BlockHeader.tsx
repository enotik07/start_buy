import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import {
  Box,
  BoxProps,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

interface IBaseProps {
  label: string;
  title: string;
  boxProps?: BoxProps;
}

interface IPaginationProps extends IBaseProps {
  pagination: true;
  page: number;
  pages?: number;
  previousClick: () => void;
  nextClick: () => void;
}

interface INoPaginationProps extends IBaseProps {
  pagination?: false;
  link: string;
}

export type IBlockHeaderProps = IPaginationProps | INoPaginationProps;

export default function BlockHeader(props: IBlockHeaderProps) {
  return (
    <Box {...props.boxProps}>
      <Stack direction="row" spacing={1} mb={1}>
        <Paper sx={{ bgcolor: "primary.main", width: "20px" }} elevation={0} />
        <Typography variant="subtitle2" color="primary">
          {props.label}
        </Typography>
      </Stack>
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" color="textPrimary" fontWeight={600}>
          {props.title}
        </Typography>
        {props.pagination ? (
          <Stack direction="row" spacing={2}>
            <IconButton
              disabled={props.page === 1}
              onClick={props.previousClick}
              size="small"
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              size="small"
              disabled={props.pages ? props.page === props.pages : true}
              onClick={props.nextClick}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Stack>
        ) : (
          <Button href={props.link} variant="contained" size="small">
            View all
          </Button>
        )}
      </Box>
    </Box>
  );
}
