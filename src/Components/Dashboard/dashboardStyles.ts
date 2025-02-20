import { Box, styled } from "@mui/material";
import CustomButton from "../Common/CustomButton";
import { HomeImage } from "../../Utils/Images";

export const HomeContainer = styled(Box)({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "100vh",
	backgroundImage: `url(${HomeImage})`,
	backgroundRepeat: "no-repeat",
	backgroundPosition: "center",
});

export const HomeButton = styled(CustomButton)(({ theme }) => ({
	backgroundColor: "white",
	color: "darkblue",
	border: `2px solid darkblue`,

	"&:hover": {
		backgroundColor: theme.palette.grey[300],
	},
}));
