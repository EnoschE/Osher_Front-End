import { createTheme } from "@mui/material";
import { borderRadius } from "./Utils/spacings";
import colors, { frostedGlassEffect } from "./Utils/colors";

const breakpoints = {
  xs: 0,
  sm: 768,
  md: 1028,
  lg: 1440,
  xl: 1920,
};

const createAppTheme = () => {
  return createTheme({
    palette: {
      primary: {
        main: colors.primary,
        light: colors.primaryLight,
      },
      secondary: {
        main: colors.border,
      },
      text: {
        primary: colors.text,
        secondary: colors.textMid,
        disabled: colors.textPlaceholder,
      },
      success: {
        main: colors.success,
      },
      error: {
        main: colors.error,
      },
    },

    typography: {
      // fontFamily: ["Inter"].join(","),
      fontFamily: ["BricolageGrotesque"].join(","),
      allVariants: {
        color: colors.text,
        fontSize: "14px",
        lineHeight: 1.3,
      },
      h1: {
        // fontSize: "56px",
        fontSize: "56px",
        fontWeight: 500,

        [`@media (max-width: ${breakpoints.md}px)`]: {
          fontSize: "36px",
        },
        [`@media (max-width: ${breakpoints.sm}px)`]: {
          fontSize: "26px",
        },
      },
      h2: {
        fontSize: "32px",
        fontWeight: 500,
      },
      h3: {
        fontSize: "28px",
        fontWeight: 500,
      },
      h4: {
        fontSize: "24px",
        fontWeight: 500,
      },
      h5: {
        fontSize: "18px",
        fontWeight: 500,
      },
      h6: {
        fontSize: "16px",
        fontWeight: 500,
      },
      body1: {
        fontSize: "14px",
        fontWeight: 400,
        color: colors.text,
      },
      body2: {
        fontSize: "14px",
        fontWeight: 400,
        color: colors.textMid,
      },
    },

    breakpoints: { values: breakpoints },

    spacing: 1,
    shape: {
      borderRadius: 1,
    },

    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            "& .link, &.link": {
              color: colors.primary,
              cursor: "pointer",
            },
          },
        },
      },

      MuiInputBase: {
        styleOverrides: {
          root: {
            "& textarea, & input": {
              padding: 0,
              paddingBlock: 10,
              color: colors.text,
              fontSize: "14px",
              lineHeight: "20px",
              "&:-internal-autofill-selected": {
                boxShadow: "0 0 0 50px white inset",
              },

              "&:-webkit-autofill, &:-webkit-autofill-strong-password, &:-webkit-autofill-strong-password-viewable, &:-webkit-autofill-and-obscured":
                {
                  backgroundColor: "#fff !important",
                  color: `${colors.text} !important`,
                  WebkitBoxShadow: "0 0 0px 1000px #fff inset !important",
                },
            },

            fieldset: {
              borderColor: colors.border,
            },

            "&.MuiInputBase-root": {
              // backgroundColor: "transparent",
              backgroundColor: "#fff",
              "&:has(> input), &:has(input)": {
                height: 40,
              },
            },
            "&.MuiInput-underline input": {
              paddingBlock: 10,
            },
            "&.MuiInput-underline:after": {
              borderBottomColor: colors.border,
            },
            "&.MuiOutlinedInput-root": {
              padding: `${0}px 16px`,
              borderRadius: borderRadius.xs,

              "&.MuiAutocomplete-inputRoot": {
                padding: `10px 16px`,
                "& .MuiAutocomplete-input": {
                  padding: 0,
                  "&:-internal-autofill-selected": {
                    boxShadow: "0 0 0 50px white inset",
                  },
                  "&:-webkit-autofill, &:-webkit-autofill-strong-password, &:-webkit-autofill-strong-password-viewable, &:-webkit-autofill-and-obscured":
                    {
                      backgroundColor: "#fff !important",
                      color: `${colors.text} !important`,
                      WebkitBoxShadow: "0 0 0px 1000px #fff inset !important",
                    },
                },
              },

              "& .MuiSelect-outlined": {
                padding: 0,
                paddingBlock: "10px",
                paddingRight: 32,
              },

              "&.Mui-focused fieldset, &:hover fieldset": {
                borderColor: colors.primary,
                borderWidth: 1,
              },
            },

            "& input::placeholder, & textarea::placeholder": {
              // color: "gray",
              color: colors.textPlaceholder,
              opacity: 1,
              textAlign: "left",
            },
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            paddingBlock: 15,
            paddingInline: 32,
            fontSize: 16,
            fontWeight: 500,
            textTransform: "unset",
            boxShadow: "unset",
            borderRadius: borderRadius.xs,

            "&:hover, &:focus, &:active": {
              boxShadow: "none",
            },

            "&.MuiButton-containedPrimary": {
              transition: "all ease 0.3s",
              boxShadow: `0px 8px 20px ${colors.primary}99`,
              border: `1px solid ${colors.primary}`,
              // boxShadow:
              //   `0px 8px 20px ${colors.primary}99, 0 17px 50px 0 rgba(0,0,0,.19)`,

              "&:disabled": {
                color: "white",
                backgroundColor: colors.primaryLight,
              },
            },

            "&.MuiButton-containedError": {
              "&:disabled": {
                color: colors.error + 75,
                backgroundColor: colors.error + 25,
              },
            },
           
            "&.MuiButton-containedSuccess": {
              "&:disabled": {
                color: colors.success + 75,
                backgroundColor: colors.success + 25,
              },
            },

            "&.MuiButton-outlined": {
              borderColor: colors.border,
              color: colors.text,

              "&:disabled": {
                color: "white",
                backgroundColor: colors.border,
              },

              "&.MuiButton-outlinedPrimary": {
                borderColor: colors.primary,
                color: colors.primary,
                // ...frostedGlassEffect,
                backgroundColor: 'rgba(256, 256, 256, 0.9)',

                "&:disabled": {
                  color: colors.primary + 40,
                  borderColor: colors.primary + 60,
                  backgroundColor: colors.primary + 20,
                },
              },

              "&.MuiButton-outlinedError": {
                borderColor: colors.error,
                color: colors.error,

                "&:disabled": {
                  color: colors.error + 90,
                  borderColor: colors.error + 70,
                  backgroundColor: colors.error + 20,
                },
              },
            },
            "&.MuiButton-sizeSmall": {
              padding: "8px 20px",
            },
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: colors.border,
          },
        },
      },

      MuiBackdrop: {
        styleOverrides: {
          root: {
            WebkitBackdropFilter: "blur(2px) saturate(120%)",
            backdropFilter: "blur(2px) saturate(120%)",
            backgroundColor: "rgba(0 ,0 ,0 , 0.25)",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
            "&.MuiMenu-paper": {
              borderRadius: borderRadius.xs,
            },
          },
        },
      },

      MuiTableContainer: {
        styleOverrides: {
          root: {
            thead: {
              background: "#f6f6f6",

              th: {
                borderBottom: 0,
                color: colors.text,
                padding: "14px 20px",
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "16px",

                "&:nth-of-type(1)": {
                  borderTopLeftRadius: borderRadius.xs,
                  borderBottomLeftRadius: borderRadius.xs,
                },
                "&:nth-last-of-type(1)": {
                  borderTopRightRadius: borderRadius.xs,
                  borderBottomRightRadius: borderRadius.xs,
                },
              },
            },

            tbody: {
              tr: {
                transition: "all ease 0.15s",
                cursor: "pointer",

                "&:hover": {
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 30px",
                  backgroundColor: colors.primary + "10",
                },
              },

              td: {
                color: colors.text,
                padding: "18px 20px",
                fontSize: 14,
                fontWeight: 400,
                lineHeight: "18px",
                borderBottom: `1px solid ${colors.border}`,

                "&:nth-of-type(1)": {
                  borderTopLeftRadius: borderRadius.xs,
                  borderBottomLeftRadius: borderRadius.xs,
                },
                "&:nth-last-of-type(1)": {
                  borderTopRightRadius: borderRadius.xs,
                  borderBottomRightRadius: borderRadius.xs,
                },
              },
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            height: 28,

            "& .MuiChip-label": {
              paddingRight: 12,
              fontSize: 12,
              fontWeight: 500,
            },
            "& .MuiChip-icon": {
              width: 16,
              height: 16,
              marginLeft: 12,
            },
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: "white",
            borderRadius: 4,
            color: colors.text,
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            textAlign: "center",
          },
          arrow: {
            color: "white",
            textShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          },
        },
      },
    },
  });
};

export default createAppTheme;
