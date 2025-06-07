import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  Link,
} from "@mui/material";
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
} from "@mui/icons-material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../components/common/Search";
import CategoriesMenu from "../components/navbar/CategoriesMenu";
import AdminPages from "../components/navbar/AdminPages";
import UserPages from "../components/navbar/UserPages";
import ProfileMenu from "../components/navbar/ProfileMenu";
import { useAppSelector } from "../store";

export function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuClick = () => setOpen((value) => !value);
  const menuClose = () => setOpen(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      navigate(`/products?query=${searchQuery}`);
      setSearchQuery("");
      inputRef.current?.blur();
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(event.target.value);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { isLogged, isAdmin } = useAppSelector((state) => state.authReducer);
  return (
    <>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2, display: { xs: "block", md: "none" } }}
            onClick={menuClick}
          >
            {open ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            underline="none"
            color="textPrimary"
          >
            SmartBuy
          </Typography>
          <Box
            sx={{ flexGrow: 1 }}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {isAdmin ? <AdminPages /> : <UserPages setAnchorEl={setAnchorEl} />}
          </Box>
          {!isAdmin && (
            <Search
              inputProps={{
                inputRef: inputRef,
                value: searchQuery,
                onChange: handleChange,
                onKeyDown: handleKeyDown,
              }}
            />
          )}
          {isLogged && !isAdmin && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ ml: 1 }}
              onClick={() => navigate("/cart")}
            >
              <ShoppingCartOutlinedIcon />
            </IconButton>
          )}
          {isLogged && <ProfileMenu />}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{ top: "64px" }}
        open={open}
        onClose={menuClose}
        slotProps={{
          paper: { sx: { top: "64px", height: "fit-content" } },
          backdrop: { sx: { top: "64px" } },
        }}
      >
        <Box sx={{ width: 250 }} role="presentation" onClick={menuClose}>
          {isAdmin ? (
            <AdminPages drawer />
          ) : (
            <UserPages setAnchorEl={setAnchorEl} drawer />
          )}
        </Box>
      </Drawer>
      <CategoriesMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
    </>
  );
}
