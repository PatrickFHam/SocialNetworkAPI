import { isEmail } from 'validator';

const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought');

// Schema to create Student model
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
    },
  }
);


userSchema
  .virtual('friendCount')
  .get(function () {
    return `${this.friends.length}`;
  })
  .set(function (v) {
    this.set(v)
  });

const Student = model('user', userSchema);

module.exports = Student;
