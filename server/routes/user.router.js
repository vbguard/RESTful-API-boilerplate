const router = require('express').Router();
const passport = require('passport');

const {
  restorePassword,
  updateUser,
  deleteUser,
  getUser
} = require('../controllers/user');

const passportCheck = passport.authenticate('jwt', {
  session: false
});

router
  .post('/:id')
  .get('/', passportCheck, getUser)
  .delete('/', passportCheck, deleteUser)
  .put('/', passportCheck, updateUser)
  .post('/restore', restorePassword);

module.exports = router;
