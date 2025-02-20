// import { Typography } from "@mui/material";
// import { useEffect, useState } from "react";
// import UpdatingBlock from "../UpdatingBlock";
// import { toast } from "react-toastify";
// import { getMeterReplacementStatus, updateMeterReplacementStatus } from "../../../Services/meterReplacementService";
// import { useNavigate, useParams } from "react-router-dom";
// import { allRoutes } from "../../../Routes/AllRoutes";

// const statusOptions = {
// 	TO_BE_REQUESTED: { value: "To be requested", text: "To be requested", disabled: true },
// 	REQUESTED: { value: "Requested", text: "Requested" },
// 	PENDING: { value: "Pending", text: "Pending" },
// 	SCHEDULED: { value: "Scheduled", text: "Scheduled" },
// 	IN_PROGRESS: { value: "In progress", text: "In progress" },
// 	COMPLETED: { value: "Completed", text: "Completed" },
// };

// const MeterReplacement = () => {
// 	const { id } = useParams();
// 	const navigate = useNavigate();

// 	const [data, setData] = useState<any>(null);
// 	const [status, setStatus] = useState<string>(statusOptions.TO_BE_REQUESTED.value);
// 	const [loading, setLoading] = useState<boolean>(false);

// 	useEffect(() => {
// 		getCurrentStatus();
// 	}, []);

// 	const getCurrentStatus = async () => {
// 		setLoading(true);
// 		try {
// 			const { data } = await getMeterReplacementStatus(id || "");

// 			setData({ status: data.status || statusOptions.TO_BE_REQUESTED.value, image: data.image });
// 			setStatus(data.status);

// 		} catch (error: any) {
// 			if (error === "No meter replacement request found!") {
// 				setData({ status: statusOptions.TO_BE_REQUESTED.value });
// 				setStatus(statusOptions.TO_BE_REQUESTED.value);
// 			} else {
// 				toast.error(error);
// 			}
// 		}
// 		setLoading(false);
// 	};

// 	const handleSelectStatus = (value: string) => {
// 		setStatus(value);
// 	};

// 	const handleUpdateStatus = async (file?: File) => {
// 		setLoading(true);
// 		try {
// 			const formData = new FormData();
// 			formData.append("userId", id ?? "");
// 			formData.append("status", status);
// 			formData.append("stepFile", file ?? "");

// 			const { data } = await updateMeterReplacementStatus(formData);
// 			setData({ status: status, image: data?.image });
// 			navigate(allRoutes.VIEW_CUSTOMER?.replace(":id", id || ""));
// 			toast.success("Status updated successfully!");
// 		} catch (error: any) {
// 			toast.error(error);
// 		}
// 		setLoading(false);
// 	};

// 	const displayButton = status !== statusOptions.COMPLETED.value && status !== data?.status;

// 	return (
// 		<UpdatingBlock
// 			loading={loading}
// 			heading={
// 				<>
// 					Update the status of{" "}
// 					<Typography variant="inherit" component="span" color="primary.main">
// 						meter replacement
// 					</Typography>
// 				</>
// 			}
// 			subHeading="Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document"
// 			options={Object.values(statusOptions)}
// 			completionStatus={statusOptions.COMPLETED.value}
// 			dropdownLabel="Meter replacement status"
// 			status={status}
// 			onUpdatingStatus={handleSelectStatus}
// 			onImageUploading={handleUpdateStatus}
// 			displayContinueButton={displayButton}
// 			onContinue={handleUpdateStatus}
// 			uploadedImage={data?.image}
// 		/>
// 	);
// };

// export default MeterReplacement;

import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import UpdatingBlock from "../UpdatingBlock";
import { toast } from "react-toastify";
import { getMeterReplacementStatus, updateMeterReplacementStatus } from "../../../Services/meterReplacementService";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../../Routes/AllRoutes";
import { allSteps } from "../UpdateStatus";
import { changeCurrentStep, getAppointmentByUserId } from "../../../Services/schedulingService";
import { getInstallationStatus } from "../../../Services/installationService";
import { siteSurveyStatuses } from "./SiteSurvey";
import { installationStatuses } from "./Installation";

const statusOptions = {
	TO_BE_REQUESTED: { value: "To be requested", text: "To be requested", disabled: true },
	REQUESTED: { value: "Requested", text: "Requested" },
	PENDING: { value: "Pending", text: "Pending" },
	SCHEDULED: { value: "Scheduled", text: "Scheduled" },
	IN_PROGRESS: { value: "In progress", text: "In progress" },
	COMPLETED: { value: "Completed", text: "Completed" },
};

const MeterReplacement = ({ id, sequentialId }: { id: string; sequentialId: string }) => {
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
			const { data } = await getMeterReplacementStatus(id || "");
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
			if (error === "No meter replacement request found!") {
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

			const { data: output } = await updateMeterReplacementStatus(formData);
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
				step: allSteps.METER_REPLACEMENT.text,
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
						meter replacement
					</Typography>
				</>
			}
			subHeading="Choose the current status of the meter replacement using the dropdown menu."
			options={Object.values(statusOptions)}
			completionStatus={statusOptions.COMPLETED.value}
			dropdownLabel="Meter replacement status"
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

export default MeterReplacement;
