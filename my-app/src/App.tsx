import React from "react";
import FlowCanvas from "./components/FlowCanvas";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6200ea",
    },
    background: {
      default: "#f0f0f0",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FlowCanvas />
    </ThemeProvider>
  );
}

export default App;
