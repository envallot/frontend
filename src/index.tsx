import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import 'fontsource-muli'
import green from '@material-ui/core/colors/green'

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Muli, Arial',
  },
  palette: {
    primary: green
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

