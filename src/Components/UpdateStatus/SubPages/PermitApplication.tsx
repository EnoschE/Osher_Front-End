import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import UpdatingBlock from "../UpdatingBlock";
import { toast } from "react-toastify";
import { getPermitStatus, updatePermitStatus } from "../../../Services/permitService";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../../Routes/AllRoutes";
import { changeCurrentStep, getAppointmentByUserId } from "../../../Services/schedulingService";
import { allSteps } from "../UpdateStatus";
import { siteSurveyStatuses } from "./SiteSurvey";

const statusOptions = {
	TO_BE_REQUESTED: { value: "To be requested", text: "To be requested", disabled: true },
	PENDING: { value: "Pending", text: "Pending" },
	SUBMITTED: { value: "Submitted", text: "Submitted" },
	IN_REVIEW: { value: "In review", text: "In review" },
	ACCEPTED: { value: "Accepted", text: "Accepted" },
};

const PermitApplication = ({ id, sequentialId }: { id: string; sequentialId: string }) => {
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
			const { data } = await getPermitStatus(id || "");
			const { data: siteSurvey } = await getAppointmentByUserId(id || "");

			setData({
				status: data?.status || statusOptions.TO_BE_REQUESTED.value,
				image: data?.image,
				isSiteSurveyScheduled: !!siteSurvey && siteSurvey?.status !== siteSurveyStatuses.TO_BE_SCHEDULED,
			});
			setStatus(data?.status || statusOptions.TO_BE_REQUESTED.value);
		} catch (error: any) {
			if (error === "No Permit found!") {
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

			const { data: output } = await updatePermitStatus(formData);
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
				step: allSteps.PERMIT_APPLICATION.text,
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
						permit application
					</Typography>
				</>
			}
			subHeading="Choose the current status of the permit application using the dropdown menu."
			options={Object.values(statusOptions)}
			completionStatus={statusOptions.ACCEPTED.value}
			dropdownLabel="Permit application status"
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

export default PermitApplication;
