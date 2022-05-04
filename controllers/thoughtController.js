const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// Get all thoughts.
// Get all users.
function getThoughts(req, res) {
  Thought.find({})
    .then((thoughts) => {
      return res.json(thoughts);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
  };


// Get a single thought by ID.
function getSingleThought(req, res) {
  Thought.findOne({ _id: req.params.thoughtId })
    .then(async (thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought found with that ID.' })
        : res.json(thought)
    )
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
};


// Post a new thought.  (Push created thought's ID to the associated user's thoughts array field.)
function createThought(req, res) {
  Thought.create(req.body)
    .then((thought) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId},
        { $addToSet: {
          thoughts: thought._id
        }},
        { new: true }
      )
    })
    .then((thought) => res.json(thought))
    .catch((err) => res.status(500).json(err));
};



// Put, to update a thought by its ID.
function updateThought(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $set: req.body },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No thought with this id!' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
};


// Delete to remove a thought by its ID.
function deleteThought(req, res) {
  Thought.findOneAndRemove({ _id: req.params.thoughtId })
    .then((thought) =>
      !thought
        ? res.status(404).json({
            message: 'No thought found.',
          })
        : res.json({ message: "The thought was successfully deleted." })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    })
};




// 
//  REACTIONS
// 

// Post to create a reaction stored in a single thought's 'reactions' array field.
function addReaction(req, res) {
  Thought.findOneAndUpdate(
      {_id: req.params.thoughtId},
      {$push: {reactions: req.body}},
      { new: true, runValidators: true }
  )
  .then(reaction => {
      if (!reaction) {
          res.status(404).json({ message: 'Nope! Reaction data NOT saved.' });
          return;
      }
      res.json(reaction);
  })
  .catch(err => res.json(err));
};


// Delete to pull and remove a reaction by the reaction's 'reactionId" value
function deleteReaction(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.reactionId },
    { $pull: { reactions: { reactionsId: req.params.reactionId } } },
    { runValidators: true, new: true }
  )
    .then((reaction) =>
      !reaction
        ? res
            .status(404)
            .json({ message: 'No reaction found with that ID.' })
        : res.json({ message: 'Reaction was successfully deleted.' })
    )
    .catch((err) => res.status(500).json(err));
};



module.exports = {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction
};
