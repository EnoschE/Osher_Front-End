import { styled } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import useInViewId from "../../Hooks/useInViewId";
import { navbarHeight, tabsHeight } from "../../Utils/spacings";

const TabsWrapper = styled(Box)(() => ({
  width: "100%",
  zIndex: 10,
  top: navbarHeight,
  height: tabsHeight,
  position: "sticky",
  backgroundColor: "white",
  // paddingInline: isSmallScreen ? 32 : 80,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
}));

const StyledTab = styled(Tab)(() => ({
  textTransform: "unset",
  paddingBlock: 14,
  paddingInline: 0,
  minWidth: "max-content",
  minHeight: "max-content",
  fontSize: 14,
  fontWeight: 500,
  color: "text.primary",
  "& .MuiTab-iconWrapper": {
    width: 20,
    height: 20,
    marginRight: 6,
  },
}));

function a11yProps(index: any) {
  return {
    id: `custom-tab-${index}`,
    "aria-controls": `custom-tabpanel-${index}`,
  };
}

interface OptionProps {
  id?: string;
  text: string;
  icon: any;
  disabled?: boolean;
  alwaysActive?: boolean;
}
interface CustomTabsProps {
  options?: Array<OptionProps>;
  value?: string;
  onChange?: (id?: string) => void;
  scrollingTabs?: boolean;
}

export const scrollToElement = (elementId: string | number) => {
  if (!elementId) return;

  const element = document.getElementById(elementId.toString());
  if (element) {
    // 👇 will scroll smoothly to the top of the element
    element.style.scrollMarginTop = "170px";
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const CustomTabs = ({
  options = [],
  value,
  onChange,
  scrollingTabs = true,
}: CustomTabsProps) => {
  let inViewId: string | null = "";

  inViewId = useInViewId(options?.map(({ id }) => id ?? ""));

  if (!scrollingTabs) inViewId = null;

  // if (scrollingTabs) {
  // 	inViewId = useInViewId(options?.map(({ id }) => id ?? ""));
  // }

  const handleClickScroll = (elementId: string | undefined) => {
    if (!elementId) return;

    if (scrollingTabs) {
      onChange?.(elementId);

      const waitingTime = value ? 150 : 0;

      setTimeout(() => {
        scrollToElement(elementId);
      }, waitingTime);
    } else {
      onChange?.(elementId);
    }
  };

  const indexOfActive = options.findIndex((item) => item.id === value);

  return (
    <TabsWrapper
    // px={isSmallScreen ? 32 : 80}
    >
      <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
        <Tabs
          value={scrollingTabs ? value || (inViewId ?? options[0]?.id) : value}
          aria-label='custom-tabs'
          variant='scrollable'
          scrollButtons='auto'
          sx={{
            "&.MuiTabs-root": {
              overflow: "unset",
            },
            "& .MuiTabs-scrollButtons": {
              "&:nth-of-type(1)": {
                marginLeft: -40,
              },
              "&:nth-last-of-type(1)": {
                marginRight: -40,
              },
            },
            "& .MuiTabs-flexContainer": {
              gap: 30,
              justifyContent: "space-between",
            },
          }}
        >
          {options?.map((item: OptionProps, idx: number) => (
            <StyledTab
              key={idx}
              iconPosition='start'
              icon={item.icon}
              label={item.text}
              value={item.id}
              disabled={item.disabled}
              onClick={() => handleClickScroll(item.id)}
              sx={idx < indexOfActive ? { color: "primary.main" } : {}}
              {...a11yProps(idx)}
            />
          ))}
        </Tabs>
      </Box>
    </TabsWrapper>
  );
};

export default CustomTabs;
