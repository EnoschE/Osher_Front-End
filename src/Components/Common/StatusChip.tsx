import { Chip } from "@mui/material";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { Done, ErrorOutlineOutlined } from "@mui/icons-material";

interface StatusChipProps {
	status?: string;
}

const StatusChip = ({ status }: StatusChipProps) => {
	const colors = useSelector(selectColors);

	const chipStatuses = {
		IN_PROGRESS: {
			text: "In Progress",
			values: ["Pending", "In progress"],
			icon: ErrorOutlineOutlined,
			bgColor: colors.primaryExtraLight,
			color: colors.primary,
		},
		COMPLETED: {
			text: "Completed",
			values: ["Completed", "Accepted"],
			icon: Done,
			bgColor: colors.successBg,
			color: colors.success,
		},
	};

	const currentStatus =
		Object.values(chipStatuses)?.find((item) => item.values?.includes(status || "")) || chipStatuses.IN_PROGRESS;

	return (
		<Chip
			label={status}
			icon={<currentStatus.icon />}
			sx={{
				backgroundColor: currentStatus.bgColor,
				color: currentStatus.color,
				"& svg": {
					path: {
						fill: currentStatus.color,
					},
				},
			}}
		/>
	);
};

export default StatusChip;
