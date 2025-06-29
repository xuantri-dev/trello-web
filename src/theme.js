import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { cyan, orange, teal, deepOrange } from "@mui/material/colors";

const theme = extendTheme({
  trello: {
    appBarHeight: "58px",
    boardBarHeight: "60px",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange,
        text: {
          primary: "#000",
          secondary: "#666",
        },
        background: {
          default: "#fff",
          paper: "#f5f5f5",
        },
      },
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange,
        text: {
          primary: "#fff",
          secondary: "#ccc",
        },
        background: {
          default: "#121212",
          paper: "#1e1e1e",
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: (theme) => ({
        color: theme.palette.primary.main,
        fontSize: "0.875rem",
        "&.Mui-focused": {
          color: theme.palette.primary.main,
        },
      }),
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdc3c7",
            borderRadius: "8px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#00b894",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            color: theme.palette.primary.main,
            fontSize: "0.875rem",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.light,
            },
            "&:hover": {
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
            },
            "& fieldset": {
              borderWidth: "1px !important",
            },
          };
        },
      },
    },
  },
});

export default theme;
