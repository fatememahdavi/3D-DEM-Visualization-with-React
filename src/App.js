// Author: Fateme Mahdavi

import * as React from 'react';

import {theme} from "./themes/GlobalTheme";
import Model3D from './components/Models3DComponent';
import 'leaflet/dist/leaflet.css';
import './App.css';

import { ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <Model3D/>
      </StyledEngineProvider>
    </ThemeProvider>
  );
}
