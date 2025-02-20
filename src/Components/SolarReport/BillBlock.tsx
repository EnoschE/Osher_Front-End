import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { SuccessIcon, LossIcon } from "../../Utils/icons";
import { WhiteBillBlock } from "./solarReportStyles";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

interface BillBlockProps {
	title?: string | ReactNode;
	isLoss?: boolean;
	bill?: number | string;
	mt?: number | string;
	mb?: number | string;
	hideIcon?: boolean;
	customUnit?: string;
}

const BillBlock = ({ title, isLoss = false, bill = 0, hideIcon, customUnit, ...rest }: BillBlockProps) => {
	const reducePaddingY = !bill && hideIcon;
	const colors = useSelector(selectColors);

	return (
		<WhiteBillBlock {...rest} style={{ border: `1px solid ${colors.border}`, paddingBlock: reducePaddingY ? 12 : 20 }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 10 }}>
				{!!title && <Typography fontWeight={600}>{title}</Typography>}
				{!hideIcon && <img alt="" src={isLoss ? LossIcon : SuccessIcon} width={47} />}
			</Box>
			<Box sx={{ display: "flex", alignItems: "center", gap: 10 }}>
				{!!bill && (
					<Typography variant="body2" color={`${isLoss ? "error" : "success"}.main`}>
						{!customUnit && "$"}
						{bill}
						{!!customUnit && customUnit}
					</Typography>
				)}
			</Box>
		</WhiteBillBlock>
	);
};

export default BillBlock;
