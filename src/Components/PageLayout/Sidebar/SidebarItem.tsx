import { JSX, useState } from "react";
import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { KeyboardArrowDownRounded } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import {
  StyledDrawerListItem,
  StyledDrawerListSubItem,
} from "../pageLayoutStyles";
import colors from "../../../Utils/colors";

interface ItemProps {
  icon: JSX.Element;
  text: string;
  path?: string;
}

interface SidebarItemProps {
  item: ItemProps & { subItems?: ItemProps[] };
  onClick: (path?: string) => void;
}

const SidebarItem = ({ item, onClick }: SidebarItemProps) => {
  const location = useLocation();
  const [expand, setExpand] = useState(false);

  const isActive = (path?: string) => path && location.pathname.includes(path);

  const handleClick = (path?: string, hasSubItems?: boolean) => {
    if (hasSubItems) setExpand(!expand);
    else onClick(path);
  };

  const hasSubItems = !!item.subItems?.length;
  const isMainActive = isActive(item.path);

  return (
    <>
      <StyledDrawerListItem
        disablePadding
        onClick={() => handleClick(item.path, hasSubItems)}
        sx={{
          backgroundColor: isMainActive ? "primary.main" : "transparent",
          boxShadow: isMainActive ? `0px 8px 20px ${colors.primary}99` : "none",
          color: isMainActive ? "white" : "text.primary",
          svg: { path: { fill: isMainActive ? "white" : "text.primary" } },
        }}
      >
        <ListItemButton>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <Typography sx={{ py: 10, color: "inherit", fontWeight: 500 }}>
            {item.text}
          </Typography>
          {hasSubItems && (
            <ListItemIcon sx={{ ml: "auto", pl: "14px" }}>
              <KeyboardArrowDownRounded
                sx={{
                  transition: "all 0.3s",
                  transform: `rotate(${expand ? 180 : 0}deg)`,
                }}
              />
            </ListItemIcon>
          )}
        </ListItemButton>
      </StyledDrawerListItem>

      {hasSubItems && (
        <Collapse in={expand}>
          {item.subItems?.map((sub, idx) => (
            <StyledDrawerListSubItem
              key={idx}
              disablePadding
              onClick={() => onClick(sub.path)}
              sx={{
                backgroundColor: isMainActive ? "primary.main" : "transparent",
                color: isMainActive ? "white" : "text.primary",
                svg: {
                  path: { fill: isMainActive ? "white" : "text.primary" },
                },
              }}
            >
              <ListItemButton>
                <ListItemIcon>{sub.icon}</ListItemIcon>
                <Typography sx={{ py: 10, color: "inherit", fontWeight: 500 }}>
                  {sub.text}
                </Typography>
              </ListItemButton>
            </StyledDrawerListSubItem>
          ))}
        </Collapse>
      )}
    </>
  );
};

export default SidebarItem;
