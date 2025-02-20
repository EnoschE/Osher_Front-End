import CustomMenu from "./CustomMenu";
import { Box, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const CustomTableOptions = ({ menuOptions }: { menuOptions: any }) => {
	return (
		<Box display="flex" alignItems="center" justifyContent="end" gap={10} flexWrap={"wrap"}>
			<CustomMenu
				anchorComponent={(props: any) => (
					<IconButton variant="text" color="primary" sx={{ p: 2 }} {...props}>
						<MoreVertIcon />
					</IconButton>
				)}
				options={menuOptions}
			/>
		</Box>
	);
};

export default CustomTableOptions;
