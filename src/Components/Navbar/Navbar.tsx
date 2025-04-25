import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Avatar, IconButton } from "@mui/material";
import {
  LogoutOutlined,
  SettingsOutlined,
  Menu,
  KeyboardArrowLeftOutlined,
} from "@mui/icons-material";
import { StyledAppBar, StyledMenuBlock } from "./navbarStyles";
import CustomMenu from "../Common/CustomMenu";
import { isUserLoggedIn, logoutUser } from "../../Services/userService";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../Routes/AllRoutes";
import { useDispatch } from "react-redux";
import { resetUserState, selectUser } from "../../Redux/Slices/userSlice";
import { OsherLogo } from "../../Utils/Images";
import { useSelector } from "../../Redux/reduxHooks";
import colors from "../../Utils/colors";
import { sidebarWidth } from "../../Utils/spacings";
import CustomAvatar from "../Common/CustomAvatar";
import CustomButton from "../Common/CustomButton";

const Navbar = ({
  navbarForNonProtectedRoutes,
  handleDrawerToggle,
  backButtonPath,
  hideBackButton,
}: {
  navbarForNonProtectedRoutes?: boolean;
  handleDrawerToggle?: () => void;
  backButtonPath?: string;
  hideBackButton?: boolean;
}) => {
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
        <Box display="flex" alignItems="center" gap={8}>
          <CustomAvatar src={user.picture} />
          <Box>
            <Typography variant="h6" mb={4}>
              {user.name || "User Name"}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
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
      position="fixed"
      sx={{
        zIndex: 30,
        borderTop: `1px solid ${colors.border}`,
        // borderBottom: `1px solid ${colors.border}`,
        color: colors.text,
        ...(navbarForNonProtectedRoutes
          ? {}
          : {
              width: { sm: `calc(100% - ${sidebarWidth}px)` },
              ml: { sm: `${sidebarWidth}px` },
            }),
      }}
    >
      <Box display="flex" alignItems="center" gap={7}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            display: navbarForNonProtectedRoutes ? "none" : { sm: "none" },
          }}
        >
          <Menu />
        </IconButton>
        <Box
          component="img"
          src={OsherLogo}
          alt=""
          sx={{
            cursor: "pointer",
            display: navbarForNonProtectedRoutes
              ? "inline-block"
              : { sm: "none" },
            height: "45px",
          }}
          onClick={handleLogoClick}
        />
        {!hideBackButton && (
          <CustomButton
            className="animated-block"
            sx={{ py: 2, px: 6 }}
            variant="outlined"
            color="secondary"
            onClick={() =>
              backButtonPath ? navigate(backButtonPath) : navigate(-1)
            }
            startIcon={<KeyboardArrowLeftOutlined fontSize="small" />}
          >
            Back
          </CustomButton>
        )}
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

        {isUserLoggedIn() ? (
          <CustomMenu
            anchorComponent={(props: any) => (
              <CustomAvatar
                sx={{ cursor: "pointer" }}
                src={user.picture}
                {...props}
              />
            )}
            options={menuOptions}
          />
        ) : (
          <IconButton sx={{ p: 0 }} onClick={() => navigate(allRoutes.LOGIN)}>
            <Avatar sx={{ width: 40, height: 40 }} />
          </IconButton>
        )}
      </StyledMenuBlock>
    </StyledAppBar>
  );
};

export default Navbar;
