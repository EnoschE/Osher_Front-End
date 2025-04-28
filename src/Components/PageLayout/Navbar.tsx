import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Avatar, Backdrop, IconButton, Tooltip } from "@mui/material";
import {
  LogoutOutlined,
  SettingsOutlined,
  Menu,
  KeyboardArrowLeftOutlined,
  LanguageOutlined,
  VolumeDownOutlined,
  VolumeUpOutlined,
  VolumeMuteOutlined,
  VolumeOffOutlined,
  BedtimeOffOutlined,
  BedtimeOutlined,
  DarkModeOutlined,
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
import NapScreen, { napTime } from "./NapScreen";
import { useEffect, useRef, useState } from "react";
import VolumeButtons from "./VolumeButtons";

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [nap, setNap] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const enableNap = () => {
    setNap(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setNap(false);
    }, napTime);
  };

  const disableNap = () => setNap(false);

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
      icon: SettingsOutlined,
      text: "Settings",
      onClick: () => navigate(allRoutes.ACCOUNT_SETTINGS),
    },
    { isDivider: true },
    { icon: LogoutOutlined, text: "Log Out", onClick: handleLogout },
  ];

  return (
    <>
      <StyledAppBar
        position='fixed'
        sx={{
          zIndex: 30,
          borderTop: `1px solid ${colors.border}`,
          color: colors.text,
          ...(navbarForNonProtectedRoutes
            ? {}
            : {
                width: { sm: `calc(100% - ${sidebarWidth}px)` },
                ml: { sm: `${sidebarWidth}px` },
              }),
        }}
      >
        <Box display='flex' alignItems='center' gap={7}>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{
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
              height: "55px",
            }}
            onClick={handleLogoClick}
          />
          {!hideBackButton && (
            <CustomButton
              className='animated-block'
              sx={{ py: 2, px: 6 }}
              variant='outlined'
              color='secondary'
              onClick={() =>
                backButtonPath ? navigate(backButtonPath) : navigate(-1)
              }
              startIcon={<KeyboardArrowLeftOutlined fontSize='small' />}
            >
              Back
            </CustomButton>
          )}
        </Box>

        <StyledMenuBlock>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 4, sm: 8 },
              "& button": {
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 500,
                color: "text.primary",
              },
              "& svg": {
                width: 28,
                height: 28,
              },
            }}
          >
            {/* <VolumeButtons /> */}

            <CustomButton variant='text' onClick={enableNap}>
              <DarkModeOutlined />
              Nap
            </CustomButton>
          </Box>

          {isUserLoggedIn() ? (
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
          )}
        </StyledMenuBlock>
      </StyledAppBar>

      <NapScreen open={nap} onClick={disableNap} />
    </>
  );
};

export default Navbar;
