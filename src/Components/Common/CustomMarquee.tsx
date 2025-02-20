import { Box, SxProps, Typography, keyframes } from "@mui/material";
import colors from "../../Utils/colors";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

import { borderRadius } from "../../Utils/spacings";

const movingForward = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const CustomMarquee = ({ text = "Customer", sx }: { text: string; sx?: SxProps }) => {
	return (
		<Box
			className="text-wrapper"
			sx={{
				...sx,
				display: "flex",
				justifyContent: "flex-start",
				overflow: "hidden",
				backgroundColor: colors.lightGray,
				maxWidth: "calc(100vw - 32px - 32px)",
				// backgroundImage: "linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%)",
				// backgroundColor: colors.text,
				borderRadius: borderRadius.lg,

				"& h2": {
					whiteSpace: "nowrap",
					padding: "1rem 6rem",
					letterSpacing: "0px",
					animation: `${movingForward} 10.5s linear infinite`,
					textTransform: "uppercase",
					// WebkitTextStrokeWidth: 1,
					// WebkitTextStrokeColor: "white",
					WebkitTextStrokeWidth: { xs: 3, md: 7 },
					WebkitTextStrokeColor: colors.text,
					// color: "transparent",
					// color: "white",
					color: colors.text,
					// color: colors.text,
					fontSize: { xs: 70, md: 120 },
					fontWeight: 700,
				},
			}}
		>
			<Typography component="h2">{text}</Typography>
			<Typography component="h2">{text}</Typography>
			<Typography component="h2">{text}</Typography>
			<Typography component="h2">{text}</Typography>
			<Typography component="h2">{text}</Typography>
			<Typography component="h2">{text}</Typography>
			<Typography component="h2">{text}</Typography>
			<Typography component="h2">{text}</Typography>
			<Typography component="h2">{text}</Typography>
		</Box>
	);
};

export default CustomMarquee;
