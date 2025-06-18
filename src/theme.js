import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { cyan, orange, teal, deepOrange } from "@mui/material/colors";

const theme = extendTheme({
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
});

export default theme;
