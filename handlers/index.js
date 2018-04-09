const { getUsers, createUser, getUser, updateUser, deleteUser } = require('./users');
const { userAuthHandler, companyAuthHandler, verifyToken, ensureCorrectUser, ensureCorrectCompany, ensureIsCompany, ensureCorrectJob } = require('./auth');
const { getCompanies, createCompany, getCompany, updateCompany, deleteCompany } = require('./companies');
const { getJobs, createJob, getJob, updateJob, deleteJob } = require('./jobs');


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
    ensureCorrectCompany,
    ensureIsCompany,
    ensureCorrectJob,
    getCompanies,       // GET to /companies Auth
    createCompany,     // POST to /companies
    getCompany,        // GET to /companies/${handle} User Auth
    updateCompany,     // PATCH to /companies/${handle} Company Auth + Correct Company
    deleteCompany,
    getJobs,       // GET to /companies Auth
    createJob,     // POST to /companies
    getJob,        // GET to /companies/${handle} User Auth
    updateJob,     // PATCH to /companies/${handle} Job Auth + Correct Job
    deleteJob      // DELETE to /companies/${handle} Job Auth + Correct Job 
};