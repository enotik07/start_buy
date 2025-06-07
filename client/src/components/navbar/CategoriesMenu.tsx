import { useGetCategoriesNamesQuery } from "../../store/services/storeAPI";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Menu, MenuItem } from "@mui/material";

export interface ICategoriesMenuProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
}

export default function CategoriesMenu({
  anchorEl,
  onClose,
}: ICategoriesMenuProps) {
  const { data, isLoading } = useGetCategoriesNamesQuery();
  const navigate = useNavigate();
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        data?.map((item) => (
          <MenuItem
            key={item.id}
            onClick={() => {
              navigate(`/category/${item.id}`);
              onClose();
            }}
          >
            {item.name}
          </MenuItem>
        ))
      )}
    </Menu>
  );
}
