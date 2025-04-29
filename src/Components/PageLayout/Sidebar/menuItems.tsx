import {
  WidgetsOutlined,
  StorefrontOutlined,
  StyleOutlined,
  SellOutlined,
  InterpreterModeOutlined,
  AllInboxOutlined,
  SettingsOutlined,
  AccountCircleOutlined,
} from "@mui/icons-material";
import { allRoutes } from "../../../Routes/AllRoutes";
import {
  isBrandLoggedIn,
  isInfluencerLoggedIn,
  isSuperAdminLoggedIn,
} from "../../../Services/userService";

export const getMenuItems = () => {
  const isSuperAdmin = isSuperAdminLoggedIn();
  const isBrand = isBrandLoggedIn();
  const isInfluencer = isInfluencerLoggedIn();

  const items = [
    { icon: <WidgetsOutlined />, text: "Dashboard", path: allRoutes.DASHBOARD },
    { icon: <WidgetsOutlined />, text: "Feed", path: allRoutes.FEED },

    ...(isSuperAdmin
      ? [
          {
            icon: <StorefrontOutlined />,
            text: "Brands",
            path: allRoutes.BRANDS,
          },
          {
            icon: <InterpreterModeOutlined />,
            text: "Influencers",
            path: allRoutes.INFLUENCERS,
          },
          {
            icon: <StyleOutlined />,
            text: "Categories",
            path: allRoutes.CATEGORIES,
          },
        ]
      : []),

    ...(isSuperAdmin || isBrand
      ? [{ icon: <SellOutlined />, text: "Ads", path: allRoutes.ADS }]
      : []),

    ...(isSuperAdmin || isInfluencer
      ? [{ icon: <AllInboxOutlined />, text: "Posts", path: allRoutes.POSTS }]
      : []),

    {
      icon: <AccountCircleOutlined />,
      text: "My Profile",
      path: allRoutes.MY_PROFILE,
    },
    {
      icon: <SettingsOutlined />,
      text: "Account Settings",
      path: allRoutes.ACCOUNT_SETTINGS,
    },
  ];

  return items;
};
