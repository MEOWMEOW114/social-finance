import React, { Component } from 'react'
import * as userActions from '../../actions/userActions'
import { connect } from 'react-redux'
import { InputGroup, Button, PageHeader, FormGroup, FormControl } from 'react-bootstrap'
// import * as hello from 'hellojs';
import GoogleLogin from 'react-google-login';


class WelcomePage extends Component {
  constructor(props){
    super(props)

    // const google = hello.use("google"); //This is the new line
    this.state = {
      input: '',
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnSubmit = this.handleOnSumbit.bind(this)
    this.responseGoogle = this.responseGoogle.bind(this);

  }

  handleOnChange(ev){
    this.setState({input: ev.target.value})
    console.log(ev.target.value)
  }

  handleOnSumbit(ev){
    ev.preventDefault()
    this.props.newUser(this.state.input)
    this.setState({ input: ''})
  }

  responseGoogle(response){
    console.log( 'response', response);
  }

  render(){

    console.log( 'this.props;', this.props)
    return (
      <div>
       <PageHeader> Welcome! What would you like to be called? </PageHeader>
          <form onSubmit={this.handleOnSubmit}>
            <FormGroup>
              <InputGroup value={this.state.input}>
               <FormControl onChange={this.handleOnChange} />
               <Button bsStyle="primary" type='submit'> Submit </Button>
              </InputGroup>
            </FormGroup>
          </form>

          <div>
            <GoogleLogin
               clientId="314444125630-jlt21ef4buv6vblsbvd83tcmd8vic56f.apps.googleusercontent.com"
               buttonText="Login"
               redirectUri= 'http://localhost:5000/auth/google'
               uxMode= 'redirect'
               offline='false'
               onSuccess={ this.responseGoogle}
               onFailure={ this.responseGoogle}
             />
          </div>
        </div>
    )
  }
}

function mapStateToProps(state, ownProps){
  return { user: state.user }
}

function mapDispatchToProps(dispatch){
 return {
   newUser: (user) => {
    dispatch(userActions.newUser(user))
  }
 }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
