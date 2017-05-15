import React from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import ChatDetail from './chatDetail'
import RoomsContainer from './containers/roomsContainer'

export default (props) => {
  const messages = props.messages.map ( (message) => {

    return (<Col xs={8}> <ChatDetail user={message.user} message={message.content} image={message.image || ''}/>   </Col>) })

    // <Row className="show-grid">
    //   <RoomsContainer />
    //    <Col xs={8} xs={8}>
    //       {messages}
    //     </Col>
    //  </Row>
  return (
    <div>
      <Grid>
        <Row className="show-grid">
            <RoomsContainer />
              {messages}

         </Row>
      </Grid>
    </div>
  )
}
