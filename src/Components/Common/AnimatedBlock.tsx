import { Box, SxProps } from "@mui/material";
import React, { ReactNode } from "react";

interface AnimatedBlockProps {
  animationDelay?: number;
  className?: string;
  onClick?: () => void;
  sx?: SxProps;
  children: ReactNode;
}

const AnimatedBlock: React.FC<AnimatedBlockProps> = ({
  animationDelay = 0.05,
  className = "",
  onClick,
  children,
  sx,
}) => {
  return (
    <Box
      className={`heading-overflow-hidden ${onClick ? "pointer" : ""} ${className}`}
      onClick={onClick}
      sx={{ ...sx, "& > *": { animationDelay: `${animationDelay}s` } }}
    >
      {children}
    </Box>
  );
};

export default AnimatedBlock;
