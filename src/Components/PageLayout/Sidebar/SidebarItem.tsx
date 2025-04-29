import { JSX, useState } from "react";
import { ListItemButton, ListItemIcon, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { StyledDrawerListItem } from "../pageLayoutStyles";
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

  const isMainActive = isActive(item.path);

  return (
    <StyledDrawerListItem
      disablePadding
      onClick={() => handleClick(item.path)}
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
      </ListItemButton>
    </StyledDrawerListItem>
  );
};

export default SidebarItem;
