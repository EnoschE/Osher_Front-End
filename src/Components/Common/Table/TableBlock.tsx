import { Box, Tooltip, Typography } from "@mui/material";
import CustomTable from "./CustomTable";
import PlaceholderForEmptyTable from "./PlaceholderForEmptyTable";
import CustomTextField from "../CustomTextField";
import { Add, SearchOutlined } from "@mui/icons-material";
import CustomButton from "../CustomButton";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllInstallerCompanies } from "../../../Services/dashboardService";
import { toast } from "react-toastify";
import CustomDropdown from "../CustomDropdown";

export const TableBlock = ({
	heading,
	subHeading,
	addButtonText,
	addButtonPath,
	addButtonClick,
	emptyStateMessage,
	addButtonState,
	detailsPagePath,
	rowsPerPage=10,
	tableData,
	tableHeaders,
	disabledAddButton,
	addButtonTooltip,
	filterByCompany = false,
	onRowClick

}: {
	heading: string;
	subHeading: string;
	addButtonText?: string;
	addButtonPath?: string;
	addButtonClick?: () => void;
	emptyStateMessage?: string;
	addButtonState?: any;
	disabledAddButton?: boolean;
	addButtonTooltip?: string;
	detailsPagePath?: string;
	rowsPerPage?: number;
	tableData?: Array<any>;
	tableHeaders: Array<any>;
	filterByCompany?: boolean;
	onRowClick? : (row : any)=>void;

}) => {
	const navigate = useNavigate();

	const [search, setSearch] = useState<string>("");
	const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
	const [allCompanies, setAllCompanies] = useState<Array<any>>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (filterByCompany) {
			getAllInstallerCompaniesData();
		}
	}, [filterByCompany]);

	const getAllInstallerCompaniesData = async () => {
		setLoading(true);
		try {
			let { data }: any = await getAllInstallerCompanies();
			data = data.map((item: any) => ({ ...item, value: item._id, text: item.name }));
			setAllCompanies(data);
			setSelectedId("");
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};
	const handleDropdown = (value: string) => {
		setSelectedId(value);
	};

	let searchedTableData = search
		? tableData?.filter(
				(item) =>
					item._id?.toString()?.includes(search?.toLowerCase()) ||
					item.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
					item.address?.toLowerCase()?.includes(search?.toLowerCase()) ||
					item.currentStep?.toLowerCase()?.includes(search?.toLowerCase()) ||
					item.status?.toLowerCase()?.includes(search?.toLowerCase()) ||
					item.log?.toLowerCase()?.includes(search?.toLowerCase()) ||
					item.company?.toLowerCase()?.includes(search?.toLowerCase()) ||
					item.timeStamp?.toLowerCase()?.includes(search?.toLowerCase()) ||
					item.email?.toLowerCase()?.includes(search?.toLowerCase()), // TODO: in future, change this logic to dynamic and add all tableHeaders here
		  )
		: tableData;

	if (selectedId && searchedTableData && filterByCompany) {
		searchedTableData = searchedTableData.filter((item) => item.companyId === selectedId);
	}

	return (
		<>
			<Typography variant="h4" mb={8}>
				{heading} {tableData?.length ? `(${searchedTableData?.length})` : ""}
			</Typography>
			<Box
				display="flex"
				alignItems={{ xs: "stretch", md: "center" }}
				justifyContent="space-between"
				flexDirection={{ xs: "column", md: "row" }}
				gap={12}
				mb={32}
			>
				<Typography fontSize={16}>{subHeading}</Typography>
				<Box
					display="flex"
					alignItems={{ xs: "stretch", md: "center" }}
					justifyContent="flex-end"
					gap={12}
					flexDirection={{ xs: "column", md: "row" }}
				>
					{!!tableData?.length && (
						<>
							{filterByCompany && (
								<CustomDropdown
									options={allCompanies}
									value={selectedId}
									onChange={handleDropdown}
									minWidth="220px"
									label="Filter by Company"
									defaultSelectable={true}
									disabled={loading}
								/>
							)}
							<CustomTextField
								value={search}
								onChange={handleOnChange}
								placeholder="Search here"
								startIcon={<SearchOutlined sx={{ opacity: 0.7 }} />}
							/>
						</>
					)}
					{addButtonText && (
						<Tooltip title={addButtonTooltip} arrow>
							<span>
								<CustomButton
									sx={{ height: 40.13, minWidth: "max-content" }}
									startIcon={<Add />}
									onClick={() => addButtonClick?.() || navigate(addButtonPath || "", { state: addButtonState })}
									disabled={disabledAddButton}
								>
									{addButtonText}
								</CustomButton>
							</span>
						</Tooltip>
					)}
				</Box>
			</Box>

			{tableData?.length ? (
				<CustomTable
					headers={tableHeaders}
					rows={searchedTableData}
					detailsPagePath={detailsPagePath}
					rowsPerPage={rowsPerPage}
					onRowClick={onRowClick}

				/>
			) : (
				<PlaceholderForEmptyTable message={emptyStateMessage} />
			)}
		</>
	);
};

export default TableBlock;
