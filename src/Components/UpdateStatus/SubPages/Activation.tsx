import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import UpdatingBlock from "../UpdatingBlock";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getActivationStatus, updateActivationStatus } from "../../../Services/activationService";
import { allRoutes } from "../../../Routes/AllRoutes";
import { changeCurrentStep, getAppointmentByUserId } from "../../../Services/schedulingService";
import { allSteps } from "../UpdateStatus";
import { getInstallationStatus } from "../../../Services/installationService";
import { siteSurveyStatuses } from "./SiteSurvey";
import { installationStatuses } from "./Installation";

const statusOptions = {
	NOT_ACTIVE: { value: "Not active", text: "Not active", disabled: true },
	ACTIVE: { value: "Active", text: "Active" },
};

const Activation = ({ id, sequentialId }: { id: string; sequentialId: string }) => {
	const navigate = useNavigate();

	const [data, setData] = useState<any>(null);
	const [status, setStatus] = useState<string>(statusOptions.NOT_ACTIVE.value);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		getCurrentStatus();
	}, []);

	const getCurrentStatus = async () => {
		setLoading(true);
		try {
			const { data } = await getActivationStatus(id || "");
			const [{ data: siteSurvey }, { data: installation }] = await Promise.all([
				getAppointmentByUserId(id || ""),
				getInstallationStatus(id || ""),
			]);

			setData({
				status: data?.status || statusOptions.NOT_ACTIVE.value,
				image: data?.image,
				isSiteSurveyScheduled: !!siteSurvey && siteSurvey?.status !== siteSurveyStatuses.TO_BE_SCHEDULED,
				isInstallationScheduled: !!installation && installation?.status !== installationStatuses.TO_BE_SCHEDULED,
			});
			setStatus(data?.status || statusOptions.NOT_ACTIVE.value);
		} catch (error: any) {
			if (error === "No activation request found!") {
				setData({ status: statusOptions.NOT_ACTIVE.value });
				setStatus(statusOptions.NOT_ACTIVE.value);
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

			const { data: output } = await updateActivationStatus(formData);
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
				step: allSteps.ACTIVATION.text,
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

	const displayStepButton =
		data?.status === statusOptions.NOT_ACTIVE.value || !data?.isSiteSurveyScheduled || !data?.isInstallationScheduled;

	// const displayButton = status !== statusOptions.COMPLETED.value && status !== data?.status;
	const displayButton = status !== data?.status;

	return (
		<UpdatingBlock
			loading={loading}
			heading={
				<>
					Update the status of the{" "}
					<Typography variant="inherit" component="span" color="primary.main">
						activation
					</Typography>
				</>
			}
			subHeading="Choose the current status of the activation using the dropdown menu."
			options={Object.values(statusOptions)}
			// completionStatus={statusOptions.COMPLETED.value}
			dropdownLabel="Activation status"
			status={status}
			onUpdatingStatus={handleSelectStatus}
			onImageUploading={handleUpdateStatus}
			displayContinueButton={displayButton}
			onContinue={handleUpdateStatus}
			uploadedImage={data?.image}
			onStepChange={handleChangeStep}
			disableStepButton={displayStepButton}
			stepButtonTooltip={
				!data?.isSiteSurveyScheduled
					? "You need to schedule site survey first"
					: !data.isInstallationScheduled
					? "You need to schedule installation first"
					: ""
			}
		/>
	);
};

export default Activation;
