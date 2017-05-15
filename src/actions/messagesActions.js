import messageApi from '../api/messageApi'

export function saveMessage(data) {
  let payload;
  payload = {room: data.room, newMessage: {user: data.newMessage.user, content: data.newMessage.message}}


  return { type: 'NEW_MESSAGE', payload }
}

export function createMessage(data) {
 return (dispatch) => {
    return messageApi.newMessage(data).then((response) => {
      console.log( 'data.room', data.room)
      dispatch(saveMessage({room: data.room, message: response.data}))
      return response;
    })
  }
}
