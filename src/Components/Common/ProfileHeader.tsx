import { Box, Skeleton, Tooltip, Typography } from "@mui/material";
import CustomButton from "../Common/CustomButton";
import CustomMarquee from "../Common/CustomMarquee";
import AnimatedHeading from "../Common/AnimatedHeading";
import CustomAvatar from "../Common/CustomAvatar";
import { borderRadius } from "../../Utils/spacings";
import PostPicture from "./PostPicture";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { UserRoleType } from "../../Utils/types";
import { useTranslation } from "react-i18next";

interface ProfileHeaderProps {
  data: {
    name?: string;
    picture?: string;
    lastName?: string;
    role: string;
  };
  userType: UserRoleType;
  handleEdit?: () => void;
  handleDelete?: () => void;
  disableDeleteButton?: boolean;
  hideButtons?: boolean;
  hideDeleteButton?: boolean;
  isSquarish?: boolean;
  isLoading?: boolean;
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
  isLoading,
  tooltipText = "You cannot delete brands those have generated ads",
}: ProfileHeaderProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Box className='animated-block'>
        <CustomMarquee text={data?.name || t(userType)} />
      </Box>

      <Box display='flex' alignItems='center' gap={8} flexDirection='column'>
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          width='100%'
          mb={10}
          mt={{ xs: 70, sm: 130 }}
        >
          {isSquarish ? (
            <PostPicture src={data?.picture} sx={{ maxWidth: 450 }} />
          ) : (
            <CustomAvatar
              isSquarish={isSquarish}
              size='xl'
              src={data?.picture}
              showLoader={isLoading}
            />
          )}
        </Box>

        <Box className='animated-block' sx={{ animationDelay: `${3 / 21}s` }}>
          {isLoading ? (
            <Skeleton
              sx={{
                width: { xs: 200, sm: 230 },
                height: { xs: 45, sm: 71 },
                borderRadius: borderRadius.sm,
              }}
            />
          ) : (
            <AnimatedHeading
              heading={data?.name}
              charactersBaseAnimation
              animationSpeed='fast'
            />
          )}
        </Box>

        {/* background: `radial-gradient(circle 200px at 100% 50%, ${colors.primary} 0.2%,     ${colors.text} 100.2%)`, */}

        <Typography
          className='animated-block'
          sx={{ animationDelay: `${4 / 21}s` }}
          color='text.secondary'
        >
          {t(userType)}
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
            <CustomButton
              size='small'
              disabled={isLoading}
              variant='outlined'
              onClick={handleEdit}
              startIcon={<EditOutlined />}
            >
              {t("Edit")}
            </CustomButton>
            {!hideDeleteButton && (
              <Tooltip arrow title={disableDeleteButton ? t(tooltipText) : ""}>
                <span>
                  <CustomButton
                    size='small'
                    disabled={disableDeleteButton || isLoading}
                    color='error'
                    variant='outlined'
                    onClick={handleDelete}
                    startIcon={<DeleteOutline />}
                  >
                    {t("Delete")}
                  </CustomButton>
                </span>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>

      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "sticky",
          bottom: {
            xs: "2px",
            sm: "4px",
          },
          padding: "12px",
          gap: "12px",
          borderRadius: "16px",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          backdropFilter: "saturate(180%) blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          border: `1px solid ${colors.border}`,
          boxShadow: "rgba(17, 12, 46, 0.1) 0px 28px 60px 0px",
          overflow: "hidden",
          m: { xs: "32px auto 0 auto", sm: "32px 0 0 auto" },

          animationDelay: "0.05s",

          "& button": {
            animationDelay: "0.47s",
            "&:nth-child(2)": {
              animationDelay: "0.52s",
            },
          },
        }}
        className='floating-action-buttons'
      >
        <CustomButton
          className='slide-up-bounce'
          variant='outlined'
          // onClick={() => setEditMode(true)}
          startIcon={<EditOutlined />}
        >
          Edit
        </CustomButton>
        <CustomButton
          className='slide-up-bounce'
          variant='outlined'
          // onClick={() => setOpenDeleteDialog(true)}
          startIcon={<DeleteOutline />}
        >
          Delete
        </CustomButton>
      </Box> */}
    </>
  );
};

export default ProfileHeader;
