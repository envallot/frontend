import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Home } from './components'
import { ErrorModal } from './Modals'
import { useStyles } from './styles'

export default function App() {

  const classes = useStyles();

  const [user, setUser] = useState({
    authorized: false,
    id: '',
    username: '',
    email: ''
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

  const setAndShowError = ({ code, name, message }: any) => {
    setError({
      code,
      name,
      message,
    })
    setShowErrorModal(true)
  }

  return (
    <Router>
      <div className={classes.root}>
        <Switch>
          <Route path="/">
            <Home
              user={user}
              setUser={setUser}
              setError={setError}
              error={error}
              setShowErrorModal={setShowErrorModal}
              setAndShowError={setAndShowError}
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
      </div>
    </Router>
  );
}


