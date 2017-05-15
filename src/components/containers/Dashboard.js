import React, { Component } from 'react';
import ChatContainer from './ChatContainer';
import StockChart from '../common/StockChart';
import SplitPane from 'react-split-pane';
import './Dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props)

  }

  render() {

    return (
      <div>
        <SplitPane split="vertical" minSize={400} defaultSize={600}>
          <StockChart/>
          <ChatContainer user={ this.props.user}/>
        </SplitPane>
      </div>
    )
  }

}






export default Dashboard;
