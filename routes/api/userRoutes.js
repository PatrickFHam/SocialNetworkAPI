const router = require('express').Router();

const {
  // list of functions from the user controller
  getUsers,
  createUser,
  getSingleUser,
  deleteSingleUser,
  updateSingleUser,
  addFriend,
  deleteFriend
} = require('../../controllers/userController.js');

router.route('/users').get(getUsers).post(createUser);

router.route('/users/:userId').get(getSingleUser).delete(deleteSingleUser).put(updateSingleUser);

router.route('/users/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);