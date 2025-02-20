import { Route, Routes } from "react-router-dom";
import Login from "../Components/Login/Login";
import { PrivateRoute } from "./PrivateRoutes";
import { PublicRoute } from "./PublicRoutes";
import AccountSettings from "../Components/AccountSettings/AccountSettings";
import { useEffect, useState } from "react";
import {
  isAdminManagerLoggedIn,
  isDirectorLoggedIn,
  isPslLoggedIn,
  isSuperAdminLoggedIn,
  isUserLoggedIn,
} from "../Services/userService";
import Loader from "../Components/Common/Loader";
import { toast } from "react-toastify";
import { getProfile } from "../Services/profileService";
import { useDispatch, useSelector } from "../Redux/reduxHooks";
import { allRoutes } from "./AllRoutes";
import Dashboard from "../Components/Dashboard/Dashboard";
import UpdateStatus from "../Components/UpdateStatus/UpdateStatus";
import InstallerCompanies from "../Components/Installers/InstallerCompanies/InstallerCompanies";
import Admins from "../Components/Admins/Admins";
import Customers from "../Components/Customers/Customers";
import Technicians from "../Components/Technicians/Technicians";
import CustomerDetails from "../Components/Customers/CustomerDetails";
import EditCustomer from "../Components/Customers/EditCustomer";
import ConfigurationsPage from "../Components/ConfigurationsPage/ConfigurationsPage";
import ResetPassword from "../Components/ResetPassword/ResetPassword";
import AdminDetails from "../Components/Admins/AdminDetails";
import InstallerCompanyDetails from "../Components/Installers/InstallerCompanies/InstallerCompanyDetails";
import TechnicianDetails from "../Components/Technicians/TechnicianDetails";
import EditInstallerCompany from "../Components/Installers/InstallerCompanies/EditInstallerCompany";
import EditAdmin from "../Components/Admins/EditAdmin";
import EditTechnician from "../Components/Technicians/EditTechnician";
import AddAdmin from "../Components/Admins/AddAdmin";
import AddInstallerCompany from "../Components/Installers/InstallerCompanies/AddInstallerCompany";
import AddTechnician from "../Components/Technicians/AddTechnician";
import AddCustomer from "../Components/Customers/AddCustomer";
import TextSnippetPage from "../Components/TextSnippetPage/TextSnippetPage";
import NotFound from "../Components/NotFound/NotFound";
import InstallerAdmins from "../Components/Installers/InstallerAdmins/InstallerAdmins";
import AddInstallerAdmin from "../Components/Installers/InstallerAdmins/AddInstallerAdmin";
import InstallerAdminDetails from "../Components/Installers/InstallerAdmins/InstallerAdminDetails";
import EditInstallerAdmin from "../Components/Installers/InstallerAdmins/EditInstallerAdmin";
import OfficeManagers from "../Components/Installers/OfficeManagers/OfficeManagers";
import AddOfficeManager from "../Components/Installers/OfficeManagers/AddOfficeManager";
import OfficeManagerDetails from "../Components/Installers/OfficeManagers/OfficeManagerDetails";
import EditOfficeManager from "../Components/Installers/OfficeManagers/EditOfficeManager";
import Managers from "../Components/Installers/Managers/Managers";
import AddManager from "../Components/Installers/Managers/AddManager";
import ManagerDetails from "../Components/Installers/Managers/ManagerDetails";
import EditManager from "../Components/Installers/Managers/EditManager";
import Logs from "../Components/Logs/Logs";
import Representatives from "../Components/Installers/Representatives/Representatives";
import AddRepresentative from "../Components/Installers/Representatives/AddRepresentative";
import RepresentativeDetails from "../Components/Installers/Representatives/RepresentativeDetails";
import EditRepresentative from "../Components/Installers/Representatives/EditRepresentative";
import { selectUser } from "../Redux/Slices/userSlice";
import RoleBasedDashboard from "../Components/Dashboard/RoleBasedDashboard";
import TechnicianCalendarView from "../Components/Technicians/Calendar/TechnicianCalendarView";
import UtilityCompaniesPage from "../Components/UtilityCompanies/UtilityCompaniesPage";
import AddUtilityCompany from "../Components/UtilityCompanies/AddUtilityCompany";
import EditUtilityCompany from "../Components/UtilityCompanies/EditUtilityCompany";
import ViewUtilityCompany from "../Components/UtilityCompanies/ViewUtilityCompany";
import AccountCreation from "../Components/Common/AccountCreation";
import ColorTheme from "../Components/ColorTheme/ColorTheme";
import Brands from "../Components/Brands/Brands";
import AddBrand from "../Components/Brands/AddBrand";
import EditBrand from "../Components/Brands/EditBrand";
import BrandDetails from "../Components/Brands/BrandDetails";
// import SignUp from "../Components/SignUp/SignUp";
// import Home from "../Components/Home/Home";
// import Estimate from "../Components/Estimate/Estimate";
// import WhyUs from "../Components/WhyUs/WhyUs";
// import SolarReport from "../Components/SolarReport/SolarReport";
// import ResetPassword from "../Components/ResetPassword/ResetPassword";
// import VerifyEmail from "../Components/VerifyEmail/VerifyEmail";
// import Scheduling from "../Components/Scheduling/Scheduling";
// import ProposalAcceptance from "../Components/Scheduling/SubPages/ProposalAcceptance";
// import SiteSurvey from "../Components/Scheduling/SubPages/SiteSurvey";
// import Payment from "../Components/Payment/Payment";
// import CADDesign from "../Components/Scheduling/SubPages/CADDesgin";

interface RouteWithComponent {
  path: string;
  Component: React.FC;
  isPrivate?: boolean;
  accessTo?: {
    superAdmin?: boolean;
    director?: boolean;
    adminManager?: boolean;
    psl?: boolean;
  };
}

const routesWithComponents = {
  HOME: { path: allRoutes.HOME, Component: Login },
  RESET_PASSWORD: { path: allRoutes.RESET_PASSWORD, Component: ResetPassword },
  DASHBOARD: {
    path: allRoutes.DASHBOARD,
    Component: Dashboard,
    isPrivate: true,
  },
  BRANDS: {
    path: allRoutes.BRANDS,
    Component: Brands,
    isPrivate: true,
    accessTo: {
      superAdmin: true, // TODO: replace it with admin
    },
  },
  ADD_BRAND: {
    path: allRoutes.ADD_BRAND,
    Component: AddBrand,
    isPrivate: true,
    accessTo: {
      superAdmin: true, // TODO: replace it with admin
    },
  },
  EDIT_BRAND: {
    path: allRoutes.EDIT_BRAND,
    Component: EditBrand,
    isPrivate: true,
    accessTo: {
      superAdmin: true, // TODO: replace it with admin
    },
  },
  VIEW_BRAND: {
    path: allRoutes.VIEW_BRAND,
    Component: BrandDetails,
    isPrivate: true,
    accessTo: {
      superAdmin: true, // TODO: replace it with admin
    },
  },

  LOGS: { path: allRoutes.LOGS, Component: Logs, isPrivate: true },

  INSTALLER_COMPANIES: {
    path: allRoutes.INSTALLER_COMPANIES,
    Component: InstallerCompanies,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  VIEW_INSTALLER_COMPANY: {
    path: allRoutes.VIEW_INSTALLER_COMPANY,
    Component: InstallerCompanyDetails,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  EDIT_INSTALLER_COMPANY: {
    path: allRoutes.EDIT_INSTALLER_COMPANY,
    Component: EditInstallerCompany,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  ADD_INSTALLER_COMPANY: {
    path: allRoutes.ADD_INSTALLER_COMPANY,
    Component: AddInstallerCompany,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },

  INSTALLER_ADMINS: {
    path: allRoutes.INSTALLER_ADMINS,
    Component: InstallerAdmins,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  ADD_INSTALLER_ADMIN: {
    path: allRoutes.ADD_INSTALLER_ADMIN,
    Component: AddInstallerAdmin,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  VIEW_INSTALLER_ADMIN: {
    path: allRoutes.VIEW_INSTALLER_ADMIN,
    Component: InstallerAdminDetails,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  VIEW_INSTALLER_ADMIN_DASHBOARD: {
    path: allRoutes.VIEW_INSTALLER_ADMIN_DASHBOARD,
    Component: RoleBasedDashboard,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  EDIT_INSTALLER_ADMIN: {
    path: allRoutes.EDIT_INSTALLER_ADMIN,
    Component: EditInstallerAdmin,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },

  OFFICE_MANAGERS: {
    path: allRoutes.OFFICE_MANAGERS,
    Component: OfficeManagers,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  ADD_OFFICE_MANAGER: {
    path: allRoutes.ADD_OFFICE_MANAGER,
    Component: AddOfficeManager,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  VIEW_OFFICE_MANAGER: {
    path: allRoutes.VIEW_OFFICE_MANAGER,
    Component: OfficeManagerDetails,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  EDIT_OFFICE_MANAGER: {
    path: allRoutes.EDIT_OFFICE_MANAGER,
    Component: EditOfficeManager,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  VIEW_OFFICE_MANAGER_DASHBOARD: {
    path: allRoutes.VIEW_OFFICE_MANAGER_DASHBOARD,
    Component: RoleBasedDashboard,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  MANAGERS: {
    path: allRoutes.MANAGERS,
    Component: Managers,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      psl: true,
      adminManager: true,
      director: true,
    },
  },
  ADD_MANAGER: {
    path: allRoutes.ADD_MANAGER,
    Component: AddManager,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  VIEW_MANAGER: {
    path: allRoutes.VIEW_MANAGER,
    Component: ManagerDetails,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      psl: true,
      adminManager: true,
      director: true,
    },
  },
  VIEW_MANAGER_DASHBOARD: {
    path: allRoutes.VIEW_MANAGER_DASHBOARD,
    Component: RoleBasedDashboard,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      psl: true,
      adminManager: true,
      director: true,
    },
  },
  EDIT_MANAGER: {
    path: allRoutes.EDIT_MANAGER,
    Component: EditManager,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      psl: true,
      adminManager: true,
      director: true,
    },
  },

  REPRESENTATIVES: {
    path: allRoutes.REPRESENTATIVES,
    Component: Representatives,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      psl: true,
      adminManager: true,
      director: true,
    },
  },
  ADD_REPRESENTATIVE: {
    path: allRoutes.ADD_REPRESENTATIVE,
    Component: AddRepresentative,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  VIEW_REPRESENTATIVE: {
    path: allRoutes.VIEW_REPRESENTATIVE,
    Component: RepresentativeDetails,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      psl: true,
      adminManager: true,
      director: true,
    },
  },
  VIEW_REPRESENTATIVE_DASHBOARD: {
    path: allRoutes.VIEW_REPRESENTATIVE_DASHBOARD,
    Component: RoleBasedDashboard,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      psl: true,
      adminManager: true,
      director: true,
    },
  },
  EDIT_REPRESENTATIVE: {
    path: allRoutes.EDIT_REPRESENTATIVE,
    Component: EditRepresentative,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      adminManager: true,
      director: true,
      psl: true,
    },
  },

  ADMINS: {
    path: allRoutes.ADMINS,
    Component: Admins,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
      adminManager: true,
    },
  },
  VIEW_ADMIN: {
    path: allRoutes.VIEW_ADMIN,
    Component: AdminDetails,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
      adminManager: true,
    },
  },
  VIEW_ADMIN_DASHBOARD: {
    path: allRoutes.VIEW_ADMIN_DASHBOARD,
    Component: RoleBasedDashboard,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
      adminManager: true,
    },
  },
  EDIT_ADMIN: {
    path: allRoutes.EDIT_ADMIN,
    Component: EditAdmin,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
      adminManager: true,
    },
  },
  ADD_ADMIN: {
    path: allRoutes.ADD_ADMIN,
    Component: AddAdmin,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
      adminManager: true,
    },
  },
  TECHNICIANS: {
    path: allRoutes.TECHNICIANS,
    Component: Technicians,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  VIEW_TECHNICIAN: {
    path: allRoutes.VIEW_TECHNICIAN,
    Component: TechnicianDetails,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  EDIT_TECHNICIAN: {
    path: allRoutes.EDIT_TECHNICIAN,
    Component: EditTechnician,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },
  ADD_TECHNICIAN: {
    path: allRoutes.ADD_TECHNICIAN,
    Component: AddTechnician,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },

  CONFIGURATIONS: {
    path: allRoutes.CONFIGURATIONS,
    Component: ConfigurationsPage,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },
  COLOR_THEME: {
    path: allRoutes.COLOR_THEME,
    Component: ColorTheme,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },
  UTILITY_COMPANIES_PAGE: {
    path: allRoutes.UTILITY_COMPANIES_PAGE,
    Component: UtilityCompaniesPage,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },
  ADD_UTILITY_COMPANY: {
    path: allRoutes.ADD_UTILITY_COMPANY,
    Component: AddUtilityCompany,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },
  VIEW_UTILITY_COMPANY: {
    path: allRoutes.VIEW_UTILITY_COMPANY,
    Component: ViewUtilityCompany,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },
  EDIT_UTILITY_COMPANY: {
    path: allRoutes.EDIT_UTILITY_COMPANY,
    Component: EditUtilityCompany,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },
  TEXTSNIPPETS: {
    path: allRoutes.TEXT_SNIPPETS,
    Component: TextSnippetPage,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
    },
  },
  CUSTOMERS: {
    path: allRoutes.CUSTOMERS,
    Component: Customers,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      psl: true,
      adminManager: true,
      director: true,
    },
  },
  VIEW_CUSTOMER: {
    path: allRoutes.VIEW_CUSTOMER,
    Component: CustomerDetails,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      psl: true,
      adminManager: true,
      director: true,
    },
  },
  EDIT_CUSTOMER: {
    path: allRoutes.EDIT_CUSTOMER,
    Component: EditCustomer,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      psl: true,
      adminManager: true,
      director: true,
    },
  },
  ADD_CUSTOMER: {
    path: allRoutes.ADD_CUSTOMER,
    Component: AddCustomer,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
    },
  },
  UPDATE_STATUS: {
    path: allRoutes.UPDATE_STATUS,
    Component: UpdateStatus,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
      psl: true,
      adminManager: true,
    },
  },
  ACCOUNT_SETTINGS: {
    path: allRoutes.ACCOUNT_SETTINGS,
    Component: AccountSettings,
    isPrivate: true,
    accessTo: {
      superAdmin: true,
      director: true,
      psl: true,
      adminManager: true,
    },
  },
  ACCOUNT_CREATION: {
    path: allRoutes.ACCOUNT_CREATION,
    Component: AccountCreation,
  },
  NOT_FOUND: {
    path: "*",
    Component: NotFound,
    isPrivate: true,
  },
};

// TODO: ** try to add these nested routes inside the route of Scheduling

const RouteNavigation = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  // const isFirstRender = useRef(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [renderingRoutes, setRenderingRoutes] = useState<
    Array<RouteWithComponent>
  >([]);

  useEffect(() => {
    fetchUserProfile();

    // if (!isFirstRender.current) {
    // 	// check if this is not the initial render
    // 	fetchUserProfile();
    // } else {
    // 	isFirstRender.current = false; // set to false after the initial render
    // }
  }, []);

  useEffect(() => {
    const allRoutes = Object.values(routesWithComponents).filter(
      (item: RouteWithComponent) =>
        item.accessTo
          ? isSuperAdminLoggedIn()
            ? item.accessTo.superAdmin
            : isDirectorLoggedIn()
            ? item.accessTo.director
            : isAdminManagerLoggedIn()
            ? item.accessTo.adminManager
            : isPslLoggedIn() && item.accessTo.psl
          : item
    );
    setRenderingRoutes(allRoutes);
  }, [
    user.id,
    isSuperAdminLoggedIn(),
    isAdminManagerLoggedIn(),
    isDirectorLoggedIn(),
    isPslLoggedIn(),
  ]);

  const fetchUserProfile = async () => {
    if (isUserLoggedIn()) {
      setLoading(true);
      try {
        await dispatch(getProfile());
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
          const ComponentWrapper = item.isPrivate ? PrivateRoute : PublicRoute;

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
