const connection = require('../config/connection');
const { User, Thought } = require('../models');
const users = require('./userData');
const thoughts = require('./thoughtData');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Drop existing users
  await User.deleteMany({});

  // Drop existing thoughts
  await Thought.deleteMany({});
  
  // Add users to the collection and await the results
  await User.collection.insertMany(users);
  
  // Add courses to the collection and await the results
  await Thought.collection.insertMany(thoughts);

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.table(thoughts);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
