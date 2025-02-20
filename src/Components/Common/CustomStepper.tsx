import * as React from "react";
import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import colors from "../../Utils/colors";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

const StyledStepperConnector = styled(StepConnector)(({ theme }) => ({
	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 16,
	},
	[`&.${stepConnectorClasses.active}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			backgroundColor: theme.palette.primary.main,
		},
	},
	[`&.${stepConnectorClasses.completed}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			backgroundColor: theme.palette.primary.main,
		},
	},
	[`& .${stepConnectorClasses.line}`]: {
		height: 4,
		border: 0,
		backgroundColor: colors.border,
		borderRadius: 1,
		width: "calc(100% + 20px)",
		marginLeft: -10,
	},
}));

const StyledStepperIcon = styled("div")<{
	ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
	backgroundColor: "white",
	border: `1px solid ${colors.border}`,
	zIndex: 1,
	color: colors.text,
	width: 38,
	height: 38,
	display: "flex",
	borderRadius: "50%",
	justifyContent: "center",
	alignItems: "center",
	"& svg": {
		width: 21,
		height: 21,
	},
	...(ownerState.active && {
		backgroundColor: theme.palette.primary.main,
		border: `1px solid ${colors.primary}`,
		color: "white",
	}),
	...(ownerState.completed && {
		backgroundColor: theme.palette.primary.main,
		border: `1px solid ${colors.primary}`,
		color: "white",
	}),
}));

interface Step {
	text: string;
	icon: React.ReactNode;
}

interface CustomStepperProps {
	steps?: Array<Step>;
	activeStep?: number;
}

const StepperIcon = (props: StepIconProps) => {
	const { active, completed, className } = props;

	return (
		<StyledStepperIcon ownerState={{ completed, active }} className={className}>
			{props.icon}
		</StyledStepperIcon>
	);
};

const CustomStepper = ({ steps, activeStep }: CustomStepperProps) => {
	return (
		<Stepper alternativeLabel activeStep={activeStep} connector={<StyledStepperConnector />}>
			{steps?.map((item) => (
				<Step key={item.text}>
					<StepLabel
						icon={item.icon}
						StepIconComponent={StepperIcon}
						sx={{
							"& .Mui-completed": {
								color: colors.primary,
							},
						}}
					>
						{item.text}
					</StepLabel>
				</Step>
			))}
		</Stepper>
	);
};

export default CustomStepper;
