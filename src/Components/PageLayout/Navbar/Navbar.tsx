import { Box, IconButton, Theme, useMediaQuery } from "@mui/material";
import { Menu, KeyboardArrowLeftOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import CustomButton from "../../Common/CustomButton";
import { StyledAppBar, StyledMenuBlock } from "./navbarStyles";
import { useNavigate } from "react-router-dom";
import { useSelector } from "../../../Redux/reduxHooks";
import { selectUser } from "../../../Redux/Slices/userSlice";
import colors from "../../../Utils/colors";
import { sidebarWidth } from "../../../Utils/spacings";
import Logo from "./Logo";
import LiveDateTime from "./LiveDateTime";
import NavMenu from "./NavMenu";
import UserMenu from "./UserMenu";
import NapScreen from "./NapScreen";
import { useNap } from "../../../Hooks/useNap";

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { nap, enableNap, disableNap } = useNap();
  const isMobileView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

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
        <Box display='flex' alignItems='center' gap={6}>
          <IconButton
            color='inherit'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{
              display: navbarForNonProtectedRoutes ? "none" : { sm: "none" },
            }}
          >
            <Menu />
          </IconButton>

          <Logo isVisible={!!navbarForNonProtectedRoutes} />

          {!hideBackButton && (
            <CustomButton
              sx={{ p: { xs: "2px", sm: "2px 6px", minWidth: 0 } }}
              variant='outlined'
              color='secondary'
              onClick={() =>
                backButtonPath ? navigate(backButtonPath) : navigate(-1)
              }
            >
              <KeyboardArrowLeftOutlined fontSize='small' />
              {isMobileView ? "" : t("Back")}
            </CustomButton>
          )}

          <LiveDateTime />
        </Box>

        <StyledMenuBlock>
          <NavMenu onNap={enableNap} />
          <UserMenu user={user} />
        </StyledMenuBlock>
      </StyledAppBar>

      <NapScreen open={nap} onClick={disableNap} />
    </>
  );
};

export default Navbar;
