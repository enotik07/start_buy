import {
  styled,
  alpha,
  InputBase,
  InputBaseProps,
  SxProps,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export interface ISearchProps {
  placeholder?: string;
  inputProps?: InputBaseProps;
  fullwidth?: boolean;
}
const SearchBox = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default function Search({
  placeholder = "What are you looking for?",
  inputProps,
  fullwidth,
}: ISearchProps) {
  const theme = useTheme();
  
  const inputSx: SxProps = {
    transition: theme.transitions.create("width"),

    [theme.breakpoints.up("sm")]: {
      width: "21ch",
      "&:focus": {
        width: "30ch",
      },
    },
  };

  return (
    <SearchBox>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <InputBase
        sx={{
          color: "inherit",
          width: "100%",
          "& .MuiInputBase-input": {
            ...(fullwidth ? {} : inputSx),
            border: `1px solid ${theme.palette.secondary.main}`,
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
          },
        }}
        placeholder={placeholder}
        {...inputProps}
      />
    </SearchBox>
  );
}
