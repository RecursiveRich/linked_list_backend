const { getUsers, createUser, getUser, updateUser, deleteUser } = require('./users');
const { userAuthHandler, companyAuthHandler, verifyToken, ensureCorrectUser, ensureCorrectCompany } = require('./auth');

module.exports = {
    getUsers,       // GET to /users
    createUser,     // POST to /users
    getUser,        // GET to /users/${username} Auth
    updateUser,     // PATCH to /users/${username} Auth + Correct User
    deleteUser,      // DELETE to /users/${username} Auth + Correct User
    userAuthHandler,
    companyAuthHandler,
    verifyToken,
    ensureCorrectUser,
    ensureCorrectCompany
};