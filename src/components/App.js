import React from 'react'
import ChatContainer from './containers/ChatContainer'
import Dashboard  from './containers/Dashboard'
import WelcomePage from './common/WelcomePage'
import { connect } from 'react-redux'

class App extends React.Component {
  constructor(props){
    super(props)
    this.currentUser = this.currentUser.bind(this)

  }


  currentUser(){
   return !!this.props.user
  }
  render() {
    return (
      <div>
        {this.currentUser() ? <Dashboard user={ this.props.user }/> : <WelcomePage />}
      </div>
    )
  }
}


function mapStateToProps(state){
 return { user: state.user }
}

export default connect(mapStateToProps)(App)
