import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Login } from './components/login/Login';
import { Register } from './components/login/Register';

export default function Routes() {
    return(
        <Switch>
            <Route exact path="/login">
                <Login/>
            </Route>
            <Route exact path="/register">
                <Register/>
            </Route>
        </Switch>
    );
}