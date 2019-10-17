const User = require('../../models/user.model');

const getUser = (req, res) => {
  const userId = req.user._id;

  const sendResponse = user => {
    res.json({
      status: 'success',
      user
    });
  };

  const sendError = error => {
    const errMessage =
      error.message || 'must handle this error on registration';
    res.json({
      status: 'error',
      error: errMessage
    });
  };

  User.findById(userId)
    .then(user => {
      if (!user) {
        sendError({ message: 'No such user' });
        return;
      }
      sendResponse(user.getPublicFields());
    })
    .catch(sendError);
};

module.exports = getUser;
