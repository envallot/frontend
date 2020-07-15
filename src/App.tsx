import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Home } from './components'
import { ErrorModal } from './Modals'
import {
  Container
} from '@material-ui/core';

export default function App() {

  const [user, setUser] = useState({
    authorized: false,
    id: '',
  })

  const [error, setError] = useState({
    code: '',
    name: '',
    message: '',
  })

  const [showErrorModal, setShowErrorModal] = useState(false)

  const handleCloseErrorModal = () => {
    setShowErrorModal(false)
    setError({
      code: '',
      name: '',
      message: ''
    })
  }

  return (
    <Router>
      <Container maxWidth="lg">
        <Switch>
          <Route path="/">
            <Home user={user}
              setUser={setUser}
              setError={setError}
              error={error}
              setShowErrorModal={setShowErrorModal}
            />
          </Route>
        </Switch>
        <ErrorModal
          open={showErrorModal}
          handleClose={handleCloseErrorModal}
          message={error.message}
          code={error.code}
          name={error.name}
        />
      </Container>
    </Router>
  );
}


