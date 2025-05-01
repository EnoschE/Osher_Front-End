import { Box, Typography, IconButton, Avatar } from "@mui/material";
import CustomAvatar from "../../Common/CustomAvatar";
import CustomMenu from "../../Common/CustomMenu";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../../Routes/AllRoutes";
import { useDispatch } from "react-redux";
import { resetUserState } from "../../../Redux/Slices/userSlice";
import {
  LogoutOutlined,
  SettingsOutlined,
  WidgetsOutlined,
} from "@mui/icons-material";
import { isUserLoggedIn, logoutUser } from "../../../Services/userService";

const UserMenu = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    logoutUser();
    dispatch(resetUserState());
    navigate(allRoutes.HOME);
  };

  const menuOptions = [
    {
      text: (
        <Box display='flex' alignItems='center' gap={8}>
          <CustomAvatar src={user.picture} />
          <Box>
            <Typography variant='h6' mb={4}>
              {user.name || "User Name"}
            </Typography>
            <Typography fontSize={12} color='text.secondary'>
              {user.email || "user@example.com"}
            </Typography>
          </Box>
        </Box>
      ),
      onClick: () => navigate(allRoutes.MY_PROFILE),
    },
    { isDivider: true },
    {
      icon: WidgetsOutlined,
      text: "Dashboard",
      onClick: () => navigate(allRoutes.DASHBOARD),
    },
    {
      icon: SettingsOutlined,
      text: "Settings",
      onClick: () => navigate(allRoutes.ACCOUNT_SETTINGS),
    },
    { isDivider: true },
    { icon: LogoutOutlined, text: "Log Out", onClick: handleLogout },
  ];

  return isUserLoggedIn() ? (
    <CustomMenu
      anchorComponent={(props: any) => (
        <Box sx={{ cursor: "pointer" }} {...props}>
          <CustomAvatar src={user.picture} />
        </Box>
      )}
      options={menuOptions}
    />
  ) : (
    <IconButton sx={{ p: 0 }} onClick={() => navigate(allRoutes.LOGIN)}>
      <Avatar sx={{ width: 40, height: 40 }} />
    </IconButton>
  );
};

export default UserMenu;
