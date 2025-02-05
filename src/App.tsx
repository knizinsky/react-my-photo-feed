import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/routes";
import { GlobalStyles } from "./styles/GlobalStyles";
import { theme } from "./styles/theme";
import { ThemeProvider } from "styled-components";
import CheckSession from "./components/CheckSession";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <CheckSession />
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
};

export default App;
