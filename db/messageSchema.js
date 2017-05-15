import mongoose from 'mongoose'

const imageSchema = mongoose.Schema({
   data: String,
   contentType: String
})

const messageSchema = mongoose.Schema({
  user: String,
  content: String,
  room: String,
  image: String
})

export default mongoose.model('Message', messageSchema)
