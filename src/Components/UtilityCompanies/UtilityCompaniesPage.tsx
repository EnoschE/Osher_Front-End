import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import TableBlock from "../Common/Table/TableBlock";
import { getAllUtilityCompanies } from "../../Services/utilityCompaniesService";
import CustomTableOptions from "../Common/CustomTableOptions";
import { allRoutes } from "../../Routes/AllRoutes";
import { UtilityCompany } from "./EditUtilityCompany";

const UtilityCompaniesPage = () => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<any>();

	useEffect(() => {
		getAllUsers();
	}, []);

	const getAllUsers = async () => {
		setLoading(true);
		try {
			const {
				data: { allUtilityCompanies },
			} = await getAllUtilityCompanies();

			console.log({ allUtilityCompanies });
			setData(allUtilityCompanies);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const tableHeaders = [
		{ text: "Name", key: "name", sortable: true },
		{ text: "Utility Rate", key: "utilityRate", sortable: true },
		{
			text: "",
			key: "",
			align: "right",
			notClickable: true,
			customComponent: (props: any) => (
				<CustomTableOptions
					menuOptions={[
						{
							text: "Edit Company",
							onClick: () => navigate(allRoutes.EDIT_UTILITY_COMPANY.replace(":id", props.fullObject.sequentialId)),
						},
					]}
				/>
			),
		},
	];

	return (
		<PageLayout loading={loading} hideBackButton>
			<TableBlock
				heading="Utility Companies"
				subHeading="These are all the utility companies listed:"
				tableData={data}
				addButtonText="Add Utility Company"
				addButtonPath={allRoutes.ADD_UTILITY_COMPANY}
				detailsPagePath={allRoutes.VIEW_UTILITY_COMPANY}
				tableHeaders={tableHeaders}
				emptyStateMessage="There are no utility companies present. Please add an utility company"
				rowsPerPage={10}
			/>
		</PageLayout>
	);
};

export default UtilityCompaniesPage;
