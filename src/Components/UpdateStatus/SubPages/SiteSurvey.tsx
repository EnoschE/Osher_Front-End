import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import UpdatingBlock from "../UpdatingBlock";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { changeCurrentStep, getAppointmentByUserId, updateSiteSurveyStatus } from "../../../Services/schedulingService";
import { allRoutes } from "../../../Routes/AllRoutes";
import { allSteps } from "../UpdateStatus";

export const siteSurveyStatuses = {
	TO_BE_SCHEDULED: { value: "To be scheduled", text: "To be scheduled", disabled: true },
	SCHEDULED: { value: "Scheduled", text: "Scheduled" },
	IN_PROGRESS: { value: "In progress", text: "In Progress" },
	COMPLETED: { value: "Completed", text: "Completed" },
};

const SiteSurvey = ({ id, sequentialId }: { id: string; sequentialId: string }) => {
	const navigate = useNavigate();

	const [data, setData] = useState<any>(null);
	const [status, setStatus] = useState<string>(siteSurveyStatuses.TO_BE_SCHEDULED.value);
	const [loading, setLoading] = useState<boolean>(false);
	const [disableDropdown, setDisableDropdown] = useState<boolean>(false);

	useEffect(() => {
		getCurrentStatus();
	}, []);

	const getCurrentStatus = async () => {
		setLoading(true);
		try {
			const { data } = await getAppointmentByUserId(id || "");
			if (data) {
				setData({ status: data.status || siteSurveyStatuses.TO_BE_SCHEDULED.value, image: data.image });
				setStatus(data.status);
			} else {
				setData({ status: siteSurveyStatuses.TO_BE_SCHEDULED.value });
				setStatus(siteSurveyStatuses.TO_BE_SCHEDULED.value);
				setDisableDropdown(true);
			}
		} catch (error: any) {
			toast.error(error);
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

			const { data } = await updateSiteSurveyStatus(formData);
			setData({ status: status, image: data?.image });

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
				step: allSteps.SITE_SURVEY.text,
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

	const displayStepButton = data?.status === siteSurveyStatuses.TO_BE_SCHEDULED.value;
	const displayButton = status !== siteSurveyStatuses.COMPLETED.value && status !== data?.status;

	return (
		<UpdatingBlock
			loading={loading}
			heading={
				<>
					Update the status of the{" "}
					<Typography variant="inherit" component="span" color="primary.main">
						site survey
					</Typography>
				</>
			}
			subHeading="Choose the current status of the site survey using the dropdown menu."
			options={Object.values(siteSurveyStatuses)}
			completionStatus={siteSurveyStatuses.COMPLETED.value}
			dropdownLabel="Site survey status"
			status={status}
			onUpdatingStatus={handleSelectStatus}
			onImageUploading={handleUpdateStatus}
			displayContinueButton={displayButton}
			onContinue={handleUpdateStatus}
			uploadedImage={data?.image}
			disableDropdown={disableDropdown}
			dropdownTooltip="This dropdown will be enabled after the customer schedules the site survey"
			onStepChange={handleChangeStep}
			disableStepButton={displayStepButton}
			// stepButtonTooltip={"You need to schedule site survey first!"}
		/>
	);
};

export default SiteSurvey;
