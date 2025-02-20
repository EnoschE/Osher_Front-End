import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import UpdatingBlock from "../UpdatingBlock";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getInterconnectionStatus, updateInterconnectionStatus } from "../../../Services/interconnectionService";
import { allRoutes } from "../../../Routes/AllRoutes";
import { allSteps } from "../UpdateStatus";
import { changeCurrentStep, getAppointmentByUserId } from "../../../Services/schedulingService";
import { siteSurveyStatuses } from "./SiteSurvey";

const statusOptions = {
	TO_BE_REQUESTED: { value: "To be requested", text: "To be requested", disabled: true },
	PENDING: { value: "Pending", text: "Pending" },
	REQUESTED: { value: "Requested", text: "Requested" },
	IN_REVIEW: { value: "In review", text: "In review" },
	ACCEPTED: { value: "Accepted", text: "Accepted" },
};

const UtilityInterconnection = ({ id, sequentialId }: { id: string; sequentialId: string }) => {
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
			const { data } = await getInterconnectionStatus(id || "");
			const { data: siteSurvey } = await getAppointmentByUserId(id || "");

			setData({
				status: data?.status || statusOptions.TO_BE_REQUESTED.value,
				image: data?.image,
				isSiteSurveyScheduled: !!siteSurvey && siteSurvey?.status !== siteSurveyStatuses.TO_BE_SCHEDULED,
			});
			setStatus(data?.status || statusOptions.TO_BE_REQUESTED.value);
		} catch (error: any) {
			if (error === "No Interconnection request found!") {
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

			const { data: output } = await updateInterconnectionStatus(formData);
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
				step: allSteps.UTILITY_INTERCONNECTION.text,
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

	const displayStepButton = data?.status === statusOptions.TO_BE_REQUESTED.value || !data?.isSiteSurveyScheduled;

	const displayButton = status !== statusOptions.ACCEPTED.value && status !== data?.status;

	return (
		<UpdatingBlock
			loading={loading}
			heading={
				<>
					Update the status of the{" "}
					<Typography variant="inherit" component="span" color="primary.main">
						utility interconnection
					</Typography>
				</>
			}
			subHeading="Choose the current status of the utility interconnection using the dropdown menu."
			options={Object.values(statusOptions)}
			completionStatus={statusOptions.ACCEPTED.value}
			dropdownLabel="Utility interconnection status"
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

export default UtilityInterconnection;
