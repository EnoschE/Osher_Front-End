import { useNavigate } from "react-router-dom";
import { LoginContainer, LoginInnerBlock } from "../Login/loginStyles";
import { Box } from "@mui/material";
import CustomButton from "../Common/CustomButton";
import PageLayout from "../PageLayout/PageLayout";
import { HomeImage } from "../../Utils/Images";
import { allRoutes } from "../../Routes/AllRoutes";

const Home = () => {
  const navigate = useNavigate();

  const goToFeed = () => navigate(allRoutes.FEED);

  return (
    <PageLayout hideSidebar hideBackButton sx={{ p: 0 }}>
      <LoginContainer>
        <LoginInnerBlock gap={50}>
          <Box
            className='pop-out-animation'
            component='img'
            src={HomeImage}
            alt='Home'
          />
          <CustomButton
            type='submit'
            fullWidth
            className='slide-down-bounce'
            sx={{ animationDelay: `0.2s` }}
						onClick={goToFeed}
          >
            Continue
          </CustomButton>
        </LoginInnerBlock>
      </LoginContainer>
    </PageLayout>
  );
};

export default Home;
