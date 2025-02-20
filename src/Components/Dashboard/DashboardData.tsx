import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import CustomTable from "../Common/Table/CustomTable";
import { toast } from "react-toastify";
import { useSelector } from "../../Redux/reduxHooks";
import { selectUser } from "../../Redux/Slices/userSlice";
import { allRoutes } from "../../Routes/AllRoutes";
import { getDashboardData } from "../../Services/dashboardService";
import { customerTableHeaders } from "../Installers/Representatives/RepresentativeDetails";
import FunnelDiagram from "./FunnelDiagram";
import { getFunnelData } from "../../Services/installersService";
import { roles } from "../../Utils/tokenKeyValue";
import DashboardCard from "./DashboardCard";
import FiltersPopover, { FunnelFiltersState, funnelUnits } from "./FiltersPopover";
import { formatDatesForDisplay } from "../Common/CustomDateRangePicker";

const tableHeaders = customerTableHeaders.filter((item) => !["Date", "Address", "Report"].includes(item.text));

const DashboardData = ({
	loading,
	setLoading,
	funnelName,
	id,
	role,
}: {
	loading: boolean;
	setLoading: (bool: boolean) => void;
	funnelName: string;
	id?: string;
	role?: string;
}) => {
	const user = useSelector(selectUser);
	const loaderDone = useRef<boolean>(false);

	const [data, setData] = useState<any>({ recentlyJoined: [] });
	const [funnelData, setFunnelData] = useState<any>(null);
	const [filters, setFilters] = useState<FunnelFiltersState>({
		timeFilter: "",
		minDate: "",
		maxDate: "",
		unit: "",
	});

	useEffect(() => {
		getAllUsers();
	}, [filters]);

	const getAllUsers = async () => {
		setLoading(!loaderDone.current);

		try {
			if (!id) {
				const { data } = await getDashboardData();
				setData({ recentlyJoined: data.recentlyJoined || [] });
			}

			const { data: apiFunnelData } = await getFunnelData(id, filters);
			setFunnelData(apiFunnelData);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
		loaderDone.current = true;
	};

	const displayFilters = [roles.SUPER_ADMIN, roles.ADMIN_MANGER, roles.DIRECTOR, roles.PSL].includes(role ?? "") || !id;

	return (
		<Box display="flex" flexDirection="column" gap={16}>
			{!loading && user.id && (
				<>
					{displayFilters && (
						<DashboardCard delay={0.025} disableHoverEffect>
							<Box display="flex" alignItems="center" justifyContent="space-between">
								<Typography>
									{filters.timeFilter || (filters.minDate && filters.maxDate) ? (
										<>
											Filter by:{" "}
											<b>
												{filters.minDate && filters.maxDate
													? formatDatesForDisplay(filters.minDate, filters.maxDate)
													: filters.timeFilter}
											</b>
										</>
									) : (
										""
									)}
									{filters.unit ? (
										<>
											{filters.timeFilter || (filters.minDate && filters.maxDate) ? ", " : ""}
											Unit:{" "}
											<b>
												{filters.unit === funnelUnits.ACCOUNTS
													? "No. of Accounts"
													: filters.unit === funnelUnits.CONVERSION_RATE
													? "Conversion Rate"
													: filters.unit}
											</b>
										</>
									) : (
										""
									)}
								</Typography>
								<FiltersPopover filters={filters} updateFilters={(updated) => setFilters(updated)} />
							</Box>
						</DashboardCard>
					)}
					{funnelData && (
						<DashboardCard delay={0.05} disableHoverEffect>
							<FunnelDiagram data={funnelData} funnelName={funnelName || ""} installerId={id} filters={filters} />
						</DashboardCard>
					)}
					{!id && (
						<DashboardCard delay={0.1} disableHoverEffect>
							<Typography variant="h5">Aging Customers</Typography>
							<CustomTable
								headers={tableHeaders}
								rows={data.recentlyJoined}
								hidePagination
								extraPaddingInParent={24}
								detailsPagePath={allRoutes.VIEW_CUSTOMER}
							/>
						</DashboardCard>
					)}
				</>
			)}
		</Box>
	);
};

export default DashboardData;
