import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import UpdatingBlock from "../UpdatingBlock";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getCADDesignByUserId, updateCADDesignStatus } from "../../../Services/cadDesignService";
import { allRoutes } from "../../../Routes/AllRoutes";
import { changeCurrentStep, getAppointmentByUserId } from "../../../Services/schedulingService";
import { allSteps } from "../UpdateStatus";
import { siteSurveyStatuses } from "./SiteSurvey";

const statusOptions = {
	TO_BE_REQUESTED: { value: "To be requested", text: "To be requested", disabled: true },
	REQUESTED: { value: "Requested", text: "Requested" },
	IN_PROGRESS: { value: "In progress", text: "In Progress" },
	COMPLETED: { value: "Completed", text: "Completed" },
};

const CADDesign = ({ id, sequentialId }: { id: string; sequentialId: string }) => {
	const navigate = useNavigate();

	const [data, setData] = useState<any>(null);
	const [status, setStatus] = useState<string>(statusOptions.TO_BE_REQUESTED.value);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		getCurrentStatus();
	}, []);

	const getCurrentStatus = async () => {
		setLoading(true);
		try {
			const { data } = await getCADDesignByUserId(id || "");
			const { data: siteSurvey } = await getAppointmentByUserId(id || "");

			setData({
				status: data?.status || statusOptions.TO_BE_REQUESTED.value,
				image: data?.image,
				isSiteSurveyScheduled: !!siteSurvey && siteSurvey?.status !== siteSurveyStatuses.TO_BE_SCHEDULED,
			});
			setStatus(data?.status || statusOptions.TO_BE_REQUESTED.value);
		} catch (error: any) {
			if (error === "No CAD Design found!") {
				setData({ status: statusOptions.TO_BE_REQUESTED.value });
				setStatus(statusOptions.TO_BE_REQUESTED.value);
			} else {
				toast.error(error);
			}
		}
		setLoading(false);
	};

	const handleSelectStatus = (value: string) => {
		setStatus(value);
	};

	const handleUpdateStatus = async (file?: File) => {
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("userId", id ?? "");
			formData.append("status", status);
			formData.append("stepFile", file ?? "");

			const { data: output } = await updateCADDesignStatus(formData);
			setData({ ...data, status: status, image: output?.image });

			toast.success("Status updated successfully!");
			// if (representativeId && !isRepresentativeLoggedIn()) {
			// 	navigate(allRoutes.VIEW_REPRESENTATIVE.replace(":id", representativeId || ""));
			// } else {
			// 	navigate(allRoutes.DASHBOARD);
			// }
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleChangeStep = async () => {
		setLoading(true);
		try {
			const payload = {
				status: data?.status,
				step: allSteps.CAD_DESIGN.text,
				userId: id,
			};
			await changeCurrentStep(payload);

			// setData({ status: status, image: data?.image });
			toast.success("Current step changed successfully!");
			navigate(allRoutes.VIEW_CUSTOMER?.replace(":id", sequentialId || ""));
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const displayStepButton = data?.status === statusOptions.TO_BE_REQUESTED.value || !data?.isSiteSurveyScheduled;

	const displayButton = status !== statusOptions.COMPLETED.value && status !== data?.status;

	return (
		<UpdatingBlock
			loading={loading}
			heading={
				<>
					Update the status of the{" "}
					<Typography variant="inherit" component="span" color="primary.main">
						CAD Design
					</Typography>
				</>
			}
			subHeading="Choose the current status of the CAD design using the dropdown menu."
			options={Object.values(statusOptions)}
			completionStatus={statusOptions.COMPLETED.value}
			dropdownLabel="CAD design status"
			status={status}
			onUpdatingStatus={handleSelectStatus}
			onImageUploading={handleUpdateStatus}
			displayContinueButton={displayButton}
			onContinue={handleUpdateStatus}
			uploadedImage={data?.image}
			onStepChange={handleChangeStep}
			disableStepButton={displayStepButton}
			stepButtonTooltip={!data?.isSiteSurveyScheduled ? "You need to schedule site survey first" : ""}
		/>
	);
};

export default CADDesign;
