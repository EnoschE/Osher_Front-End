import {
  WidgetsOutlined,
  StorefrontOutlined,
  StyleOutlined,
  SellOutlined,
  InterpreterModeOutlined,
  AllInboxOutlined,
  SettingsOutlined,
  AccountCircleOutlined,
  MapOutlined,
} from "@mui/icons-material";
import { allRoutes } from "../../../Routes/AllRoutes";
import {
  isBrandLoggedIn,
  isInfluencerLoggedIn,
  isSuperAdminLoggedIn,
} from "../../../Services/userService";
import { useTranslation } from "react-i18next";

export const getMenuItems = () => {
  const { t } = useTranslation();
  const isSuperAdmin = isSuperAdminLoggedIn();
  const isBrand = isBrandLoggedIn();
  const isInfluencer = isInfluencerLoggedIn();

  const items = [
    {
      icon: <WidgetsOutlined />,
      text: t("Dashboard"),
      path: allRoutes.DASHBOARD,
    },
    { icon: <WidgetsOutlined />, text: t("Feed"), path: allRoutes.FEED },

    ...(isSuperAdmin
      ? [
          {
            icon: <StorefrontOutlined />,
            text: t("Brands"),
            path: allRoutes.BRANDS,
          },
          {
            icon: <InterpreterModeOutlined />,
            text: t("Influencers"),
            path: allRoutes.INFLUENCERS,
          },
          {
            icon: <StyleOutlined />,
            text: t("Categories"),
            path: allRoutes.CATEGORIES,
          },
        ]
      : []),

    ...(isSuperAdmin || isBrand
      ? [{ icon: <SellOutlined />, text: t("Ads"), path: allRoutes.ADS }]
      : []),

    ...(isSuperAdmin || isInfluencer
      ? [
          {
            icon: <AllInboxOutlined />,
            text: t("Posts"),
            path: allRoutes.POSTS,
          },
        ]
      : []),

    ...(isSuperAdmin
      ? [
          {
            icon: <MapOutlined />,
            text: t("Spots"),
            path: allRoutes.SPOTS,
          },
        ]
      : []),

    {
      icon: <AccountCircleOutlined />,
      text: t("My Profile"),
      path: allRoutes.MY_PROFILE,
    },
    {
      icon: <SettingsOutlined />,
      text: t("Account Settings"),
      path: allRoutes.ACCOUNT_SETTINGS,
    },
  ];

  return items;
};
