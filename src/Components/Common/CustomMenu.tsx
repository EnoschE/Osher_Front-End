import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Box, Divider, Tooltip } from "@mui/material";
import { borderRadius } from "../../Utils/spacings";
import { useSelector } from "../../Redux/reduxHooks";
import { selectColors } from "../../Redux/Slices/generalSlice";

interface CustomMenuProps {
  anchorComponent?: any;
  options?: Array<OptionProps>;
}
interface OptionProps {
  icon?: any;
  text?: string | React.ReactNode;
  onClick?: () => void;
  isDivider?: boolean;
  disabled?: boolean;
  tooltip?: string; // Tooltip content for disabled items
}

const CustomMenu = ({
  anchorComponent: AnchorComponent = Button,
  options = [],
}: CustomMenuProps) => {
  const colors = useSelector(selectColors);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const renderMenuItem = (option: OptionProps, key: number) => {
    const menuItemContent = option.isDivider ? (
      <Divider key={key} style={{ marginTop: 12, marginBottom: 12 }} />
    ) : (
      <MenuItem
        key={key}
        onClick={() => {
          if (!option.disabled) {
            option?.onClick?.();
            handleClose();
          }
        }}
        disabled={option.disabled}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          px: 20,
          py: 8,
          minWidth: 226,
        }}
      >
        {!!option.icon && <option.icon style={{ width: 16, height: 16 }} />}
        {option.text}
      </MenuItem>
    );

    return option.disabled && option.tooltip ? (
      <Tooltip title={option.tooltip}>
        <Box>{menuItemContent}</Box>
      </Tooltip>
    ) : (
      menuItemContent
    );
  };

  return (
    <div>
      <AnchorComponent
        id='custom-menu-anchor'
        aria-controls={open ? "custom-menu" : undefined}
        aria-haspopup='true'
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />

      <Menu
        id='custom-menu'
        aria-labelledby='custom-menu-anchor'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        BackdropProps={{
          style: { backdropFilter: "unset" },
        }}
        PaperProps={{
          style: {
            borderRadius: borderRadius.sm,
            border: `1px solid ${colors.border}`,
            WebkitBackdropFilter: "saturate(200%) blur(15px)",
            backdropFilter: "saturate(200%) blur(15px)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          },
        }}
      >
        {options.map(renderMenuItem)}
      </Menu>
    </div>
  );
};

export default CustomMenu;
