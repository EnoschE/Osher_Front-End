import { Theme, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { ReactNode } from "react";
import CustomDropdown from "../Common/CustomDropdown";
import { StatusUpdatingBox } from "./updateStatusStyles";
import ImageUploading from "./ImageUploading";
import CustomButton from "../Common/CustomButton";
import Loader from "../Common/Loader";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

interface UpdatingBlockProps {
	heading: ReactNode | string;
	subHeading?: ReactNode | string;
	dropdownLabel?: string;
	status?: string;
	onUpdatingStatus?: (status: string) => void;
	onImageUploading?: (file?: File) => void;
	options?: Array<{ value: string; text: string }>;
	completionStatus?: string;
	stepButtonTooltip?: string;
	displayContinueButton?: boolean;
	loading?: boolean;
	disableDropdown?: boolean;
	disableStepButton?: boolean;
	uploadedImage?: string;
	dropdownTooltip?: string;
	onContinue?: () => void;
	onStepChange?: () => void;
}

const UpdatingBlock = ({
	heading,
	subHeading,
	status,
	onUpdatingStatus,
	options,
	dropdownLabel,
	completionStatus,
	onImageUploading,
	displayContinueButton,
	onContinue,
	onStepChange,
	loading,
	uploadedImage,
	disableDropdown,
	disableStepButton,
	stepButtonTooltip,
	dropdownTooltip,
}: UpdatingBlockProps) => {
	const colors = useSelector(selectColors);
	const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

	const handleSelectStatus = (value: string) => {
		onUpdatingStatus?.(value);
	};

	return (
		<>
			<Loader open={loading} />
			<StatusUpdatingBox sx={{ backgroundColor: colors.lightGray }}>
				<Typography variant="h2" textAlign="center" fontSize={isSmallScreen ? 24 : 40}>
					{heading}
				</Typography>
				<Typography fontSize={isSmallScreen ? 14 : 18} maxWidth={430} textAlign="center" mb={16}>
					{subHeading}
				</Typography>

				<Tooltip arrow placement="top" title={disableDropdown ? dropdownTooltip : ""}>
					<span>
						<CustomDropdown
							disabled={disableDropdown}
							isLargeDropdown
							label={dropdownLabel}
							options={options}
							value={status}
							onChange={handleSelectStatus}
						/>
					</span>
				</Tooltip>
				{displayContinueButton && !loading && (
					<CustomButton sx={{ width: { xs: "100%", sm: 560 } }} onClick={onContinue}>
						Update Status
					</CustomButton>
				)}

				{status === completionStatus && (
					<ImageUploading onImageUploading={onImageUploading} uploadedImage={uploadedImage} />
				)}

				<Tooltip arrow title={disableStepButton ? stepButtonTooltip : ""}>
					<span>
						<CustomButton sx={{ width: { xs: "100%", sm: 560 } }} onClick={onStepChange} disabled={disableStepButton}>
							Make it current step
						</CustomButton>
					</span>
				</Tooltip>
			</StatusUpdatingBox>
		</>
	);
};

export default UpdatingBlock;
