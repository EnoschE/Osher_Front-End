import { Avatar, Box, Tooltip, Typography, keyframes } from "@mui/material";
import CustomButton from "../Common/CustomButton";
// import CustomMarquee from "../Common/CustomMarquee";
import { roles } from "../../Utils/tokenKeyValue";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

// const fadeUp = keyframes`
//   0% {
//     // transform: scale(0.85) translateY(20px);
// 		opacity: 0;
// 		filter: blur(5px);
//   }
//   70% {
//     // transform: scale(1.005) translateY(-5px);
// 		opacity: 0.5;
// 		filter: blur(0px);
//   }
//   100% {
//     // transform: scale(1) translateY(0px);
// 		opacity: 1;
// 		filter: blur(0px);
//   }
// `;

interface ProfileHeaderProps {
	data: { name?: string; image?: string; ImageUrl?: string; lastName?: string; role: string };
	userType:
		| "Admin"
		| "Super Admin"
		| "Customer"
		| "Technician"
		| "Installer"
		| "Office Manager"
		| "Manager"
		| "Representative"
		| "Installer Admin"
		| "Admin Manager"
		| "PSL"
		| "Director"
		| "Installer Company"
		| "Installation Crew"
		| "Utility Company";
	handleEdit?: () => void;
	handleDelete?: () => void;
	disableDeleteButton?: boolean;
	hideButtons?: boolean;
	tooltipText?: string;
}

const ProfileHeader = ({
	data,
	userType,
	handleEdit,
	handleDelete,
	disableDeleteButton,
	hideButtons,
	tooltipText = "You cannot delete accounts that have customers assigned to them",
}: ProfileHeaderProps) => {
	userType = userType === "Technician" ? "Installation Crew" : userType;

	const colors = useSelector(selectColors);

	return (
		<>
			{/* <Box sx={{ animation: `0.35s ${fadeUp} 0s ease-in both` }}>
				<CustomMarquee text={data?.name || userType} />
			</Box> */}

			<Box display="flex" alignItems="center" gap={8} flexDirection="column">
				<Avatar
					sx={{ mt: "-30px", width: 130, height: 130, border: `1px solid ${colors.border}` }}
					src={data?.image || data?.ImageUrl}
				/>
				<Typography variant="h2" mt={10}>
					{data.role === roles.CUSTOMER ? `${data?.name} ${data?.lastName || ""}` : data?.name || "User name"}
				</Typography>
				<Typography>{userType}</Typography>
				{hideButtons ? (
					<></>
				) : (
					<Box display="grid" gridTemplateColumns="1fr 1fr" gap={8} mt={12}>
						<CustomButton variant="outlined" onClick={handleEdit}>
							Edit
						</CustomButton>
						<Tooltip arrow title={disableDeleteButton ? tooltipText : ""}>
							<span>
								<CustomButton disabled={disableDeleteButton} color="error" variant="outlined" onClick={handleDelete}>
									Delete
								</CustomButton>
							</span>
						</Tooltip>
					</Box>
				)}
			</Box>
		</>
	);
};

export default ProfileHeader;
