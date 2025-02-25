import { FormEvent, useEffect, useState } from "react";
import CustomButton from "../Common/CustomButton";
import { Box, Divider, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";
import ColorPicker from "../Common/ColorPicker";
import { getColors, updateColors } from "../../Services/colorsServices";
import { allRoutes } from "../../Routes/AllRoutes";
import { useDispatch } from "../../Redux/reduxHooks";
import { fetchColors } from "../../Redux/Slices/generalSlice";

interface ColorsInterface {
	primary: string;
	text: string;
	textSecondary: string;
}

const defaultData = {
	primary: "#FFA800",
	text: "#1C1D34",
	textSecondary: "#475467",
};

const ColorTheme = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [loading, setLoading] = useState<boolean>(false);
	const [themeColors, setThemeColors] = useState<ColorsInterface>(defaultData);

	useEffect(() => {
		getDetails();
	}, []);

	const getDetails = async () => {
		setLoading(true);
		try {
			const { data } = await getColors();

			console.log("COL", data);
			setThemeColors({
				primary: data?.primary || defaultData.primary,
				text: data?.text || defaultData.text,
				textSecondary: data?.textSecondary || defaultData.textSecondary,
			});
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoading(true);
		try {
			const { data: output } = await updateColors(themeColors);
			console.log("Colors got updated!", output);

			// updating colors in redux
			// dispatch(fetchColors());

			toast.success("Color theme updated successfully!");
			navigate(allRoutes.CONFIGURATIONS);
		} catch (error: any) {
			toast.error(error);
		}
		setLoading(false);
	};

	const handleCancel = () => {
		navigate(allRoutes.CONFIGURATIONS);
	};

	return (
		<PageLayout loading={loading}>
			<Typography variant="h5">Color Theme</Typography>
			<Typography fontSize={15} mt={10}>
				These are all the colors used in our applications
			</Typography>
			<Divider sx={{ mt: 14, mb: 24 }} />

			<form onSubmit={handleUpdate}>
				<Box
					display="grid"
					gridTemplateColumns={{ xs: "1fr", md: "340px 1fr" }}
					gap={{ xs: 10, md: 32 }}
					alignItems="center"
				>
					{/* <Box alignSelf="flex-start">
						<Typography variant="h5">Company Logo</Typography>
						<Typography fontSize={15} mt={10}>
							This will be displayed on installer company's dashboard
						</Typography>
					</Box>
					<Box>
						<ImageUploader isLogo onUpdate={handleSelectImage} imageFile={profilePicture} />
					</Box> */}

					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Primary
					</Typography>
					<ColorPicker
						color={themeColors.primary}
						onChange={(color: string) => setThemeColors({ ...themeColors, primary: color })}
					/>

					<Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Typography
					</Typography>
					<ColorPicker
						color={themeColors.text}
						onChange={(color: string) => setThemeColors({ ...themeColors, text: color })}
					/>

					{/* <Typography variant="h6" fontSize={18} mt={{ xs: 12, md: 0 }}>
						Typography Secondary
					</Typography>
					<ColorPicker
						color={themeColors.textSecondary}
						onChange={(color: string) => setThemeColors({ ...themeColors, textSecondary: color })}
					/> */}

					<Box />
					<Box display="flex" alignItems="center" justifyContent="flex-end" gap={20}>
						<CustomButton variant="outlined" color="secondary" onClick={handleCancel}>
							Cancel
						</CustomButton>
						<CustomButton type="submit">Save Changes</CustomButton>
					</Box>
				</Box>
			</form>
		</PageLayout>
	);
};

export default ColorTheme;
