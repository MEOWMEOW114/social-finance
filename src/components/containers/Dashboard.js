import React, { Component } from 'react';
import ChatContainer from './ChatContainer';
import StockChart from '../common/StockChart';
import SplitPane from 'react-split-pane';
import './Splitpane.css';

class Dashboard extends Component {
  constructor(props) {
    super(props)

  }

  render() {

    return (
        <SplitPane split="vertical"  defaultSize={'50%'}>
          <StockChart/>
          <ChatContainer user={ this.props.user}/>
        </SplitPane>
    )
  }

}






export default Dashboard;
