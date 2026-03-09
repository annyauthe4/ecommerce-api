exports.userToDTO = (user) => {
  return {
    id: user._id ? user._id.toString() : user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
};

exports.usersToDTO = (users) => {
  return users.map(exports.userToDTO);
};