import { Box, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { StyledAppBar, StyledMenuBlock } from "./navbarStyles";
import { useSelector } from "../../../Redux/reduxHooks";
import { selectUser } from "../../../Redux/Slices/userSlice";
import { sidebarWidth } from "../../../Utils/spacings";
import Logo from "./Logo";
import LiveDateTime from "./LiveDateTime";
import NavMenu from "./NavMenu";
import UserMenu from "./UserMenu";
import NapScreen from "./NapScreen";
import { useNap } from "../../../Hooks/useNap";

const Navbar = ({
  hideSidebar,
  handleDrawerToggle,
  backButtonPath,
  hideBackButton,
}: {
  hideSidebar?: boolean;
  handleDrawerToggle?: () => void;
  backButtonPath?: string;
  hideBackButton?: boolean;
}) => {
  const user = useSelector(selectUser);
  const { nap, enableNap, disableNap } = useNap();

  return (
    <>
      <StyledAppBar
        sx={
          hideSidebar
            ? {}
            : {
                width: { sm: `calc(100% - ${sidebarWidth}px)` },
                ml: { sm: `${sidebarWidth}px` },
              }
        }
      >
        <Box display='flex' alignItems='center' gap={6}>
          <IconButton
            color='inherit'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ display: hideSidebar ? "none" : { sm: "none" } }}
          >
            <Menu />
          </IconButton>

          <Logo isVisible={!!hideSidebar} />
          <LiveDateTime />
        </Box>

        <StyledMenuBlock>
          <NavMenu
            onNap={enableNap}
            hideBackButton={hideBackButton}
            backButtonPath={backButtonPath}
          />
          <UserMenu user={user} />
        </StyledMenuBlock>
      </StyledAppBar>

      <NapScreen open={nap} onClick={disableNap} />
    </>
  );
};

export default Navbar;
