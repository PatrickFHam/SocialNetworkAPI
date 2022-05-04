const router = require('express').Router();

const {
  // list of functions from the user controller
  getUsers,
  createUser,
  getSingleUser,
  deleteUser,
  updateUser,
  addFriend,
  removeFriend
} = require('../../controllers/userController');

router.route('/users')
  .get(getUsers)
  .post(createUser);

router.route('/users/:userId')
  .get(getSingleUser)
  .delete(deleteUser)
  .put(updateUser);

router.route('/users/:userId/friends/:friendId')
  .post(addFriend)
  .delete(removeFriend);

  