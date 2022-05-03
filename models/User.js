const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought');

import { isEmail } from 'validator';

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, 'invalid email'],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    },
  }
);


userSchema
  .virtual('friendCount')
  .get(function () {
    return `${this.friends.length}`;
  })
/*   .set(function (v) {
    this.set(v)
  }) */
  ;

const User = model('user', userSchema);

module.exports = User;
