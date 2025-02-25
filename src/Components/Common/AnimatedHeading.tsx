import { Box, Typography } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import React from "react";

interface AnimatedHeadingProps {
  heading?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  animationDelay?: number;
  className?: string;
  onClick?: () => void;
  charactersBaseAnimation?: boolean;
  animationSpeed?: "fast" | "normal";
  gapBetweenChars?: string | number;
  justifyContent?: React.CSSProperties["justifyContent"];
  lineHeight?: string | number;
  variant?: Variant;
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  variant = "h1",
  heading = "",
  fontSize,
  fontWeight,
  animationDelay = 0.05,
  className = "",
  onClick,
  charactersBaseAnimation = false,
  animationSpeed = "normal",
  gapBetweenChars,
  justifyContent,
  lineHeight,
}) => {
  // Split heading into words or characters based on charactersBaseAnimation
  const headingParts =
    heading && charactersBaseAnimation
      ? heading.split("")
      : heading.split(/(\s+)/).filter((part) => part !== "");

  return (
    <Box
      className={`heading-overflow-hidden ${
        onClick ? "pointer" : ""
      } ${className}`}
      onClick={onClick}
      style={{ gap: gapBetweenChars, justifyContent }}
    >
      {headingParts.map((char, i) => (
        <Typography
          variant={variant}
          key={i}
          style={{
            animationDelay: `${
              i / (animationSpeed === "fast" ? 20 : 12) + animationDelay
            }s`,
            fontSize,
            fontWeight,
            // paddingInline:
            //   char === " " ? (fontSize ? +fontSize / 5 : "0.625%") : 0,
            lineHeight,
          }}
        >
          {char === " " ? `\u00A0` : char}
        </Typography>
      ))}
    </Box>
  );
};

export default AnimatedHeading;
