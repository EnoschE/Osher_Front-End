import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Toolbar from "@mui/material/Toolbar";
import { useLocation, useNavigate } from "react-router-dom";
import { sidebarWidth } from "../../Utils/spacings";
import { OsherLogo } from "../../Utils/Images";
import { allRoutes } from "../../Routes/AllRoutes";
import {
  AdminPanelSettingsOutlined,
  ApartmentOutlined,
  HomeOutlined,
  KeyboardArrowDownRounded,
  ManageAccountsOutlined,
  Person4Outlined,
  RecordVoiceOverOutlined,
  SettingsOutlined,
  SupervisorAccountOutlined,
  SupportAgentOutlined,
  TuneOutlined,
  TextSnippetOutlined,
} from "@mui/icons-material";
import { Collapse, Typography } from "@mui/material";
import { useState } from "react";
import {
  isAdminManagerLoggedIn,
  isDirectorLoggedIn,
  isPslLoggedIn,
  isSuperAdminLoggedIn,
} from "../../Services/userService";
import {
  StyledDrawer,
  StyledDrawerBox,
  StyledDrawerList,
  StyledDrawerListItem,
  StyledDrawerListSubItem,
} from "./pageLayoutStyles";
interface ItemProps {
  icon: any;
  text: string;
  path?: string;
}

interface ParentItemProps extends ItemProps {
  subItems?: Array<ItemProps>;
}

interface SidebarItemProps {
  item: ParentItemProps;
  onClick: (path?: string) => void;
}

interface LayoutSidebarProps {
  open?: boolean;
  handleDrawerToggle?: () => void;
}
interface MenuItem {
  icon: JSX.Element;
  text: string;
  path?: string;
  subItems?: MenuItem[];
}

const SidebarItem = ({ item, onClick }: SidebarItemProps) => {
  const location = useLocation();

  const isActive = (path?: string) =>
    path === location.pathname || path
      ? location.pathname?.includes(path)
      : false;

  const containSubItems = !!item.subItems?.length;
  const isAnySubItemActive =
    containSubItems && item.subItems?.find((sub) => isActive(sub.path));

  const [expand, setExpand] = useState<boolean>(!!isAnySubItemActive);

  const handleOnClick = (path?: string, isParentItem?: boolean) => {
    if (isParentItem) {
      setExpand(!expand);
    } else {
      onClick(path);
    }
  };

  return (
    <>
      <StyledDrawerListItem
        disablePadding
        onClick={() => handleOnClick(item.path, containSubItems)}
        sx={{
          backgroundColor: isActive(item.path) ? "primary.main" : "transparent",
          color: isActive(item.path) ? "white" : "text.primary",
          svg: {
            path: { fill: isActive(item.path) ? "white" : "text.primary" },
          },
        }}
      >
        <ListItemButton sx={{ display: "flex", alignItems: "center" }}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <Typography sx={{ py: 10, color: "inherit", fontWeight: 500 }}>
            {item.text}
          </Typography>
          {containSubItems && (
            <ListItemIcon sx={{ ml: "auto", mr: "0px !important", pl: "14px" }}>
              <KeyboardArrowDownRounded
                sx={{
                  transition: "all ease 0.3s",
                  transform: `rotate(${expand ? 180 : 0}deg)`,
                }}
              />
            </ListItemIcon>
          )}
        </ListItemButton>
      </StyledDrawerListItem>

      {containSubItems && (
        <Collapse in={expand}>
          {item.subItems?.map((subItem, idx) => {
            return (
              <StyledDrawerListSubItem
                key={idx}
                disablePadding
                sx={{
                  backgroundColor: isActive(item.path)
                    ? "primary.main"
                    : "transparent",
                  color: isActive(item.path) ? "white" : "text.primary",
                  svg: {
                    path: {
                      fill: isActive(item.path) ? "white" : "text.primary",
                    },
                  },
                }}
                onClick={() => handleOnClick(subItem.path)}
              >
                <ListItemButton sx={{ display: "flex", alignItems: "center" }}>
                  <ListItemIcon>{subItem.icon}</ListItemIcon>
                  <Typography
                    sx={{ py: 10, color: "inherit", fontWeight: 500 }}
                  >
                    {subItem.text}
                  </Typography>
                </ListItemButton>
              </StyledDrawerListSubItem>
            );
          })}
        </Collapse>
      )}
    </>
  );
};

const LayoutSidebar = ({ open, handleDrawerToggle }: LayoutSidebarProps) => {
  const navigate = useNavigate();

  // User role checks
  const isSuperAdmin = isSuperAdminLoggedIn();
  const isDirector = isDirectorLoggedIn();
  const isAdminManager = isAdminManagerLoggedIn();
  const isPsl = isPslLoggedIn();

  const menuItems: MenuItem[] = [
    { icon: <HomeOutlined />, text: "Dashboard", path: allRoutes.DASHBOARD },
    ...(isSuperAdmin
      ? [
          {
            icon: <RecordVoiceOverOutlined />,
            text: "Brands",
            path: allRoutes.BRANDS,
          },
        ]
      : []),
    // ...(isSuperAdmin || isDirector || isAdminManager
    //   ? [
    //       {
    //         icon: <RecordVoiceOverOutlined />,
    //         text: "My Organization",
    //         path: allRoutes.ADMINS,
    //       },
    //     ]
    //   : []),
    // {
    //   icon: <ManageAccountsOutlined />,
    //   text: "Installers",
    //   subItems: [
    //     ...(isSuperAdmin || isDirector
    //       ? [
    //           {
    //             icon: <ApartmentOutlined />,
    //             text: "Installer Companies",
    //             path: allRoutes.INSTALLER_COMPANIES,
    //           },
    //           {
    //             icon: <AdminPanelSettingsOutlined />,
    //             text: "Installer Admins",
    //             path: allRoutes.INSTALLER_ADMINS,
    //           },
    //           {
    //             icon: <Person4Outlined />,
    //             text: "Office Managers",
    //             path: allRoutes.OFFICE_MANAGERS,
    //           },
    //         ]
    //       : []),
    //     ...(isSuperAdmin || isDirector || isAdminManager || isPsl
    //       ? [
    //           {
    //             icon: <SupervisorAccountOutlined />,
    //             text: "Managers",
    //             path: allRoutes.MANAGERS,
    //           },
    //           {
    //             icon: <SupportAgentOutlined />,
    //             text: "Representatives",
    //             path: allRoutes.REPRESENTATIVES,
    //           },
    //         ]
    //       : []),
    //   ],
    // },
    // ...(isSuperAdmin || isDirector || isAdminManager || isPsl
    //   ? [
    //       {
    //         icon: <SupervisorAccountOutlined />,
    //         text: "Customers",
    //         path: allRoutes.CUSTOMERS,
    //       },
    //     ]
    //   : []),
    // ...(isSuperAdmin
    //   ? [
    //       {
    //         icon: <SupportAgentOutlined />,
    //         text: "Installation Crew",
    //         path: allRoutes.TECHNICIANS,
    //       },
    //       {
    //         icon: <TuneOutlined />,
    //         text: "Configurations",
    //         path: allRoutes.CONFIGURATIONS,
    //       },
    //       {
    //         icon: <TextSnippetOutlined />,
    //         text: "Text Snippets",
    //         path: allRoutes.TEXT_SNIPPETS,
    //       },
    //     ]
    //   : []),

    {
      icon: <SettingsOutlined />,
      text: "Account Settings",
      path: allRoutes.ACCOUNT_SETTINGS,
    },
  ];

  const handleClickItem = (path?: string) => {
    if (open) handleDrawerToggle?.();
    if (path) navigate(path);
  };

  const DrawerBlock = (
    <StyledDrawerBox>
      <Toolbar sx={{ justifyContent: "center" }}>
        <img
          alt='Logo'
          src={OsherLogo}
          style={{ cursor: "pointer" }}
          onClick={() => handleClickItem(allRoutes.DASHBOARD)}
          className='main-logo'
        />
      </Toolbar>

      <StyledDrawerList>
        {Object.values(menuItems).map((item) => {
          return (
            <SidebarItem
              key={item.text}
              onClick={handleClickItem}
              item={item}
            />
          );
        })}
      </StyledDrawerList>
    </StyledDrawerBox>
  );

  return (
    <Box
      component='nav'
      sx={{ width: { sm: sidebarWidth }, flexShrink: { sm: 0 } }}
      aria-label='mailbox folders'
    >
      <StyledDrawer
        open={open}
        variant='temporary'
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true, disableScrollLock: true }} // Better open performance on mobile.
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        {DrawerBlock}
      </StyledDrawer>
      <StyledDrawer
        open
        variant='permanent'
        sx={{ display: { xs: "none", sm: "block" } }}
      >
        {DrawerBlock}
      </StyledDrawer>
    </Box>
  );
};

export default LayoutSidebar;
