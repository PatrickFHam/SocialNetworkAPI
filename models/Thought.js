const { Schema, model } = require('mongoose');
const userSchema = require('./User');
const moment = require('moment');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
    username: {
      type: String,
      required: true,
      ref: 'User'
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    },
    timestamps: true,
    id: false
  }
);

thoughtSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reactions.length;
  })
  .set(function (v) {
    this.set(v)
  })
  ;


const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
