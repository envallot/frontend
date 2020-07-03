import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Welcome, Home } from './components'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';


export default function App() {
  return (
    <Router>
      <Container maxWidth="lg">
        {/* Place Banner Here */}
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav> */}

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/">
            <Welcome />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}


// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" href="https://material-ui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

// export default function App() {
//   return (
//     <Container maxWidth="lg">
//       <Box my={4}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Create React App v4-beta example
//         </Typography>
//         <Copyright />
//       </Box>
//     </Container>
//   );
// }

