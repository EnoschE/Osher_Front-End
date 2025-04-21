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
    | "Ad"
    | "Post"
    | "Influencer"
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
  hideDeleteButton?: boolean;
  isSquarish?: boolean;
  tooltipText?: string;
}

const ProfileHeader = ({
  data,
  userType,
  handleEdit,
  handleDelete,
  disableDeleteButton,
  hideButtons,
  hideDeleteButton,
  isSquarish,
  tooltipText = "You cannot delete brands those have generated ads",
}: ProfileHeaderProps) => {
  return (
    <>
      <Box className='animated-block'>
        <CustomMarquee text={data?.name || userType} />
      </Box>

      <Box display='flex' alignItems='center' gap={8} flexDirection='column'>
        <Box
          // className='animated-block'
          sx={{ animationDelay: `${2 / 21}s` }}
        >
          <CustomAvatar
            isSquarish={isSquarish}
            size='lg'
            sx={{ mt: "-30px", mb: 10, filter: "blur(15px)", opacity: 0.7 }}
            src={data?.picture}
          />

          <CustomAvatar
            isSquarish={isSquarish}
            size='lg'
            sx={{ mt: "-160px", mb: 10 }}
            src={data?.picture}
          />
        </Box>

        <AnimatedHeading
          className='animated-block'
          heading={data?.name}
          charactersBaseAnimation
          animationSpeed='fast'
          sx={{ animationDelay: `${3 / 21}s` }}
        />

        {/* <Typography
          variant='h1'
          style={{
            background: `radial-gradient(circle 200px at 100% 50%, ${colors.primary} 0.2%,     ${colors.text} 100.2%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {data?.name}
        </Typography> */}
        <Typography
          className='animated-block'
          sx={{ animationDelay: `${4 / 21}s` }}
        >
          {userType}
        </Typography>
        {hideButtons ? (
          <></>
        ) : (
          <Box
            className='animated-block'
            sx={{ animationDelay: `${5 / 21}s` }}
            display='grid'
            gridTemplateColumns={hideDeleteButton ? "1fr" : "1fr 1fr"}
            gap={8}
            mt={12}
          >
            <CustomButton variant='outlined' onClick={handleEdit}>
              Edit
            </CustomButton>
            {!hideDeleteButton && (
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
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default ProfileHeader;
