import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import './App.css';

class App extends Component {
  render(): ReactNode {
    return (
    <div className="App">
      Hello, World!
    </div>
    )};
}

const mapStateToProps = (state: any) => ({
  issues: state.issues,
});

export default connect(mapStateToProps)(App);
