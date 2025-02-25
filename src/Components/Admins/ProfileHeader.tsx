import { Avatar, Box, Tooltip, Typography, keyframes } from "@mui/material";
import CustomButton from "../Common/CustomButton";
// import CustomMarquee from "../Common/CustomMarquee";
import { roles } from "../../Utils/tokenKeyValue";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";
import CustomMarquee from "../Common/CustomMarquee";
import AnimatedHeading from "../Common/AnimatedHeading";
import CustomAvatar from "../Common/CustomAvatar";

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
  data: {
    name?: string;
    picture?: string;
    lastName?: string;
    role: string;
  };
  userType:
    | "Admin"
    | "Brand"
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
  const colors = useSelector(selectColors);

  return (
    <>
      <Box>
        <CustomMarquee text={data?.name || userType} />
      </Box>

      <Box display='flex' alignItems='center' gap={8} flexDirection='column'>
        <CustomAvatar
          sx={{
            mt: "-30px",
            width: 130,
            height: 130,
            border: `1px solid ${colors.border}`,
            mb: 10,
            filter: "blur(15px)",
            opacity: 0.7,
          }}
          src={data?.picture}
        />
        <CustomAvatar
          sx={{
            mt: "-160px",
            width: 130,
            height: 130,
            // border: `1px solid ${colors.border}`,
            mb: 10,
            border: "2px solid white",
          }}
          src={data?.picture}
        />

        <AnimatedHeading
          heading={data?.name}
          charactersBaseAnimation
          animationSpeed='fast'
        />

        <Typography
          variant='h1'
          style={{
            background: `radial-gradient(circle 200px at 100% 50%, ${colors.primary} 0.2%,     ${colors.text} 100.2%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {data?.name}
        </Typography>
        <Typography>{userType}</Typography>
        {hideButtons ? (
          <></>
        ) : (
          <Box display='grid' gridTemplateColumns='1fr 1fr' gap={8} mt={12}>
            <CustomButton variant='outlined' onClick={handleEdit}>
              Edit
            </CustomButton>
            <Tooltip arrow title={disableDeleteButton ? tooltipText : ""}>
              <span>
                <CustomButton
                  disabled={disableDeleteButton}
                  color='error'
                  variant='outlined'
                  onClick={handleDelete}
                >
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
