import React, { Component } from 'react';
import ChatContainer from './ChatContainer';
import SplitPane from 'react-split-pane';
import './Dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props)

  }

  render() {

    return (
      <div>
      <SplitPane split="vertical" minSize={400} defaultSize={400}>
      <div/>

        <ChatContainer user={ this.props.user}/>
        </SplitPane>
        </div>
    )
  }

}






export default Dashboard;
