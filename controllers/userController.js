const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

const headCount = async () =>
  User.aggregate()
    .count('userCount')
    .then((numberOfUsers) => numberOfUsers);

const getFriends = async (userId) =>
  User.aggregate([
    { $match: { _id: ObjectId(userId) }},
    { $unwind: '$friends' }
  ]); 

const getThoughts = async (userId) =>
  User.aggregate([
    { $match: { _id: ObjectId(userId) }},
    { $unwind: '$thoughts' }
  ]);


// Get all users.
function getStudents(req, res) {
  User.find()
    .then(async (users) => {
      const userObj = {
        users,
        headCount: await headCount(),
      };
      return res.json(userObj);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
  };

// Create a user.
function createUser(req, res) {
  User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
};

// Get a single user.
function getSingleStudent(req, res) {
  User.findOne({ _id: req.params.userId })
    .select('-__v')
    .then(async (user) =>
      !user
        ? res.status(404).json({ message: 'No user found with that ID.' })
        : res.json({
            user,
            friends: await getFriends(req.params.userId),
            thoughts: await getThoughts(req.params.userId)
          })
    )
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

// Delete a user.
function deleteUser(req, res) {
  let userUID = req.params.userId;
  let pulledUsername = () => {
    User.findOne({ _id: userUID }, 'username').exec();
  }

  console.log(`Pulled Username is ${pulledUsername}`);
  
  User.findOneAndRemove({ _id: req.params.userId })
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No such user exists.' })
        : Thought.deleteMany(
            { username: pulledUsername },
            { new: true }
          )
    )
    .then((thought) =>
      !thought
        ? res.status(404).json({
            message: 'User deleted, but no thoughts found.',
          })
        : res.json({ message: "User and the user's thoughts were successfully deleted." })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    })
};

// Update a user.
function updateUser(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.courseId },
    { $set: req.body },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with this id!' })
        : res.json(course)
    )
    .catch((err) => res.status(500).json(err));
};


// Add friend to a user.
function addFriend(req, res) {
  console.log('You are adding a friend');
  console.log(req.body);
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $addToSet: { friends: req.body.friendId } },
    { runValidators: true, new: true }
    )
    .then((user) =>
    !user
    ? res
    .status(404)
    .json({ message: 'No user found with that ID.' })
    : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
};


// Delete friend from a user.
function removeFriend(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: { _id: req.body.friendId } } },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res
            .status(404)
            .json({ message: 'No user found with that ID.' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
};