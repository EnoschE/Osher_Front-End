import { DashBorderedBox } from "./solarReportStyles";
import { Box, Typography } from "@mui/material";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import { formatNumber } from "../../Utils/utils";

interface ValueProp {
	value?: number;
	text?: string;
}

interface DashedBoxWithValuesProps {
	leftValue?: ValueProp;
	rightValue?: ValueProp;
	isWhiteBox?: boolean;
}

const DashedBoxWithValues = ({ leftValue, rightValue, isWhiteBox }: DashedBoxWithValuesProps) => {
	const colors = useSelector(selectColors);
	return (
		<DashBorderedBox
			sx={{
				border: `1px solid ${colors.border}`,
				...(isWhiteBox ? { bgcolor: "white", border: "none", justifyContent: "center" } : {}),
			}}
		>
			<Box display="flex" alignItems="center" flexDirection="column" gap={4}>
				<Typography variant="h6" fontWeight={600}>
					${formatNumber(leftValue?.value || 0)}
				</Typography>
				<Typography fontSize={12}>{leftValue?.text}</Typography>
			</Box>

			{!isWhiteBox && (
				<>
					<Box sx={{ flexGrow: 1, borderTop: `1px dashed ${colors.border}` }} />

					<Box display="flex" alignItems="center" flexDirection="column" gap={4}>
						<Typography variant="h6" fontWeight={600}>
							${formatNumber(rightValue?.value || 0)}
						</Typography>
						<Typography fontSize={12}>{rightValue?.text}</Typography>
					</Box>
				</>
			)}
		</DashBorderedBox>
	);
};

export default DashedBoxWithValues;
