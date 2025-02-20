import { Box, Typography } from "@mui/material";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { borderRadius } from "../../Utils/spacings";
import { formatNumber } from "../../Utils/utils";

interface BarWithValueProps {
	height?: string | number;
	value?: number | string;
	isSolar?: boolean;
	subtext?: string;
}

const BarWithValue = ({ height = 235, value = 0, subtext, isSolar }: BarWithValueProps) => {
	const colors = useSelector(selectColors);
	return (
		<Box display="flex" alignItems="center" flexDirection="column">
			<Box
				sx={{
					width: 97,
					height,
					backgroundColor: isSolar ? colors.primary : colors.gray,
					borderTopLeftRadius: borderRadius.sm,
					borderTopRightRadius: borderRadius.sm,
				}}
			/>
			<Typography variant="h5" fontSize={18} mt={8} mb={4} color={isSolar ? "primary" : "auto"}>
				${formatNumber(value)}
			</Typography>
			<Typography fontSize={12} color={isSolar ? "primary" : "auto"}>
				{subtext}
			</Typography>
		</Box>
	);
};

export default BarWithValue;
