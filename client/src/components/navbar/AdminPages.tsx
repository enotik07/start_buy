import { useNavigate } from "react-router-dom";
import { useActiveRoute } from "../../hooks/useActiveRoute";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  SxProps,
} from "@mui/material";

const pages = [
  { title: "Dashboard", link: "/" },
  { title: "Products", link: "/products" },
  { title: "Categories", link: "/categories" },
];

interface IAdminPagesProps {
  drawer?: boolean;
}

export default function AdminPages({ drawer }: IAdminPagesProps) {
  const navigate = useNavigate();
  const { isActive } = useActiveRoute();
  const sxNavbar: SxProps = {
    display: { xs: "none", md: "flex" },
    flexDirection: "row",
  };
  const color = drawer ? "textSecondary" : "textPrimary";
  return (
    <List sx={{ ...(!drawer && sxNavbar) }}>
      {pages.map((page) => (
        <ListItem key={page.title} disablePadding>
          <ListItemButton
            sx={{ textAlign: drawer ? "left" : "center" }}
            onClick={() => navigate(page.link)}
            disabled={isActive(page.link)}
          >
            <ListItemText
              primary={page.title}
              slotProps={{
                primary: {
                  noWrap: true,
                  color: isActive(page.link) ? "primary" : color,
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
