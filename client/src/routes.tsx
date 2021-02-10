
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Login } from './components/login/Login';
import { Register } from './components/login/Register';
import LandingPage from './components/LandingPage/LandingPage';

export default function Routes() {
    return(
        <Switch>
            <Route exact path="/login">
                <Login/>
            </Route>
            <Route exact path="/register">
                <Register/>
            </Route>
            <Route exact path="/landing-page">
                <LandingPage/>
            </Route>
        </Switch>
    );
}
