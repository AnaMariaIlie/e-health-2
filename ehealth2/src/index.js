import React, { Component } from 'react';
import { render } from 'react-dom';
import Patients from './Patients';
import Medication from './Medication';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {Link} from 'react-router-dom';


class App extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <Router>
        <ul>
          <li><Link to="/patients">Patients</Link></li>
          <li><Link to="/med">Medication</Link></li>
        </ul>
        <hr/>
        <Route exact path="/patients" component={Patients} />
        <Route path="/med" component={Medication} />
      </Router>
    );
  }
}

render(<App />, document.getElementById('root'));
