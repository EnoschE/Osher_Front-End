import { Box, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import {
  StyledDrawer,
  StyledDrawerBox,
  StyledDrawerList,
} from "../pageLayoutStyles";
import { sidebarWidth } from "../../../Utils/spacings";
import { OsherLogo } from "../../../Utils/Images";
import { getMenuItems } from "./menuItems";

interface LayoutSidebarProps {
  open?: boolean;
  handleDrawerToggle?: () => void;
}

const LayoutSidebar = ({ open, handleDrawerToggle }: LayoutSidebarProps) => {
  const navigate = useNavigate();
  const menuItems = getMenuItems();

  const handleClickItem = (path?: string) => {
    if (open) handleDrawerToggle?.();
    if (path) navigate(path);
  };

  const DrawerContent = (
    <StyledDrawerBox>
      <Toolbar sx={{ justifyContent: "center" }}>
        <img
          alt='Logo'
          src={OsherLogo}
          className='main-logo'
          style={{ cursor: "pointer" }}
          onClick={() => handleClickItem("/")}
        />
      </Toolbar>

      <StyledDrawerList>
        {menuItems.map((item) => (
          <SidebarItem key={item.text} item={item} onClick={handleClickItem} />
        ))}
      </StyledDrawerList>
    </StyledDrawerBox>
  );

  return (
    <Box
      component='nav'
      sx={{ width: { sm: sidebarWidth }, flexShrink: { sm: 0 } }}
    >
      <StyledDrawer
        open={open}
        variant='temporary'
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true, disableScrollLock: true }}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        {DrawerContent}
      </StyledDrawer>

      <StyledDrawer
        open
        variant='permanent'
        sx={{ display: { xs: "none", sm: "block" } }}
      >
        {DrawerContent}
      </StyledDrawer>
    </Box>
  );
};

export default LayoutSidebar;
