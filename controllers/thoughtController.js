const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// Get all thoughts.



// Get a single thought by ID.



// Post a new thought.  (Push created thought's ID to the associated user's thoughts array field.)



// Put, to update a thought by its ID.



// Delete to remove a thought by its ID.





// 
//  REACTIONS
// 

// Post to create a reaction stored in a single thought's 'reactions' array field.



// Delete to pull and remove a reaction by the reaction's 'reactionId" value




module.exports = {
  
};
