const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');


// Get all thoughts.
function getThoughts(req, res) {
  Thought.find()
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
function createThought({ body }, res) {
  Thought.create(body)
      .then(({ _id }) => {
          return User.findOneAndUpdate(
              { _id: body.userId },
              { $push: { thoughts: _id } },
              { new: true }
          );
      })
      .then(dbThoughtData => {
          if (!dbThoughtData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
          }
          res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
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


function addReaction(req, res) {
  Thought.findOneAndUpdate(
    {_id: req.params.thoughtId}, 
    {$push: {reactions: req.body}}, 
    {new: true, runValidators: true})
  .populate({
    path: 'reactions',
    // select: '-__v'
    })
  // .select('-__v')
  .then(dbThoughtData => {
      if (!dbThoughtData) {
          res.status(404).json({message: 'No thoughts with this ID.'});
          return;
      }
      res.json(dbThoughtData);
  })
  .catch(err => res.status(400).json(err))
};

// Delete to pull and remove a reaction by the reaction's 'reactionId" value
function deleteReaction(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId } } },
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
