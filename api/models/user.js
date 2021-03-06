const fetch = require('node-fetch')
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const UserSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  facebookId: String,
  profilePictureUrl: String
})

UserSchema.plugin(timestamps)

UserSchema.statics.createFacebookUser = async function (facebookId, userAccessToken) {
  const queryResult = await fetch(`https://graph.facebook.com/${facebookId}` +
    `?access_token=${userAccessToken}` +
    `&fields=picture,id,first_name,last_name,email`)
  const userInfo = await queryResult.json()

  const {
    first_name: firstName,
    last_name: lastName,
    email
  } = userInfo
  const profilePictureUrl = `https://graph.facebook.com/${facebookId}/picture?width=130&height=130`

  const newUser = new this({ email, firstName, lastName, profilePictureUrl, facebookId })
  newUser.save()

  return { firstName, lastName, profilePictureUrl }
}

const User = mongoose.model('User', UserSchema)

module.exports = User
