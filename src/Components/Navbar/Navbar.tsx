import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Avatar, IconButton } from "@mui/material";
import { LogoutOutlined, SettingsOutlined, Menu } from "@mui/icons-material";
import { StyledAppBar, StyledMenuBlock } from "./navbarStyles";
import CustomMenu from "../Common/CustomMenu";
import { isUserLoggedIn, logoutUser } from "../../Services/userService";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import { useDispatch } from "react-redux";
import { resetUserState, selectUser } from "../../Redux/Slices/userSlice";
import { OsherLogo } from "../../Utils/Images";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { sidebarWidth } from "../../Utils/spacings";

const Navbar = ({
  navbarForNonProtectedRoutes,
  handleDrawerToggle,
}: {
  navbarForNonProtectedRoutes?: boolean;
  handleDrawerToggle?: () => void;
}) => {
  const colors = useSelector(selectColors);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogoClick = () => {
    navigate(allRoutes.HOME);
  };

  const handleLogout = () => {
    logoutUser();
    dispatch(resetUserState());
    navigate(allRoutes.HOME);
  };

  const menuOptions = [
    {
      text: (
        <Box display='flex' alignItems='center' gap={8}>
          <Avatar
            sx={{ width: 40, height: 40, border: `1px solid ${colors.border}` }}
            src={user.picture}
          />
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
      onClick: () => navigate(allRoutes.ACCOUNT_SETTINGS),
    },
    { isDivider: true },
    {
      icon: SettingsOutlined,
      text: "Settings",
      onClick: () => navigate(allRoutes.ACCOUNT_SETTINGS),
    },
    { isDivider: true },
    { icon: LogoutOutlined, text: "Log Out", onClick: handleLogout },
  ];

  return (
    <StyledAppBar
      position='fixed'
      sx={{
        zIndex: 30,
        borderBottom: `1px solid ${colors.border}`,
        color: colors.text,
        ...(navbarForNonProtectedRoutes
          ? {}
          : {
              width: { sm: `calc(100% - ${sidebarWidth}px)` },
              ml: { sm: `${sidebarWidth}px` },
            }),
      }}
    >
      <Box display='flex' alignItems='center'>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={handleDrawerToggle}
          sx={{
            mr: 7,
            display: navbarForNonProtectedRoutes ? "none" : { sm: "none" },
          }}
        >
          <Menu />
        </IconButton>
        <Box
          component='img'
          src={OsherLogo}
          alt=''
          sx={{
            cursor: "pointer",
            display: navbarForNonProtectedRoutes
              ? "inline-block"
              : { sm: "none" },
            height: "50px",
          }}
          onClick={handleLogoClick}
        />
      </Box>

      <StyledMenuBlock>
        {/* <CustomButton variant="outlined" color="primary" sx={{ padding: "6px 18px", gap: 8 }}>
					<PersonAddAlt1Outlined sx={{ width: 20, height: 20 }} />
					<Typography color="inherit" display={{ xs: "none", sm: "inline-block" }}>
						Refer a Friend
					</Typography>
				</CustomButton> */}
        {/* <Box sx={{ display: "flex", alignItems: "center", gap: 8 }}>
					<LanguageOutlined sx={{ width: 20, height: 20 }} />
					<Typography display={{ xs: "none", sm: "inline-block" }}>US</Typography>
				</Box> */}

        {isUserLoggedIn() && (
          <CustomMenu
            anchorComponent={(props: any) => (
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  ml: 8,
                  cursor: "pointer",
                  border: `1px solid ${colors.border}`,
                }}
                src={user.picture}
                {...props}
              />
            )}
            options={menuOptions}
          />
        )}
      </StyledMenuBlock>
    </StyledAppBar>
  );
};

export default Navbar;
