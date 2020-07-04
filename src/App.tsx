import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Welcome, Home } from './components'
import Container from '@material-ui/core/Container';


export default function App() {

  const [user, setUser] = useState({
    authorized: false,
    id: '',
    email: '',
    name: ''
  })

  return (
    <Router>
      <Container maxWidth="lg">
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/">
            <Welcome user={user} setUser={setUser} />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}


