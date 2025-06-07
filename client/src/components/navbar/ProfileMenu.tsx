import {
  PersonOutlineOutlined as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useGetUserQuery } from "../../store/services/storeAPI";
import { useLogoutMutation } from "../../store/services/authAPI";
import { getTokens } from "../../utils/authCookies";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { clearTokens } from "../../store/reducers/auth";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { data } = useGetUserQuery();
  const [logout, { isLoading }] = useLogoutMutation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const dispatch = useAppDispatch();
  const onClose = () => setAnchorEl(null);
  const onClick = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);

  const logOut = async () => {
    const tokens = getTokens();
    await logout({ refresh_token: tokens.refreshToken ?? "" })
      .unwrap()
      .then(() => {
        dispatch(clearTokens());
        navigate("/");
      });
  };

  return (
    <>
      <IconButton size="large" edge="start" color="inherit" onClick={onClick}>
        <PersonIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              width: 320,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="h6" component="div">
            {`${data?.first_name} ${data?.last_name}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data?.email}
          </Typography>
        </Box>

        <Divider />

        <MenuItem>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          My Profile
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          Account Settings
        </MenuItem>

        <Divider />

        <MenuItem sx={{ color: "error.main" }} onClick={logOut}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <ListItemIcon sx={{ color: "error.main" }}>
                <LogoutIcon />
              </ListItemIcon>
              Logout
            </>
          )}
        </MenuItem>
      </Menu>
    </>
  );
}
