import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import AddDocument from './views/AddDocument';
import ShowDocument from "./views/ShowDocument";
import {Container} from "@material-ui/core";

function Routes() {
    return (
        <Container component="main">
            <Router>
                    <Switch>
                        <Route path="/document/:documentId">
                            <ShowDocument />
                        </Route>
                        <Route path="/">
                            <AddDocument />
                        </Route>
                    </Switch>
            </Router>
        </Container>
    );
}

ReactDOM.render(<Routes />, document.getElementById('root'));
