const User = require('../models/user-model');

const createUser = async () => {
  const defaultUser = {
    id: 123123,
    first_name: 'mosh',
    last_name: 'israeli',
    birthday: new Date('1990-01-10')
  };
  const existing = await User.findOne({ id: defaultUser.id });
  if (!existing) {
    await User.create(defaultUser);
    console.log('Default user created');
  }
};

module.exports = createUser;
