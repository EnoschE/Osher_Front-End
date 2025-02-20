import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import UpdatingBlock from "../UpdatingBlock";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getTowInspectionStatus, updateTowInspectionStatus } from "../../../Services/townInspectionService";
import { allRoutes } from "../../../Routes/AllRoutes";
import { allSteps } from "../UpdateStatus";
import { changeCurrentStep, getAppointmentByUserId } from "../../../Services/schedulingService";
import { siteSurveyStatuses } from "./SiteSurvey";
import { getInstallationStatus } from "../../../Services/installationService";
import { installationStatuses } from "./Installation";

const statusOptions = {
	TO_BE_REQUESTED: { value: "To be requested", text: "To be requested", disabled: true },
	REQUESTED: { value: "Requested", text: "Requested" },
	IN_PROGRESS: { value: "Pending", text: "Pending" },
	IN_REVIEW: { value: "In progress", text: "In Progress" },
	COMPLETED: { value: "Accepted", text: "Accepted" },
};

const TownInspection = ({ id, sequentialId }: { id: string; sequentialId: string }) => {
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
			const { data } = await getTowInspectionStatus(id || "");
			const [{ data: siteSurvey }, { data: installation }] = await Promise.all([
				getAppointmentByUserId(id || ""),
				getInstallationStatus(id || ""),
			]);
			setData({
				status: data?.status || statusOptions.TO_BE_REQUESTED.value,
				image: data?.image,
				isSiteSurveyScheduled: !!siteSurvey && siteSurvey?.status !== siteSurveyStatuses.TO_BE_SCHEDULED,
				isInstallationScheduled: !!installation && installation?.status !== installationStatuses.TO_BE_SCHEDULED,
			});
			setStatus(data?.status || statusOptions.TO_BE_REQUESTED.value);
		} catch (error: any) {
			if (error === "No town inspection request found!") {
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

			const { data: output } = await updateTowInspectionStatus(formData);
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
				step: allSteps.TOWN_INSPECTION.text,
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

	console.log("DAATA", data);
	const disableStepButton =
		data?.status === statusOptions.TO_BE_REQUESTED.value ||
		!data?.isSiteSurveyScheduled ||
		!data?.isInstallationScheduled;

	const displayButton = status !== statusOptions.COMPLETED.value && status !== data?.status;

	return (
		<UpdatingBlock
			loading={loading}
			heading={
				<>
					Update the status of the{" "}
					<Typography variant="inherit" component="span" color="primary.main">
						town inspection
					</Typography>
				</>
			}
			subHeading="Choose the current status of the town inspection using the dropdown menu."
			options={Object.values(statusOptions)}
			completionStatus={statusOptions.COMPLETED.value}
			dropdownLabel="Town inspection status"
			status={status}
			onUpdatingStatus={handleSelectStatus}
			onImageUploading={handleUpdateStatus}
			displayContinueButton={displayButton}
			onContinue={handleUpdateStatus}
			uploadedImage={data?.image}
			onStepChange={handleChangeStep}
			disableStepButton={disableStepButton}
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

export default TownInspection;
