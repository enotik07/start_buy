import {
  SxProps,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useActiveRoute } from "../../hooks/useActiveRoute";
import { useAppSelector } from "../../store";

export interface IUserPagesProps {
  drawer?: boolean;
  setAnchorEl: (anchorEl: null | HTMLElement) => void;
}

export default function UserPages({ drawer, setAnchorEl }: IUserPagesProps) {
  const navigate = useNavigate();
  const { isActive } = useActiveRoute();

  const { isLogged } = useAppSelector((state) => state.authReducer);

  const pages = [
    { title: "Home", click: () => navigate("/"), link: "/" },
    {
      title: "Products",
      click: () => navigate("/products"),
      link: "/products",
    },
    {
      title: "Categories",
      click: (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget),
      link: "/category",
    },
    ...(!isLogged
      ? [
          {
            title: "Log in",
            click: () => navigate("/login"),
            link: "/login",
          },
        ]
      : []),
  ];
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
            onClick={page.click}
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
