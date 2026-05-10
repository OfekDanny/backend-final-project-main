const User = require('../models/User');

/* Creates the default seed user on startup if it does not already exist */
const createUser = async () => {
  const defaultUser = {
    id: 123123,
    firstName: 'moshe',
    lastName: 'israeli',
    birthday: 'January, 10th, 1990'
  };

  // Skip creation if the user already exists
  const user = await User.findOne({ id: defaultUser.id });
  if (!user) {
    // Create and persist the default user
    const newUser = await User.create({
      id: defaultUser.id, firstName: defaultUser.firstName,
      lastName: defaultUser.lastName, birthday: defaultUser.birthday
    });
    newUser.save();
    // Confirm seeding success to the console
    console.log('User added successfully');
  } else {
    console.log('User already exists, skipping creation');
  }
};

module.exports = createUser;
