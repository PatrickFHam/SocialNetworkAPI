const router = require('express').Router();

// list of functions from the user controller
const {
  getUsers,
  createUser,
  getSingleUser,
  deleteUser,
  updateUser,
  addFriend,
  removeFriend
} = require('../../controllers/userController');


// functions being called with specific routes and methods
router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:userId')
  .get(getSingleUser)
  .delete(deleteUser)
  .put(updateUser);

router.route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(removeFriend);

module.exports = router;
