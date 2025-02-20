import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import UpdatingBlock from "../UpdatingBlock";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getInstallationStatus, updateInstallationStatus } from "../../../Services/installationService";
import { allRoutes } from "../../../Routes/AllRoutes";
import { changeCurrentStep, getAppointmentByUserId } from "../../../Services/schedulingService";
import { allSteps } from "../UpdateStatus";
import { siteSurveyStatuses } from "./SiteSurvey";

export const installationStatuses = {
	TO_BE_SCHEDULED: { value: "To be scheduled", text: "To be scheduled", disabled: true },
	SCHEDULED: { value: "Scheduled", text: "Scheduled" },
	IN_PROGRESS: { value: "In progress", text: "In Progress" },
	COMPLETED: { value: "Completed", text: "Completed" },
};

const Installation = ({ id, sequentialId }: { id: string; sequentialId: string }) => {
	const navigate = useNavigate();

	const [data, setData] = useState<any>(null);
	const [status, setStatus] = useState<string>(installationStatuses.TO_BE_SCHEDULED.value);
	const [loading, setLoading] = useState<boolean>(false);
	const [disableDropdown, setDisableDropdown] = useState<boolean>(false);

	useEffect(() => {
		getCurrentStatus();
	}, []);

	const getCurrentStatus = async () => {
		setLoading(true);
		try {
			const { data } = await getInstallationStatus(id || "");
			const { data: siteSurvey } = await getAppointmentByUserId(id || "");

			if (data) {
				setData({
					status: data.status || installationStatuses.TO_BE_SCHEDULED.value,
					image: data.image,
					isSiteSurveyScheduled: !!siteSurvey && siteSurvey?.status !== siteSurveyStatuses.TO_BE_SCHEDULED,
				});
				setStatus(data.status);
				setDisableDropdown(false);
			} else {
				setData({
					status: installationStatuses.TO_BE_SCHEDULED.value,
					isSiteSurveyScheduled: siteSurvey?.status !== siteSurveyStatuses.TO_BE_SCHEDULED,
				});
				setStatus(installationStatuses.TO_BE_SCHEDULED.value);
				setDisableDropdown(true);
			}
		} catch (error: any) {
			if (error === "No installation request found!") {
				setData({ status: installationStatuses.TO_BE_SCHEDULED.value });
				setStatus(installationStatuses.TO_BE_SCHEDULED.value);
				// toast.error(error);
				setDisableDropdown(true);
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

			const { data: output } = await updateInstallationStatus(formData);
			setData({ ...data, status: status, image: output?.image });

			toast.success("Status updated successfully!");
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
				step: allSteps.INSTALLATION.text,
				userId: id,
			};
			await changeCurrentStep(payload);

			toast.success("Current step changed successfully!");
			navigate(allRoutes.VIEW_CUSTOMER?.replace(":id", sequentialId || ""));
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const displayStepButton = data?.status === installationStatuses.TO_BE_SCHEDULED.value || !data?.isSiteSurveyScheduled;

	const displayButton = status !== installationStatuses.COMPLETED.value && status !== data?.status;

	return (
		<UpdatingBlock
			loading={loading}
			heading={
				<>
					Update the status of the{" "}
					<Typography variant="inherit" component="span" color="primary.main">
						installation
					</Typography>
				</>
			}
			subHeading="Choose the current status of the installation using the dropdown menu."
			options={Object.values(installationStatuses)}
			completionStatus={installationStatuses.COMPLETED.value}
			dropdownLabel="Installation status"
			status={status}
			onUpdatingStatus={handleSelectStatus}
			onImageUploading={handleUpdateStatus}
			displayContinueButton={displayButton}
			onContinue={handleUpdateStatus}
			uploadedImage={data?.image}
			disableDropdown={disableDropdown}
			dropdownTooltip="This dropdown will be enabled after the customer schedules the installation"
			onStepChange={handleChangeStep}
			disableStepButton={displayStepButton}
			stepButtonTooltip={!data?.isSiteSurveyScheduled ? "You need to schedule site survey first" : ""}
		/>
	);
};

export default Installation;
