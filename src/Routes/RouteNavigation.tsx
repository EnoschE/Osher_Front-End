import { Route, Routes } from "react-router-dom";
import Login from "../Components/Login/Login";
import { PrivateRoute } from "./PrivateRoutes";
import { PublicRoute } from "./PublicRoutes";
import AccountSettings from "../Components/AccountSettings/AccountSettings";
import React, { useEffect, useState } from "react";
import {
  isBrandLoggedIn,
  isInfluencerLoggedIn,
  isSuperAdminLoggedIn,
  isUserLoggedIn,
} from "../Services/userService";
import Loader from "../Components/Common/Loader";
import { toast } from "react-toastify";
import { getProfile } from "../Services/profileService";
import { useDispatch, useSelector } from "../Redux/reduxHooks";
import { allRoutes } from "./AllRoutes";
import Dashboard from "../Components/Dashboard/Dashboard";
import ResetPassword from "../Components/ResetPassword/ResetPassword";
import NotFound from "../Components/NotFound/NotFound";
import { selectUser } from "../Redux/Slices/userSlice";
import Brands from "../Components/Brands/Brands";
import AddBrand from "../Components/Brands/AddBrand";
import EditBrand from "../Components/Brands/EditBrand";
import BrandDetails from "../Components/Brands/BrandDetails";
import Categories from "../Components/Categories/Categories";
import Ads from "../Components/Ads/Ads";
import AddAd from "../Components/Ads/AddAd";
import EditAd from "../Components/Ads/EditAd";
import AdDetails from "../Components/Ads/AdDetails";
import Influencers from "../Components/Influencers/Influencers";
import InfluencerDetails from "../Components/Influencers/InfluencerDetails";
import EditInfluencer from "../Components/Influencers/EditInfluencer";
import AddInfluencer from "../Components/Influencers/AddInfluencer";
import Posts from "../Components/Posts/Posts";
import AddPost from "../Components/Posts/AddPost";
import EditPost from "../Components/Posts/EditPost";
import PostDetails from "../Components/Posts/PostDetails";
import Feed from "../Components/Feed/Feed";
import MyProfile from "../Components/MyProfile/MyProfile";
import Home from "../Components/Home/Home";

interface RouteWithComponent {
  path: string;
  Component: React.FC;
  isPrivate?: boolean;
  isBoth?: boolean;
  accessTo?: {
    superAdmin?: boolean;
    brand?: boolean;
    influencer?: boolean;

    director?: boolean;
    adminManager?: boolean;
    psl?: boolean;
  };
}

const routesWithComponents = {
  HOME: { path: allRoutes.HOME, Component: Home },
  LOGIN: { path: allRoutes.LOGIN, Component: Login },
  RESET_PASSWORD: { path: allRoutes.RESET_PASSWORD, Component: ResetPassword },
  DASHBOARD: {
    path: allRoutes.DASHBOARD,
    Component: Dashboard,
    isPrivate: true,
  },
  FEED: {
    path: allRoutes.FEED,
    Component: Feed,
    // isPrivate: true,
    isBoth: true,
  },
  CATEGORIES: {
    path: allRoutes.CATEGORIES,
    Component: Categories,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },

  BRANDS: {
    path: allRoutes.BRANDS,
    Component: Brands,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },
  ADD_BRAND: {
    path: allRoutes.ADD_BRAND,
    Component: AddBrand,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },
  EDIT_BRAND: {
    path: allRoutes.EDIT_BRAND,
    Component: EditBrand,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },
  VIEW_BRAND: {
    path: allRoutes.VIEW_BRAND,
    Component: BrandDetails,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      brand: true,
    },
  },

  INFLUENCERS: {
    path: allRoutes.INFLUENCERS,
    Component: Influencers,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },
  ADD_INFLUENCER: {
    path: allRoutes.ADD_INFLUENCER,
    Component: AddInfluencer,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },
  EDIT_INFLUENCER: {
    path: allRoutes.EDIT_INFLUENCER,
    Component: EditInfluencer,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },
  VIEW_INFLUENCER: {
    path: allRoutes.VIEW_INFLUENCER,
    Component: InfluencerDetails,
    isBoth: true,
  },

  ADS: {
    path: allRoutes.ADS,
    Component: Ads,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      brand: true,
    },
  },
  ADD_AD: {
    path: allRoutes.ADD_AD,
    Component: AddAd,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      brand: true,
    },
  },
  EDIT_AD: {
    path: allRoutes.EDIT_AD,
    Component: EditAd,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      brand: true,
    },
  },
  VIEW_AD: {
    path: allRoutes.VIEW_AD,
    Component: AdDetails,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      brand: true,
    },
  },

  POSTS: {
    path: allRoutes.POSTS,
    Component: Posts,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      influencer: true,
    },
  },
  ADD_POST: {
    path: allRoutes.ADD_POST,
    Component: AddPost,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      influencer: true,
    },
  },
  EDIT_POST: {
    path: allRoutes.EDIT_POST,
    Component: EditPost,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      influencer: true,
    },
  },
  VIEW_POST: {
    path: allRoutes.VIEW_POST,
    Component: PostDetails,
    isBoth: true,
  },

  MY_PROFILE: {
    path: allRoutes.MY_PROFILE,
    Component: MyProfile,
    isPrivate: true,
  },
  ACCOUNT_SETTINGS: {
    path: allRoutes.ACCOUNT_SETTINGS,
    Component: AccountSettings,
    isPrivate: true,
  },
  NOT_FOUND: {
    path: "*",
    Component: NotFound,
    isPrivate: true,
  },
};

const RouteNavigation = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const isLoggedIn = isUserLoggedIn();
  const isSuperAdmin = isSuperAdminLoggedIn();
  const isBrand = isBrandLoggedIn();
  const isInfluencer = isInfluencerLoggedIn();

  const [loading, setLoading] = useState<boolean>(false);
  const [renderingRoutes, setRenderingRoutes] = useState<
    Array<RouteWithComponent>
  >([]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const allRoutes = Object.values(routesWithComponents).filter(
      (item: RouteWithComponent) =>
        item.accessTo
          ? isSuperAdmin
            ? item.accessTo.superAdmin
            : isBrand
            ? item.accessTo.brand
            : isInfluencer && item.accessTo.influencer
          : item
    );
    setRenderingRoutes(allRoutes);
  }, [user._id, isSuperAdmin, isBrand, isInfluencer]);

  const fetchUserProfile = async () => {
    if (isLoggedIn) {
      setLoading(true);
      try {
        await dispatch(getProfile()); // TODO: change this to fetchProfile as well like categories and dashbaord
      } catch (error: any) {
        toast.error(error);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Loader open={loading} />
      <Routes>
        {renderingRoutes.map((item: RouteWithComponent) => {
          const ComponentWrapper = item.isBoth
            ? React.Fragment
            : item.isPrivate
            ? PrivateRoute
            : PublicRoute;

          return (
            <Route
              key={item.path}
              path={item.path}
              element={
                <ComponentWrapper>
                  <item.Component />
                </ComponentWrapper>
              }
            />
          );
        })}
      </Routes>
    </>
  );
};

export default RouteNavigation;
