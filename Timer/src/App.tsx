

import { ThemeProvider} from "styled-components";
import { defaultTheme } from "./styles/themes/Default";
import { GlobalStyle } from "./styles/global";
import { Router } from "./Router";
import { BrowserRouter } from "react-router-dom";
import { CyclesContextProvider } from "./contexts/CyclesContexts";



 export function App() {
 

  return (
    
    <ThemeProvider  theme={defaultTheme}>
      <BrowserRouter>
      <CyclesContextProvider>
      <Router/>
      </CyclesContextProvider>
    
      </BrowserRouter>
    
    <GlobalStyle/>
    </ThemeProvider>
  )
}



